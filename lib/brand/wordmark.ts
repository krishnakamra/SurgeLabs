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
 * Display face is Bodoni Moda (lib/fonts.ts) at 400.
 */

export const WORDMARK_TEXT = "SURGE LABS";

/**
 * Tracking, in em. POSITIVE and generous, and that is the whole trick.
 *
 * Headlines in this system run negative — text-3xl sits at -0.02em — and a
 * wordmark set on those defaults looks like a headline that got small. Caps
 * want the opposite, and Didone caps want it more than most: this is the
 * letterform class that engravers and foil houses have set wide for two
 * hundred years, because the hairlines need air around them or they fill in
 * under the die. 0.14em is where SURGE LABS stops reading as a word and
 * starts reading as a stamped mark.
 */
export const WORDMARK_TRACKING = 0.14;

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
 * Bodoni Moda's opsz axis runs 6–96, and `font-optical-sizing: auto` feeds it
 * the rendered size: the wordmark would be drawn with different letterforms
 * at 26px in a phone header than at 200px on a trade-show banner. For a
 * headline that is the feature, and globals.css leaves it automatic there.
 * For an identity it is a defect — a wordmark that changes shape with size
 * is not a wordmark.
 *
 * Pinned at 48: far enough up the axis to get real Didone contrast, and not
 * so far that the hairlines disappear at the 24px minimum. The display end
 * (96) is genuinely too fine to survive a 26px phone masthead, which is the
 * smallest place this lockup has to work.
 */
export const WORDMARK_OPSZ = 48;

/**
 * Wordmark size as a multiple of the MARK'S HEIGHT, per lockup.
 *
 * horizontal — 0.60 puts the cap height at a little under half the mark.
 *   Lower than the grotesque needed: Bodoni's caps carry more visual weight
 *   per point, and the extra tracking makes the lockup longer, so the type
 *   holds its own against the square mark at a smaller size.
 * stacked — the wordmark is no longer competing with the mark for horizontal
 *   room, so it sets smaller and runs about twice the mark's width, which is
 *   the proportion that keeps a stacked lockup from looking bottom-heavy.
 */
export const WORDMARK_SCALE = { horizontal: 0.6, stacked: 0.3 } as const;

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
 * quote the lockup's proportions. Bodoni Moda caps at 400 average ~0.62em of
 * advance — narrower than the grotesque was — but 0.14em of tracking across
 * ten glyph positions more than makes the difference back.
 */
export const WORDMARK_ASPECT = 7.4;
