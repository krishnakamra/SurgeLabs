import Link from "next/link";
import { getTable } from "@/content/blog-tables";

/**
 * A table from content/blog-tables.ts, by id.
 *
 * Posts never hold their own figures. Eight articles quoting the same
 * business card price in eight MDX files is eight places to miss when the
 * price changes; here it is one, and the id is the only thing the prose has
 * to know.
 *
 * The provenance note under each table is generated from the data's own
 * `status`, not written by hand — so a table cannot be marked draft in the
 * content layer while the page tells the reader the number is firm.
 */
export function DataTable({ id }: { id: string }) {
  const table = getTable(id);
  if (!table) {
    // Failing loudly beats rendering a gap where a price list should be.
    throw new Error(`<DataTable id="${id}" /> — no such table in content/blog-tables.ts`);
  }

  const isDraft = table.status === "draft";

  return (
    <figure className="not-prose my-12">
      <div className="overflow-x-auto border border-rule">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-rule bg-surface-sunken px-5 py-3 text-left font-utility text-2xs uppercase tracking-utility text-fg-muted">
            {table.caption}
          </caption>
          <thead>
            <tr className="border-b border-rule">
              {table.columns.map((col, i) => (
                <th
                  key={col || `col-${i}`}
                  scope="col"
                  className="px-5 py-3 font-utility text-2xs uppercase tracking-utility text-fg-faint"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join("|")} className="border-b border-rule last:border-b-0">
                {row.map((cell, i) => (
                  <td
                    key={`${row[0]}-${i}`}
                    className={
                      i === 0
                        ? "px-5 py-3 align-top font-medium text-fg"
                        : "px-5 py-3 align-top text-fg-muted"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <figcaption className="mt-3 flex gap-3 text-fg-faint">
        <span aria-hidden="true" className={isDraft ? "mt-px text-mark" : "mt-px text-rule-strong"}>
          {isDraft ? "\u25b2" : "\u2014"}
        </span>
        {/* The label stays in the job-ticket voice; the sentence does not.
            Setting 40 words of explanation in uppercase mono is the fastest
            way to make sure the one note on the page that has to be read is
            the one nobody reads. */}
        <span className="min-w-0 text-2xs leading-relaxed">
          {isDraft ? (
            <>
              <span className="font-utility uppercase tracking-utility text-accent-text">
                Indicative — not a quote.
              </span>{" "}
              {table.source} Your figure depends on artwork, stock availability and turnaround.{" "}
              <Link
                href="/quote"
                className="underline decoration-rule underline-offset-2 transition-colors hover:text-fg hover:decoration-mark"
              >
                Send the job through and we will price it exactly
              </Link>
              .
            </>
          ) : (
            <span className="font-utility uppercase tracking-utility">{table.source}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
