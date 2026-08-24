"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

type Current = { name: string; price: string; slug: string };

/**
 * Sticky bar naming whichever package you are currently reading, so the price
 * and the way to buy it are never scrolled off. Mobile only — on desktop the
 * panel's own price sits in view the whole time.
 *
 * Fixed and outside the flow, so it cannot shift the page; it fades in once a
 * panel is actually on screen rather than sitting there from first paint.
 */
export function MobilePackageBar() {
  const [current, setCurrent] = useState<Current | null>(null);
  const visible = useRef<Set<number>>(new Set());

  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-package-panel]"));
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = panels.indexOf(entry.target as HTMLElement);
          if (index < 0) continue;
          if (entry.isIntersecting) visible.current.add(index);
          else visible.current.delete(index);
        }

        if (visible.current.size === 0) {
          setCurrent(null);
          return;
        }

        const panel = panels[Math.min(...visible.current)];
        if (!panel) return;
        setCurrent({
          name: panel.dataset.packageName ?? "",
          price: panel.dataset.packagePrice ?? "",
          slug: panel.dataset.packageSlug ?? "",
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const panel of panels) observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-surface="ink"
      aria-hidden={current === null}
      className={[
        "fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-surface lg:hidden",
        "transition-[opacity,transform] duration-[var(--dur-snap)] ease-press",
        current ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      ].join(" ")}
    >
      {/* Fixed height. The bar is anchored to the bottom, so if its box grew
          when the CTA mounted, its top edge would move and book a layout
          shift — on a fixed element, which still counts. */}
      <div className="flex h-[4.75rem] items-center justify-between gap-4 px-gutter">
        <div className="min-w-0">
          <p className="truncate font-utility text-2xs uppercase tracking-utility text-fg-faint">
            {current?.name ?? ""}
          </p>
          <p className="mt-1 font-utility text-sm leading-none tabular-nums text-fg">
            {current?.price ?? ""}
          </p>
        </div>
        {/* Rendered only once a panel is actually current — otherwise this
            emits /quote?package= with an empty parameter, which is a real
            link in the DOM for a crawler to follow. */}
        {current ? (
          <Button href={`/quote?package=${current.slug}`} size="sm">
            Start this
          </Button>
        ) : null}
      </div>
    </div>
  );
}
