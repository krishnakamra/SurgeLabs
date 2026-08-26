import Image from "next/image";
import Link from "next/link";
import { Button, Eyebrow, SectionFrame } from "@/components/ui";
import { getCity, getService, work } from "@/content";
import { imageSrc, workStills } from "@/content/media";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * The homepage slot that testimonials will eventually take.
 *
 * content/testimonials.ts is deliberately empty and stays that way until
 * there are real, attributed reviews — a fabricated endorsement is illegal
 * advertising in Canada, not a style problem. But leaving a hole in the
 * homepage while waiting is its own cost, so the slot shows recent work
 * instead.
 *
 * This used to be four columns of text set as job tickets, and the owner's
 * reaction to it was the correct one: a job ticket is a thing a print shop
 * finds meaningful and a customer does not. Nobody arrives at a website
 * wanting to read a docket. They want to see the thing that got made. So the
 * ticket idiom moved to where it earns its place — the /quote form and the
 * package panels, where there really is a spec to fill in — and this section
 * shows photographs with a plain sentence under each.
 *
 * When real reviews land, this section and <Testimonials /> can both run —
 * work does a different job from a quote. Nothing here needs removing.
 */
export function RecentWork() {
  const shown = work.slice(0, 4);
  if (shown.length === 0) return null;

  return (
    <SectionFrame
      surface="stock"
      id="recent-work"
      padding="lg"
      ticket={{ number: "07", label: "RECENT WORK", spec: "WHAT WE MADE" }}
    >
      <Eyebrow number="07" spec="WHAT CAME OFF THE FLOOR">
        Recent work
      </Eyebrow>

      <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
        Some of what we made last month.
      </h2>

      <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
        Four recent jobs, with what was ordered and how long it took. We do not name clients
        without asking them first, so each one says the trade and the town instead.
      </p>

      <ul className="mt-16 grid gap-x-gutter gap-y-16 border-t-[length:var(--hairline)] border-rule pt-14 sm:grid-cols-2">
        {shown.map((item) => {
          const city = getCity(item.city);
          const still = workStills[item.slug];
          const services = item.services
            .map((slug) => getService(slug)?.name)
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={item.slug}>
              <Link href={`/work#${item.slug}`} className="group block">
                {still ? (
                  <div className="relative aspect-[3/2] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken">
                    <Image
                      src={imageSrc(still)}
                      alt={still.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 45vw"
                      className="object-cover transition-transform duration-[var(--dur-slow)] ease-press group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}

                <h3 className="mt-7 max-w-[26ch] font-display text-lg font-bold text-fg underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-mark">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-fg-muted">
                  {item.sector}
                  {city ? ` in ${city.name}` : ""} · {item.turnaround}
                </p>

                <p className={`${SPEC} mt-5 text-fg-faint`}>{services}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-16">
        <Button href="/work" variant="outline" size="lg">
          See all work
        </Button>
      </div>
    </SectionFrame>
  );
}
