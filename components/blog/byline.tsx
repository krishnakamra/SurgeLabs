import type { Post } from "@/content/posts";

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/** Long form for people, ISO for machines — see the <time> elements. */
function readable(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Author, dates and reading time, set as a job-ticket spec line.
 *
 * The modified date only appears when the post has actually been revised.
 * Printing "Updated 12 January" on a page that has never changed since
 * publication is the kind of small lie that a reader checking two articles
 * side by side will catch, and it tells Google the same thing.
 */
export function Byline({ post }: { post: Post }) {
  const wasUpdated = post.updated !== post.date;

  return (
    <div className={`${SPEC} flex flex-wrap items-center gap-x-3 gap-y-2 text-fg-faint`}>
      <span className="text-fg-muted">
        {post.author}
        <span className="text-rule-strong"> — </span>
        {post.authorRole}
      </span>
      <span aria-hidden="true" className="text-rule-strong">
        /
      </span>
      <time dateTime={post.date}>{readable(post.date)}</time>
      {wasUpdated ? (
        <>
          <span aria-hidden="true" className="text-rule-strong">
            /
          </span>
          <span>
            Updated <time dateTime={post.updated}>{readable(post.updated)}</time>
          </span>
        </>
      ) : null}
      <span aria-hidden="true" className="text-rule-strong">
        /
      </span>
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}
