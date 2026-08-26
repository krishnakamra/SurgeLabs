import Link from "next/link";
import { Button, Eyebrow, SectionFrame } from "@/components/ui";
import { packages, priceLabel } from "@/content";
import { cn } from "@/lib/cn";

/**
 * All five tiers, set as one price ladder rather than five floating cards.
 *
 * The cards used to be three boxes with a mono price and a truncated feature
 * list, and the owner's complaint about it was exactly right: it did not read
 * as a price list, so nobody could tell at a glance what the difference
 * between $899 and $1,899 actually was. A ladder answers the only two
 * questions this section is asked — what does it cost, and what is it — in
 * that order, and puts the price in the display face rather than the mono one.
 */
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
          <p className="mt-5 max-w-[52ch] text-md text-fg-muted">
            Five ways to start, from a hundred dollars to a full rebrand. Every price below is
            what you pay, in Canadian dollars, delivery across the GTA included.
          </p>
        </div>
        <Button href="/packages" variant="outline" size="lg">
          Compare them all
        </Button>
      </div>

      {/* gap-px on a ruled background draws the ladder's separators, so the
          five cells read as one table instead of five cards. */}
      <ul className="mt-16 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {packages.map((pkg) => (
          <li key={pkg.slug} className="flex">
            <Link
              href={`/packages#${pkg.slug}`}
              className={cn(
                "group flex flex-1 flex-col p-7 transition-colors",
                "bg-surface-raised hover:bg-surface-sunken",
                "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
                pkg.badge ? "ring-[length:var(--hairline)] ring-accent ring-inset" : "",
              )}
            >
              <p className="min-h-[1.25rem] font-utility text-2xs uppercase tracking-utility text-accent-text">
                {pkg.badge ?? ""}
              </p>

              <h3 className="mt-4 font-display text-lg leading-tight font-bold text-fg">
                {pkg.name}
              </h3>

              <p className="mt-5 font-numeral text-xl leading-none font-black tabular-nums text-fg">
                {priceLabel(pkg)}
              </p>
              <p className="mt-2 font-utility text-2xs uppercase tracking-utility text-fg-faint">
                {pkg.price === null ? "Per job, in CAD" : "One-time, CAD"}
              </p>

              <p className="mt-6 flex-1 text-sm text-fg-muted">{pkg.plain}</p>

              <span className="mt-7 font-utility text-2xs uppercase tracking-utility-tight text-fg underline decoration-1 decoration-rule-strong underline-offset-[7px] transition-colors group-hover:decoration-mark">
                What&rsquo;s included
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
