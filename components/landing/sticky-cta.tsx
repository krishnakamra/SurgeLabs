"use client";

import { useEffect, useState } from "react";
import { site } from "@/content";
import { cn } from "@/lib/cn";

/**
 * The phone-only bar that appears once neither form is on screen.
 *
 * Most paid traffic arrives on a phone, reads a screen and a half, and then
 * has to decide. Without this, deciding means scrolling back up to a form
 * they have already passed. Two controls, one of which dials — a call is
 * worth more than a form fill on a job this small, because the whole thing
 * can be agreed in five minutes.
 *
 * It watches both forms rather than a scroll offset, so it never covers the
 * thing it is pointing at.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const forms = Array.from(document.querySelectorAll("#lead-top, #lead-bottom"));
    if (forms.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setShow(visible.size === 0);
      },
      // A form half off the bottom of the screen is still the thing being
      // looked at, so it counts as visible.
      { threshold: 0.15 },
    );

    for (const form of forms) observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-surface="ink"
      // aria-hidden while off screen so a screen reader does not announce two
      // extra buttons that are not visible; both actions exist in the page.
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t-[length:var(--hairline)] border-rule bg-surface lg:hidden",
        "transition-transform duration-[var(--dur-snap)] ease-press motion-reduce:transition-none",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-stretch gap-px bg-rule">
        <a
          href={site.phoneHref}
          tabIndex={show ? 0 : -1}
          className="flex flex-1 flex-col items-center justify-center bg-surface px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus"
        >
          <span className="font-utility text-2xs uppercase tracking-utility text-fg-faint">Call us</span>
          <span className="mt-1 font-numeral text-md leading-none font-black tabular-nums text-fg">
            {site.phone}
          </span>
        </a>
        <a
          href="#lead-bottom"
          tabIndex={show ? 0 : -1}
          className="flex flex-1 items-center justify-center bg-accent px-4 py-3.5 text-center font-display text-sm font-bold uppercase tracking-[0.06em] leading-tight text-accent-fg focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus"
        >
          Get my $99 cards
        </a>
      </div>
    </div>
  );
}
