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

/** The seven literal inks. These never flip. */
export const PRESS_INKS: readonly InkSwatch[] = [
  { name: "Ink", token: "--color-ink", hex: "#0C0C0E", role: "Dominant dark surface — the press bed" },
  { name: "Ink 2", token: "--color-ink-2", hex: "#17171A", role: "Raised dark surface, cards" },
  { name: "Stock", token: "--color-stock", hex: "#EDEDE8", role: "Paper surface — cool, never cream" },
  { name: "Stock 2", token: "--color-stock-2", hex: "#DCDCD5", role: "Paper shadow, rules" },
  { name: "Process Cyan", token: "--color-cyan", hex: "#009FE3", role: "Secondary accent — links, data" },
  { name: "Process Magenta", token: "--color-magenta", hex: "#E6007E", role: "PRIMARY accent — CTAs, key marks" },
  { name: "Process Yellow", token: "--color-yellow", hex: "#FFED00", role: "Micro only — reg marks, ticks. Never a fill." },
];

/** Tints and shades of the same four inks. Legibility only. */
export const DERIVED_INKS: readonly InkSwatch[] = [
  { name: "Ink 3", token: "--color-ink-3", hex: "#232328", role: "Hairline rule on ink" },
  { name: "Ink 4", token: "--color-ink-4", hex: "#08080A", role: "Sunken well on ink" },
  { name: "Stock 0", token: "--color-stock-0", hex: "#F5F5F1", role: "Second sheet on top — raised card on paper" },
  { name: "Cyan Deep", token: "--color-cyan-deep", hex: "#0071A3", role: "Cyan as text on stock" },
  { name: "Magenta Deep", token: "--color-magenta-deep", hex: "#B80065", role: "Magenta as text on stock; hover fill on paper" },
  { name: "Magenta Lift", token: "--color-magenta-lift", hex: "#FF3D9E", role: "Magenta as text on ink; hover fill on the bed" },
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
  { token: "--color-surface", utility: "bg-surface", onInk: "#0C0C0E", onStock: "#EDEDE8", role: "Section bed" },
  { token: "--color-surface-raised", utility: "bg-surface-raised", onInk: "#17171A", onStock: "#F5F5F1", role: "Cards, panels" },
  { token: "--color-surface-sunken", utility: "bg-surface-sunken", onInk: "#08080A", onStock: "#DCDCD5", role: "Wells, insets" },
  { token: "--color-fg", utility: "text-fg", onInk: "#EDEDE8", onStock: "#0C0C0E", role: "Primary type" },
  { token: "--color-fg-muted", utility: "text-fg-muted", onInk: "#A0A0A8", onStock: "#4A4A50", role: "Secondary type" },
  { token: "--color-fg-faint", utility: "text-fg-faint", onInk: "#7C7C86", onStock: "#63636A", role: "Spec labels, metadata" },
  { token: "--color-rule", utility: "border-rule", onInk: "#232328", onStock: "#DCDCD5", role: "Decorative hairline" },
  { token: "--color-rule-strong", utility: "border-rule-strong", onInk: "#606069", onStock: "#7A7A72", role: "Interactive border, crop marks" },
  { token: "--color-accent", utility: "bg-accent", onInk: "#E6007E", onStock: "#E6007E", role: "Primary CTA fill" },
  { token: "--color-accent-fg", utility: "text-accent-fg", onInk: "#FFFFFF", onStock: "#FFFFFF", role: "Type knocked out of the fill" },
  { token: "--color-accent-hover", utility: "hover:bg-accent-hover", onInk: "#FF3D9E", onStock: "#B80065", role: "Fill on hover" },
  { token: "--color-accent-hover-fg", utility: "hover:text-accent-hover-fg", onInk: "#0C0C0E", onStock: "#FFFFFF", role: "Knockout on hover" },
  { token: "--color-accent-text", utility: "text-accent-text", onInk: "#FF3D9E", onStock: "#B80065", role: "Magenta as running text" },
  { token: "--color-link", utility: "text-link", onInk: "#009FE3", onStock: "#0071A3", role: "Links, data" },
  { token: "--color-mark", utility: "text-mark", onInk: "#FFED00", onStock: "#E6007E", role: "Ticks, underlines" },
  { token: "--color-focus", utility: "outline-[var(--color-focus)]", onInk: "#FFED00", onStock: "#E6007E", role: "Focus ring" },
  { token: "--color-plate-k", utility: "text-plate-k", onInk: "#EDEDE8", onStock: "#0C0C0E", role: "The K plate — whatever 'printed' means here" },
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
  { utility: "text-4xl", token: "--text-4xl", size: "56 → 128", role: "Hero. Runs to the edge of the grid.", family: "display" },
  { utility: "text-3xl", token: "--text-3xl", size: "48 → 88", role: "Section opener", family: "display" },
  { utility: "text-2xl", token: "--text-2xl", size: "40 → 60", role: "Sub-head", family: "display" },
  { utility: "text-xl", token: "--text-xl", size: "32 → 40", role: "Card title", family: "display" },
  { utility: "text-lg", token: "--text-lg", size: "24 → 28", role: "Lead-in", family: "display" },
  { utility: "text-md", token: "--text-md", size: "18 → 21", role: "Standfirst", family: "body" },
  { utility: "text-base", token: "--text-base", size: "18", role: "Body copy — the default", family: "body" },
  { utility: "text-sm", token: "--text-sm", size: "16", role: "Dense body, captions", family: "body" },
  { utility: "text-xs", token: "--text-xs", size: "14", role: "Utility — prices, form labels", family: "utility" },
  { utility: "text-2xs", token: "--text-2xs", size: "12", role: "Utility — eyebrows, spec labels", family: "utility" },
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
  { label: "fg on ink", fg: "#EDEDE8", bg: "#0C0C0E", min: 4.5, surface: "ink" },
  { label: "fg-muted on ink", fg: "#A0A0A8", bg: "#0C0C0E", min: 4.5, surface: "ink" },
  { label: "fg-faint on ink", fg: "#7C7C86", bg: "#0C0C0E", min: 4.5, surface: "ink" },
  { label: "link (cyan) on ink", fg: "#009FE3", bg: "#0C0C0E", min: 4.5, surface: "ink" },
  { label: "accent-text on ink", fg: "#FF3D9E", bg: "#0C0C0E", min: 4.5, surface: "ink" },
  { label: "mark / focus (yellow) on ink", fg: "#FFED00", bg: "#0C0C0E", min: 3, surface: "ink" },
  { label: "rule-strong on ink", fg: "#606069", bg: "#0C0C0E", min: 3, surface: "ink" },
  { label: "fg on stock", fg: "#0C0C0E", bg: "#EDEDE8", min: 4.5, surface: "stock" },
  { label: "fg-muted on stock", fg: "#4A4A50", bg: "#EDEDE8", min: 4.5, surface: "stock" },
  { label: "fg-faint on stock", fg: "#63636A", bg: "#EDEDE8", min: 4.5, surface: "stock" },
  { label: "link (cyan-deep) on stock", fg: "#0071A3", bg: "#EDEDE8", min: 4.5, surface: "stock" },
  { label: "accent-text on stock", fg: "#B80065", bg: "#EDEDE8", min: 4.5, surface: "stock" },
  { label: "rule-strong on stock", fg: "#7A7A72", bg: "#EDEDE8", min: 3, surface: "stock" },
  { label: "focus (magenta) on stock", fg: "#E6007E", bg: "#EDEDE8", min: 3, surface: "stock" },
  { label: "knockout on magenta (CTA rest)", fg: "#FFFFFF", bg: "#E6007E", min: 4.5, surface: "both" },
  { label: "knockout on magenta-deep (CTA hover, stock)", fg: "#FFFFFF", bg: "#B80065", min: 4.5, surface: "stock" },
  { label: "ink on magenta-lift (CTA hover, ink)", fg: "#0C0C0E", bg: "#FF3D9E", min: 4.5, surface: "ink" },
  { label: "yellow tick on magenta fill (decorative)", fg: "#FFED00", bg: "#E6007E", min: 3, surface: "both" },
  {
    label: "yellow on stock — why the mark role flips to magenta on paper",
    fg: "#FFED00",
    bg: "#EDEDE8",
    min: 3,
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
