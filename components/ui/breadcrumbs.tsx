import Link from "next/link";

export type Crumb = { name: string; path: string };

/**
 * The visible half of the BreadcrumbList in each page's JSON-LD.
 *
 * Google will render a breadcrumb trail in the result from the markup alone,
 * but a trail that exists only in JSON-LD and nowhere on the page is a claim
 * about a navigation the visitor does not have. It is also the mechanism
 * that makes /service-areas and the service pages reachable from the 25
 * local pages, which is what stops the cluster reading as a flat mat of
 * doorway URLs with no hierarchy above it.
 *
 * Set in the job-ticket voice, because that is what a route reads as here.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="relative z-[1]">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 font-utility text-2xs uppercase tracking-utility text-fg-faint">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-3">
              {last ? (
                <span aria-current="page" className="text-fg-muted">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="rounded-[2px] underline decoration-rule underline-offset-4 outline-offset-4 transition-colors hover:text-fg hover:decoration-mark focus-visible:outline-2 focus-visible:outline-focus"
                >
                  {crumb.name}
                </Link>
              )}
              {last ? null : <span aria-hidden="true" className="text-rule-strong">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
