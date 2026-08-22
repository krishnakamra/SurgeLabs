"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
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
 * Accessibility: the vertical readout is aria-hidden, because it restates the
 * heading a screen-reader user just passed. The tick stack is the part that
 * earns its "navigation aid" billing — real anchors, real accessible names,
 * for any section given an id.
 */
export function JobTicketRail({ className }: { className?: string }) {
  const pathname = usePathname();
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

  return (
    <aside
      data-surface={active?.surface ?? "ink"}
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-w)] rail:flex",
        "flex-col items-center justify-between border-r border-rule bg-surface text-fg",
        "py-5 transition-colors duration-[var(--dur-run)] ease-press",
        className,
      )}
    >
      <RegistrationTarget className="size-4 shrink-0 text-mark" />

      <div aria-hidden="true" className="flex min-h-0 flex-1 items-center justify-center py-6">
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

      <nav aria-label="Sections" className="flex shrink-0 flex-col items-center gap-2">
        {tickets.map((ticket, index) => {
          const isActive = index === activeIndex;
          const bar = cn(
            "block transition-all duration-[var(--dur-snap)] ease-press",
            isActive ? "h-[2px] w-6 bg-accent" : "h-px w-3 bg-rule-strong",
          );

          if (!ticket.id) {
            return <span key={`${ticket.number}-${index}`} aria-hidden="true" className={bar} />;
          }

          return (
            <Link
              key={ticket.id}
              href={`#${ticket.id}`}
              aria-current={isActive ? "true" : undefined}
              className="flex h-4 w-full items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              <span className={bar} />
              <span className="sr-only">
                {ticket.number} {ticket.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
