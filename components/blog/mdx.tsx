import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { DataTable } from "./data-table";

/**
 * How MDX renders inside an article.
 *
 * There is no typography plugin here. The design system already fixes the
 * scale, the rules and the surfaces; a prose plugin would bring a second
 * opinion about all three and they would fight. So each element is mapped
 * once, explicitly, against the tokens.
 *
 * Headings get no generated anchor links — rehype-slug puts the id on, the
 * contents rail links to it, and a row of ¶ marks down the left of every
 * heading is clutter in a design language this spare.
 */

function Anchor({ href = "", children }: { href?: string; children?: React.ReactNode }) {
  const external = /^https?:\/\//.test(href);
  const className =
    "underline decoration-rule underline-offset-4 transition-colors hover:text-fg hover:decoration-mark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

  if (external) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      {...props}
      className="mt-16 scroll-mt-28 font-display text-2xl font-extrabold text-fg first:mt-0"
    />
  ),
  h3: (props) => (
    <h3 {...props} className="mt-10 scroll-mt-28 font-display text-lg font-bold text-fg" />
  ),
  p: (props) => <p {...props} className="mt-6 text-md leading-relaxed text-fg-muted" />,
  ul: (props) => <ul {...props} className="mt-6 space-y-3" />,
  ol: (props) => <ol {...props} className="mt-6 list-decimal space-y-3 pl-5" />,
  li: (props) => (
    <li
      {...props}
      className="text-md leading-relaxed text-fg-muted marker:text-mark [ul>&]:relative [ul>&]:pl-6 [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:top-[0.7em] [ul>&]:before:h-px [ul>&]:before:w-3 [ul>&]:before:bg-mark"
    />
  ),
  strong: (props) => <strong {...props} className="font-semibold text-fg" />,
  a: Anchor,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="mt-8 border-l-2 border-mark pl-6 font-display text-lg font-bold text-fg"
    />
  ),
  hr: () => <hr className="mt-12 border-0 border-t border-rule" />,
  code: (props) => (
    <code
      {...props}
      className="rounded-[2px] bg-surface-sunken px-1.5 py-0.5 font-utility text-sm text-fg"
    />
  ),
  // Tables written as markdown, for the small ones that do not need an entry
  // in the data layer. Anything carrying a price uses <DataTable> instead.
  table: (props) => (
    <div className="my-10 overflow-x-auto border border-rule">
      <table {...props} className="w-full border-collapse text-left text-sm" />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border-b border-rule px-5 py-3 font-utility text-2xs uppercase tracking-utility text-fg-faint"
    />
  ),
  td: (props) => <td {...props} className="border-b border-rule px-5 py-3 align-top text-fg-muted" />,
  DataTable,
};
