import { Button, Eyebrow, SectionFrame } from "@/components/ui";
import { formatPrice, packages } from "@/content";
import { cn } from "@/lib/cn";

/** Three on the homepage; Full Surge is the step up you find on /packages. */
const TEASER_SLUGS = ["launch-kit", "momentum-kit", "storefront-kit"];

export function PackagesTeaser() {
  const shown = packages.filter((pkg) => TEASER_SLUGS.includes(pkg.slug));
  if (shown.length === 0) return null;

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
        {shown.map((pkg) => (
          <article
            key={pkg.slug}
            className={cn(
              "flex flex-col border bg-surface-raised p-8",
              pkg.badge ? "border-accent" : "border-rule",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-fg">{pkg.name}</h3>
              {pkg.badge ? (
                <span className="font-utility text-2xs uppercase tracking-utility text-accent-text">
                  {pkg.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-4 min-h-[3.5rem] text-sm text-fg-muted">{pkg.bestFor}</p>

            <p className="mt-8 flex items-baseline gap-3 border-t border-rule pt-8">
              <span className="font-utility text-xl leading-none font-normal tabular-nums text-fg">
                {formatPrice(pkg.price)}
              </span>
              <span className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
                one-time
              </span>
            </p>

            <ul className="mt-8 flex-1 space-y-3">
              {pkg.deliverables.flatMap((group) =>
                group.items.slice(0, 2).map((item) => (
                  <li key={`${group.group}-${item}`} className="flex gap-3 text-sm text-fg-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.35em] w-[3.6rem] shrink-0 font-utility text-2xs uppercase tracking-utility text-fg-faint"
                    >
                      {group.group}
                    </span>
                    <span>{item}</span>
                  </li>
                )),
              )}
            </ul>

            <div className="mt-10">
              <Button
                href={`/packages#${pkg.slug}`}
                variant={pkg.badge ? "primary" : "outline"}
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
