import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Base is the utility voice: Geist Mono, uppercase, wide tracking, zero radius.
 * There is no radius token in this system to reach for — a foil-stamped card
 * has a cut edge.
 */
const BASE = [
  "group relative inline-flex items-center justify-center gap-[0.7em]",
  "font-utility uppercase leading-none whitespace-nowrap",
  "tracking-utility-tight select-none align-middle",
  // 200ms, and only the four properties that actually change. Transitioning
  // `all` here would also catch the foil gradient's background-image, which
  // cannot interpolate and would flash.
  "transition-[background-color,color,border-color,text-decoration-color] duration-200 ease-press",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
  "aria-disabled:pointer-events-none aria-disabled:opacity-40",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const VARIANT: Record<ButtonVariant, string> = {
  // The house button: nothing but a gold hairline until you reach for it,
  // then the whole shape floods gold and the type knocks out to ink. No
  // fill at rest is the entire idea — a solid button in a Didone setting
  // reads as a web form; an empty gold rectangle reads as a blind-stamp.
  primary: [
    "border-[length:var(--hairline)] border-accent bg-transparent text-accent-text",
    "hover:bg-accent hover:text-accent-fg focus-visible:bg-accent focus-visible:text-accent-fg",
  ].join(" "),
  // Applied on top of `primary` only — see the Button body. The edge is the
  // one part of a CTA that can safely be foil: the type stays a solid gold
  // that clears AA, and the moving metal is the border.
  // Same geometry, quieter rule — for the second action in a pair.
  outline: [
    "border-[length:var(--hairline)] border-rule-strong bg-transparent text-fg",
    "hover:border-fg hover:bg-fg hover:text-surface",
  ].join(" "),
  // Underlined type. The underline is where the mark colour lands.
  ghost:
    "text-fg underline decoration-[length:var(--hairline)] underline-offset-[7px] decoration-rule-strong hover:decoration-mark",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-10 px-6 text-2xs",
  md: "h-12 px-8 text-2xs",
  lg: "h-16 px-12 text-xs",
};

/** Ghost has no box, so it takes type size only — never the padded height. */
const GHOST_SIZE: Record<ButtonSize, string> = {
  sm: "text-2xs",
  md: "text-2xs",
  lg: "text-xs",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export type ButtonProps = AsButton | AsLink;

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const classes = cn(BASE, VARIANT[variant], variant === "ghost" ? GHOST_SIZE[size] : SIZE[size], className);
  // Only the primary CTA. A <FoilField> ancestor makes the highlight travel;
  // without one the gradient is still lit, just still.
  const foil = variant === "primary" ? { "data-foil": "edge" } : {};

  // The old build wiped a yellow rule along the bottom of a solid fill. The
  // fill is now the hover state itself, so the tick has nothing left to
  // announce — and yellow is not in this palette. Nothing replaces it: the
  // button already changes from a hairline to a solid gold plate, which is
  // as much event as a foil house needs.
  const tick = null;

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as AsLink;
    const content = (
      <>
        <span className="relative">{children}</span>
        {tick}
      </>
    );

    if (isExternal(href)) {
      return (
        <a href={href} className={classes} {...foil} {...anchorProps}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...foil} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type="button" className={classes} {...foil} {...buttonProps}>
      <span className="relative">{children}</span>
      {tick}
    </button>
  );
}
