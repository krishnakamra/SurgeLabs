import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { RegistrationTarget } from "./press-marks";

export type EyebrowProps = {
  /** Section number, e.g. "03". Zero-padded, always two digits. */
  number?: string;
  /** Spec suffix in the job-ticket idiom, e.g. "4C PROCESS", "NO MINIMUMS". */
  spec?: string;
  /** Show the leading registration target. */
  mark?: boolean;
  tone?: "default" | "accent";
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * The job-ticket line: `✛ 03 / SERVICES — 4C PROCESS`
 * Martian Mono, uppercase, wide tracking. Separators are decorative, so a
 * screen reader hears "03 SERVICES 4C PROCESS", not a run of punctuation.
 */
export function Eyebrow({
  number,
  spec,
  mark = true,
  tone = "default",
  as: Tag = "p",
  className,
  children,
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "flex flex-wrap items-center gap-x-[0.6em] gap-y-1",
        "font-utility text-2xs uppercase tracking-utility",
        tone === "accent" ? "text-accent-text" : "text-fg-faint",
        className,
      )}
    >
      {mark ? <RegistrationTarget className="size-[0.9em] shrink-0 text-mark" /> : null}
      {number ? <span className="text-fg tabular-nums">{number}</span> : null}
      {number ? (
        <span aria-hidden="true" className="text-rule-strong">
          /
        </span>
      ) : null}
      <span className={tone === "accent" ? undefined : "text-fg"}>{children}</span>
      {spec ? (
        <>
          <span aria-hidden="true" className="text-rule-strong">
            &mdash;
          </span>
          <span>{spec}</span>
        </>
      ) : null}
    </Tag>
  );
}
