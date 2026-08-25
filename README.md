# Surge Labs

The website for Surge Labs — web, print, signage and custom apparel, Mississauga and the GTA.

Next.js 15 (App Router), TypeScript, Tailwind v4, GSAP + Lenis for motion, MDX for the blog. No CMS: content lives in typed modules under `content/`, and several of them refuse to build when the content is wrong.

```bash
npm install
cp .env.example .env.local     # then fill it in — see Environment below
npm run dev
```

---

## The build gates

Four checks run before every build (`npm run prebuild`). They exist because the failures they catch are all silent ones — a page that ranks for nothing, a lead that vanishes, a thin page that drags the domain down with it.

| Command | Fails when |
|---|---|
| `npm run check:local` | A city page is missing its copy, its FAQs, its image, or names a neighbourhood the prose never mentions |
| `npm run check:seo` | Any page's H1 or `<title>` does not contain its primary keyword, or a title/description is over length |
| `npm run check:env` | The code reads an environment variable that `.env.example` does not document |
| `npm run check:redirects` | A 301 does not resolve to a live page in one hop (needs a running server) |

Two more gates throw at import rather than in a script: `content/posts.ts` rejects a malformed or under-length blog post, and `content/blog-tables.ts` rejects a duplicate table id or a row that does not match its columns.

If a gate is in your way, the answer is almost always to fix the content, not the gate. They were each added after the thing they check went wrong.

---

## How to add a package

Packages drive `/packages`, the pricing schema, and the deep links into the quote form.

1. **Add the entry** to `packages` in `content/packages.ts`. Required: `slug`, `name`, `tagline`, `price`, `priceNote`, `bestFor`, `turnaround`, `ctaLabel`, `deliverables`, `addOns`. TypeScript will tell you if you miss one.
2. **Read the block at the top of that file first.** It splits prices the owner has confirmed from ones written as drafts. If your price is not confirmed, say so there — it is the only place anyone will look.
3. **Add a row** to `comparisonRows` in the same file for anything the matrix should compare. Real values only; the matrix has no "~" ratings by design.
4. **Add a flat lay** if you want one: generate it through the Higgsfield MCP and register it in `packageStills` in `content/media.ts`, keyed by the package slug. See *Regenerating a Higgsfield asset* below.
5. Nothing else. `/packages`, the `Product` + `AggregateOffer` schema, the comparison matrix, the mobile sticky bar and the `/quote?package=<slug>` deep link all read from the same array.

The horizontal panel section sizes itself from the array length — it stacks vertically below `lg` and on reduced motion, so a fifth package does not break the layout.

---

## How to add a city page

This is the one with teeth. `/[service]/[city]` can generate 160 URLs from 10 services × 16 cities, and generating them all as templated pages is textbook doorway spam — the kind Google penalises across a whole domain rather than page by page. So pages are an explicit allow-list, and the content requirements are enforced at build time.

1. **Add an entry** to `localPages` in `content/local-pages.ts`.
2. **Write the content.** The build will not pass without all of it:
   - `intro` — **250+ words written for that city.** Not the same paragraph with the name swapped.
   - `neighbourhoods` — real areas. **Every one you list must actually appear in the intro.** This is the strongest check in the file, and it is what stops the field being filled in to satisfy a count while the prose stays generic.
   - `delivery` — a real turnaround or delivery line for that city.
   - `faqs` — **three**, specific to that city.
   - `image` — a unique `src` and a descriptive `alt`.
3. **Generate the image**: `npm run gen:local-images`. These are designed plates, not photographs — genuinely unique per page, but a real photo of work in that city does a job no generated graphic can.
4. **Check it**: `npm run check:local`.

A city with nothing true to say about it does not get a page. It goes in `content/cities.ts` and appears on `/service-areas` as a place we deliver to and have not written about yet. That is an honest state and it costs nothing.

---

## How to add a blog post

1. **Create** `content/posts/<slug>.mdx`. The slug becomes the URL.
2. **Frontmatter** — all required except `ogImage`:

```yaml
---
title: "The H1. A full sentence is fine."
metaTitle: "The <title>, 47 chars max"   # 13 more go to " | Surge Labs"
description: "80–155 characters."
date: "2026-08-24"
updated: "2026-08-24"                     # equal to date until you revise it
author: "The Surge Labs shop floor"
authorRole: "Print production"
category: "print"                         # print | signage | apparel | web-seo
keywords:                                 # first is the primary; ≥3 total
  - "primary keyword"
  - "supporting term"
  - "supporting term"
ogImage: null                             # null generates one from the title
---
```

3. **Write it.** 900–1,400 words is the house length; under 700 fails the build.
4. **Never put a price or a spec in the prose.** Add it to `content/blog-tables.ts` and reference it as `<DataTable id="your-table" />`. One table, one place to correct it, every post that quotes it updated at once. Each table declares where its numbers come from — `standard`, `confirmed` or `draft` — and a `draft` table renders a visible note telling the reader the figure is indicative. That note is generated from the data, so a post cannot claim a number is firm when the content layer says it is not.
5. **Link out**: the matching service page, at least one city page, and `/packages`.
6. **The keyword gate applies.** Both the H1 and the meta title must contain `keywords[0]`, matched by subsequence — "Custom web design and SEO in Mississauga" satisfies "web design mississauga". Run `npm run check:seo`.

Adding a new category means adding it to `categories` in `content/posts.ts` **and** to `lib/seo/blog-seo.ts`, which throws if copy is missing. Reading time, the table of contents, related posts, the `Article` schema and the sitemap entry are all derived — there is nothing else to update.

---

## Regenerating a Higgsfield asset

Every generated still and loop is recorded in `content/media.ts` with the `jobId`, the `model`, and the exact `prompt` that produced it. That is the point: any asset can be reproduced or varied without reconstructing what was asked for.

**To fetch what already exists:**

```bash
node scripts/fetch-media.mjs              # everything
node scripts/fetch-media.mjs --videos     # loops and reels only
node scripts/fetch-media.mjs --force      # re-encode what is already there
MEDIA_BASE=http://127.0.0.1:8899 node scripts/fetch-media.mjs   # from a mirror
```

It downloads each asset, encodes an MP4 and a WebM, extracts the poster from frame 1 of the encoded file at matching dimensions, and flips `MEDIA_PRESENT` in `content/media.ts` to `true` on a clean full run. Until that runs, components keep their placeholders and nothing points at a 404. Needs `ffmpeg` and `ffprobe` on PATH.

**To regenerate one:**

1. Take the `model` and `prompt` from its entry in `content/media.ts`.
2. Submit through the Higgsfield MCP — `generate_image_batch` or `generate_video_batch`, then `jobs_wait`.
3. Replace the `jobId` and the URL stamp on that entry.
4. `node scripts/fetch-media.mjs --force`.

**Two things worth knowing before you regenerate a loop.** Every one was made with the *same keyframe in both `start_image` and `end_image`* — that is what makes it seamless, because the last frame is the first frame and the browser's loop has nothing to cut across. Regenerate with only a start frame and it will still play, but it will jump. And the poster is frame 1 of the encoded file, so it matches the first painted frame exactly and there is no flash when playback starts.

The hero press sheet is different — it is generated locally, not through Higgsfield:

```bash
node scripts/generate-hero-image.mjs      # writes both trims
```

Two trims, landscape and portrait, art-directed with `<picture>`. Cropping the landscape sheet into a phone-shaped box threw away 72% of the bytes, and Chrome scores an LCP image by the part that survives the crop.

The logo is not generated this way and never should be — it is drawn geometry, not a prompt. See *The logo* below.

---

## The logo

One geometry, in **`lib/brand/mark.ts`**. Everything else is cut from it.

```bash
npm run gen:brand
```

That rewrites the handoff SVGs in `public/brand/`, the favicon set in `app/`
(`favicon.ico`, `icon.svg`, `apple-icon.png`) and the PWA icons the manifest
points at. Change a number in `mark.ts` and re-run; **do not hand-edit a
generated file**, or the favicon and the letterhead become different logos.

The running site does not load any of those files. It renders
`components/brand/logo.tsx`, which inlines the same path so it can take
`currentColor` from whatever `[data-surface]` section it lands in — the ink
version and the stock version are the same call with no variant to choose.
Three lockups: `horizontal` (default, the masthead), `stacked` (footer, OG
card), `mark` (favicon, masthead under 480px, loading state).

**`/brand` is the spec page** — every variant on both surfaces at real sizes,
clear space, minimum sizes and misuse, all rendered by the component itself so
the page cannot drift from the site. `noindex`, and it is the thing to send a
client who asks for brand guidelines.

**⚠️ The wordmark is a placeholder.** Until the client supplies drawn artwork,
"SURGE LABS" is live type in the display face, tuned in
`lib/brand/wordmark.ts` — positive tracking where the rest of the site runs
negative, and a pinned optical size where the rest of the site leaves it
automatic. The four-step swap for real artwork is commented above the
`Wordmark` function in `components/brand/logo.tsx`. Until then the two lockup
SVGs in the handoff pack carry `<text>` rather than outlines and are not safe
to send to a printer; the mark files have no type in them and are.

The rasteriser, PNG encoder and ICO container behind the favicon set are in
`scripts/lib/raster.mjs` — about 150 lines and no dependency, because the mark
is one closed polygon of straight edges and that is the one case where writing
it is smaller than installing `sharp`.

---

## Environment

`.env.example` documents every variable, and `npm run check:env` fails the build if the code reads one that is not in there. The short version:

| Variable | Needed for |
|---|---|
| `QUOTE_DATABASE_URL` (or `POSTGRES_URL` / `DATABASE_URL`) | Storing quote submissions. **Set one.** With none set the form fails loudly rather than dropping leads |
| `QUOTE_LOG_FILE` | Local alternative: append-only JSONL instead of a database |
| `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL` | Sending the quote email. The sending domain must be verified in Resend first |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel. Optional — a default is compiled in. Set it empty to switch tracking off |
| `MEDIA_BASE` | Pointing `fetch-media.mjs` at a mirror |

Storage runs **before** email, deliberately, so a lead survives an email outage. `lib/quote/` documents the four failure combinations and what the visitor is told in each.

---

## Deploying

Headers, redirects and image config all live in `next.config.ts` rather than `vercel.json` — Vercel honours the Next config, and splitting them across two files is how they drift apart. `vercel.json` carries only what is genuinely Vercel's.

Security headers are applied to every route: HSTS, a host-restricted CSP, `nosniff`, `X-Frame-Options: DENY`, a referrer policy and a `Permissions-Policy` that denies every sensor the site does not use. `poweredByHeader` is off.

The CSP allows `'unsafe-inline'` for scripts, deliberately. Removing it needs a per-request nonce from middleware, which makes every page dynamic and throws away the static generation. This site renders no user-supplied HTML anywhere, so the XSS surface is close to empty; what the policy actually buys is the host allowlist, which is the threat a marketing site has.

**Before the first deploy:**

```bash
npm run build                    # runs all four gates
npm run check:redirects          # against a running server
node scripts/fetch-media.mjs     # if the footage should be live
```

`DEPLOY.md` has the domain, DNS and Search Console steps.
