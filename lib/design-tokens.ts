/**
 * Documentation metadata for /styleguide.
 *
 * app/globals.css is the source of truth for the running site; this file
 * exists so the styleguide can render the palette, prove contrast, and label
 * what each token is for. The CONTRAST_CHECKS below are computed at render
 * time from these hexes, so if a value here drifts from the CSS the styleguide
 * will show a ratio that no longer matches the page — which is the point.
 */

export type InkSwatch = {
  name: string;
  token: string;
  hex: string;
  role: string;
};

/** The literal palette. These never flip. */
export const PRESS_INKS: readonly InkSwatch[] = [
  { name: "Ink", token: "--color-ink", hex: "#0A0A0B", role: "Dominant dark surface — the press bed" },
  { name: "Ink 2", token: "--color-ink-2", hex: "#141416", role: "Raised dark surface, cards" },
  { name: "Stock", token: "--color-stock", hex: "#EFEDE8", role: "Warm uncoated paper. Pairs with gold and black only." },
  { name: "Stock 2", token: "--color-stock-2", hex: "#DFDBD2", role: "Deckle shadow, sunken wells" },
  { name: "Gold", token: "--color-gold", hex: "#C8A24A", role: "PRIMARY — CTAs, rules, marks, the foil" },
  { name: "Foil Low", token: "--color-gold-lo", hex: "#8C6B1F", role: "Foil gradient stop — the shade in the leaf" },
  { name: "Foil High", token: "--color-gold-hi", hex: "#E8CE84", role: "Foil gradient stop — the catch" },
];

/**
 * The process set, kept and demoted.
 *
 * These are still the inks the shop actually runs, and the registration
 * animation is a picture of a press — so they are not deleted. They are
 * confined: cyan carries links and data readouts, magenta appears only inside
 * the CMYK registration layer and the production sections, and yellow only
 * survives as a registration plate. None of them is a brand colour any more.
 */
export const PROCESS_INKS: readonly InkSwatch[] = [
  { name: "Process Cyan", token: "--color-cyan", hex: "#009FE3", role: "Links and data readouts only" },
  { name: "Process Magenta", token: "--color-magenta", hex: "#E6007E", role: "Registration animation and production sections only" },
  { name: "Process Yellow", token: "--color-yellow", hex: "#FFED00", role: "Registration plate only. Never a fill, never type." },
];

/** Tints and shades. Legibility only. */
export const DERIVED_INKS: readonly InkSwatch[] = [
  { name: "Ink 4", token: "--color-ink-4", hex: "#050506", role: "Sunken well on ink" },
  { name: "Stock 0", token: "--color-stock-0", hex: "#F6F4EF", role: "Second sheet on top — raised card on paper" },
  { name: "Gold Deep", token: "--color-gold-deep", hex: "#74591B", role: "The ONLY gold allowed to be text or an interactive border on paper" },
  { name: "Cyan Deep", token: "--color-cyan-deep", hex: "#006795", role: "Cyan as text on stock" },
  { name: "Magenta Deep", token: "--color-magenta-deep", hex: "#B80065", role: "Magenta as text on stock — production sections only" },
  { name: "Magenta Lift", token: "--color-magenta-lift", hex: "#FF3D9E", role: "Magenta as text on ink — production sections only" },
  { name: "Knockout", token: "--color-knockout", hex: "#FFFFFF", role: "Unprinted paper inside a solid ink fill" },
];

export type SemanticRow = {
  token: string;
  utility: string;
  onInk: string;
  onStock: string;
  role: string;
};

/** Everything here is re-declared by both [data-surface] blocks. */
export const SEMANTIC_TOKENS: readonly SemanticRow[] = [
  { token: "--color-surface", utility: "bg-surface", onInk: "#0A0A0B", onStock: "#EFEDE8", role: "Section bed" },
  { token: "--color-surface-raised", utility: "bg-surface-raised", onInk: "#141416", onStock: "#F6F4EF", role: "Cards, panels" },
  { token: "--color-surface-sunken", utility: "bg-surface-sunken", onInk: "#050506", onStock: "#DFDBD2", role: "Wells, insets" },
  { token: "--color-fg", utility: "text-fg", onInk: "#EFEDE8", onStock: "#0A0A0B", role: "Primary type" },
  { token: "--color-fg-muted", utility: "text-fg-muted", onInk: "#A8A69F", onStock: "#55524B", role: "Secondary type" },
  { token: "--color-fg-faint", utility: "text-fg-faint", onInk: "#8A887F", onStock: "#5F5C55", role: "Spec labels, metadata" },
  { token: "--color-rule", utility: "border-rule", onInk: "#C8A24A4D", onStock: "#C8A24A4D", role: "Decorative hairline — gold at 30%, 0.5px" },
  { token: "--color-rule-strong", utility: "border-rule-strong", onInk: "#C8A24A", onStock: "#74591B", role: "Interactive border, crop marks" },
  { token: "--color-accent", utility: "bg-accent", onInk: "#C8A24A", onStock: "#C8A24A", role: "Gold as a FILL — the foil" },
  { token: "--color-accent-fg", utility: "text-accent-fg", onInk: "#0A0A0B", onStock: "#0A0A0B", role: "Type knocked out of the foil" },
  { token: "--color-accent-hover", utility: "hover:bg-accent-hover", onInk: "#C8A24A", onStock: "#C8A24A", role: "The button floods gold" },
  { token: "--color-accent-hover-fg", utility: "hover:text-accent-hover-fg", onInk: "#0A0A0B", onStock: "#0A0A0B", role: "Knockout on hover" },
  { token: "--color-accent-text", utility: "text-accent-text", onInk: "#C8A24A", onStock: "#74591B", role: "Gold as running text — darkens on paper" },
  { token: "--color-link", utility: "text-link", onInk: "#009FE3", onStock: "#006795", role: "Links, data" },
  { token: "--color-mark", utility: "text-mark", onInk: "#C8A24A", onStock: "#74591B", role: "Ticks, underlines" },
  { token: "--color-focus", utility: "outline-[var(--color-focus)]", onInk: "#C8A24A", onStock: "#74591B", role: "Focus ring" },
  { token: "--color-plate-k", utility: "text-plate-k", onInk: "#EFEDE8", onStock: "#0A0A0B", role: "The K plate — whatever 'printed' means here" },
  { token: "--reg-blend", utility: "—", onInk: "screen", onStock: "multiply", role: "How plates combine" },
];

export type TypeRow = {
  utility: string;
  token: string;
  size: string;
  role: string;
  family: "display" | "body" | "utility";
};

export const TYPE_SCALE: readonly TypeRow[] = [
  { utility: "text-4xl", token: "--text-4xl", size: "72 → 160", role: "Hero. Runs to the edge of the grid.", family: "display" },
  { utility: "text-3xl", token: "--text-3xl", size: "56 → 112", role: "Section opener", family: "display" },
  { utility: "text-2xl", token: "--text-2xl", size: "44 → 76", role: "Sub-head", family: "display" },
  { utility: "text-xl", token: "--text-xl", size: "34 → 52", role: "Card title", family: "display" },
  { utility: "text-lg", token: "--text-lg", size: "26 → 36", role: "Lead-in", family: "display" },
  { utility: "text-md", token: "--text-md", size: "20 → 26", role: "Standfirst", family: "body" },
  { utility: "text-base", token: "--text-base", size: "17", role: "Body copy — the default", family: "body" },
  { utility: "text-sm", token: "--text-sm", size: "15", role: "Dense body, captions", family: "body" },
  { utility: "text-xs", token: "--text-xs", size: "13", role: "Utility — prices, form labels", family: "utility" },
  { utility: "text-2xs", token: "--text-2xs", size: "11", role: "Utility — eyebrows, spec labels", family: "utility" },
];

export type ContrastCheck = {
  label: string;
  fg: string;
  bg: string;
  /** 4.5 for body text, 3 for large text, UI borders and focus rings. */
  min: number;
  surface: "ink" | "stock" | "both";
  /** Documented on purpose as a failure — it is the reason a token flips. */
  expectFail?: boolean;
};

export const CONTRAST_CHECKS: readonly ContrastCheck[] = [
  { label: "fg on ink", fg: "#EFEDE8", bg: "#0A0A0B", min: 4.5, surface: "ink" },
  { label: "fg-muted on ink", fg: "#A8A69F", bg: "#0A0A0B", min: 4.5, surface: "ink" },
  { label: "fg-faint on ink", fg: "#8A887F", bg: "#0A0A0B", min: 4.5, surface: "ink" },
  { label: "gold as text on ink", fg: "#C8A24A", bg: "#0A0A0B", min: 4.5, surface: "ink" },
  { label: "gold as a border on ink", fg: "#C8A24A", bg: "#0A0A0B", min: 3, surface: "ink" },
  { label: "link (cyan) on ink", fg: "#009FE3", bg: "#0A0A0B", min: 4.5, surface: "ink" },

  { label: "fg on stock", fg: "#0A0A0B", bg: "#EFEDE8", min: 4.5, surface: "stock" },
  { label: "fg-muted on stock", fg: "#55524B", bg: "#EFEDE8", min: 4.5, surface: "stock" },
  { label: "fg-faint on stock", fg: "#5F5C55", bg: "#EFEDE8", min: 4.5, surface: "stock" },
  { label: "fg-faint in a sunken well", fg: "#5F5C55", bg: "#DFDBD2", min: 4.5, surface: "stock" },
  { label: "gold-deep as text on stock", fg: "#74591B", bg: "#EFEDE8", min: 4.5, surface: "stock" },
  { label: "gold-deep as text in a sunken well", fg: "#74591B", bg: "#DFDBD2", min: 4.5, surface: "stock" },
  { label: "gold-deep as a border on stock", fg: "#74591B", bg: "#EFEDE8", min: 3, surface: "stock" },
  { label: "link (cyan-deep) on stock", fg: "#006795", bg: "#EFEDE8", min: 4.5, surface: "stock" },

  { label: "ink knocked out of the foil (CTA hover)", fg: "#0A0A0B", bg: "#C8A24A", min: 4.5, surface: "both" },
  { label: "ink on the foil's brightest stop", fg: "#0A0A0B", bg: "#E8CE84", min: 4.5, surface: "both" },
  // The foil's darkest stop, held to 3:1 rather than 4.5:1 — and the reason
  // is a design rule, not a rounding. Foil is only ever type at display
  // sizes (where AA asks 3:1) or the logo lockup (which WCAG 1.4.3 exempts
  // as a logotype). It is never a fill behind text, so nothing has to read
  // against it at body size.
  { label: "foil's darkest stop as large display type on ink", fg: "#8C6B1F", bg: "#0A0A0B", min: 3, surface: "ink" },

  // Demoted, and only used where the ratio still holds.
  { label: "magenta as text on ink (production sections)", fg: "#FF3D9E", bg: "#0A0A0B", min: 4.5, surface: "ink" },
  { label: "magenta as text on stock (production sections)", fg: "#B80065", bg: "#EFEDE8", min: 4.5, surface: "stock" },

  {
    label: "gold on stock — why a second, darker gold exists at all",
    fg: "#C8A24A",
    bg: "#EFEDE8",
    min: 4.5,
    surface: "stock",
    expectFail: true,
  },
  {
    label: "#A8842F on stock — the first darkening tried, and why it was not enough",
    fg: "#A8842F",
    bg: "#EFEDE8",
    min: 4.5,
    surface: "stock",
    expectFail: true,
  },
];

export const SCREEN_ANGLES = [
  { plate: "y", label: "Yellow", angle: 0 },
  { plate: "c", label: "Cyan", angle: 15 },
  { plate: "k", label: "Key", angle: 45 },
  { plate: "m", label: "Magenta", angle: 75 },
] as const;
