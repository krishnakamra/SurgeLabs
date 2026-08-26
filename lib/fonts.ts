import { Bodoni_Moda, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Three voices, three jobs. Nothing else gets loaded.
 *
 *  display  Bodoni Moda   400-500, optical sizing live, tracking negative
 *  body     Satoshi       300-900 variable, self-hosted
 *  utility  Geist Mono    400 only, uppercase, wide tracking
 *
 * This is a Didone house. The display face is the typeface class that has set
 * foil-stamped stationery for two hundred years, which is the product this
 * shop sells most of — the type is the argument, so it is worth being exact
 * about how it is loaded.
 */

export const fontDisplay = Bodoni_Moda({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-bodoni",
  // opsz is the whole reason this face is here rather than a static Didone.
  // Bodoni's hairlines are supposed to get thinner as the type gets bigger;
  // the optical size axis is what does that, and without it a 160px hero is
  // just a text-size Bodoni scaled up, with the hairlines too heavy and the
  // serifs too blunt. `axes` and an explicit `weight` list are mutually
  // exclusive in next/font, so weight comes from the variable range.
  axes: ["opsz"],
  // The only face preloaded. It sets every headline, including the LCP
  // element on most pages. Preloading all three would put body and utility in
  // competition with the thing the visitor actually sees first.
  preload: true,
  // `optional`, not `swap`. next/font emits a metric-adjusted fallback, and
  // for a Didone the fallback is necessarily a long way off — there is no
  // system face with this contrast — so a swap would visibly re-flow every
  // headline. The measured cost of `swap` on the previous face was 0.5984 CLS
  // at 768px; nothing about that calculation improves with a higher-contrast
  // face. `optional` gives the browser ~100ms and otherwise uses the fallback
  // for that page load, caching the face for the next navigation.
  //
  // Preloaded and same-origin, it almost always makes the window.
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
