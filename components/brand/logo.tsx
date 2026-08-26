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
   * Strike the lockup in foil rather than flat ink. The gradient is static
   * until a <FoilField> ancestor starts driving --foil-pos; both states are
   * finished, so this is safe with no JS.
   *
   * Allowed on the logo lockup, primary CTAs and the foil section, and
   * nowhere else — see the FOIL block in globals.css for why.
   */
  foil?: boolean;
  /**
   * Accessible name. Pass null when a parent already names the control and
   * this would double it up.
   */
  title?: string | null;
  className?: string;
};

/**
 * The mark as a CSS mask, built from MARK_PATH so it cannot drift from the
 * <svg> beside it. Used only by the foil variant: a gradient cannot be
 * clipped to an SVG path the way background-clip clips it to glyphs, so the
 * foil version paints the gradient on a box and masks it to this shape.
 */
const MARK_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${MARK_SIZE} ${MARK_SIZE}'%3E%3Cpath d='${MARK_PATH}' fill='%23000'/%3E%3C/svg%3E")`;

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
function Wordmark({
  variant,
  foil,
  className,
}: {
  variant: "horizontal" | "stacked";
  foil?: boolean;
  className?: string;
}) {
  return (
    <span
      data-foil={foil ? "text" : undefined}
      className={cn("block", className)}
      style={
        {
          fontFamily: "var(--font-display)",
          // 400, like every other piece of display type here. A bolded Didone
          // loses the stem-to-hairline contrast that is the entire reason
          // this face sets the identity.
          fontWeight: 400,
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
function Mark({ foil }: { foil?: boolean }) {
  const box = { width: "var(--logo-size, 32px)", height: "var(--logo-size, 32px)" };

  if (foil) {
    return (
      <span
        aria-hidden="true"
        data-foil="mark"
        className="block shrink-0"
        style={{ ...box, "--foil-mask": MARK_MASK } as CSSProperties}
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
      aria-hidden="true"
      focusable="false"
      className="block shrink-0"
      style={box}
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
  foil = false,
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
        <Mark foil={foil} />
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
        <Mark foil={foil} />
        <Wordmark
          variant="stacked"
          foil={foil}
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
      <Mark foil={foil} />
      <Wordmark variant="horizontal" foil={foil} className={cn(collapse && COLLAPSE[collapse])} />
    </span>
  );
}
