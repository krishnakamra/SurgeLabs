"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type TocEntry = { id: string; text: string; depth: 2 | 3 };

/**
 * Contents rail for an article.
 *
 * Same instrument as JobTicketRail, pointed at headings instead of sections:
 * a reading line partway down the viewport decides what is current, an
 * IntersectionObserver reports it, and the current entry is marked with the
 * same tick — 2px and accent when live, a hairline when not.
 *
 * It differs from the rail in two ways, both deliberate. The rail is furniture
 * that sits outside the content, so it is aria-hidden and desktop-only; this
 * is a table of contents, which is a real navigation aid worth exposing to
 * everyone, so the headings are readable text in a labelled <nav>. And it
 * holds the last heading rather than resetting when nothing is on the line,
 * so scrolling through a long block of prose does not blank the indicator.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);
  const visible = useRef<Set<string>>(new Set());

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const order = new Map(entries.map((e, i) => [e.id, i]));

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const id = record.target.id;
          if (record.isIntersecting) visible.current.add(id);
          else visible.current.delete(id);
        }
        // Highest heading currently on the reading line wins. When none is,
        // the previous one stands — the reader is still inside that section.
        if (visible.current.size > 0) {
          const top = [...visible.current].sort(
            (a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0),
          )[0];
          if (top) setActiveId(top);
        }
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );

    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 3) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
        On this page
      </p>
      <ul className="mt-5 space-y-1">
        {entries.map((entry) => {
          const isActive = entry.id === activeId;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "group flex items-start gap-3 py-1.5 text-sm transition-colors",
                  "rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  entry.depth === 3 && "pl-4",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-[0.6em] block shrink-0 transition-all duration-[var(--dur-snap)] ease-press",
                    isActive
                      ? "h-[2px] w-6 bg-accent"
                      : "h-[var(--hairline)] w-3 bg-rule-strong group-hover:w-5",
                  )}
                />
                <span className="min-w-0">{entry.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
