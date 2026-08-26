import Image from "next/image";
import { Eyebrow, SectionFrame } from "@/components/ui";
import { portfolioByYear } from "@/content/portfolio";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

export type PortfolioGridProps = {
  /** How many to show. Omit for all of them. */
  limit?: number;
  surface?: "ink" | "stock";
  ticketNumber: string;
  heading: string;
  standfirst: string;
  id?: string;
};

/**
 * The website portfolio.
 *
 * Renders nothing while content/portfolio.ts is empty — same rule as
 * <Testimonials />. A gallery section with no gallery in it is worse than no
 * section, and a placeholder card is a promise the page cannot keep.
 *
 * Each card carries the client's name, the live URL, and — this is the part
 * that matters — the `role` line saying exactly what we did on that site. A
 * screenshot implies authorship all on its own, so the correction has to sit
 * next to it rather than in a disclaimer at the bottom of the page.
 */
export function PortfolioGrid({
  limit,
  surface = "stock",
  ticketNumber,
  heading,
  standfirst,
  id = "portfolio",
}: PortfolioGridProps) {
  const all = portfolioByYear();
  const shown = limit ? all.slice(0, limit) : all;
  if (shown.length === 0) return null;

  return (
    <SectionFrame
      surface={surface}
      id={id}
      padding="lg"
      ticket={{ number: ticketNumber, label: "PORTFOLIO", spec: `${all.length} SITES` }}
    >
      <Eyebrow number={ticketNumber} spec="LIVE SITES">
        Websites we built
      </Eyebrow>
      <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-extrabold text-fg">{heading}</h2>
      <p className="mt-6 max-w-[58ch] text-md text-fg-muted">{standfirst}</p>

      <ul className="mt-16 grid gap-x-gutter gap-y-16 border-t-[length:var(--hairline)] border-rule pt-14 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((item) => (
          <li key={item.slug} id={item.slug}>
            <article className="group">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken">
                  {/* The still is always rendered, underneath. It is the
                      reduced-motion view, and it is what shows if the scroll
                      capture fails to load — no opacity trick that could
                      leave an empty box behind a video that never arrived. */}
                  <Image
                    src={item.shot.src}
                    alt={item.shot.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 30vw"
                    className="object-cover object-top transition-transform duration-[var(--dur-slow)] ease-press group-hover:scale-[1.02]"
                  />
                  {item.motion ? (
                    <video
                      // A scroll capture, not a film: there is no sound track
                      // and there are no controls, so it has to be muted and
                      // inline or iOS refuses to autoplay it at all.
                      src={item.motion.src}
                      poster={item.shot.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      className="absolute inset-0 size-full object-cover object-top motion-reduce:hidden"
                    />
                  ) : null}
                </div>

                <h3 className="mt-7 font-display text-lg font-bold text-fg underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-mark">
                  {item.name}
                </h3>
              </a>

              <p className={`${SPEC} mt-3 text-fg-faint`}>
                {item.sector} · {item.city} · {item.year}
              </p>

              {/* What we actually did. Required by the content layer. */}
              <p className="mt-4 font-display text-sm font-bold text-accent-text">{item.role}</p>

              <p className="mt-3 max-w-[44ch] text-sm text-fg-muted">{item.summary}</p>

              <ul className="mt-5 space-y-2">
                {item.built.map((line) => (
                  <li key={line} className="flex gap-3 text-sm text-fg-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-[var(--hairline)] w-3 shrink-0 bg-rule-strong"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {item.stack?.length ? (
                <p className={`${SPEC} mt-5 text-fg-faint`}>{item.stack.join(" · ")}</p>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
