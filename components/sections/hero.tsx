import { MagneticCTA, MarqueeSpec, RegistrationReveal } from "@/components/motion";
import { Button, CropMarks, Eyebrow, HalftoneField } from "@/components/ui";
import { site } from "@/content";

const SPEC_STRIP = [
  "MISSISSAUGA, ON",
  "EST. IN-HOUSE",
  "4C PROCESS",
  "DTF + EMBROIDERY",
  "NEXT-DAY RUSH",
];

/**
 * Full bleed, ink bed. The Higgsfield loop drops in behind this later; the
 * screened field is doing that job for now and the layout does not change
 * when it is swapped.
 *
 * The headline converges on load rather than on scroll: it is already on
 * screen, so there is no scroll distance to scrub against. Its words ship as
 * plain text in the SSR HTML — the plates are a CSS layer over the top.
 */
export function Hero() {
  return (
    <section
      data-surface="ink"
      data-ticket-number="01"
      data-ticket-label="HERO"
      data-ticket-spec="4C PROCESS"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-surface text-fg"
    >
      <HalftoneField plate="m" pitch={9} dot={1.8} opacity={0.22} seed={23} fade="radial" />
      <HalftoneField plate="c" pitch={7} dot={1.2} opacity={0.14} seed={5} fade="bottom" />
      <CropMarks />

      <div className="relative z-[1] mx-auto flex w-full max-w-page flex-1 flex-col justify-center px-gutter py-24">
        <Eyebrow spec={site.serviceArea}>Surge Labs</Eyebrow>

        <RegistrationReveal
          as="h1"
          trigger="load"
          offset="0.09em"
          duration={1.7}
          className="mt-10 max-w-[22ch] font-display text-3xl font-extrabold text-fg"
        >
          We print, code and stitch your brand into existence.
        </RegistrationReveal>

        <p className="mt-10 max-w-[54ch] text-md text-fg-muted">
          Web, SEO, print, signage and custom apparel from one Mississauga shop. One team. One
          invoice. One brand that actually matches everywhere.
        </p>

        <div className="mt-14 flex flex-wrap items-center gap-6">
          <MagneticCTA>
            <Button href="/packages" size="lg">
              See the packages
            </Button>
          </MagneticCTA>
          <Button href="/contact" size="lg" variant="outline">
            Get a quote in 24hrs
          </Button>
        </div>
      </div>

      <MarqueeSpec items={SPEC_STRIP} duration={44} className="relative z-[1] border-x-0" />
    </section>
  );
}
