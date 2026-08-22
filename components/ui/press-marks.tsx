import { cn } from "@/lib/cn";

/**
 * Registration target — circle plus a crosshair that runs through it.
 * The mark a pressman lines the plates up against.
 */
export function RegistrationTarget({
  className,
  strokeWidth = 1,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("block", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      vectorEffect="non-scaling-stroke"
    >
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 0.5V8.5M12 15.5v8M0.5 12h8M15.5 12h8" />
    </svg>
  );
}

/**
 * Real crop marks: two hairlines that stop short of the trim corner, leaving
 * a gap where they would meet. Not an L-shaped box.
 *
 *   ──────      the horizontal arm runs from the sheet edge inward
 *         │     the vertical arm runs from the sheet edge down
 *         │     neither touches the corner point
 *
 * Geometry comes from --crop-inset / --crop-gap / --crop-len so the marks
 * scale with the gutter.
 */
const ARM_H = "h-px w-[var(--crop-len)]";
const ARM_V = "w-px h-[var(--crop-len)]";

const MARKS: readonly string[] = [
  // top-left
  `${ARM_H} left-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] top-[var(--crop-inset)]`,
  `${ARM_V} top-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] left-[var(--crop-inset)]`,
  // top-right
  `${ARM_H} right-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] top-[var(--crop-inset)]`,
  `${ARM_V} top-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] right-[var(--crop-inset)]`,
  // bottom-left
  `${ARM_H} left-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] bottom-[var(--crop-inset)]`,
  `${ARM_V} bottom-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] left-[var(--crop-inset)]`,
  // bottom-right
  `${ARM_H} right-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] bottom-[var(--crop-inset)]`,
  `${ARM_V} bottom-[calc(var(--crop-inset)-var(--crop-gap)-var(--crop-len))] right-[var(--crop-inset)]`,
];

export function CropMarks({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 z-0", className)}>
      {MARKS.map((position) => (
        <span key={position} className={cn("absolute block bg-rule-strong", position)} />
      ))}
    </div>
  );
}
