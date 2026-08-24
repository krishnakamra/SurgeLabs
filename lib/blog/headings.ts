import GithubSlugger from "github-slugger";
import type { TocEntry } from "@/components/blog/toc";

/**
 * Pulls the H2s and H3s out of an MDX body for the contents rail.
 *
 * The ids have to match what rehype-slug puts on the rendered headings or
 * every contents link is a dead anchor, so this uses github-slugger — the
 * same library rehype-slug uses, including its collision counter, which is
 * why the instance is created once per document rather than per heading.
 *
 * Fenced code is skipped: a `# comment` line inside a shell block is not a
 * section, and the reader clicking it would be sent nowhere.
 */
export function extractHeadings(body: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    // Strip the inline markup the heading text may carry, so the contents
    // read as words rather than as source.
    const text = match[2]!
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    entries.push({ id: slugger.slug(text), text, depth: match[1]!.length as 2 | 3 });
  }

  return entries;
}
