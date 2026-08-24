import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { QuoteSubmission } from "./types";

export type StoreResult = { ok: true; via: string } | { ok: false; error: string };

const CONNECTION =
  process.env.QUOTE_DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";

/**
 * Storage runs BEFORE email, and its result is reported separately, because
 * the whole point is that a submission survives an email provider having a
 * bad afternoon. See db/schema.sql for the table.
 *
 * Configure exactly one of:
 *   QUOTE_DATABASE_URL / POSTGRES_URL / DATABASE_URL   Postgres (Vercel, Supabase, Neon)
 *   QUOTE_LOG_FILE                                      append-only JSONL, for local work
 *
 * With neither set this fails loudly rather than quietly discarding a lead.
 */
export async function storeQuote(submission: QuoteSubmission): Promise<StoreResult> {
  if (CONNECTION) {
    try {
      // Imported lazily so the driver is not pulled into a build that has no
      // database configured.
      const { default: postgres } = await import("postgres");
      const sql = postgres(CONNECTION, { max: 1, idle_timeout: 5, connect_timeout: 10 });
      try {
        await sql`
          insert into quote_submissions
            (reference, needs, package_slug, answers, deadline, budget,
             contact_name, business, email, phone, city, notes,
             attachment, source, submitted_at)
          values
            (${submission.reference},
             ${submission.needs as unknown as string[]},
             ${submission.packageSlug},
             ${sql.json(submission.answers)},
             ${submission.deadline},
             ${submission.budget},
             ${submission.contact.name},
             ${submission.contact.business},
             ${submission.contact.email},
             ${submission.contact.phone},
             ${submission.contact.city},
             ${submission.contact.notes},
             ${submission.attachment ? sql.json(submission.attachment) : null},
             ${submission.source},
             ${submission.submittedAt})
        `;
        return { ok: true, via: "postgres" };
      } finally {
        await sql.end({ timeout: 5 });
      }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "postgres insert failed" };
    }
  }

  const logFile = process.env.QUOTE_LOG_FILE;
  if (logFile) {
    try {
      await mkdir(dirname(join(process.cwd(), logFile)), { recursive: true });
      await appendFile(join(process.cwd(), logFile), `${JSON.stringify(submission)}\n`, "utf8");
      return { ok: true, via: "jsonl" };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "jsonl append failed" };
    }
  }

  return {
    ok: false,
    error:
      "No quote storage configured. Set QUOTE_DATABASE_URL (or POSTGRES_URL / DATABASE_URL) " +
      "for Postgres, or QUOTE_LOG_FILE for local development.",
  };
}

export function storageConfigured(): boolean {
  return Boolean(CONNECTION || process.env.QUOTE_LOG_FILE);
}
