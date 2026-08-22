import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Base is the utility voice: Martian Mono, uppercase, wide tracking, 2px radius.
 * The only radius in the system.
 */
const BASE = [
  "group relative inline-flex items-center justify-center gap-[0.7em]",
  "font-utility uppercase leading-none whitespace-nowrap",
  "tracking-utility-tight select-none align-middle",
  "transition-[background-color,color,border-color,text-decoration-color] duration-[var(--dur-snap)] ease-press",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
  "aria-disabled:pointer-events-none aria-disabled:opacity-40",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const VARIANT: Record<ButtonVariant, string> = {
  // Magenta carries the brand. Solid ink, knockout-white type.
  primary:
    "rounded-btn overflow-hidden bg-accent text-accent-fg hover:bg-accent-hover hover:text-accent-hover-fg",
  // A trapped rule that floods on hover — plate inversion.
  outline:
    "rounded-btn border border-rule-strong bg-transparent text-fg hover:border-fg hover:bg-fg hover:text-surface",
  // Underlined type. The underline is where the mark colour lands.
  ghost:
    "text-fg underline decoration-1 underline-offset-[7px] decoration-rule-strong hover:decoration-mark",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-2xs",
  md: "h-11 px-6 text-2xs",
  lg: "h-14 px-8 text-xs",
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

  // A 2px yellow rule wipes in along the bottom edge of a solid fill. Yellow
  // reads at 3.7:1 on magenta, and it is the only place a tick works on both
  // surfaces. Transform only.
  const tick =
    variant === "primary" ? (
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-yellow",
          "scale-x-0 transition-transform duration-[var(--dur-snap)] ease-press",
          "group-hover:scale-x-100 group-focus-visible:scale-x-100",
        )}
      />
    ) : null;

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
        <a href={href} className={classes} {...anchorProps}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      <span className="relative">{children}</span>
      {tick}
    </button>
  );
}
