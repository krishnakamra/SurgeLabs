import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CropMarks } from "./press-marks";

export type Surface = "ink" | "stock";
export type SectionPadding = "none" | "sm" | "md" | "lg";

/**
 * SECTION PADDING LIVES HERE AND ONLY HERE.
 *
 * There is deliberately no `.section` rule in globals.css. Vertical rhythm is
 * a prop, resolved to a single utility class at render time, so two rules can
 * never sit at the same specificity fighting over the same element. To break
 * the rhythm, pass padding="none" and put your own classes on className —
 * one class wins, visibly, at the call site.
 */
const PADDING: Record<SectionPadding, string> = {
  none: "",
  sm: "py-[clamp(2.5rem,4vw,4rem)]",
  md: "py-[clamp(4rem,7vw,7rem)]",
  lg: "py-[clamp(6rem,11vw,11rem)]",
};

export type SectionTicket = {
  /** Two-digit section number shown on the rail, e.g. "03". */
  number: string;
  /** Section name, e.g. "SERVICES". */
  label: string;
  /** Spec line in the job-ticket idiom, e.g. "4C PROCESS". */
  spec?: string;
};

export type SectionFrameProps = {
  surface: Surface;
  as?: ElementType;
  padding?: SectionPadding;
  /** Skip the centred container and let children reach the full bleed. */
  bleed?: boolean;
  cropMarks?: boolean;
  /** Registers this section with the JobTicketRail. */
  ticket?: SectionTicket;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/**
 * One sheet running through the press. Declares its own surface, so every
 * token inside it — fg, rule, mark, focus, plate-k, blend mode — flips to
 * match, using the same class names on either bed.
 */
export function SectionFrame({
  surface,
  as: Tag = "section",
  padding = "md",
  bleed = false,
  cropMarks = true,
  ticket,
  id,
  className,
  innerClassName,
  children,
}: SectionFrameProps) {
  return (
    <Tag
      id={id}
      data-surface={surface}
      data-ticket-number={ticket?.number}
      data-ticket-label={ticket?.label}
      data-ticket-spec={ticket?.spec}
      className={cn("relative isolate bg-surface text-fg", PADDING[padding], className)}
    >
      {cropMarks ? <CropMarks /> : null}
      {bleed ? (
        children
      ) : (
        <div className={cn("relative z-[1] mx-auto w-full max-w-page px-gutter", innerClassName)}>
          {children}
        </div>
      )}
    </Tag>
  );
}
