"use client";

import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { SCREEN_ANGLE, dotGrid, turbulenceMask, type Plate } from "@/lib/halftone";
import { useMotion } from "@/lib/motion/use-motion";

export type PlateWipeProps = {
  plate?: Plate;
  color?: string;
  /** Which edge of the parent section this straddles. */
  edge?: "top" | "bottom";
  /** Band depth. It sits half above the boundary and half below. */
  height?: string;
  /** Dot radius in px at peak coverage. */
  maxDot?: number;
  /** Grid pitch in px — centre to centre. */
  pitch?: number;
  opacity?: number;
  seed?: number;
  className?: string;
};

/**
 * The section transition: a halftone field whose dot radius grows from
 * nothing to full coverage and back as the boundary crosses the viewport, so
 * one section appears to print over the next before lifting off it again.
 *
 * Only the dot radius animates — one custom property inside a background
 * gradient. No layout, no opacity crossfade of a whole section, and the band
 * is absolutely positioned, so it can't shift anything around it.
 *
 * Place it as a direct child of a bleed SectionFrame:
 *   <SectionFrame surface="stock" bleed>
 *     <PlateWipe plate="m" edge="top" />
 */
export function PlateWipe({
  plate = "k",
  color,
  edge = "top",
  height = "42vh",
  maxDot = 4.5,
  pitch = 10,
  opacity = 0.85,
  seed = 6,
  className,
}: PlateWipeProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);

  useMotion({
    scope: root,
    deps: [maxDot, edge, height],
    animate({ gsap, scope }) {
      if (!scope || !screen.current) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(
          screen.current,
          { "--plate-dot": "0px" },
          { "--plate-dot": `${maxDot}px`, ease: "none", duration: 1 },
        )
        .to(screen.current, { "--plate-dot": "0px", ease: "none", duration: 1 });
    },
  });

  const ink = color ?? `var(--color-plate-${plate})`;
  const mask = turbulenceMask({ seed });

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
    backgroundImage: dotGrid(ink, "var(--plate-dot, 0px)"),
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
      ref={root}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-[2] overflow-hidden [container-type:size]",
        className,
      )}
      style={{
        height,
        opacity,
        [edge]: 0,
        transform: edge === "top" ? "translateY(-50%)" : "translateY(50%)",
      }}
    >
      <div ref={screen} style={screenStyle} />
    </div>
  );
}
