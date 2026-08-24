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
  display: "swap",
  variable: "--font-bricolage",
  // Variable across the full weight range. `axes` and an explicit `weight`
  // list are mutually exclusive in next/font, and we want opsz live.
  axes: ["opsz"],
  // The only face that is preloaded. It sets every headline, including the
  // LCP element on most pages, so it is worth a connection at the front of
  // the queue. Preloading all three would put body and utility faces in
  // competition with the thing the visitor actually sees first.
  preload: true,
  // Kept on `swap` rather than `optional` deliberately. next/font emits a
  // metric-adjusted Arial fallback (size-adjust 105.43%), which matches the
  // vertical metrics but not the advance widths — so a multi-line headline
  // can re-wrap when the real face lands. Measured on a cold cache that
  // costs 0.017–0.034 CLS depending on the page, against a 0.05 budget.
  // `optional` would take it to zero, at the price of some first-time
  // visitors never seeing the display face on that page load. The headline
  // face is the brand here, so the shift is the cheaper of the two.
});

export const fontBody = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  // Not preloaded: display:swap paints the fallback immediately and body copy
  // is below the headline anyway.
  preload: false,
  adjustFontFallback: true,
});

export const fontUtility = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-martian",
  preload: false,
  adjustFontFallback: true,
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontUtility.variable,
].join(" ");
