import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type Plate = "c" | "m" | "y" | "k";

/** Real screen angles. Offsetting the plates like this is what stops moiré. */
const SCREEN_ANGLE: Record<Plate, number> = { y: 0, c: 15, k: 45, m: 75 };

export type HalftoneFade = "none" | "top" | "bottom" | "y" | "radial";

const FADE: Record<HalftoneFade, string | undefined> = {
  none: undefined,
  top: "linear-gradient(to bottom, transparent 0%, #000 38%)",
  bottom: "linear-gradient(to bottom, #000 62%, transparent 100%)",
  y: "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
  radial: "radial-gradient(ellipse at center, #000 30%, transparent 76%)",
};

/**
 * feTurbulence, inlined as a data URI so it carries its own filter id and can
 * never collide with another instance's <defs> in the document.
 * luminanceToAlpha turns the noise into a soft alpha mask — dot gain, the
 * uneven density you get when ink meets an imperfect sheet.
 */
function turbulenceMask(baseFrequency: number, seed: number, octaves: number, contrast: number) {
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

export type HalftoneFieldProps = {
  /** Sets the screen angle and, unless `color` says otherwise, the ink. */
  plate?: Plate;
  /** Any CSS colour. Defaults to the plate's own process ink. */
  color?: string;
  /** Dot radius in px. */
  dot?: number;
  /** Grid pitch in px — centre to centre. */
  pitch?: number;
  opacity?: number;
  /**
   * feTurbulence controls. Change `seed` to reroll the ink density.
   * `contrast` is the gamma exponent on the alpha channel — higher thins the
   * mid-tones out, lower floods them. Above ~1.0 with the fixed 1.35
   * amplitude the mask stops clamping to solid and the dot gain shows.
   */
  baseFrequency?: number;
  seed?: number;
  octaves?: number;
  contrast?: number;
  /** Second mask on the wrapper, for letting the field die out at an edge. */
  fade?: HalftoneFade;
  className?: string;
};

/**
 * A halftone screen: a rotated dot grid whose density is modulated by
 * feTurbulence. Decorative and inert — aria-hidden, pointer-events-none,
 * no JS, no ids in the document, no network requests.
 *
 * Drop it into a bleed section as a sibling of the content:
 *   <SectionFrame surface="ink" bleed>
 *     <HalftoneField plate="m" fade="y" />
 *     ...
 *   </SectionFrame>
 */
export function HalftoneField({
  plate = "k",
  color,
  dot = 1.4,
  pitch = 6,
  opacity = 0.5,
  baseFrequency = 0.7,
  seed = 4,
  octaves = 3,
  contrast = 1.6,
  fade = "none",
  className,
}: HalftoneFieldProps) {
  const ink = color ?? `var(--color-plate-${plate})`;
  const mask = turbulenceMask(baseFrequency, seed, octaves, contrast);
  const fadeMask = FADE[fade];

  const wrapperStyle: CSSProperties = {
    opacity,
    ...(fadeMask
      ? {
          maskImage: fadeMask,
          WebkitMaskImage: fadeMask,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }
      : null),
  };

  // Oversized so the rotation never exposes a corner, then clipped by the wrapper.
  const screenStyle: CSSProperties = {
    position: "absolute",
    inset: "-50%",
    transform: `rotate(${SCREEN_ANGLE[plate]}deg)`,
    backgroundImage: `radial-gradient(circle at center, ${ink} 0 ${dot}px, transparent ${dot + 0.5}px)`,
    backgroundSize: `${pitch}px ${pitch}px`,
    backgroundRepeat: "repeat",
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
      style={wrapperStyle}
    >
      <div style={screenStyle} />
    </div>
  );
}
