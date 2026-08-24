import Link from "next/link";
import { categories, type Post } from "@/content/posts";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/** One post in a list. The whole card is the link target, so the hit area
 *  matches what the eye reads as clickable. */
export function PostCard({ post, number }: { post: Post; number?: string }) {
  const category = categories[post.category];

  return (
    <article className="group relative border-t border-rule pt-6">
      <div className={`${SPEC} flex items-center gap-3 text-fg-faint`}>
        {number ? (
          <>
            <span className="text-accent-text">{number}</span>
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
        className="mt-5 block h-px w-8 bg-rule-strong transition-all duration-[var(--dur-snap)] ease-press group-hover:w-16 group-hover:bg-accent"
      />
    </article>
  );
}
