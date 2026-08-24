import { Bricolage_Grotesque, Inter_Tight, Martian_Mono } from "next/font/google";

/**
 * Three voices, three jobs. Nothing else gets loaded.
 *
 *  display  Bricolage Grotesque  700-800, tight tracking, optical sizing live
 *  body     Inter Tight          400/500
 *  utility  Martian Mono         400, uppercase, wide tracking - the job-ticket voice
 */

export const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-bricolage",
  // Variable across the full weight range. `axes` and an explicit `weight`
  // list are mutually exclusive in next/font, and we want opsz live.
  axes: ["opsz"],
  // The only face that is preloaded. It sets every headline, including the
  // LCP element on most pages, so it is worth a connection at the front of
  // the queue. Preloading all three would put body and utility faces in
  // competition with the thing the visitor actually sees first.
  preload: true,
  // `optional`, not `swap`. next/font emits a metric-adjusted Arial fallback
  // (size-adjust 105.43%) which matches the vertical metrics but not the
  // per-glyph advance widths, so a multi-line headline re-wraps when the real
  // face lands and everything below it moves.
  //
  // That was measured at 0.017–0.034 CLS at 1440 and 390 and accepted as the
  // cheaper of two evils. It was not measured at 768, where a blog headline
  // re-wraps into an extra line and the shift is 0.5984 — twelve times the
  // budget and a failing Core Web Vital on a width Google actually samples.
  // `optional` gives the browser roughly 100ms to produce the font and
  // otherwise uses the fallback for that page load, caching the face for the
  // next navigation. Preloaded and same-origin, it almost always makes the
  // window. The cost is that some first-time visitors on a slow connection
  // see Arial Black once; the alternative was a headline that jumps.
});

export const fontBody = Inter_Tight({
  subsets: ["latin"],
  // Also `optional`, and this is the one that mattered. Moving only the
  // display face left CLS at 768 untouched at 0.5984: the shift was the
  // standfirst re-wrapping when Inter Tight swapped in, which moved
  // everything below it by one line.
  display: "optional",
  variable: "--font-inter-tight",
  // `optional` gives the browser about 100ms to have the font, so a face that
  // is not preloaded will essentially never make the window and every first
  // visit would render in the fallback. Preloading it is what makes
  // `optional` a real choice rather than a way of switching the font off.
  preload: true,
  adjustFontFallback: true,
});

export const fontUtility = Martian_Mono({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-martian",
  // The one face still not preloaded. It sets short spec labels in fixed-width
  // type, so a fallback swap moves nothing — and a third preload would take
  // bandwidth from the two faces that do shift the page.
  preload: false,
  adjustFontFallback: true,
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontUtility.variable,
].join(" ");
