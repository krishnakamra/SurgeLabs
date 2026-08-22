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
});

export const fontBody = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const fontUtility = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-martian",
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontUtility.variable,
].join(" ");
