import Image from "next/image";
import { Button } from "@/components/ui";
import { imageSrc, packageStills } from "@/content/media";
import { priceLabel, type Package } from "@/content";
import { cn } from "@/lib/cn";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/** One package, set like a job ticket off the shop floor. */
export function PackagePanel({ pkg, index, total }: { pkg: Package; index: number; total: number }) {
  const still = packageStills[pkg.slug];

  return (
    <article
      id={pkg.slug}
      data-package-panel
      data-package-name={pkg.name}
      data-package-price={priceLabel(pkg)}
      data-package-slug={pkg.slug}
      className={cn(
        // min-w-0: grid and flex children default to min-width:auto, which
        // lets a single long word set at display size ("Storefront" at 60px)
        // widen the whole panel past a phone viewport.
        "flex min-w-0 flex-col border-[length:var(--hairline)] bg-surface-raised",
        // Panels sit inside a viewport-height track on desktop, so a long
        // ticket scrolls inside its own box rather than off the sheet.
        "motion-ready:lg:mr-gutter motion-ready:lg:min-h-0",
        pkg.badge ? "border-accent" : "border-rule",
      )}
    >
      {/* Ticket header: number left, price large on the right. */}
      <header className="flex flex-col gap-6 border-b-[length:var(--hairline)] border-rule p-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className={cn(SPEC, "text-fg-faint")}>
            Ticket {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <h2 className="mt-5 font-display text-xl leading-none font-extrabold text-fg sm:text-2xl">
            {pkg.name}
          </h2>
          <p className="mt-4 max-w-[38ch] text-md text-fg">{pkg.plain}</p>
          <p className="mt-3 max-w-[38ch] text-sm text-fg-muted">{pkg.tagline}</p>
        </div>

        <div className="shrink-0 sm:text-right">
          {pkg.badge ? (
            <p className={cn(SPEC, "mb-4 text-accent-text")}>{pkg.badge}</p>
          ) : null}
          <p className="font-numeral text-2xl leading-none font-black tabular-nums text-fg sm:text-3xl">
            {priceLabel(pkg)}
          </p>
          <p className={cn(SPEC, "mt-3 text-fg-faint")}>
            {pkg.price === null ? "Per job, CAD" : "CAD, one-time"}
          </p>
        </div>
      </header>

      {/* What you are buying, as a photograph. The ticket used to open
          straight onto a spec table, which is the right thing for someone
          who already knows what a 16pt card is and the wrong thing for
          everyone else. */}
      {still ? (
        <div className="relative aspect-[3/2] w-full overflow-hidden border-b-[length:var(--hairline)] border-rule bg-surface-sunken">
          <Image
            src={imageSrc(still)}
            alt={still.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 46rem"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Spec rows. */}
      <dl className="divide-y divide-rule border-b-[length:var(--hairline)] border-rule">
        {[
          { term: "Best for", detail: pkg.bestFor },
          { term: "Turnaround", detail: pkg.turnaround },
          { term: "Terms", detail: pkg.priceNote },
        ].map((row) => (
          <div key={row.term} className="flex flex-col gap-1 px-8 py-4 sm:flex-row sm:gap-6">
            <dt className={cn(SPEC, "shrink-0 text-fg-faint sm:w-[7.5rem]")}>{row.term}</dt>
            {/* min-w-0: a flex item defaults to min-width:auto, so a long
                value refuses to shrink below its content and pushes the row
                past the viewport on a phone. */}
            <dd className="min-w-0 text-sm text-fg-muted">{row.detail}</dd>
          </div>
        ))}
      </dl>

      {/* Deliverables, grouped by vertical. */}
      {/* Chrome makes a scrollable region keyboard-focusable so it can be
          scrolled without a mouse, which is right — but it arrives in the tab
          order with no name and no role, so a screen reader announces a stop
          and nothing else. tabIndex and a group label make it say what it is. */}
      <div
        className="flex-1 overflow-y-auto p-8"
        tabIndex={0}
        role="group"
        aria-label={`${pkg.name} — what is included`}
      >
        <div className="space-y-8">
          {pkg.deliverables.map((group) => (
            <section key={group.group}>
              <h3 className={cn(SPEC, "text-accent-text")}>{group.group}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-fg-muted">
                    <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-3 shrink-0 bg-rule-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {pkg.notIncluded && pkg.notIncluded.length > 0 ? (
          <section className="mt-10 border-t-[length:var(--hairline)] border-rule pt-6">
            <h3 className={cn(SPEC, "text-fg-faint")}>Not included</h3>
            <ul className="mt-4 space-y-2.5">
              {pkg.notIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-fg-muted">
                  {/* An em dash, not a cross: this is a list of things that
                      are simply outside the scope, not a list of failures. */}
                  <span aria-hidden="true" className="shrink-0 font-utility text-2xs leading-[1.9] text-rule-strong">
                    &mdash;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {pkg.addOns.length > 0 ? (
          <div className="mt-10 border-t-[length:var(--hairline)] border-rule pt-6">
            <p className={cn(SPEC, "text-fg-faint")}>Often added</p>
            <p className="mt-3 text-sm text-fg-muted">{pkg.addOns.join(" · ")}</p>
          </div>
        ) : null}
      </div>

      <footer className="border-t-[length:var(--hairline)] border-rule p-8">
        <Button
          href={`/quote?package=${pkg.slug}`}
          variant={pkg.badge ? "primary" : "outline"}
          size="lg"
          className="w-full"
        >
          {pkg.ctaLabel}
        </Button>
      </footer>
    </article>
  );
}
