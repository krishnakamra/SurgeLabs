import { getBranch, quoteBranches } from "@/content/quote-form";
import type { QuoteSubmission, TicketRow } from "./types";

function display(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? value.join(", ") : value;
}

/**
 * The single definition of what the job ticket says.
 *
 * The header the visitor watches fill in, the spec sheet on the success page,
 * the internal notification and the customer's confirmation all render from
 * this. If they were built separately they would drift, and a customer
 * holding a confirmation that disagrees with the shop's copy of the ticket is
 * an argument nobody wins.
 */
export function ticketRows(submission: Partial<QuoteSubmission>): TicketRow[] {
  const rows: TicketRow[] = [];
  const needs = submission.needs ?? [];
  const answers = submission.answers ?? {};

  rows.push({ label: "SERVICES", value: needs.length > 0 ? needs.map((n) => getBranch(n)?.label ?? n).join(" · ") : "" });

  if (submission.packageSlug) {
    rows.push({ label: "PACKAGE", value: submission.packageSlug.replace(/-/g, " ").toUpperCase() });
  }

  // Branch answers, in the order the branches are defined, so two tickets for
  // the same job always list their specs the same way round.
  for (const branch of quoteBranches) {
    if (!needs.includes(branch.id)) continue;
    for (const field of branch.fields) {
      const value = display(answers[field.id]);
      if (!value) continue;
      rows.push({ label: `${branch.ticket} · ${field.ticket}`, value });
    }
  }

  rows.push({ label: "DEADLINE", value: submission.deadline ?? "" });
  rows.push({ label: "BUDGET", value: submission.budget ?? "" });

  const contact = submission.contact;
  if (contact) {
    const who = [contact.name, contact.business].filter(Boolean).join(" — ");
    rows.push({ label: "CONTACT", value: who });
    rows.push({ label: "EMAIL", value: contact.email });
    if (contact.phone) rows.push({ label: "PHONE", value: contact.phone });
    if (contact.city) rows.push({ label: "CITY", value: contact.city });
  } else {
    rows.push({ label: "CONTACT", value: "" });
  }

  if (submission.attachment) {
    rows.push({
      label: "ARTWORK",
      value: `${submission.attachment.name} (${Math.round(submission.attachment.size / 1024)} KB)`,
    });
  }

  return rows;
}

/** Fixed-width rendering for the plain-text half of the emails. */
export function ticketText(submission: QuoteSubmission): string {
  const rows = ticketRows(submission);
  const width = Math.max(...rows.map((r) => r.label.length));
  const lines = rows
    .filter((row) => row.value)
    .map((row) => `${row.label.padEnd(width)}  ${row.value}`);

  return [
    `JOB TICKET  ${submission.reference}`,
    "=".repeat(width + 30),
    ...lines,
    "=".repeat(width + 30),
    submission.contact.notes ? `\nNOTES\n${submission.contact.notes}` : "",
  ]
    .join("\n")
    .trim();
}
