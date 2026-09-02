"use server";

import { headers } from "next/headers";
import { sendQuoteEmails } from "@/lib/quote/email";
import { MIN_FILL_MS, rateLimit } from "@/lib/quote/rate-limit";
import { generateReference } from "@/lib/quote/reference";
import { storeQuote } from "@/lib/quote/storage";
import type { QuoteAnswers, QuoteResult, QuoteSubmission } from "@/lib/quote/types";
import { site } from "@/content";

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/postscript",
  "application/illustrator",
  "application/zip",
];

function text(form: FormData, key: string, max = 2000): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Rejects the obvious shapes. Real validation is the human reading it. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function submitQuote(form: FormData): Promise<QuoteResult> {
  // ── Spam: honeypot first, it costs nothing ────────────────────────
  if (text(form, "company_website")) {
    // Look successful to the bot rather than telling it which field failed,
    // but never store or send anything.
    return { ok: true, reference: generateReference(), stored: false, emailed: false };
  }

  const startedAt = Number(text(form, "started_at"));
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, error: "That was submitted faster than the form can be read. Try again." };
  }

  // ── Rate limit ────────────────────────────────────────────────────
  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "unknown").split(",")[0]!.trim();
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many requests from this connection. Try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or call ${site.phone}.`,
    };
  }

  // ── Parse ─────────────────────────────────────────────────────────
  let answers: QuoteAnswers = {};
  try {
    const raw = text(form, "answers", 20000);
    answers = raw ? (JSON.parse(raw) as QuoteAnswers) : {};
  } catch {
    return { ok: false, error: "We could not read that submission. Please try again." };
  }

  const needs = text(form, "needs").split(",").map((n) => n.trim()).filter(Boolean);
  const contact = {
    name: text(form, "name", 120),
    business: text(form, "business", 160),
    email: text(form, "email", 200),
    phone: text(form, "phone", 40),
    city: text(form, "city", 80),
    notes: text(form, "notes", 4000),
  };

  if (needs.length === 0) return { ok: false, error: "Tell us what you need first." };
  if (!contact.name) return { ok: false, error: "We need a name to put on the ticket." };
  // Either route is enough. Requiring an email used to be the rule, and on a
  // page reached from an ad it is the rule that loses the lead — a lot of
  // people will give a phone number and will not type an address on a phone.
  // An unreachable submission is the only thing worth rejecting here.
  if (!contact.email && !contact.phone) {
    return { ok: false, error: "Leave a phone number or an email so we can send the quote back." };
  }
  if (contact.email && !looksLikeEmail(contact.email)) {
    return { ok: false, error: "That email address does not look right." };
  }

  // ── Attachment ────────────────────────────────────────────────────
  const file = form.get("artwork");
  let attachmentMeta: QuoteSubmission["attachment"] = null;
  let attachmentBody: { filename: string; content: Buffer } | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return {
        ok: false,
        error: `That file is ${Math.round(file.size / 1024 / 1024)}MB. Keep it under 10MB, or send it by email after you submit.`,
      };
    }
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return { ok: false, error: "We take PDF, PNG, JPG, SVG, AI, EPS and ZIP artwork." };
    }
    attachmentMeta = { name: file.name, size: file.size, type: file.type || "application/octet-stream" };
    attachmentBody = { filename: file.name, content: Buffer.from(await file.arrayBuffer()) };
  }

  const submission: QuoteSubmission = {
    reference: generateReference(),
    needs,
    packageSlug: text(form, "package", 80) || null,
    answers,
    deadline: text(form, "deadline", 80),
    budget: text(form, "budget", 80),
    contact,
    attachment: attachmentMeta,
    submittedAt: new Date().toISOString(),
    source: text(form, "source", 200) || null,
  };

  // ── Store first, then email ───────────────────────────────────────
  // Order matters. Email is the thing most likely to fail, and a lead that
  // exists in the table can be recovered from it; one that only ever existed
  // in a failed API call cannot.
  const stored = await storeQuote(submission);
  const emailed = await sendQuoteEmails(submission, attachmentBody);

  if (!stored.ok) console.error(`[quote] storage failed for ${submission.reference}: ${stored.error}`);
  if (!emailed.ok) console.error(`[quote] email failed for ${submission.reference}: ${emailed.error}`);

  // Both routes gone means we genuinely do not have their request. Saying
  // "thanks!" at that point would be a lie that costs a customer.
  if (!stored.ok && !emailed.ok) {
    return {
      ok: false,
      error: `We could not record that — please call ${site.phone} or email ${site.email} instead. Nothing was lost on your end; the details are still on this page.`,
    };
  }

  return { ok: true, reference: submission.reference, stored: stored.ok, emailed: emailed.ok };
}
