/**
 * THE MARK AND THE WORDMARK — the client's artwork, and the only place it is
 * defined.
 *
 * Everything downstream reads from here: the React <Logo>, the static SVGs in
 * public/brand, the favicon set, the OG card and the /brand spec page. Change
 * a path in this file and `npm run gen:brand` re-cuts every asset from it.
 *
 * ── WHAT WAS SUPPLIED ────────────────────────────────────────────────────
 *
 * One file, "KRISHNA STUFF logo.svg": a horizontal wordmark, 1588.53 × 190.99
 * (8.32:1), set in a heavy grotesque. Nine glyph paths in two colours —
 * "Surge" in #F9F9FA and "Labs" in #325FAC.
 *
 * Two consequences drove everything below.
 *
 * 1. THERE IS NO SEPARATE SYMBOL. An 8.32:1 wordmark cannot be a 16px
 *    favicon, a phone masthead or a loading state. Rather than pair the
 *    client's wordmark with an unrelated invented mark, the mark IS their
 *    own S — the first glyph, lifted unaltered. It is their letterform, so
 *    the two can never disagree, and it proofs cleanly at 16px: heavy
 *    strokes, wide apertures, no counter fine enough to close up.
 *
 * 2. THE WORDMARK ALREADY CONTAINS THE S, so a mark-plus-wordmark lockup
 *    would set the letter twice. The horizontal lockup is therefore the
 *    wordmark alone — as supplied, it already reads as the whole logo — and
 *    the stacked lockup splits it onto two lines rather than adding a mark
 *    above it. See LOCKUP geometry below.
 *
 * ── WHAT WAS CHANGED ─────────────────────────────────────────────────────
 *
 * Only the colour. #325FAC is a mid blue with no place in a gold-and-ink
 * foil system, and #F9F9FA is a fixed near-white that cannot sit on paper.
 * Both are dropped in favour of tokens, so the artwork inherits the surface
 * it lands on. The geometry is untouched: every path string below is
 * byte-identical to the file supplied, which is why they are ugly and why
 * they must stay that way — a hand-tidied path is a redrawn logo.
 */

export const MARK_D = "M144.18,144.86C107.25,150.21,1.75,154.5,0,97.52l52.16-.8c8.81,13.9,34.5,14.19,49.83,14.27,9.7.05,38.61,1.02,39.88-9.93.92-7.93-11.53-10.08-17.89-10.34l-32.02-1.34c-22.8-.95-55.17-1.52-74.97-11.62-8.88-4.53-13.61-12.15-14.73-22.01-1.46-12.78,3.15-24.52,13.88-31.88,8.93-6.12,18.53-10.21,29.53-12.41,29.44-5.91,59.61-6.02,89.14-.41,25.59,4.86,52.36,19.37,50.46,48.92l-49.53,1.02c-2.11-7.4-7.6-11.62-14.96-13.38-11.93-2.86-24.15-2.94-36.57-2.58-8.68.25-32.83.42-31.49,12.13.39,3.41,3.5,6,7.43,6.81,21.48,4.42,62.3,3.64,90.09,7.69,20.52,2.99,43.14,10.14,41.83,35.18-.66,12.61-6.7,22.9-18.22,28.88-9.09,4.71-19.06,7.61-29.68,9.15Z";

export const SURGE_D: readonly string[] = [
  "M144.18,144.86C107.25,150.21,1.75,154.5,0,97.52l52.16-.8c8.81,13.9,34.5,14.19,49.83,14.27,9.7.05,38.61,1.02,39.88-9.93.92-7.93-11.53-10.08-17.89-10.34l-32.02-1.34c-22.8-.95-55.17-1.52-74.97-11.62-8.88-4.53-13.61-12.15-14.73-22.01-1.46-12.78,3.15-24.52,13.88-31.88,8.93-6.12,18.53-10.21,29.53-12.41,29.44-5.91,59.61-6.02,89.14-.41,25.59,4.86,52.36,19.37,50.46,48.92l-49.53,1.02c-2.11-7.4-7.6-11.62-14.96-13.38-11.93-2.86-24.15-2.94-36.57-2.58-8.68.25-32.83.42-31.49,12.13.39,3.41,3.5,6,7.43,6.81,21.48,4.42,62.3,3.64,90.09,7.69,20.52,2.99,43.14,10.14,41.83,35.18-.66,12.61-6.7,22.9-18.22,28.88-9.09,4.71-19.06,7.61-29.68,9.15Z",
  "M378.87,42.98l-.16,102.56-46.71.21-.3-33.82c-15.42,23.23-40.16,36.03-67.66,35.46-12.6-.26-24.49-1.57-35.59-7.22-17.1-7.84-27.37-23.48-28.14-42.45l-.14-54.91h46.54s.16,46.94.16,46.94c.12,10.95,6.87,18.87,17.18,22.45,15.56,4.33,32.15,3.01,47.42-2.68,9.87-4.33,17.43-11.91,20.27-22.28l.25-44.27h46.89Z",
  "M435.74,145.63l-45.92.19-.15-102.95,46.27-.16.04,33.68c12.07-18.9,27.15-35.84,51.04-35.83l-.12,41.85c-15.9.05-27.88-.54-41.78,7.34-6.01,3.76-9.23,9.86-9.26,16.98l-.13,38.9Z",
  "M614.96,145.2c18.6.02,38.9,4.11,44.39,24,1.97,7.15,3.07,14.28,2.96,21.72l-47.37.08c-.18-4.71-1.06-8.44-3.41-11.23-2.82-3.35-6.88-4.4-11.58-4.43l-61.13-.38c-10.62-.07-20.78-1.25-30.63-4.53-7.95-2.65-12.81-8.78-13.41-16.22-1.62-20.36,23.99-21.45,39.33-25.57-9.25-3.2-17.26-4.36-24.93-9.19s-13.87-11.28-16.47-20.17c-2.9-9.93-2.62-21.36,2.42-30.54,13.15-23.98,52.05-28.97,76.92-28.91l97.88.2-.05,23.59-36.6.2c9.09,4.89,15.42,11.45,17.31,21.12,2.55,13-2.79,25.39-13.75,32.68-19.93,13.26-52.8,12.64-76.83,13.59-7.11.28-19.54,3.47-17.19,10.93.54,1.72,2.67,2.98,5.19,2.99l66.92.08ZM596.24,100.41c3.94-1.16,7.84-3.81,9.43-6.96,4.21-8.34-.72-18-9.79-20.45-16.04-4.32-33.35-4.43-49.12.51-6.31,1.98-10.45,7.01-10.6,12.8s3.6,11.15,9.94,13.36c15.85,5.52,33.4,5.67,50.13.74Z",
  "M799.86,108.89l46.32.58c-7.98,43.58-88.85,40.07-120.13,36.07-30.74-3.93-62.21-16.8-60.35-53.01.74-14.44,6.58-26.92,18.78-35.36,9.85-6.81,20.84-11.31,32.99-13.78,31.67-6.45,78.07-6.53,106.81,10.13,16.72,9.69,23.61,26.82,22.09,45.12l-131.73-.18c.26,11.31,14.84,16.67,23.8,18.09,12.94,2.05,51.87,4.6,61.42-7.66ZM798.47,84.95c-1.09-8.14-7.06-10.18-13.01-12.99-14.01-4.49-64.95-6.99-70.04,12.99h83.05Z",
];

export const LABS_D: readonly string[] = [
  "M919.35,106.62l105.58.1.22,20.98c.03,3.1,1.18,5.99.1,9.03.66,2.85,1.13,5.46-.08,8.88l-164.91-.02-.05-135.23,49.5-.21c1.86,5.95,1.45,11.71.23,17.7l.41,32.77c.08,6.62.51,12.54-.02,19.23-.62,7.78-.61,15.81.13,23.63.34,3.52,5.71,3.14,8.91,3.14Z",
  "M1177.11,145.25l-.45-28.92c-5.95,3.81-9.34,9.29-14.66,13.25-26.43,19.71-51.08,20.95-83.28,15.58-16.89-2.82-32.38-10.38-43.27-23.8-6.63-8.17-7.37-18.26-7.56-28.53-.29-15.61,6.02-28.55,19.01-37.26,5.92-3.97,12.45-7.78,19.46-10.18,24.89-8.54,70.51-8.54,89.77,8.32l18.17,15.91c2.11-9.07-.08-17.54,1.08-26.59l45.46-.04c2.89,0,2.21,3.25,2.21,5.09l-.2,97.48-45.74-.3ZM1172.25,98.15c2.23-9.93-4.17-18.76-13.71-21.97-13.34-4.49-27.27-4.87-41.49-4.68-13.12.18-35.71,2.35-39.46,17.54-3.4,13.77,7.32,22.21,20.01,24.99,17.52,3.83,69.59,6.63,74.65-15.88Z",
  "M1430.65,82.36c2.4,12.43,1.83,25.24-4.5,35.76-17.09,28.4-63.28,32.89-92.39,27.76-13.19-2.33-25.13-8.62-35.82-16.03-5.65-3.92-8.61-10.05-14.74-13.73l-.6,29.24-46.33.08-.14-145.05,47.26-.4.86,71.59c8.75-7.54,14.36-15.35,23.09-20.2,15.09-8.39,30.52-12.12,47.7-11.7,19.32.47,39.14,3.05,55.28,13.58,10.41,6.78,17.93,16.7,20.32,29.1ZM1382.59,96.89c.81-5.98-1.27-11.17-5.27-15.5-13.24-14.29-62.27-11.58-78.4-4.68-6.45,2.76-11.3,7.87-11.96,13.74-1.52,13.55,8.03,20.91,20.88,23.4,17.93,3.48,71.34,8.36,74.75-16.97Z",
  "M1547.21,145.98c-27.42,3.6-70.13,4.17-94.65-9.82-13.6-7.76-19.02-24.28-15.71-26.02.72-.38,2.25-1.01,3.55-1.02l36.53-.33c4.67-.04,6.85,2.51,10.01,5.13,8.8,7.31,63.85,7.63,50.41-6.54-5.2-5.48-21.58-4.25-28.4-4.88l-9.99-.92c-10.93-1-44.52-.32-55.13-12.76-7.02-8.24-6.39-21.7.36-29.52,5.72-6.63,12.06-10.71,20.1-13.21,29.97-9.33,30.85-4.62,40.5-6.59,3.32-.68,6.07.16,9.3.12,17.78-.18,35,2.52,51.2,9.9,10.75,4.9,20.12,18.03,19.63,30.02-3.62-.1-6.55.92-9.94.94l-28.99.24c-8.67.07-4.37-8.2-19.98-10.17-7.56-.95-38.26-3.65-37.85,7.69.11,3.06,2.39,5.45,5.66,5.95,27.64,4.18,59.56-.13,83.56,11.26,6.48,3.08,10.41,8.56,11.02,16,1.97,24.05-21.17,31.89-41.2,34.52Z",
];

/* ── The mark: their S, tight-cropped ─────────────────────────────────────
   An offset viewBox rather than a transform. SVG viewBox takes a min-x and
   min-y, so the glyph can be cropped to its own bounding box without
   touching the path data or wrapping it in a <g>. Measured, not eyeballed —
   the numbers come from flattening the curves and taking the extremes. */

export const MARK_X = 0;
export const MARK_Y = 6.93;
export const MARK_W = 192.11;
export const MARK_H = 140.84;

/** `0 6.93 192.11 140.84` — ready to drop into a viewBox attribute. */
export const MARK_VIEWBOX = `${MARK_X} ${MARK_Y} ${MARK_W} ${MARK_H}`;

/**
 * Width over height, 1.364. The mark is NOT square, which the old geometric
 * mark was — anything sizing it must set height and let width follow, or the
 * S is squashed.
 */
export const MARK_ASPECT = MARK_W / MARK_H;

/* ── The wordmark, as supplied ──────────────────────────────────────────── */

export const WORDMARK_W = 1588.53;
export const WORDMARK_H = 190.99;
export const WORDMARK_VIEWBOX = `0 0 ${WORDMARK_W} ${WORDMARK_H}`;
export const WORDMARK_ASPECT = WORDMARK_W / WORDMARK_H;

/**
 * The S's height as a fraction of the wordmark's box, 0.737. Needed to align
 * a lockup by cap height rather than by box height — the box includes the g's
 * descender and the b's ascender, so centring on it sits the type low.
 */
export const WORDMARK_CAP_RATIO = MARK_H / WORDMARK_H;

/* ── The stacked lockup ───────────────────────────────────────────────────
   "Surge" over "Labs", both centred, sharing a baseline grid. Not a mark
   above a wordmark: the wordmark's first glyph IS the mark, and stacking
   them would set the S twice in one lockup.

   Line two is translated down by LEADING and left so the two words centre on
   each other. Leading is 165 units against a ~137 cap height — a little over
   1.2, which is where two words of this weight stop crowding. */

export const SURGE_W = 846.57;
export const LABS_W = 728.31;
export const STACK_LEADING = 165;

/** x-shift applied to the Labs glyphs: pull them to 0, then centre. */
export const LABS_DX = (SURGE_W - LABS_W) / 2 - 860.21;

/** The stacked artwork's own box: `0 6.93 846.57 306.21`. */
export const STACK_VIEWBOX = `0 ${MARK_Y} ${SURGE_W} ${313.14 - MARK_Y}`;

/* ── Clear space and minimum sizes ────────────────────────────────────────
   The old rule was "clear space is the bar", measured off a geometric stroke
   this artwork does not have — a typographic S has modulated strokes and no
   single bar to measure. The rule is now a fraction of the mark's HEIGHT,
   which is the one dimension every lockup shares. */

/** Clear space on all four sides: a quarter of the mark's height. */
export const CLEAR_SPACE = 0.25;

/** Mark → wordmark gap, where a lockup carries both. */
export const LOCKUP_GAP = 0.34;

export type LogoVariant = "horizontal" | "stacked" | "mark";

export const MINIMUM_SIZE: Record<LogoVariant, { screen: number; print: string; note: string }> = {
  horizontal: {
    screen: 18,
    print: "22mm wide",
    note: "Quoted as the wordmark's HEIGHT. At 8.32:1 the constraint is width — 18px tall is 150px wide, and below that the Labs counters start to close.",
  },
  stacked: {
    screen: 30,
    print: "16mm wide",
    note: "Two lines, so it holds at a smaller width than the horizontal. The measure is the full two-line block.",
  },
  mark: {
    screen: 16,
    print: "5mm",
    note: "16px is the favicon, and this S is built for it — heavy strokes, wide apertures, no counter fine enough to close. Proofed at 16, 24, 32 and 48.",
  },
};

/* ── Locked colours, for artwork that cannot inherit ─────────────────────
   The live component uses currentColor and the accent token, and takes
   whatever the surface it is sitting on has already decided. These exist for
   the flat files a client gets emailed, where there is no surface to ask. */

export const SURFACE_COLOR = {
  /** On the press bed: the wordmark is the paper showing through. */
  ink: { fg: "#EFEDE8", accent: "#FF3D9E", bg: "#0A0A0B" },
  /** On paper: the wordmark is the ink, and Labs darkens to clear AA. */
  stock: { fg: "#0A0A0B", accent: "#B80065", bg: "#EFEDE8" },
} as const;

/**
 * The plate pair for app icons: a magenta plate with the S struck out of it.
 * Magenta carries the brand, so the tab icon is the same colour as the CTA
 * and the registration marks rather than a third identity.
 */
export const PLATE_COLOR = { fill: "#E6007E", knockout: "#FFFFFF" } as const;

/** The three foil stops. Flat files bake the highlight at the centre. */
export const FOIL_STOPS = { lo: "#8C6B1F", hi: "#E8CE84" } as const;
