import { getImageProps } from "next/image";
import { MagneticCTA, MarqueeSpec, PressLight, RegistrationReveal } from "@/components/motion";
import { Button, CropMarks, Eyebrow } from "@/components/ui";
import { site } from "@/content";
import { getPageSeo } from "@/lib/seo/page-seo";

/**
 * The strip under the fold. Spec codes on their own read as decoration to
 * anyone who does not already work in print, so each one now says what it
 * means — the strip still scans like a press control bar, and it also tells
 * a first-time visitor five true things about the shop.
 */
const SPEC_STRIP = [
  "MISSISSAUGA, ON",
  "MADE IN OUR OWN BUILDING",
  "FULL-COLOUR PRINTING",
  "SHIRTS PRINTED OR STITCHED",
  "SAME-DAY RUSH ON STOCK ITEMS",
  "ONE BILL FOR ALL OF IT",
];

/**
 * Full bleed, ink bed.
 *
 * The press sheet is a real, prioritised image, and it is here for two
 * reasons. It is the hero's texture, and it is deliberately the largest
 * paintable thing above the fold — so LCP reports when the image bytes land
 * rather than when the headline animation finishes resolving. With the
 * headline as the largest element, LCP measured 1.39s on a machine that
 * served the HTML in 200ms; the number was describing the animation.
 *
 * Measured afterwards, across viewport widths 390 → 1440: Chrome nominates
 * the image only where its box is strictly narrower than the viewport,
 * which here means ≥1200px, where the left rail's padding insets it. At
 * every narrower width it treats a bleed-to-every-edge image as background
 * and hands LCP back to the headline — painted from the server HTML at
 * 104–256ms, so the budget is met either way and the headline is not
 * waiting on an animation. Not worth breaking the full bleed to win the
 * nomination, but worth knowing before anyone reads a field report and
 * assumes the image regressed.
 *
 * The headline converges on load rather than on scroll: it is already on
 * screen, so there is no scroll distance to scrub against. Its words ship as
 * plain text in the SSR HTML — the plates are a CSS layer over the top.
 */
/**
 * Alt describes what the plate actually is. It is a hero image, not a
 * decorative flourish, so it gets a real description — but a short factual
 * one: a screen reader announcing a paragraph of keywords before the H1
 * would be worse than no alt at all.
 */
const HERO_ALT =
  "A four-colour process press sheet — cyan, magenta, yellow and black halftone dots with registration targets and a printed colour control strip.";

const heroCommon = {
  alt: HERO_ALT,
  fill: true,
  priority: true,
  quality: 68,
  sizes: "100vw",
} as const;

export function Hero() {
  const h1 = getPageSeo("/")!.h1;

  // The three verbs are what the business does, so they carry the colour and
  // the caps. The plates underneath still get the flat string — see the
  // `solid` prop on RegistrationText — so the H1 is one text node to a
  // crawler and the keyword gate still reads the sentence it asserts on.
  const VERB = "font-black uppercase";
  const headline = (
    <>
      We <span className={`${VERB} text-plate-m`}>print</span>,{" "}
      <span className={`${VERB} text-plate-c`}>code</span> and{" "}
      <span className={`${VERB} text-accent-lime`}>stitch</span> your brand into existence.
    </>
  );

  // Two trims, chosen by media query. See scripts/generate-hero-image.mjs:
  // cropping the landscape sheet into a phone-shaped box threw away 72% of
  // the bytes, and Chrome scores an LCP image by the part that survives the
  // crop — which cost the image the LCP slot on mobile.
  const { props: heroLandscape } = getImageProps({ ...heroCommon, src: "/hero/press-sheet.jpg" });
  const { props: heroPortrait } = getImageProps({
    ...heroCommon,
    src: "/hero/press-sheet-portrait.jpg",
  });

  return (
    <section
      data-surface="ink"
      data-ticket-number="01"
      data-ticket-label="HERO"
      data-ticket-spec="4C PROCESS"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-surface text-fg"
    >
      {/* getImageProps is Next's supported route to art direction: the img
          below carries the props <Image> would have set, so it still goes
          through the optimizer, AVIF/WebP and the responsive srcset. */}
      <PressLight className="absolute inset-0 -z-10">
      <picture>
        <source media="(max-width: 639px)" srcSet={heroPortrait.srcSet} sizes={heroPortrait.sizes} />
        {/* fetchPriority is set explicitly. getImageProps returns the srcSet
            and sizes but drops the priority hint that <Image priority> would
            have emitted, so the LCP image was shipping without one —
            Lighthouse reported priorityHinted: false against it. */}
        <img
          {...heroLandscape}
          alt={HERO_ALT}
          fetchPriority="high"
          decoding="async"
          // No duotone. The sheet underneath is a four-colour process proof
          // and it is meant to be: this is a press shop, and the rosette,
          // the registration targets and the CMYK colour bar are the
          // product. A filter chain re-mapping it to two brand inks was
          // there to serve a foil identity that has since been reverted.
className="absolute inset-0 -z-10 object-cover"
        />
      </picture>
      </PressLight>
      {/* No scrim. Both trims carry their own gradient hold over the
          column the type sits in — landscape holds from the left, portrait
          from the top — so a CSS overlay on top of that was darkening the
          sheet twice and flattening the rosette to nothing. */}
      <CropMarks />

      <div className="relative z-[1] mx-auto flex w-full max-w-page flex-1 flex-col justify-center px-gutter py-24">
        <Eyebrow spec={site.serviceArea}>Surge Labs</Eyebrow>

        <RegistrationReveal
          as="h1"
          trigger="load"
          offset="0.09em"
          duration={1.7}
          className="mt-10 max-w-[22ch] font-display text-3xl font-extrabold text-fg"
          solid={headline}
        >
          {h1}
        </RegistrationReveal>

        <p className="mt-10 max-w-[54ch] text-md text-fg-muted">
          We design it, build the website, print the cards and the signs, and stitch the shirts —
          all in one building in Mississauga. One team, one bill, and the same colours on every
          one of them.
        </p>

        <div className="mt-14 flex flex-wrap items-center gap-6">
          <MagneticCTA>
            <Button href="/quote" size="lg">
              Get a price in 24 hours
            </Button>
          </MagneticCTA>
          <Button href="/packages" size="lg" variant="outline">
            See what things cost
          </Button>
        </div>
      </div>

      <MarqueeSpec items={SPEC_STRIP} duration={44} className="relative z-[1] border-x-0" />
    </section>
  );
}
