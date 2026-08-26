import Image from "next/image";
import { galleryShot, type GalleryItem } from "@/content/gallery";
import { imageSrc } from "@/content/media";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * One category's products.
 *
 * A card, a lawn sign and a polo are all "work", but nobody browsing arrives
 * wanting a case study — they arrive wanting to know whether we make the
 * thing and what it costs. So each cell leads with the picture, then the
 * name, then the price, and only then the production spec for the people who
 * came for that.
 */
export function ProductGrid({ items }: { items: readonly GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-x-gutter gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const shot = galleryShot(item);
        return (
          <li key={item.slug} id={item.slug}>
            <article>
              <div className="relative aspect-[4/3] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken">
                <Image
                  src={imageSrc(shot)}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover"
                />
              </div>

              {/* Stacked, not a title/price row. Half these prices are a
                  short sentence rather than a figure — "Quoted per job" — and
                  in a justified row a long one squeezes the name into a
                  five-line column. Stacking costs a line and never breaks. */}
              <h3 className="mt-6 font-display text-lg leading-tight font-bold text-fg">
                {item.title}
              </h3>
              <p className="mt-3 font-numeral text-md leading-none font-black tabular-nums text-accent-text">
                {item.price}
              </p>

              <p className="mt-4 max-w-[44ch] text-sm text-fg-muted">{item.blurb}</p>

              <p className={`${SPEC} mt-5 border-t-[length:var(--hairline)] border-rule pt-4 text-fg-faint`}>
                {item.spec}
              </p>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
