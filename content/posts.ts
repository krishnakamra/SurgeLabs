import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

/**
 * The blog's content layer.
 *
 * Posts are .mdx files with YAML frontmatter. Everything below runs at module
 * scope and throws on a malformed post, which means `next build` fails rather
 * than shipping an article with no description, a broken date or a category
 * that does not exist. Same rule as content/local-pages.ts: a content gate
 * only works if it is impossible to ignore.
 *
 * ⚠️  SERVER ONLY. This reads the filesystem. Importing it from a client
 *     component is a hard webpack failure, not a warning — the "server-only"
 *     import above is there to make that error say why.
 */

export const categories = {
  print: {
    slug: "print",
    name: "Print",
    blurb: "Stocks, sizes, finishes and the artwork rules that keep a job on schedule.",
  },
  signage: {
    slug: "signage",
    name: "Signage",
    blurb: "Vinyl, vehicles and trade show hardware — what lasts, what it costs, what to order.",
  },
  apparel: {
    slug: "apparel",
    name: "Apparel",
    blurb: "Screen printing, DTF and embroidery: picking the right process for the run.",
  },
  "web-seo": {
    slug: "web-seo",
    name: "Web & SEO",
    blurb: "What a site should cost, and how a local business gets found after it launches.",
  },
  industries: {
    slug: "industries",
    name: "By industry",
    blurb: "What each trade actually orders, what it costs, and the order to buy it in.",
  },
} as const;

export type CategorySlug = keyof typeof categories;
export type Category = (typeof categories)[CategorySlug];

export type PostMeta = {
  slug: string;
  /** The H1. Free to be a full sentence — headlines are not meta titles. */
  title: string;
  /**
   * The <title>, before " | Surge Labs" is appended. Kept separate because a
   * good headline and a good search-result title are different lengths: post
   * one's H1 is 66 characters, which Google would cut in half.
   */
  metaTitle: string;
  description: string;
  /** ISO date, first publication. */
  date: string;
  /** ISO date, last substantive edit. Equals `date` until something changes. */
  updated: string;
  author: string;
  authorRole: string;
  /** First entry is the primary term; the rest drive related-post matching. */
  keywords: string[];
  ogImage: string | null;
  category: CategorySlug;
  /** Whole minutes, rounded up, never zero. */
  readingMinutes: number;
  wordCount: number;
};

export type Post = PostMeta & { body: string };

const POSTS_DIR = join(process.cwd(), "content", "posts");

/**
 * Words, with the MDX taken out.
 *
 * Code fences, JSX tags, link targets and table pipes are not reading — a
 * naive split on whitespace counts `<SpecTable id="stocks" />` as three words
 * and puts several minutes on an article nobody spends them on.
 */
function countWords(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[|>#*_`~-]/g, " ");
  return prose.split(/\s+/).filter(Boolean).length;
}

/** 220 wpm. Slower than the usual 240 because these are reference articles
 *  people read with a job in front of them, not skim. */
const WORDS_PER_MINUTE = 220;

function validate(slug: string, data: Record<string, unknown>, body: string): Post {
  const errors: string[] = [];
  const str = (key: string): string => {
    const value = data[key];
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`${key} is missing or empty`);
      return "";
    }
    return value.trim();
  };
  const isoDate = (key: string): string => {
    const value = str(key);
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errors.push(`${key} must be YYYY-MM-DD, got "${value}"`);
    }
    if (value && Number.isNaN(Date.parse(value))) errors.push(`${key} is not a real date`);
    return value;
  };

  const title = str("title");
  const metaTitle = typeof data.metaTitle === "string" && data.metaTitle.trim()
    ? data.metaTitle.trim()
    : title;
  const description = str("description");
  const date = isoDate("date");
  const updated = isoDate("updated");
  const author = str("author");
  const authorRole = str("authorRole");
  const category = str("category");

  if (title.length > 75) errors.push(`title is ${title.length} chars; keep it under 75`);
  // 13 characters go to " | Surge Labs", and 60 is where Google truncates.
  if (metaTitle.length > 47) {
    errors.push(`metaTitle is ${metaTitle.length} chars; 47 is the most that fits with the suffix`);
  }
  if (description.length < 80 || description.length > 155) {
    errors.push(`description is ${description.length} chars; needs to be 80–155`);
  }
  if (category && !(category in categories)) {
    errors.push(`category "${category}" is not one of ${Object.keys(categories).join(", ")}`);
  }
  if (date && updated && Date.parse(updated) < Date.parse(date)) {
    errors.push(`updated (${updated}) is before date (${date})`);
  }

  const keywords = data.keywords;
  if (!Array.isArray(keywords) || keywords.length < 3) {
    errors.push("keywords must be an array of at least 3 terms");
  }

  const wordCount = countWords(body);
  // The brief for these is 900–1,400 words. Under 700 is a stub, and a stub
  // competing for a commercial term loses to the page that answers properly.
  if (wordCount < 700) errors.push(`only ${wordCount} words; these need 700 minimum`);

  if (errors.length > 0) {
    throw new Error(
      `content/posts/${slug}.mdx is not publishable:\n  - ${errors.join("\n  - ")}\n`,
    );
  }

  return {
    slug,
    title,
    metaTitle,
    description,
    date,
    updated,
    author,
    authorRole,
    category: category as CategorySlug,
    keywords: (keywords as string[]).map((k) => k.trim().toLowerCase()),
    ogImage: typeof data.ogImage === "string" && data.ogImage ? data.ogImage : null,
    readingMinutes: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
    wordCount,
    body,
  };
}

function load(): Post[] {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) throw new Error("content/posts holds no .mdx files");

  const loaded = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = readFileSync(join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return validate(slug, data, content);
  });

  // Newest first. Ties broken by slug so the order is stable across builds
  // rather than depending on what readdir happens to return.
  return loaded.sort((a, b) =>
    a.date === b.date ? a.slug.localeCompare(b.slug) : Date.parse(b.date) - Date.parse(a.date),
  );
}

export const posts: Post[] = load();

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function postsInCategory(slug: CategorySlug): Post[] {
  return posts.filter((p) => p.category === slug);
}

export function getCategory(slug: string): Category | undefined {
  return (categories as Record<string, Category>)[slug];
}

/**
 * Related posts, ranked by shared keywords.
 *
 * Same category is worth something but not much — "Print" covers both a price
 * guide and an artwork spec, and someone reading about bleed does not
 * necessarily want business card prices. A shared keyword is the stronger
 * signal, so it is weighted three times heavier.
 *
 * Posts with no relationship at all are dropped rather than used as padding.
 * Returning three items always is easy and it is what most blogs do; it also
 * means a reader finishing the trade show checklist gets pointed at DTF
 * transfers because the slot had to be filled. Two honest suggestions beat
 * three where the third is noise, and an empty list hides the section.
 */
export function relatedPosts(post: Post, limit = 3): Post[] {
  const mine = new Set(post.keywords);
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const shared = p.keywords.filter((k) => mine.has(k)).length;
      return { post: p, score: shared * 3 + (p.category === post.category ? 1 : 0) };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.post.date) - Date.parse(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post);
}

/** Every category that actually has posts in it. Empty ones are not routes. */
export function liveCategories(): Category[] {
  return Object.values(categories).filter((c) => postsInCategory(c.slug).length > 0);
}
