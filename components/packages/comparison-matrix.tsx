import { comparisonRows, formatPrice, packages } from "@/content";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * Real values only — a count, a size, a stock, or an em dash. No tick marks
 * and no "~" ratings: a row that says "5" and a row that says "10" tells you
 * something a row of ticks never does.
 */
export function ComparisonMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-left">
        <caption className="sr-only">Package comparison</caption>
        <thead>
          <tr>
            <th scope="col" className={`${SPEC} w-[14rem] pb-5 pr-6 font-normal text-fg-faint`}>
              Included
            </th>
            {packages.map((pkg) => (
              <th key={pkg.slug} scope="col" className="pb-5 pr-6 align-bottom">
                <span className="block font-display text-lg font-bold text-fg">{pkg.name}</span>
                <span className={`${SPEC} mt-2 block tabular-nums text-accent-text`}>
                  {formatPrice(pkg.price)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.label} className="border-t-[length:var(--hairline)] border-rule">
              <th scope="row" className={`${SPEC} py-4 pr-6 font-normal text-fg`}>
                {row.label}
              </th>
              {packages.map((pkg) => {
                const value = row.values[pkg.slug] ?? "—";
                const absent = value === "—";
                return (
                  <td
                    key={pkg.slug}
                    className={`py-4 pr-6 text-sm ${absent ? "text-fg-faint" : "text-fg-muted"}`}
                  >
                    {absent ? <span aria-label="Not included">—</span> : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
