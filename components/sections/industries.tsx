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
        We already know what your industry orders.
      </h2>

      <ul className="mt-16 grid border-t border-rule md:grid-cols-2 md:gap-x-gutter">
        {industries.map((industry) => (
          <li
            key={industry.name}
            tabIndex={0}
            className="group border-b border-rule py-7 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          >
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="h-px w-4 shrink-0 origin-left bg-rule-strong transition-[transform,background-color] duration-[var(--dur-snap)] ease-press group-hover:scale-x-[2.2] group-hover:bg-mark group-focus-visible:scale-x-[2.2] group-focus-visible:bg-mark"
              />
              <h3 className="font-display text-lg font-bold text-fg">{industry.name}</h3>
            </div>
            <p className="mt-3 pl-8 font-utility text-2xs uppercase tracking-utility text-fg-faint transition-colors duration-[var(--dur-snap)] group-hover:text-fg-muted group-focus-visible:text-fg-muted">
              {industry.orders}
            </p>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
