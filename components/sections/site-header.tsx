"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/brand";
import { FoilField } from "@/components/motion";
import { Button } from "@/components/ui";
import { site } from "@/content";
import { cn } from "@/lib/cn";
import { isBareRoute, navCta, primaryNav, type NavItem } from "@/lib/navigation";

/**
 * The masthead. Rendered once in app/layout.tsx, so every route has it.
 *
 * Sticky (`sticky top-0`, z-50). An earlier version of this comment claimed
 * the opposite — that the masthead was deliberately not sticky — while the
 * element below it had been sticky the whole time. Trust the className.
 *
 * Sticky chrome costs two things and both are paid for elsewhere, so don't
 * re-litigate them here: PinnedPanel's `sticky top-0` package track sits
 * under this one and is offset for it, and every in-page anchor is kept out
 * from under the header by `scroll-padding-top: var(--header-h)` in
 * globals.css. That padding is load-bearing for the skip link — remove it
 * and keyboard users land on a heading hidden behind this bar.
 *
 * Ink bed, always — the masthead is the press bed the sheets run through,
 * which is also what themeColor in app/layout.tsx claims the site is.
 *
 * The link set comes from lib/navigation.ts, which the footer sitemap and the
 * route audit also read. Adding a route in one place lights it up in all
 * three, and failing to add it fails the build.
 */

const LINK =
  "font-utility text-2xs uppercase tracking-utility text-fg-muted transition-colors hover:text-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus";

function isCurrent(pathname: string, href: string) {
  const base = href.split("#")[0]!;
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

/* ── Desktop dropdown ─────────────────────────────────────────────────────
   A button, not a link: it opens a menu rather than going anywhere. Opens on
   hover for a mouse and on click or Enter for everything else, closes on
   Escape and on focus leaving the group — which is what makes it usable with
   a keyboard rather than merely operable with one. */
function Dropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const group = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const active = item.children?.some((child) => isCurrent(pathname, child.href));

  return (
    <div
      ref={group}
      className="relative"
      // Pointer events with an explicit mouse guard, not onMouseEnter.
      // A tap on a touch device synthesises mouse events: the tap fires
      // pointerenter (opening the menu) and then click (toggling it shut
      // again), so the menu was unopenable by touch entirely. Restricting
      // hover to a real mouse leaves click as the only path on touch, which
      // is the one that works there.
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      // Closing on blur-out rather than on click-away: a keyboard user tabbing
      // past the last item should not leave an open menu behind them.
      onBlur={(event) => {
        if (!group.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(LINK, "inline-flex items-center gap-2", active && "text-fg")}
      >
        {item.label}
        <span
          aria-hidden="true"
          className={cn(
            "block h-[var(--hairline)] w-3 bg-current transition-transform duration-[var(--dur-snap)] ease-press",
            open && "scale-x-[1.6]",
          )}
        />
      </button>

      <div
        id={id}
        // `hidden` rather than a conditional render: the menu keeps its place
        // in the DOM order, so a screen reader announces it where it is.
        hidden={!open}
        className="absolute left-0 top-full z-50 pt-5"
      >
        {/* Capped and scrollable. The Work menu carries seven entries, which
            at the old padding ran past the bottom of a 800px viewport and cut
            the last item in half — a menu whose last item you cannot see is a
            route nobody reaches. */}
        <ul
          data-surface="ink"
          className="max-h-[min(72vh,34rem)] w-[22rem] overflow-y-auto border-[length:var(--hairline)] border-rule bg-surface p-2"
        >
          {item.children?.map((child) => (
            <li key={child.href} className={child.compact ? "mt-2 border-t-[length:var(--hairline)] border-rule pt-2" : undefined}>
              <Link
                href={child.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(pathname, child.href) ? "page" : undefined}
                className={cn(
                  "group block px-5 transition-colors hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus",
                  child.compact ? "py-3" : "py-4",
                )}
              >
                <span
                  className={cn(
                    child.compact
                      ? "font-utility text-2xs uppercase tracking-utility text-fg-muted group-hover:text-fg"
                      : "font-display text-md font-bold text-fg",
                  )}
                >
                  {child.label}
                </span>
                {child.description ? (
                  <span className="mt-1.5 block max-w-[32ch] text-sm text-fg-muted">
                    {child.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Mobile overlay ───────────────────────────────────────────────────────
   Full screen, ink bed, everything on it. Focus moves into the panel on open
   and back to the toggle on close; Escape closes it; the page behind it stops
   scrolling via html[data-nav-open] in globals.css. */
function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Any navigation closes it. Without this, tapping a link on the overlay
  // changes the route underneath and leaves the menu covering the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (open) root.setAttribute("data-nav-open", "");
    else root.removeAttribute("data-nav-open");

    if (!open) return;

    panel.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      // Focus trap. Without it, tab moves into the page behind the overlay
      // and the visible focus ring simply disappears.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.removeAttribute("data-nav-open");
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className={cn(LINK, "inline-flex items-center gap-3 lg:hidden")}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true" className="flex flex-col gap-[3px]">
          <span
            className={cn(
              "block h-[var(--hairline)] w-5 bg-current transition-transform duration-[var(--dur-snap)] ease-press",
              open && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-[var(--hairline)] w-5 bg-current transition-transform duration-[var(--dur-snap)] ease-press",
              open && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </span>
      </button>

      <div
        id={id}
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        data-surface="ink"
        className="fixed inset-0 z-[90] overflow-y-auto bg-surface lg:hidden"
      >
        <div className="mx-auto flex min-h-full w-full max-w-page flex-col px-gutter py-8">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)} className="inline-flex">
              <Logo variant="horizontal" className="[--logo-size:26px]" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
              className={cn(LINK, "inline-flex items-center gap-3")}
            >
              Close
              <span aria-hidden="true" className="relative block size-4">
                <span className="absolute inset-x-0 top-1/2 h-[var(--hairline)] rotate-45 bg-current" />
                <span className="absolute inset-x-0 top-1/2 h-[var(--hairline)] -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav aria-label="Site" className="mt-12 flex-1">
            <ul className="space-y-1">
              {primaryNav.map((item) => (
                <li key={item.label} className="border-t-[length:var(--hairline)] border-rule py-6">
                  {item.children ? (
                    <>
                      <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
                        {item.label}
                      </p>
                      {/* The same small line the desktop dropdown carries.
                          Twelve children across two menus set at display size
                          made a menu you scrolled rather than read; at this
                          size the description fits and does the work. */}
                      <ul className="mt-5 space-y-5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={isCurrent(pathname, child.href) ? "page" : undefined}
                              className="block"
                            >
                              <span
                                className={cn(
                                  child.compact
                                    ? "font-utility text-2xs uppercase tracking-utility text-fg-muted"
                                    : "font-display text-lg font-bold text-fg",
                                )}
                              >
                                {child.label}
                              </span>
                              {child.description ? (
                                <span className="mt-1 block max-w-[38ch] text-sm text-fg-muted">
                                  {child.description}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                      className="block font-display text-xl font-extrabold text-fg"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 shrink-0 space-y-6 border-t-[length:var(--hairline)] border-rule pt-10">
            <Button href={navCta.href} size="lg" className="w-full">
              {navCta.label}
            </Button>
            <a
              href={site.phoneHref}
              className="block text-center font-utility text-2xs uppercase tracking-utility text-fg-muted"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);

  /* Publish the masthead's REAL height as --header-h, which globals.css uses
     to keep anchor targets out from under it.

     It used to be a hardcoded `4rem` guess, and the guess was the bug: the
     bar renders 65px (the 0.5px hairline border rounds up), and taller again
     once a font swaps or the viewport changes the wordmark's line box. Seven
     of the eleven homepage headings were landing underneath it. A number
     written in CSS cannot track a height the content decides, so it is
     measured here instead and the CSS value is only the pre-hydration
     fallback.

     Hooks must run on every render, so this sits above the bare-route return
     below — see the comment there. */
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-h");
    };
  }, [pathname]);

  // Landing pages render their own minimal masthead. See BARE_ROUTES. This
  // returns after the hook above, never before it: an early return that skips
  // a hook changes the hook order between renders and React throws.
  if (isBareRoute(pathname)) return null;

  return (
    <header
      ref={bar}
      data-surface="ink"
      // z-50 is load-bearing, not decoration. The header and every section
      // below it are `relative isolate` siblings, so without an explicit
      // z-index the later sibling paints on top — and the Services dropdown,
      // however high its own z-index, is trapped inside the header's stacking
      // context and disappeared behind the hero. It sits above the job-ticket
      // rail (z-40) and below the mobile overlay (z-90) and skip link (z-100).
      className="sticky top-0 isolate z-50 border-b-[length:var(--hairline)] border-rule bg-surface text-fg"
    >
      {/* Left padding is trimmed below the page gutter so the wordmark sits
          closer to the edge of the screen than the body copy does — a
          masthead reads as a masthead when it is not aligned to the text
          column. The right side keeps the full gutter so the CTA does not
          crowd the edge. */}
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-gutter pr-gutter pl-5 sm:h-20 lg:pl-6">
        {/* Home. The logo names itself — <Logo> carries role="img" and an
            aria-label — so this link needs no label of its own, and gets no
            second one that would read out twice.

            The full wordmark shows at every width. It used to collapse to the
            bare S under 480px, which left a phone visitor looking at a header
            with no company name in it — the one place the name matters most,
            because there is no nav bar spelling it out either. */}
        <FoilField as="span" className="inline-flex shrink-0">
          <Link
            href="/"
            className="inline-flex outline-offset-[6px] focus-visible:outline-2 focus-visible:outline-focus"
          >
            {/* Size is a CSS variable rather than a prop so it can step at a
                breakpoint without a second render. No `collapse`: the
                wordmark stays whole down to 320px. */}
            <Logo
              variant="horizontal"
              className="[--logo-size:22px] xs:[--logo-size:26px] sm:[--logo-size:32px]"
            />
          </Link>
        </FoilField>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {primaryNav.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <Dropdown item={item} pathname={pathname} />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                    className={cn(LINK, isCurrent(pathname, item.href) && "text-fg")}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-8">
          <a href={site.phoneHref} className={cn(LINK, "hidden xl:inline")}>
            {site.phone}
          </a>
          <Button href={navCta.href} size="sm" className="hidden sm:inline-flex">
            {navCta.label}
          </Button>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
