import { Montserrat, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Three voices, three jobs. Nothing else gets loaded.
 *
 *  display  Montserrat 100-900 variable, heavy by default — and every numeral
 *  body     Satoshi    300-900 variable, self-hosted
 *  utility  Geist Mono 400 only, uppercase spec labels — NEVER numerals
 *
 * This was a Didone house and it is not any more. Bodoni Moda is the right
 * face for foil-stamped stationery and the wrong one for a headline that has
 * to read as a press shop: at 160px its hairlines go to nothing, and "We
 * print, code and stitch" came out looking fussy rather than built.
 *
 * Montserrat is the geometric the brief wanted. Gotham was the other
 * candidate and is not available: it is Hoefler & Co, licensed per-site and
 * not on Google Fonts, so it cannot ship without someone buying it.
 * Montserrat is the closest free equivalent, and its numerals are the reason
 * it wins here — geometric, wide, and genuinely heavy at 800, which is what
 * a 01 or a $1,899 needed and never got from the mono.
 */

export const fontDisplay = Montserrat({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-montserrat",
  // No `weight` list: the variable range covers 100-900, and the numerals
  // live at 800.
  // The only face preloaded alongside the body. It sets every headline and
  // every numeral, including the LCP element on most pages.
  preload: true,
  // `optional`, not `swap`. Measured on this codebase, swap cost 0.5984 CLS
  // at 768px because the headline re-wrapped when the real face landed.
  // `optional` gives the browser ~100ms and otherwise uses the fallback for
  // that page load, caching the face for the next navigation. Preloaded and
  // same-origin, it almost always makes the window.
  adjustFontFallback: true,
});

/**
 * Satoshi is not on Google Fonts, so it is vendored: public/fonts, served
 * same-origin, which is also what the CSP's `font-src 'self'` requires.
 *
 * One variable file rather than three statics. Regular, Medium and Bold as
 * separate cuts are 81KB; the variable face covers 300-900 in 42KB and gives
 * every weight in between. The licence (Fontshare Font Licence, free for
 * commercial use) ships next to it as public/fonts/Satoshi-LICENSE.txt and
 * has to stay there.
 */
export const fontBody = localFont({
  src: [{ path: "../public/fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }],
  display: "optional",
  variable: "--font-satoshi",
  // Also `optional`, and this is the one that mattered on the previous build:
  // moving only the display face left CLS at 768 untouched, because the shift
  // was the standfirst re-wrapping. `optional` needs a preload to ever win
  // its ~100ms window, so this face gets one too.
  preload: true,
  // Vendored faces have no metrics in next/font's table, so the fallback
  // adjustment has to name the family it is adjusting from.
  adjustFontFallback: "Arial",
});

/**
 * Spec labels only — "MISSISSAUGA, ON", "4C PROCESS", the ticket rail.
 *
 * It does NOT set numerals. A 01 or a $1,899 in 400-weight mono reads as
 * weak next to a heavy grotesque headline, which is exactly what was wrong
 * before. Numerals belong to the display face; see `--font-numeral`.
 */
export const fontUtility = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "optional",
  variable: "--font-geist-mono",
  // The one face still not preloaded. It sets short spec labels in fixed-width
  // type at 11-13px, so a fallback swap moves nothing — and a third preload
  // would take bandwidth from the two faces that do shift the page.
  preload: false,
  adjustFontFallback: true,
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontUtility.variable,
].join(" ");
