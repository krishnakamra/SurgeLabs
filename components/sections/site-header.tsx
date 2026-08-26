import Link from "next/link";
import { Logo } from "@/components/brand";
import { FoilField } from "@/components/motion";
import { Button } from "@/components/ui";
import { site } from "@/content";

/**
 * The masthead. Rendered once in app/layout.tsx, so every route has it.
 *
 * NOT sticky, and that is a decision rather than an omission. This site
 * already has persistent chrome — the job-ticket rail down the left edge —
 * and a second fixed bar would compete with it. More concretely, two things
 * in here use `sticky top-0` for their own purposes: PinnedPanel, which pins
 * the horizontal package track, and the styleguide's demos. A sticky masthead
 * sits on top of both. It would also swallow every in-page anchor the rail
 * links to, since Lenis handles those itself and does not read
 * scroll-padding-top.
 *
 * So the logo is printed at the top of the sheet, and the sheet scrolls.
 *
 * Ink bed, always — the masthead is the press bed the sheets run through,
 * which is also what themeColor in app/layout.tsx claims the site is.
 */
export function SiteHeader() {
  return (
    <header
      data-surface="ink"
      className="relative isolate border-b-[length:var(--hairline)] border-rule bg-surface text-fg"
    >
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-gutter px-gutter sm:h-20">
        {/* Home. The logo names itself — <Logo> carries role="img" and an
            aria-label — so this link needs no label of its own, and gets no
            second one that would read out twice. */}
        {/* The masthead lockup is struck in foil, and the FoilField around it
            is what makes the highlight travel as the pointer crosses the bar.
            One of exactly three places the gradient is allowed. */}
        <FoilField as="span" className="inline-flex">
          <Link
            href="/"
            className="inline-flex outline-offset-[6px] focus-visible:outline-2 focus-visible:outline-focus"
          >
          {/* Size is a CSS variable rather than a prop so it can step at a
              breakpoint without a second render. Under 480px the wordmark
              drops and the mark stands alone — one DOM tree either way. */}
            <Logo
              variant="horizontal"
              collapse="xs"
              foil
              className="[--logo-size:26px] sm:[--logo-size:32px]"
            />
          </Link>
        </FoilField>

        <div className="flex items-center gap-6">
          <a
            href={site.phoneHref}
            className="hidden font-utility text-2xs uppercase tracking-utility text-fg-muted underline decoration-1 decoration-transparent underline-offset-4 transition-colors hover:text-fg hover:decoration-mark sm:inline"
          >
            {site.phone}
          </a>
          <Button href="/quote" size="sm">
            Get a quote
          </Button>
        </div>
      </div>
    </header>
  );
}
