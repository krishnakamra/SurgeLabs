import type { CSSProperties, ElementType, Ref } from "react";
import { cn } from "@/lib/cn";

const PLATES = ["c", "m", "y", "k"] as const;

/**
 * registered  Solid text, plates hidden. The default, and the SSR output.
 * armed       Off-register, CSS-transitioned. Toggle it and it animates.
 * scrub       Off-register, transitions off — GSAP owns --reg-p.
 */
export type RegistrationState = "registered" | "armed" | "scrub";

export type RegistrationTextProps = {
  /** Plain text only. One real text node; the plates are generated content. */
  children: string;
  as?: ElementType;
  /** Spread of the plates at rest. Any CSS length; em keeps it tied to type size. */
  offset?: string;
  state?: RegistrationState;
  className?: string;
  ref?: Ref<HTMLElement>;
};

/**
 * "Registration" — the signature element.
 *
 * The same words set four times in process cyan, magenta, yellow and key,
 * off-register at rest, pulled into perfect register on scroll. The plates
 * blend multiply on paper and screen on the press bed (see --reg-blend), so
 * the misregistration reads as real ink either way.
 *
 * The four plates carry the words in `data-text` and paint them through
 * `content: attr(data-text)` on a pseudo-element, so there is exactly one
 * real text node in the DOM. Setting them as children instead put the
 * headline in the page five times over: aria-hidden keeps that out of the
 * accessibility tree, but not out of the text a crawler or a reader-mode
 * extractor pulls off the page, and an H1 that reads as the same sentence
 * repeated five times is a genuinely bad first impression of the site.
 *
 * Position is one inherited custom property, --reg-p: 1 is fully off
 * register, 0 is registered. The stylesheet expands it into four plate
 * offsets and two opacities; see app/globals.css. Both non-default states
 * are gated on html[data-motion="ready"], so with no JS or under reduced
 * motion this renders as solid, legible type no matter what state is passed.
 *
 * For scroll-driven use, reach for <RegistrationReveal> instead — it wires
 * the scrub and leaves the fallbacks intact.
 */
export function RegistrationText({
  children,
  as: Tag = "span",
  offset = "0.4em",
  state = "registered",
  className,
  ref,
}: RegistrationTextProps) {
  return (
    <Tag
      ref={ref}
      data-registration=""
      data-reg={state === "registered" ? undefined : state}
      style={{ "--reg-offset": offset } as CSSProperties}
      className={cn("relative block", className)}
    >
      <span data-registration-solid="">{children}</span>
      {PLATES.map((plate) => (
        <span
          key={plate}
          aria-hidden="true"
          data-registration-plate={plate}
          data-text={children}
          style={{ color: `var(--color-plate-${plate})` }}
        />
      ))}
    </Tag>
  );
}
