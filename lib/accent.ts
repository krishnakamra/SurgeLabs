import type { Service } from "@/content";
import type { Plate } from "@/lib/halftone";

/**
 * A service's accent, resolved into the utilities that carry it.
 *
 * Every value here is a surface-aware token — `--color-link`,
 * `--color-accent-text` and `--color-accent-lime` are each re-declared under
 * `[data-surface]`, so one class name is correct on ink and on stock. That is
 * the whole reason the palette is limited to three: the homepage panels
 * alternate surfaces, and a flat hex that passes 4.5:1 on paper fails on ink.
 *
 * Kept in one file so a colour cannot drift between the homepage panel, the
 * service page and the city pages.
 */
export const accentText: Record<Service["accent"], string> = {
  cyan: "text-link",
  magenta: "text-accent-text",
  lime: "text-accent-lime",
};

/**
 * For the underline on a link that should pick up the service's colour.
 *
 * The `hover:` prefix is part of the literal on purpose. Tailwind finds
 * classes by scanning source text, so a name assembled at runtime —
 * `hover:${accentDecoration[x]}` — is never generated. Every variant a
 * component needs has to appear here spelled out.
 */
export const accentDecoration: Record<Service["accent"], string> = {
  cyan: "decoration-link",
  magenta: "decoration-accent-text",
  lime: "decoration-accent-lime",
};

export const accentDecorationHover: Record<Service["accent"], string> = {
  cyan: "hover:decoration-link",
  magenta: "hover:decoration-accent-text",
  lime: "hover:decoration-accent-lime",
};

/** For a rule, a border or a bar — not text, so contrast is 3:1, not 4.5:1. */
export const accentBorder: Record<Service["accent"], string> = {
  cyan: "border-link",
  magenta: "border-accent-text",
  lime: "border-accent-lime",
};

export const accentBg: Record<Service["accent"], string> = {
  cyan: "bg-link",
  magenta: "bg-accent-text",
  lime: "bg-accent-lime",
};

/**
 * The screened plate the placeholder falls back to. There is no lime plate —
 * the four process colours are the four process colours — so lime borrows
 * yellow, which is the nearest of them.
 */
export const accentPlate: Record<Service["accent"], Plate> = {
  cyan: "c",
  magenta: "m",
  lime: "y",
};
