import Image from "next/image";
import Link from "next/link";
import { categoryStills, imageSrc } from "@/content/media";
import { categories, type Post } from "@/content/posts";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/** One post in a list. The whole card is the link target, so the hit area
 *  matches what the eye reads as clickable.
 *
 *  `image` is off by default. The card is used in three places and only one
 *  of them — the category listing — has room for a picture without the list
 *  turning into a scroll. */
export function PostCard({
  post,
  number,
  image = false,
}: {
  post: Post;
  number?: string;
  image?: boolean;
}) {
  const category = categories[post.category];
  const still = image ? categoryStills[post.category] : undefined;

  return (
    <article className="group relative border-t-[length:var(--hairline)] border-rule pt-6">
      {still ? (
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken">
          <Image
            src={imageSrc(still)}
            alt={still.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className={`${SPEC} flex items-center gap-3 text-fg-faint`}>
        {number ? (
          <>
            <span className="font-numeral text-[1.15em] font-extrabold tabular-nums text-accent-text">{number}</span>
            <span aria-hidden="true" className="text-rule-strong">
              /
            </span>
          </>
        ) : null}
        <span>{category.name}</span>
        <span aria-hidden="true" className="text-rule-strong">
          /
        </span>
        <span>{post.readingMinutes} min</span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-fg">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-fg-muted">{post.description}</p>

      <span
        aria-hidden="true"
        className="mt-5 block h-[var(--hairline)] w-8 bg-rule-strong transition-all duration-[var(--dur-snap)] ease-press group-hover:w-16 group-hover:bg-accent"
      />
    </article>
  );
}
