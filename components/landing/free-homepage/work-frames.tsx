import Image from "next/image";
import { freeHomepage } from "@/content/free-homepage";

/**
 * Six live sites, each in a laptop with its phone leaning on it.
 *
 * The screenshots are real — captured from the live sites by
 * scripts/capture-work.mjs, which is in the repo so they can be refreshed
 * when a client redesigns. They are PNGs on disk and AVIF or WebP by the time
 * a visitor gets them: next/image converts and resizes at the edge, and
 * `formats` in next.config.ts puts AVIF first.
 *
 * Everything below the first two is lazy. `loading="lazy"` is next/image's
 * default and is left alone deliberately — this section is well below the
 * fold, and twelve eager images would be twelve requests competing with the
 * headline for the first second of the page.
 *
 * The frames are CSS. A device mockup is a rounded rectangle with a bezel,
 * and shipping a mockup library to draw one would cost more than the images.
 */
export function WorkFrames() {
  return (
    <ul className="grid grid-cols-1 gap-x-gutter gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {freeHomepage.work.map((item, index) => (
        <li key={item.slug}>
          <div className="relative">
            {/* Laptop. 16:10, which is the viewport the shot was taken at. */}
            <div className="overflow-hidden rounded-[10px] border-[3px] border-fg bg-fg">
              <div className="flex h-[18px] items-center gap-1.5 px-2.5">
                {["#ff5f57", "#febc2e", "#28c840"].map((dot) => (
                  <span key={dot} className="h-[5px] w-[5px] rounded-full" style={{ background: dot }} />
                ))}
              </div>
              <div className="relative aspect-[1440/900] w-full bg-white">
                <Image
                  src={`/work/sites/${item.slug}-desktop.png`}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover object-top"
                  // The first two are the ones a visitor can reach quickly on
                  // a wide screen; the rest stay lazy.
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
            </div>

            {/* The phone hangs off the bottom-RIGHT corner, and that is not a
                taste call. On the left it sat over the laptop's hero copy —
                "WATER STOPS HERE." and "A spotless space, without lifting a
                finger" were both half covered, which is the one part of a
                screenshot worth showing. Every one of these sites sets its
                headline left and its photography right, so the right corner
                is the only place a second frame can sit without hiding the
                first. */}
            <div className="absolute -right-2 -bottom-8 w-[64px] overflow-hidden rounded-[10px] border-[3px] border-fg bg-fg sm:-right-3 sm:w-[80px] sm:rounded-[12px]">
              <div className="relative aspect-[390/844] w-full bg-white">
                <Image
                  src={`/work/sites/${item.slug}-mobile.png`}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <p className="font-utility text-2xs font-medium uppercase tracking-[0.14em] text-accent-text">
              {item.industry}
            </p>
            <p className="mt-2 font-display text-base font-bold text-fg">{item.domain}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Four of the same live sites, as phones, in the hero.
 *
 * The hero's left column used to end at the subhead and leave half a screen
 * of empty ink beside a tall form. That space now carries the strongest thing
 * this page has — real work — at the moment a visitor is deciding whether
 * the offer is worth five fields. Phones rather than laptops because the page
 * is selling mobile-first, and the problem it names is a site that breaks on
 * a phone.
 *
 * Desktop only (`lg`). On a phone the brief puts the form directly under the
 * subhead, and anything inserted between them is a scroll between the
 * promise and the first field. The same sites appear in full under "Real
 * work" further down.
 *
 * `loading="lazy"` throughout. On a desktop these are in the first viewport
 * and lazy images in the viewport load immediately; below `lg` the strip is
 * display:none and lazy images with no layout are never fetched at all —
 * which is the whole reason they are not marked eager.
 */
const HERO_PHONES = ["solvexconstruction", "areterenovation", "ccscleanings", "axellottetech"];

export function HeroPhones() {
  const items = HERO_PHONES.map((slug) => freeHomepage.work.find((w) => w.slug === slug)!);
  // A shallow stagger, so the row reads as a set rather than a table.
  const lift = ["lg:translate-y-0", "lg:-translate-y-4", "lg:translate-y-2", "lg:-translate-y-2"];

  return (
    <figure className="hidden lg:block">
      <ul className="flex items-end gap-4">
        {items.map((item, i) => (
          <li
            key={item.slug}
            className={`w-[104px] shrink-0 overflow-hidden rounded-[14px] border-[3px] border-fg-faint/40 bg-fg ${lift[i]}`}
          >
            <div className="relative aspect-[390/844] w-full bg-white">
              <Image
                src={`/work/sites/${item.slug}-mobile.png`}
                alt={`The ${item.domain} homepage on a phone`}
                fill
                sizes="104px"
                className="object-cover object-top"
                loading="lazy"
              />
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-5 font-utility text-2xs uppercase tracking-utility text-fg-faint">
        Homepages we designed · live now
      </figcaption>
    </figure>
  );
}
