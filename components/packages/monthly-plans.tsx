import { Button } from "@/components/ui";
import { formatPrice, monthlyPlans } from "@/content";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/** The quieter block: ongoing work, not a one-time build. */
export function MonthlyPlans() {
  if (monthlyPlans.length === 0) return null;

  return (
    <div className="grid gap-gutter lg:grid-cols-3">
      {monthlyPlans.map((plan) => (
        <article key={plan.slug} className="flex flex-col border-[length:var(--hairline)] border-rule p-8">
          <h3 className="font-display text-xl font-medium text-fg">{plan.name}</h3>
          <p className="mt-4 min-h-[3rem] text-sm text-fg-muted">{plan.bestFor}</p>

          <p className="mt-6 flex items-baseline gap-2 border-t-[length:var(--hairline)] border-rule pt-6">
            <span className="font-utility text-lg leading-none tabular-nums text-fg">
              {formatPrice(plan.price)}
            </span>
            <span className={`${SPEC} text-fg-faint`}>per month</span>
          </p>

          <ul className="mt-8 flex-1 space-y-2.5">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-fg-muted">
                <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-3 shrink-0 bg-rule-strong" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href={`/quote?package=${plan.slug}`} variant="outline" size="md" className="w-full">
              Start {plan.name}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
