export type Plate = "c" | "m" | "y" | "k";

/** Real screen angles. Offsetting the plates like this is what stops moiré. */
export const SCREEN_ANGLE: Record<Plate, number> = { y: 0, c: 15, k: 45, m: 75 };

export type TurbulenceOptions = {
  baseFrequency?: number;
  seed?: number;
  octaves?: number;
  /**
   * Gamma exponent on the alpha channel — higher thins the mid-tones out,
   * lower floods them. Above ~1.0 against the fixed amplitude the mask stops
   * clamping to solid and the dot gain shows.
   */
  contrast?: number;
};

/**
 * feTurbulence, inlined as a data URI so it carries its own filter id and can
 * never collide with another instance's <defs> in the document.
 * luminanceToAlpha turns the noise into a soft alpha mask — dot gain, the
 * uneven density you get when ink meets an imperfect sheet.
 */
export function turbulenceMask({
  baseFrequency = 0.7,
  seed = 4,
  octaves = 3,
  contrast = 1.6,
}: TurbulenceOptions = {}): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">` +
    `<filter id="n" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="${octaves}" seed="${seed}" stitchTiles="stitch"/>` +
    `<feColorMatrix type="luminanceToAlpha"/>` +
    `<feComponentTransfer><feFuncA type="gamma" exponent="${contrast}" amplitude="1.35" offset="0"/></feComponentTransfer>` +
    `</filter>` +
    `<rect width="300" height="300" filter="url(#n)"/>` +
    `</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * The dot screen itself. `radius` is any CSS length — pass a var() and it
 * becomes animatable, which is how PlateWipe grows and collapses its dots.
 */
export function dotGrid(ink: string, radius: string, feather = "0.5px"): string {
  return `radial-gradient(circle at center, ${ink} 0 ${radius}, transparent calc(${radius} + ${feather}))`;
}
