import Link from "next/link";
import { Button, Eyebrow, SectionFrame } from "@/components/ui";
import { getCity, getService, work } from "@/content";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * The homepage slot that testimonials will eventually take.
 *
 * content/testimonials.ts is deliberately empty and stays that way until
 * there are real, attributed reviews — a fabricated endorsement is illegal
 * advertising in Canada, not a style problem. But leaving a hole in the
 * homepage while waiting is its own cost, so the slot shows recent work
 * instead: what came in, what went out, what it was printed on.
 *
 * When real reviews land, this section and <Testimonials /> can both run —
 * work does a different job from a quote. Nothing here needs removing.
 */
export function RecentWork() {
  const shown = work.slice(0, 4);
  if (shown.length === 0) return null;

  return (
    <SectionFrame
      surface="stock"
      id="recent-work"
      padding="lg"
      ticket={{ number: "07", label: "RECENT WORK", spec: "JOB TICKETS" }}
    >
      <Eyebrow number="07" spec="WHAT CAME OFF THE FLOOR">
        Recent work
      </Eyebrow>

      <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-normal text-fg">
        Job tickets, not a gallery.
      </h2>

      <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
        What was ordered, what it was printed on, and how long it took. The things you actually
        want to know before phoning a shop.
      </p>

      <ul className="mt-16 grid gap-x-gutter gap-y-14 border-t-[length:var(--hairline)] border-rule pt-14 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((item) => {
          const city = getCity(item.city);
          return (
            <li key={item.slug}>
              <Link href={`/work#${item.slug}`} className="group block">
                <p className={`${SPEC} text-fg-faint`}>
                  <span className="text-accent-text">{item.number}</span>
                  <span className="mx-2 text-rule-strong">/</span>
                  {city?.name}
                </p>

                <h3 className="mt-6 max-w-[18ch] font-display text-lg font-medium text-fg underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-mark">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm text-fg-muted">{item.sector}</p>

                <p className={`${SPEC} mt-6 text-fg-faint`}>
                  {item.services
                    .map((slug) => getService(slug)?.name)
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-16">
        <Button href="/work" variant="outline" size="lg">
          See all work
        </Button>
      </div>
    </SectionFrame>
  );
}
