import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { SCREEN_ANGLE, dotGrid, turbulenceMask, type Plate } from "@/lib/halftone";

export type { Plate };

export type HalftoneFade = "none" | "top" | "bottom" | "y" | "radial";

const FADE: Record<HalftoneFade, string | undefined> = {
  none: undefined,
  top: "linear-gradient(to bottom, transparent 0%, #000 38%)",
  bottom: "linear-gradient(to bottom, #000 62%, transparent 100%)",
  y: "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
  radial: "radial-gradient(ellipse at center, #000 30%, transparent 76%)",
};

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
  const mask = turbulenceMask({ baseFrequency, seed, octaves, contrast });
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

  const screenStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    // A rotated layer has to cover the container's rotated bounding box. The
    // old `inset: -50%` only covers a square-ish box: at 75° a wide, short
    // band shows cut corners. A square of side 2× the larger container
    // dimension always covers it, at any angle and any aspect ratio.
    width: "max(200cqw, 200cqh)",
    height: "max(200cqw, 200cqh)",
    transform: `translate(-50%, -50%) rotate(${SCREEN_ANGLE[plate]}deg)`,
    backgroundImage: dotGrid(ink, `${dot}px`),
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
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden [container-type:size]",
        className,
      )}
      style={wrapperStyle}
    >
      <div style={screenStyle} />
    </div>
  );
}
