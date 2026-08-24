import { Button, Eyebrow, SectionFrame } from "@/components/ui";
import { packages } from "@/content";
import { cn } from "@/lib/cn";

export function PackagesTeaser() {
  if (packages.length === 0) return null;

  return (
    <SectionFrame
      surface="stock"
      id="packages"
      padding="lg"
      ticket={{ number: "05", label: "PACKAGES", spec: "PRICED UP FRONT" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow number="05" spec="NO DISCOVERY CALL REQUIRED">
            Packages
          </Eyebrow>
          <h2 className="mt-6 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
            Priced on the page, not after a phone call.
          </h2>
        </div>
        <Button href="/packages" variant="outline" size="lg">
          See all packages
        </Button>
      </div>

      <div className="mt-16 grid gap-gutter lg:grid-cols-3">
        {packages.map((pkg) => (
          <article
            key={pkg.slug}
            className={cn(
              "flex flex-col border bg-surface-raised p-8",
              pkg.featured ? "border-accent" : "border-rule",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-fg">{pkg.name}</h3>
              {pkg.featured ? (
                <span className="font-utility text-2xs uppercase tracking-utility text-accent-text">
                  Most booked
                </span>
              ) : null}
            </div>

            <p className="mt-4 min-h-[3.5rem] text-sm text-fg-muted">{pkg.audience}</p>

            <p className="mt-8 flex items-baseline gap-3 border-t border-rule pt-8">
              <span className="font-utility text-xl leading-none font-normal tabular-nums text-fg">
                {pkg.price}
              </span>
              <span className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
                {pkg.cadence}
              </span>
            </p>

            <ul className="mt-8 flex-1 space-y-3">
              {pkg.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-fg-muted">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-rule-strong" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button
                href={`/packages#${pkg.slug}`}
                variant={pkg.featured ? "primary" : "outline"}
                size="md"
                className="w-full"
              >
                What&rsquo;s included
              </Button>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
