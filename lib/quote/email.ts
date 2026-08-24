import { site } from "@/content";
import { ticketRows, ticketText } from "./ticket";
import type { QuoteSubmission } from "./types";

export type EmailResult = { ok: true } | { ok: false; error: string };

const FROM = process.env.QUOTE_FROM_EMAIL ?? "Surge Labs <quotes@surgelabs.ca>";
const TO = process.env.QUOTE_TO_EMAIL ?? site.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The ticket as a table that survives Outlook. No external CSS, no images. */
function ticketHtml(submission: QuoteSubmission): string {
  const rows = ticketRows(submission)
    .filter((row) => row.value)
    .map(
      (row) =>
        `<tr>` +
        `<td style="padding:6px 16px 6px 0;font:11px ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;color:#63636a;white-space:nowrap;vertical-align:top">${escapeHtml(row.label)}</td>` +
        `<td style="padding:6px 0;font:14px -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0c0c0e">${escapeHtml(row.value)}</td>` +
        `</tr>`,
    )
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">${rows}</table>`;
}

function wrap(title: string, lead: string, submission: QuoteSubmission, footer: string): string {
  return `<div style="background:#ededE8;padding:32px 16px">
  <div style="max-width:592px;margin:0 auto;background:#fff;border:1px solid #dcdcd5;padding:32px">
    <p style="margin:0 0 4px;font:11px ui-monospace,Menlo,Consolas,monospace;letter-spacing:2px;color:#63636a">JOB TICKET</p>
    <p style="margin:0 0 24px;font:20px ui-monospace,Menlo,Consolas,monospace;color:#e6007e">${escapeHtml(submission.reference)}</p>
    <h1 style="margin:0 0 12px;font:700 22px -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0c0c0e">${escapeHtml(title)}</h1>
    <p style="margin:0 0 28px;font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#4a4a50">${escapeHtml(lead)}</p>
    ${ticketHtml(submission)}
    ${submission.contact.notes ? `<p style="margin:24px 0 0;font:11px ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;color:#63636a">NOTES</p><p style="margin:6px 0 0;font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0c0c0e;white-space:pre-wrap">${escapeHtml(submission.contact.notes)}</p>` : ""}
    <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #dcdcd5;font:13px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#4a4a50">${footer}</p>
  </div>
</div>`;
}

/**
 * Two emails: the ticket to the shop with the artwork attached, and a
 * confirmation to the customer restating the spec so they have a written
 * record of what they asked for.
 *
 * Both are sent after storage has already run, so a provider outage delays
 * the notification rather than losing the lead.
 */
export async function sendQuoteEmails(
  submission: QuoteSubmission,
  attachment: { filename: string; content: Buffer } | null,
): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set" };

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const { contact } = submission;

    const internal = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: contact.email,
      subject: `${submission.reference} — ${submission.needs.join(", ")} — ${contact.business || contact.name}`,
      text: ticketText(submission),
      html: wrap(
        `${contact.business || contact.name} wants a quote`,
        `Submitted ${new Date(submission.submittedAt).toLocaleString("en-CA", { timeZone: "America/Toronto" })}. Reply to this email to reach them directly.`,
        submission,
        `Reply-to is set to ${escapeHtml(contact.email)}.`,
      ),
      ...(attachment
        ? { attachments: [{ filename: attachment.filename, content: attachment.content }] }
        : {}),
    });
    if (internal.error) return { ok: false, error: internal.error.message };

    const confirmation = await resend.emails.send({
      from: FROM,
      to: [contact.email],
      replyTo: TO,
      subject: `We have your request — ${submission.reference}`,
      text: `${ticketText(submission)}\n\nWe will come back with a written quote within one business day.\n\n${site.name}\n${site.phone}\n${site.address.streetAddress}, ${site.address.locality}, ${site.address.region}`,
      html: wrap(
        "We have your request",
        "Here is exactly what we recorded. If any of it is wrong, reply to this email and say so — nothing is quoted until you confirm the spec.",
        submission,
        `We will come back with a written quote within one business day.<br>` +
          `${escapeHtml(site.name)} · <a href="${site.phoneHref}" style="color:#0071a3">${escapeHtml(site.phone)}</a> · ${escapeHtml(site.address.streetAddress)}, ${escapeHtml(site.address.locality)}` +
          (attachment ? "" : `<br><br>If you have artwork, reply to this email with it attached.`),
      ),
    });
    if (confirmation.error) return { ok: false, error: confirmation.error.message };

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "email send failed" };
  }
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
