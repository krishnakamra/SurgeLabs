"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { isBareRoute } from "@/lib/navigation";
import type { Surface } from "./section-frame";
import { RegistrationTarget } from "./press-marks";

type Ticket = {
  id: string | null;
  number: string;
  label: string;
  spec: string | null;
  surface: Surface;
};

/**
 * The job-ticket rail — a docket clipped to the left edge of the press.
 *
 * Desktop only (>=1200px, the `rail:` variant). Sections register themselves
 * by rendering <SectionFrame ticket={{ number, label, spec }} />; this reads
 * those data attributes off the DOM, so nothing has to be declared twice.
 *
 * A reading line 42% down the viewport decides what is current — that is what
 * the rootMargin is doing. IntersectionObserver, not scroll handlers, and not
 * GSAP: the rail is design-system furniture and shouldn't wait on the
 * animation layer to boot.
 *
 * Accessibility: the whole rail is aria-hidden and out of the tab order. It
 * is furniture — a readout of where you are, not a way to get anywhere. The
 * headings already do that job, and they name themselves better than the
 * ticks do. Mouse users can still click a tick to jump.
 */
export function JobTicketRail({ className }: { className?: string }) {
  const pathname = usePathname();

  // Landing pages carry no chrome at all. See BARE_ROUTES.
  const bare = isBareRoute(pathname);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intersecting = useRef<Set<number>>(new Set());

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-ticket-number]"));

    intersecting.current = new Set();
    setActiveIndex(0);
    setTickets(
      nodes.map((node) => ({
        id: node.id || null,
        number: node.dataset.ticketNumber ?? "",
        label: node.dataset.ticketLabel ?? "",
        spec: node.dataset.ticketSpec ?? null,
        surface: node.dataset.surface === "stock" ? "stock" : "ink",
      })),
    );

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = nodes.indexOf(entry.target as HTMLElement);
          if (index < 0) continue;
          if (entry.isIntersecting) intersecting.current.add(index);
          else intersecting.current.delete(index);
        }
        // Nothing on the reading line between two sheets — hold the last one.
        if (intersecting.current.size > 0) {
          setActiveIndex(Math.min(...intersecting.current));
        }
      },
      { rootMargin: "-42% 0px -56% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);

    return () => observer.disconnect();
  }, [pathname]);

  const active = tickets[activeIndex];

  // Landing pages carry no chrome at all. After the hooks, never before —
  // an early return above them changes the hook order between renders.
  if (bare) return null;

  return (
    <aside
      // Decorative. The vertical readout restates the heading a screen-reader
      // user just passed, and the tick stack's names ("01 HERO") are a worse
      // way to reach a section than the headings themselves. Marking the whole
      // rail hidden means the ticks must also leave the tab order — focusable
      // content inside aria-hidden is a failure in its own right, and it was
      // putting five rail anchors ahead of the page on every navigation.
      aria-hidden="true"
      data-surface={active?.surface ?? "ink"}
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-w)] rail:flex",
        "flex-col items-center justify-between border-r-[length:var(--hairline)] border-rule bg-surface text-fg",
        "py-5 transition-colors duration-[var(--dur-run)] ease-press",
        className,
      )}
    >
      <RegistrationTarget className="size-4 shrink-0 text-mark" />

      <div className="flex min-h-0 flex-1 items-center justify-center py-6">
        {active ? (
          <p
            key={`${activeIndex}-${active.number}`}
            className={cn(
              "animate-ticket-in whitespace-nowrap [writing-mode:vertical-rl] rotate-180",
              "font-utility text-2xs uppercase tracking-utility",
            )}
          >
            <span className="text-fg">{active.number}</span>
            <span className="text-rule-strong"> / </span>
            <span className="text-fg">{active.label}</span>
            {active.spec ? (
              <>
                <span className="text-rule-strong"> &mdash; </span>
                <span className="text-fg-faint">{active.spec}</span>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-center gap-2">
        {tickets.map((ticket, index) => {
          const isActive = index === activeIndex;
          const bar = cn(
            "block transition-all duration-[var(--dur-snap)] ease-press",
            isActive ? "h-[2px] w-6 bg-accent" : "h-[var(--hairline)] w-3 bg-rule-strong",
          );

          if (!ticket.id) {
            return <span key={`${ticket.number}-${index}`} aria-hidden="true" className={bar} />;
          }

          return (
            <Link
              key={ticket.id}
              href={`#${ticket.id}`}
              // -1, not absent: the tick is still clickable for a mouse user,
              // but it cannot be tabbed to from inside an aria-hidden subtree.
              tabIndex={-1}
              className="flex h-4 w-full items-center justify-center"
            >
              <span className={bar} />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
