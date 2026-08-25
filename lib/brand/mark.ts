/**
 * THE MARK — geometry, and the only place it is defined.
 *
 * Everything downstream reads from here: the React <Logo>, the static SVGs in
 * public/brand, the favicon set, the OG card and the /brand spec page. Change
 * a number in this file and `npm run gen:brand` re-cuts every asset from it.
 * That is the point — a logo that lives in nine files drifts in nine files.
 *
 *
 * WHAT IT IS
 *
 * An S built on a 64-unit press grid: three bars, two risers, one stroke
 * weight throughout. The two free terminals — top-right and bottom-left — are
 * cut at 45°, which is the K screen angle and the only diagonal the design
 * system already uses. The whole figure is symmetrical under a 180° rotation
 * about its centre, so it sets the same way upside down on a sheet.
 *
 *   0                                       64
 *   ┌──────────────────────────────────╲     0   ┐
 *   │              top bar              ╲        │ bar 14
 *   ├──────────┬────────────────────────╱   14   ┘
 *   │  riser   │                                 ┐ gap 11
 *   ├──────────┴─────────────────────────┐  25   ┘
 *   │            middle bar              │
 *   ├─────────────────────────┬──────────┤  39
 *   │                         │  riser   │
 *   ╲─────────────────────────┴──────────┤  50
 *    ╲            bottom bar             │
 *     ╲──────────────────────────────────┘  64
 *
 * THE BAR IS THE UNIT. Clear space, the gap between mark and wordmark and the
 * stacked leading are all expressed as multiples of the bar, so the identity
 * has one measurement in it rather than five unrelated ones.
 *
 * It is drawn as a single closed polygon — no strokes, no compound path, no
 * fill-rule dependency. A stroke would have to be re-weighted at every size;
 * a filled outline is the same shape at 16px and on a 40-foot wall, and it
 * cuts on a vinyl plotter without being expanded first.
 */

/** The mark fills its viewBox edge to edge. `size` therefore means what it says. */
export const MARK_SIZE = 64;

/** Stroke weight of the S. The unit the rest of the identity is built from. */
export const MARK_BAR = 14;

/**
 * The counters. 0.79 of the bar — deliberately looser than the display face
 * would set an S, because the mark has to survive being a 16px favicon and a
 * counter thinner than this closes up under antialiasing. Proofed at 16, 32
 * and 48 against bars of 13, 14 and 15; 14 was the one that stayed an S.
 */
export const MARK_GAP = 11;

/**
 * The S, as one closed polygon.
 *
 *   M0 0 H50     top edge, stopping a bar short for the 45° cut
 *   L64 14       the cut
 *   H14 V25      back along the underside, down the riser's inner edge
 *   H64 V64      middle bar out to the right, then down the far side
 *   H14 L0 50    bottom edge, and the answering cut
 *   H50 V39 H0 Z back along the bottom bar and up the left side
 */
export const MARK_PATH = "M0 0 H50 L64 14 H14 V25 H64 V64 H14 L0 50 H50 V39 H0 Z";

/**
 * The same twelve points, as coordinates. The rasteriser behind the favicon
 * set needs vertices rather than a path string, and re-typing them there is
 * how the .ico stops matching the .svg.
 */
export const MARK_POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [50, 0],
  [64, 14],
  [14, 14],
  [14, 25],
  [64, 25],
  [64, 64],
  [14, 64],
  [0, 50],
  [50, 50],
  [50, 39],
  [0, 39],
];

/* ── The unit, as ratios of the rendered mark height ───────────────────── */

/** One bar. Multiply by the mark's rendered height to get pixels. */
export const BAR = MARK_BAR / MARK_SIZE; // 0.21875

/**
 * Clear space: one bar on all four sides. Nothing sets inside it — no type,
 * no rule, no image edge, no other logo.
 */
export const CLEAR_SPACE = BAR;

/** Mark → wordmark, horizontal lockup. A bar and a half. */
export const LOCKUP_GAP = BAR * 1.5;

/** Mark → wordmark, stacked lockup. One bar. */
export const STACK_GAP = BAR;

/* ── Minimum sizes ──────────────────────────────────────────────────────
   Below these the counters close up and the 45° cuts stop registering. The
   print figures are the mark's height, measured on a proof, not on screen. */

export type LogoVariant = "horizontal" | "stacked" | "mark";

export const MINIMUM_SIZE: Record<LogoVariant, { screen: number; print: string; note: string }> = {
  horizontal: {
    screen: 24,
    print: "10mm",
    note: "Below 24px the wordmark's counters fill in before the mark's do. Use the mark alone.",
  },
  stacked: {
    screen: 32,
    print: "12mm",
    note: "The wordmark sets smaller here than it does horizontally, so it hits its floor sooner.",
  },
  mark: {
    screen: 16,
    print: "6mm",
    note: "16px is the favicon. At that size use the plate version — a knockout holds where a hairline counter does not.",
  },
};

/* ── Locked colours, for artwork that cannot inherit ─────────────────────
   The live component uses currentColor and takes whatever the surface it is
   sitting on has already decided. These exist for the flat files a client
   gets emailed, where there is no surface to ask. They are the same hexes as
   --color-fg on each bed, and they are not a second palette. */

export const SURFACE_COLOR = {
  /** On the press bed: the mark is the paper showing through. */
  ink: { fg: "#EDEDE8", bg: "#0C0C0E" },
  /** On paper: the mark is the ink. */
  stock: { fg: "#0C0C0E", bg: "#EDEDE8" },
} as const;

/** The plate pair, straight off --color-accent / --color-accent-fg. */
export const PLATE_COLOR = { fill: "#E6007E", knockout: "#FFFFFF" } as const;
