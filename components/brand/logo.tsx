import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  LOCKUP_GAP,
  MARK_PATH,
  MARK_SIZE,
  STACK_GAP,
  type LogoVariant,
} from "@/lib/brand/mark";
import {
  WORDMARK_NUDGE,
  WORDMARK_OPSZ,
  WORDMARK_SCALE,
  WORDMARK_TEXT,
  WORDMARK_TRACKING,
  WORDMARK_WORD_SPACING,
} from "@/lib/brand/wordmark";

/**
 * THE LOGO SLOT.
 *
 * Three lockups, one geometry (lib/brand/mark.ts), no colour of its own.
 *
 *   horizontal   mark + wordmark, side by side. The default, and the header.
 *   stacked      mark over wordmark, centred. Footer and the OG card.
 *   mark         the S alone. Favicon, phone headers, loading states.
 *
 * COLOUR IS NOT A PROP. The mark is filled with currentColor and the wordmark
 * is ordinary text, so both take --color-fg from whichever [data-surface]
 * section they are sitting inside. Drop the same call into an ink section and
 * a stock section and you get the ink version and the stock version, with
 * byte-identical markup and no variant to pick. That is the same contract
 * every other component in this system honours — if this one needed a
 * `dark:` variant, the token system would have failed.
 *
 * SIZE IS ONE NUMBER: the mark's height. Everything else — wordmark size,
 * gaps, clear space — is a multiple of the bar, resolved in calc() off
 * --logo-size. Pass `size` for a fixed logo, or leave it off and set
 * --logo-size from a class when it needs to change at a breakpoint:
 *
 *   <Logo size={32} />
 *   <Logo className="[--logo-size:26px] sm:[--logo-size:32px]" />
 */

export type LogoProps = {
  variant?: LogoVariant;
  /**
   * Mark height in px. Omit to inherit --logo-size from CSS, which is how the
   * header steps 26 → 32 without re-rendering anything.
   */
  size?: number;
  /**
   * Force a surface rather than inheriting the section's. Only for artwork
   * sitting on a fixed-colour plate — a magenta panel, a photograph — where
   * there is no [data-surface] to ask.
   */
  surface?: "ink" | "stock";
  /**
   * Drop the wordmark below this width, leaving the mark. `xs` is 480px.
   * The accessible name is unaffected — it lives on the root, not the type.
   */
  collapse?: "xs" | "sm";
  /**
   * Accessible name. Pass null when a parent already names the control and
   * this would double it up.
   */
  title?: string | null;
  className?: string;
};

/** Below this the mark is hidden by CSS, so the DOM stays single. */
const COLLAPSE: Record<NonNullable<LogoProps["collapse"]>, string> = {
  xs: "hidden xs:inline-block",
  sm: "hidden sm:inline-block",
};

/* ══════════════════════════════════════════════════════════════════════════
   ⚠️  PLACEHOLDER WORDMARK — THE SLOT. REPLACE THIS FUNCTION.
   ──────────────────────────────────────────────────────────────────────────
   Until the client supplies drawn artwork, "SURGE LABS" is live type in the
   display face, tuned in lib/brand/wordmark.ts so it sets as a wordmark and
   not as a small heading. Read that file before touching these numbers.

   WHEN THE REAL SVG ARRIVES — four steps, all of them here:

     1. Put the artwork at public/brand/surge-labs-wordmark.svg. Outlines,
        not text. viewBox tight to the letterforms — no padding, or every
        gap in every lockup is silently wrong.

     2. Replace the <span> below with the artwork's <path>, inlined:

          <svg
            viewBox="0 0 {W} {H}"
            aria-hidden="true"
            focusable="false"
            style={{ height: `calc(var(--logo-size, 32px) * ${scale})`, width: "auto" }}
            fill="currentColor"
          >
            <path d="…" />
          </svg>

        Inline, not <img src>: an <img> cannot inherit currentColor, and the
        surface flip is the whole point of this component.

     3. Set WORDMARK_ASPECT in lib/brand/wordmark.ts to W / H, and re-check
        WORDMARK_SCALE — it is expressed against the mark's height, and drawn
        letterforms almost never have the same cap height as the live face.

     4. `npm run gen:brand`. The static SVGs in public/brand are exported
        from this same geometry and carry live <text> until you do — that is
        the one thing in the handoff pack that is not yet final artwork, and
        public/brand/README.md says so out loud.

   Then delete this comment block, and delete WORDMARK_TEXT, _TRACKING,
   _WORD_SPACING, _OPSZ and _NUDGE from lib/brand/wordmark.ts. They describe
   live type and will mean nothing once there is none.
   ══════════════════════════════════════════════════════════════════════════ */
function Wordmark({ variant, className }: { variant: "horizontal" | "stacked"; className?: string }) {
  return (
    <span
      className={cn("block", className)}
      style={
        {
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: `calc(var(--logo-size, 32px) * ${WORDMARK_SCALE[variant]})`,
          lineHeight: 1,
          letterSpacing: `${WORDMARK_TRACKING}em`,
          wordSpacing: `${WORDMARK_WORD_SPACING}em`,
          // Pinned, not auto. A wordmark that redraws itself between the
          // header and the banner is not a wordmark — see wordmark.ts.
          fontOpticalSizing: "none",
          fontVariationSettings: `"opsz" ${WORDMARK_OPSZ}`,
          // Tracking adds a trailing advance after the final S. Pull it back
          // so the lockup's right edge is the letterform, not the sidebearing
          // — otherwise the clear space on the right is quietly 0.055em wider
          // than the clear space on the left.
          marginRight: `-${WORDMARK_TRACKING}em`,
          ...(WORDMARK_NUDGE ? { transform: `translateY(${WORDMARK_NUDGE}em)` } : {}),
          whiteSpace: "nowrap",
        } as CSSProperties
      }
    >
      {WORDMARK_TEXT}
    </span>
  );
}

/** The S. One filled polygon, currentColor, never a stroke. */
function Mark() {
  return (
    <svg
      viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
      aria-hidden="true"
      focusable="false"
      className="block shrink-0"
      style={{ width: "var(--logo-size, 32px)", height: "var(--logo-size, 32px)" }}
      fill="currentColor"
    >
      <path d={MARK_PATH} />
    </svg>
  );
}

export function Logo({
  variant = "horizontal",
  size,
  surface,
  collapse,
  title = "Surge Labs",
  className,
}: LogoProps) {
  // role="img" + a name on the root is what lets `collapse` work: the
  // wordmark can leave the accessibility tree with the rest of the lockup
  // and the logo still announces itself, in the header and at 400px alike.
  const naming = title ? ({ role: "img", "aria-label": title } as const) : {};

  const sized = size ? { "--logo-size": `${size}px` } : {};

  // The gaps are multiples of the bar, resolved off --logo-size — so they
  // track the logo at any size and there is no second scale to keep in step.
  const lockup = (ratio: number) =>
    ({ ...sized, gap: `calc(var(--logo-size, 32px) * ${ratio})` }) as CSSProperties;

  if (variant === "mark") {
    return (
      <span
        {...naming}
        data-surface={surface}
        data-logo="mark"
        style={sized as CSSProperties}
        className={cn("inline-block align-middle text-current", className)}
      >
        <Mark />
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span
        {...naming}
        data-surface={surface}
        data-logo="stacked"
        style={lockup(STACK_GAP)}
        className={cn("inline-flex flex-col items-center text-current", className)}
      >
        <Mark />
        <Wordmark
          variant="stacked"
          className={cn(collapse && COLLAPSE[collapse])}
        />
      </span>
    );
  }

  return (
    <span
      {...naming}
      data-surface={surface}
      data-logo="horizontal"
      style={lockup(LOCKUP_GAP)}
      className={cn("inline-flex items-center text-current", className)}
    >
      <Mark />
      <Wordmark variant="horizontal" className={cn(collapse && COLLAPSE[collapse])} />
    </span>
  );
}
