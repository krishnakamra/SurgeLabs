/**
 * THE WORDMARK — placeholder, and the numbers that make it one.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  ⚠️  THIS IS NOT FINAL ARTWORK.                                       │
 * │                                                                      │
 * │  "SURGE LABS" is set live in the display face until the client        │
 * │  supplies a drawn wordmark. Everything below exists so that it reads  │
 * │  as a wordmark rather than as a heading that wandered into the        │
 * │  header — but live type is still live type, and it will re-flow in    │
 * │  the metric fallback on a cold cache, which real artwork would not.   │
 * │                                                                      │
 * │  To drop the real thing in, there is exactly one place to go:         │
 * │  components/brand/logo.tsx → the Wordmark function. The comment       │
 * │  block above it is the four-step swap.                                │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Display face is Bricolage Grotesque (lib/fonts.ts) at 800.
 */

export const WORDMARK_TEXT = "SURGE LABS";

/**
 * Tracking, in em. POSITIVE, and that is the whole trick.
 *
 * Every headline in this system runs negative — text-3xl is at -0.035em — and
 * a wordmark set on those defaults looks like a headline that got small. Caps
 * in a heavy grotesque at 20-odd pixels need the opposite: the sidebearings
 * that make lowercase work are wrong for uppercase, and letters this weight
 * close their own counters when they sit tight. 0.055em is the point where
 * SURGE stops reading as one dark block and starts reading as five letters.
 */
export const WORDMARK_TRACKING = 0.055;

/**
 * Word space, in em, on top of the tracked space. Slightly negative: the
 * face's own space plus 0.055em of tracking lands a touch wide for a
 * two-word lockup, where the gap should read as one unit of air rather than
 * as a pause.
 */
export const WORDMARK_WORD_SPACING = -0.02;

/**
 * Optical size, PINNED — not `auto`, which is what the rest of the site uses.
 *
 * Bricolage's opsz axis runs 12–96, and `font-optical-sizing: auto` feeds it
 * the rendered size: the wordmark would be drawn with different letterforms
 * at 26px in a phone header than at 200px on a trade-show banner. For body
 * copy that is the feature. For an identity it is a defect — a wordmark that
 * changes shape with size is not a wordmark. Pinned at 40, which is the
 * display end of the axis while still holding together at the 24px minimum.
 */
export const WORDMARK_OPSZ = 40;

/**
 * Wordmark size as a multiple of the MARK'S HEIGHT, per lockup.
 *
 * horizontal — 0.66 puts the cap height at roughly half the mark. The mark is
 *   a square, so anything larger and the type starts to out-shout it.
 * stacked — the wordmark is no longer competing with the mark for horizontal
 *   room, so it sets smaller and runs about twice the mark's width, which is
 *   the proportion that keeps a stacked lockup from looking bottom-heavy.
 */
export const WORDMARK_SCALE = { horizontal: 0.66, stacked: 0.34 } as const;

/**
 * Baseline nudge, in em of the wordmark. Zero, and here on purpose.
 *
 * With line-height 1 the text box centres on the em box, and for Bricolage
 * the em-box centre and the cap-height centre land within about half a
 * percent of each other — so plain flex centring aligns the caps to the mark
 * without help. This is the dial to reach for if that stops being true when
 * the real face lands. It goes away entirely once the wordmark is an SVG.
 */
export const WORDMARK_NUDGE = 0;

/**
 * Width of the placeholder wordmark, in em of its own font size. Measured
 * from the tracked string, not guessed — it is what the static SVG exporter
 * needs to size a viewBox around live text, and what the /brand page uses to
 * quote the lockup's proportions. Bricolage 800 caps average ~0.70em of
 * advance; ten glyph positions plus the tracking and the space land here.
 */
export const WORDMARK_ASPECT = 6.9;
