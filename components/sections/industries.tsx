import { Eyebrow, SectionFrame } from "@/components/ui";
import { industries } from "@/content";

/**
 * Not an icon grid. Naming the exact thing a restaurant orders sells harder
 * than a plate emoji, and it puts real long-tail search terms on the page.
 *
 * The detail line is always in the layout and always readable — hover only
 * raises its contrast and slides a mark in. Nothing is hidden behind a hover
 * a phone cannot perform, and nothing changes height, so there is no shift.
 */
export function Industries() {
  if (industries.length === 0) return null;

  return (
    <SectionFrame
      surface="ink"
      id="industries"
      padding="lg"
      ticket={{ number: "06", label: "INDUSTRIES", spec: "WHAT THEY ORDER" }}
    >
      <Eyebrow number="06" spec="SPECIFIC ON PURPOSE">
        Industries
      </Eyebrow>

      <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
        Find your trade. We already know what you order.
      </h2>

      <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
        These are the actual things people in each trade ask us for, not a guess. If yours is on
        the list, you can skip explaining the basics on the phone.
      </p>

      <ul className="mt-16 grid border-t-[length:var(--hairline)] border-rule md:grid-cols-2 md:gap-x-gutter">
        {industries.map((industry) => (
          <li
            key={industry.name}
            tabIndex={0}
            className="group border-b-[length:var(--hairline)] border-rule py-7 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          >
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="h-[var(--hairline)] w-4 shrink-0 origin-left bg-rule-strong transition-[transform,background-color] duration-[var(--dur-snap)] ease-press group-hover:scale-x-[2.2] group-hover:bg-mark group-focus-visible:scale-x-[2.2] group-focus-visible:bg-mark"
              />
              <h3 className="font-display text-lg font-bold text-fg">{industry.name}</h3>
            </div>
            {/* Sentence case at body size. This line used to be set in
                uppercase mono at 2xs, which is a spec label — the right
                treatment for "16PT C2S" and the wrong one for a sentence a
                customer is meant to read and recognise themselves in. */}
            <p className="mt-3 pl-8 text-sm text-fg-muted transition-colors duration-[var(--dur-snap)] group-hover:text-fg group-focus-visible:text-fg">
              {industry.orders}
            </p>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
