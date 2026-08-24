import { CounterRoll } from "@/components/motion";
import { Eyebrow, SectionFrame } from "@/components/ui";
import { stats } from "@/content";

/**
 * Every number here is true by construction and checkable from the rest of
 * the page — see the warning at the top of content/stats.ts. No client
 * counts, no review counts, no years-in-business, because none were supplied.
 */
export function Proof() {
  if (stats.length === 0) return null;

  return (
    <SectionFrame
      surface="ink"
      id="proof"
      padding="lg"
      ticket={{ number: "04", label: "PROOF", spec: "PRESS COUNTER" }}
    >
      <Eyebrow number="04" spec="COUNTED, NOT CLAIMED">
        Proof
      </Eyebrow>

      <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
        Four numbers you can check before you call.
      </h2>

      <dl className="mt-16 grid gap-x-gutter gap-y-14 border-t border-rule pt-14 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <p className="font-display text-3xl leading-none font-extrabold text-fg">
                <CounterRoll
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  separator={stat.separator}
                  className="text-inherit"
                />
              </p>
              <p className="mt-5 font-utility text-2xs uppercase tracking-utility text-fg">
                {stat.label}
              </p>
              <p className="mt-3 max-w-[28ch] text-sm text-fg-muted">{stat.basis}</p>
            </dd>
          </div>
        ))}
      </dl>
    </SectionFrame>
  );
}
