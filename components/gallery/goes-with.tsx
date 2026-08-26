import Image from "next/image";
import Link from "next/link";
import { Eyebrow, SectionFrame } from "@/components/ui";
import { crossSellShots, getGalleryCategory, type GalleryCategory } from "@/content/gallery";
import { imageSrc } from "@/content/media";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * The cross-sell strip at the foot of every category page.
 *
 * The owner asked for this as "people also bought", the way Amazon does it.
 * It is not labelled that way and it never will be: that phrasing is a claim
 * about aggregate purchase behaviour, this shop has no purchase data feeding
 * a website, and a fabricated aggregate is a false representation under the
 * Competition Act rather than a design flourish.
 *
 * What it says instead does the same job honestly and, on a page like this,
 * probably better — "usually ordered on the same job ticket" is a specific
 * claim from a shop that runs the tickets, where "people also bought" is a
 * generic one from an algorithm. If real order data ever backs the stronger
 * version, the label can change; until then this is the true sentence.
 */
export function GoesWith({
  category,
  surface = "ink",
  ticketNumber,
}: {
  category: GalleryCategory;
  surface?: "ink" | "stock";
  ticketNumber: string;
}) {
  const related = category.goesWith
    .map((slug) => getGalleryCategory(slug))
    .filter((entry): entry is GalleryCategory => Boolean(entry));

  if (related.length === 0) return null;

  return (
    <SectionFrame
      surface={surface}
      id="goes-with"
      padding="md"
      ticket={{ number: ticketNumber, label: "GOES WITH", spec: "SAME TICKET" }}
    >
      <Eyebrow number={ticketNumber} spec="ONE DELIVERY, ONE INVOICE">
        Goes with this
      </Eyebrow>
      <h2 className="mt-6 max-w-[26ch] font-display text-2xl font-extrabold text-fg">
        Usually ordered on the same job ticket.
      </h2>
      <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
        Not a guess about what other people bought &mdash; we do not publish numbers we cannot
        show you. These are the things that turn up alongside{" "}
        {category.name.toLowerCase()} on the tickets we actually run, and adding one to an order
        already going through costs less than starting it separately.
      </p>

      <ul className="mt-14 grid gap-x-gutter gap-y-12 border-t-[length:var(--hairline)] border-rule pt-12 lg:grid-cols-3">
        {related.map((entry) => {
          const shots = crossSellShots(entry);
          return (
            <li key={entry.slug}>
              <Link href={`/work/${entry.slug}`} className="group block">
                <div className="grid grid-cols-2 gap-px bg-rule">
                  {shots.map((shot) => (
                    <div
                      key={shot.id}
                      className="relative aspect-[4/3] overflow-hidden bg-surface-sunken"
                    >
                      <Image
                        src={imageSrc(shot)}
                        alt={shot.alt}
                        fill
                        sizes="(max-width: 1024px) 45vw, 15vw"
                        className="object-cover transition-transform duration-[var(--dur-slow)] ease-press group-hover:scale-[1.04]"
                      />
                    </div>
                  ))}
                </div>

                <h3 className="mt-6 font-display text-lg font-bold text-fg underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-mark">
                  {entry.name}
                </h3>
                <p className="mt-3 max-w-[34ch] text-sm text-fg-muted">{entry.blurb}</p>
                <span className={`${SPEC} mt-5 block text-fg-faint`}>See them all</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionFrame>
  );
}
