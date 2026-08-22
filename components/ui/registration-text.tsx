import type { ElementType } from "react";
import { cn } from "@/lib/cn";

const PLATES = ["c", "m", "y", "k"] as const;

export type RegistrationTextProps = {
  /** Plain text only — it gets rendered five times, once per plate plus the solid. */
  children: string;
  as?: ElementType;
  /** Spread of the plates at rest. Any CSS length; em keeps it tied to type size. */
  offset?: string;
  /**
   * Render off-register on the server. Leave false for real pages: the SSR
   * output is then the registered, resolved state, which is what a reader
   * with no JS or reduced motion should get.
   */
  armed?: boolean;
  className?: string;
};

/**
 * "Registration" — the signature element.
 *
 * The same words set four times in process cyan, magenta, yellow and key,
 * off-register at rest, pulled into perfect register on scroll. The plates
 * blend multiply on paper and screen on the press bed (see --reg-blend), so
 * the misregistration reads as real ink either way.
 *
 * The state machine is CSS, driven by data-reg on the root (see globals.css):
 *
 *   (absent)  registered — solid text, plates hidden. Default and SSR output.
 *   "armed"   off-register, CSS-transitioned. Toggle to animate.
 *   "scrub"   off-register, transitions off — GSAP owns the plate transforms.
 *
 * Wiring in Prompt 3 targets [data-registration-plate] and sets one of those.
 * Only transform and opacity ever change; nothing here can trigger layout.
 */
export function RegistrationText({
  children,
  as: Tag = "span",
  offset = "0.4em",
  armed = false,
  className,
}: RegistrationTextProps) {
  return (
    <Tag
      data-registration=""
      data-reg={armed ? "armed" : undefined}
      style={{ "--reg-offset": offset } as React.CSSProperties}
      className={cn("relative block", className)}
    >
      <span data-registration-solid="">{children}</span>
      {PLATES.map((plate) => (
        <span
          key={plate}
          aria-hidden="true"
          data-registration-plate={plate}
          style={{ color: `var(--color-plate-${plate})` }}
        >
          {children}
        </span>
      ))}
    </Tag>
  );
}
