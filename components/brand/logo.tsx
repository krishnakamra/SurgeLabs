import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  CLEAR_SPACE,
  LABS_D,
  LABS_DX,
  MARK_ASPECT,
  MARK_D,
  MARK_VIEWBOX,
  STACK_LEADING,
  STACK_VIEWBOX,
  SURGE_D,
  WORDMARK_ASPECT,
  WORDMARK_VIEWBOX,
  type LogoVariant,
} from "@/lib/brand/mark";

/**
 * THE LOGO SLOT.
 *
 * Three lockups, one set of paths (lib/brand/mark.ts), no colour of its own.
 *
 *   horizontal   the wordmark as supplied. The default, and the header.
 *   stacked      "Surge" over "Labs". Footer, OG card, square spaces.
 *   mark         the S alone. Favicon, phone headers, loading states.
 *
 * There is no mark-plus-wordmark lockup, and that is deliberate: the client's
 * wordmark opens with the S, and the S is the mark, so setting them side by
 * side would print the letter twice.
 *
 * COLOUR IS NOT A PROP. "Surge" is filled with currentColor and "Labs" with
 * the accent token, so both take their value from whichever [data-surface]
 * section they are sitting inside. Drop the same call into an ink section and
 * a stock section and you get the ink version and the stock version, with
 * byte-identical markup and no variant to pick.
 *
 * The supplied artwork was two-tone — near-white and a mid blue. The
 * two-tone STRUCTURE is kept, because it is the design; the two literal
 * colours are not, because a fixed near-white cannot sit on paper and the
 * blue has no place in a gold-and-ink system. See the note in mark.ts.
 *
 * SIZE IS ONE NUMBER: the mark's height, or for the lockups the height of
 * their own box. Everything else is derived. Pass `size` for a fixed logo, or
 * leave it off and set --logo-size from a class when it needs to change at a
 * breakpoint:
 *
 *   <Logo size={32} />
 *   <Logo className="[--logo-size:26px] sm:[--logo-size:32px]" />
 */

export type LogoProps = {
  variant?: LogoVariant;
  /**
   * Height in px of the mark, or of the lockup's box. Omit to inherit
   * --logo-size from CSS, which is how the header steps 26 → 32 without
   * re-rendering anything.
   */
  size?: number;
  /**
   * Force a surface rather than inheriting the section's. Only for artwork
   * sitting on a fixed-colour plate — a gold panel, a photograph — where
   * there is no [data-surface] to ask.
   */
  surface?: "ink" | "stock";
  /**
   * Drop to the mark alone below this width. `xs` is 480px. The accessible
   * name is unaffected — it lives on the root, not the artwork.
   */
  collapse?: "xs" | "sm";
  /**
   * Strike the logo in foil rather than flat ink. Static until a <FoilField>
   * ancestor starts driving --foil-pos; both states are finished, so this is
   * safe with no JS. Allowed on the masthead lockup, primary CTAs and the
   * foil section, and nowhere else.
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
 * The mark as a CSS mask, built from MARK_D so it cannot drift from the <svg>
 * beside it. Used only by the foil variant: a gradient cannot be clipped to
 * an SVG path the way background-clip clips it to glyphs, so the foil version
 * paints the gradient on a box and masks it to this shape.
 */
const MARK_MASK =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='${MARK_VIEWBOX}'%3E%3Cpath d='${MARK_D}' fill='%23000'/%3E%3C/svg%3E")`;

/**
 * The foil gradient, as an SVG def.
 *
 * The CSS foil (globals.css) clips a moving gradient with a mask, which works
 * for the mark because the mark is one shape. It cannot do a two-tone
 * wordmark: only "Labs" should be metal, and masking half an <svg> from
 * outside it is not a thing CSS can express.
 *
 * So the lockups carry their own gradient, and it is STILL — the three stops
 * are the same, but the highlight does not track the pointer. That is an
 * honest limitation rather than a shortcut: SVG gradient stop offsets cannot
 * be driven by a custom property, and the transform trick that would fake it
 * is not reliable across browsers. The mark keeps the moving version, and it
 * is the one in the masthead that the pointer actually crosses.
 *
 * A fixed id is safe here: every instance emits an identical def, so a
 * duplicate resolves to the same gradient.
 */
const FOIL_ID = "sl-foil";

function FoilDef() {
  return (
    <defs>
      <linearGradient id={FOIL_ID} x1="0" y1="0" x2="1" y2="0.35">
        <stop offset="0%" stopColor="var(--color-gold-lo)" />
        <stop offset="28%" stopColor="var(--color-gold-lo)" />
        <stop offset="50%" stopColor="var(--color-gold-hi)" />
        <stop offset="72%" stopColor="var(--color-gold-lo)" />
        <stop offset="100%" stopColor="var(--color-gold-lo)" />
      </linearGradient>
    </defs>
  );
}

/** What fills the "Labs" half: flat accent, or foil. */
const labsFill = (foil?: boolean) => (foil ? `url(#${FOIL_ID})` : "var(--color-accent-text)");

const COLLAPSE: Record<NonNullable<LogoProps["collapse"]>, string> = {
  xs: "hidden xs:block",
  sm: "hidden sm:block",
};

/** Shown when `collapse` hides the lockup. Same artwork, mark only. */
const COLLAPSE_MARK: Record<NonNullable<LogoProps["collapse"]>, string> = {
  xs: "block xs:hidden",
  sm: "block sm:hidden",
};

/* ── The three pieces of artwork ─────────────────────────────────────────
   Every path below is the client's, unaltered. `fill` is the only thing this
   file decides. */

function Mark({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("block shrink-0", className)}
      style={style}
      fill="currentColor"
    >
      <path d={MARK_D} />
    </svg>
  );
}

function Wordmark({
  style,
  className,
  foil,
}: {
  style?: CSSProperties;
  className?: string;
  foil?: boolean;
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("block shrink-0", className)}
      style={style}
    >
      {foil ? <FoilDef /> : null}
      {/* "Surge" takes the foreground; "Labs" takes the accent — or foil.
          Two fills, both tokens, so the pair flips with the surface. */}
      <g fill="currentColor">
        {SURGE_D.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      <g fill={labsFill(foil)}>
        {LABS_D.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}

function Stacked({
  style,
  className,
  foil,
}: {
  style?: CSSProperties;
  className?: string;
  foil?: boolean;
}) {
  return (
    <svg
      viewBox={STACK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("block shrink-0", className)}
      style={style}
    >
      {foil ? <FoilDef /> : null}
      <g fill="currentColor">
        {SURGE_D.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      {/* Line two: pulled to the origin, centred under line one, dropped by
          one leading. The transform is layout, not artwork — the paths are
          untouched. */}
      <g fill={labsFill(foil)} transform={`translate(${LABS_DX} ${STACK_LEADING})`}>
        {LABS_D.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Foil is a masked gradient, so it can only carry one shape: the mark. */
function FoilMark({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-foil="mark"
      className={cn("block shrink-0", className)}
      style={{ ...style, "--foil-mask": MARK_MASK } as CSSProperties}
    />
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
  // wordmark can leave the accessibility tree with the rest of the lockup and
  // the logo still announces itself, in the header and at 400px alike.
  const naming = title ? ({ role: "img", "aria-label": title } as const) : {};
  const sized = size ? { "--logo-size": `${size}px` } : {};
  const root = cn("inline-block align-middle text-current", className);

  // Height is the driver; width follows from the artwork's own aspect. Set
  // the other way round and an 8.32:1 wordmark decides the layout.
  const box = (aspect: number): CSSProperties => ({
    height: "var(--logo-size, 32px)",
    width: `calc(var(--logo-size, 32px) * ${aspect})`,
  });

  if (variant === "mark") {
    const style = box(MARK_ASPECT);
    return (
      <span {...naming} data-surface={surface} data-logo="mark" style={sized as CSSProperties} className={root}>
        {foil ? <FoilMark style={style} /> : <Mark style={style} />}
      </span>
    );
  }

  const isStacked = variant === "stacked";
  const Art = isStacked ? Stacked : Wordmark;
  const aspect = isStacked ? 846.57 / 306.21 : WORDMARK_ASPECT;

  return (
    <span
      {...naming}
      data-surface={surface}
      data-logo={variant}
      style={sized as CSSProperties}
      className={root}
    >
      <Art style={box(aspect)} foil={foil} className={cn(collapse && COLLAPSE[collapse])} />
      {/* Below the breakpoint the lockup is replaced by the mark rather than
          simply hidden — a masthead with no logo in it is worse than a small
          one. One DOM tree either way; CSS picks. */}
      {collapse ? (
        foil ? (
          <FoilMark style={box(MARK_ASPECT)} className={COLLAPSE_MARK[collapse]} />
        ) : (
          <Mark style={box(MARK_ASPECT)} className={COLLAPSE_MARK[collapse]} />
        )
      ) : null}
    </span>
  );
}

/** Clear space in px for a given logo height. Exported for /brand. */
export function clearSpaceFor(size: number): number {
  return Math.round(size * CLEAR_SPACE);
}
