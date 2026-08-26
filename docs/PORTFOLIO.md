# Loading the website portfolio

This is the guide for whoever is putting the 25+ website projects onto the
site — most likely a second Claude Code or Claude Cowork session, working from
a list of URLs.

Everything it needs already exists. There is a typed content file, a component
that renders it, a script that takes the screenshots, and a check that fails
the build if an entry is broken. Nothing here requires design decisions.

---

## The short version

1. Add an entry per site to `content/portfolio.ts`.
2. Run `npm run shots` to screenshot the live sites.
3. Run `npm run check:portfolio`.
4. Commit.

The gallery appears automatically on `/work` and on `/web-design-seo`. Both
sections render **nothing** while the list is empty, so a half-finished load
never ships a grid of grey rectangles.

---

## The prompt to paste into the other session

Copy everything between the lines, paste your list of URLs where it says to,
and send it.

---

> You are working in the Surge Labs repository. Your job is to load the
> website portfolio.
>
> **Read `docs/PORTFOLIO.md` and `content/portfolio.ts` first.** The file has a
> validator that runs at import, so a malformed entry fails `next build` rather
> than rendering badly. Match the shape exactly.
>
> Here are the sites. For each one I have given you the URL and, where I know
> it, the business name and what we did on it:
>
> ```
> <PASTE YOUR LIST HERE — one per line, e.g.
> https://example-dental.ca | Example Dental | Mississauga | design and build
> https://example-hvac.com | Example HVAC | Brampton | rebuild, we did not do the logo
> https://example-cafe.ca | Example Café | Toronto | SEO only, site was already there>
> ```
>
> For each site:
>
> 1. **Open it and look at it.** Use WebFetch or the browser. You need the
>    sector, roughly what is on the site, and enough to write two honest
>    sentences. Do not invent features you cannot see.
> 2. **Write the entry** into `content/portfolio.ts`, appended to the
>    `portfolio` array. Every field is described in that file's comments.
> 3. **`role` is the field that matters.** It is published on the card, right
>    under the business name, and it says exactly what we did. If my note says
>    "SEO only", the role is "Local SEO and Core Web Vitals — site built
>    elsewhere", not "Design and build". If I have not told you and you cannot
>    tell, put `role: "TODO — ask Krishna what we did on this one"` and list it
>    at the end of your reply. Do not guess. A screenshot already implies we
>    built the whole thing; the role line is the only thing correcting that.
> 4. **`shot.src`** is `/portfolio/<slug>.jpg`. **`shot.width` is 2880 and
>    `shot.height` is 2160** — that is what the capture script produces. Do not
>    change those numbers unless you changed the script.
> 5. **`shot.alt`** describes what is on the page — "A dental clinic homepage
>    with a booking form above the fold and a row of staff photographs below
>    it." Not "Screenshot of Example Dental". The validator rejects an alt that
>    is just the business name.
>
> Then:
>
> ```bash
> npm i -D playwright && npx playwright install chromium   # first time only
> npm run shots            # screenshots every site that does not have one yet
> npm run check:portfolio  # asset check
> npm run typecheck && npm run lint && npm run build
> ```
>
> Fix anything the checks report and re-run until they are clean.
>
> Commit on the branch `claude/logo-brand-system-8b1c78` and push. In your
> reply, list: how many entries you added, any site that failed to screenshot
> and why, and every entry where you had to leave `role` as a TODO.
>
> Do not change any other file. Do not add a site I did not give you. Do not
> write marketing copy — the summary is two plain sentences about what the site
> does.

---

## The shape of an entry

```ts
{
  slug: "example-dental",
  name: "Example Dental",
  url: "https://example-dental.ca",
  sector: "Dental clinic",
  city: "Mississauga",
  year: 2025,

  // Published under the name. Say exactly what we did.
  role: "Design and build",

  summary:
    "A five-page site for a two-chair practice, built so the front desk can change hours and holiday closures without calling us.",

  built: [
    "Online booking form routed to the practice inbox",
    "A page per treatment, written for search",
    "Google Business Profile set up and verified",
  ],

  shot: {
    src: "/portfolio/example-dental.jpg",
    alt: "A dental clinic homepage with a booking form above the fold and a row of staff photographs below it.",
    width: 2880,
    height: 2160,
  },

  stack: ["Next.js", "Vercel"],
}
```

`motion` is optional and almost never worth it — see below.

### What the validator enforces

| Rule | Why |
| --- | --- |
| `slug` kebab-case and unique | It is the anchor in the URL |
| `url` starts with `https://` | A portfolio linking to `http://` looks abandoned |
| `role` present | The single most likely thing to be misleading on this page |
| `summary` ≥ 60 characters | Shorter than that says nothing |
| `built` 2–5 items | One is thin; six overflows the card |
| `shot.alt` ≥ 20 chars, and not just the business name | It is the only description a screen reader gets |
| `shot.width` / `shot.height` real numbers | The record of how the capture was framed, so a re-shoot matches |

---

## Taking the screenshots

```bash
npm i -D playwright
npx playwright install chromium
npm run shots
```

`npm run shots` walks `content/portfolio.ts` and captures anything that does
not already have a file. Useful flags:

```bash
npm run shots -- --force                     # re-capture everything
npm run shots -- --only=example-dental       # one entry
npm run shots -- --url=https://x.ca --slug=x # capture before writing the entry
npm run shots -- --motion                    # also record a scroll capture
```

Each capture is **1440 × 1080 at 2× — 2880 × 2160 — saved as JPEG**. That is
4:3 because the portfolio card reserves 4:3; capturing 16:9 and letting the
card crop it throws away the bottom third of every screenshot, which is
usually where the interesting part is.

The script scrolls the page down and back before shooting, because most sites
lazy-load their images and a screenshot taken without that has grey rectangles
where the photographs should be. It also forces `prefers-reduced-motion`, so
entrance animations have finished and no hero is caught mid-fade.

### If a capture looks wrong

- **A cookie banner across the middle.** Capture it manually with the banner
  dismissed and save the file to the same path.
- **The page is mostly a video that has not started.** Capture manually at a
  frame that represents it.
- **It times out.** Some sites never reach `networkidle` because of a chat
  widget polling. Capture that one manually.

Manual capture: Chrome DevTools → device toolbar → 1440 × 1080, DPR 2 → ⋮ →
Capture screenshot. Save as `public/portfolio/<slug>.jpg`.

### Scroll captures

`--motion` records a webm of the page scrolling and drops it in
`public/portfolio/motion/`. Rename it to the slug, then add:

```ts
motion: { src: "/portfolio/motion/example-dental.webm", poster: "/portfolio/example-dental.jpg", width: 1440, height: 1080 },
```

The still stays underneath as the fallback, and the video is hidden entirely
under `prefers-reduced-motion`. Be honest about whether it is worth it: a
webm is 10–40× the weight of the still, twenty-five of them on one page is a
slow page, and most site scrolls are not interesting to watch. Use it on two
or three of the best and leave the rest as stills.

---

## The rules that are not about code

These are in the comment block at the top of `content/portfolio.ts` as well,
because that is where someone adding an entry will actually be looking.

**Only sites we built.** Not sites we advised on, not a template we sold, not
work we admire. If a customer asked "did you make this", the answer has to be
yes.

**`role` says what we actually did.** A screenshot implies authorship all by
itself. "Local SEO and Core Web Vitals only — site built elsewhere" is a
perfectly good line to publish and it costs nothing; letting the screenshot
imply otherwise is the thing that costs something.

**Permission, in writing, before it goes up.** A live public website is not
consent to be used as a reference. One email saying "happy for you to show
this" is enough and it takes a day. Get it for all twenty-five before the page
ships, not after someone notices.

**Screenshots are of the live site.** Do not composite a mockup. If the site
has changed since launch, re-run the capture.

---

## Keeping it true later

`npm run check:portfolio` runs in `prebuild`, so a missing screenshot fails the
build. It does not check that the URLs are still live by default, because that
would make every build depend on twenty-five third-party servers.

Run the link check by hand every few months:

```bash
CHECK_PORTFOLIO_URLS=1 npm run check:portfolio
```

A portfolio quietly linking to a domain that lapsed two years ago is worse than
a shorter portfolio, and nobody notices, because nobody clicks their own links.

---

## Where it appears

| Page | What shows |
| --- | --- |
| `/work` | The full gallery, above the print and signage jobs |
| `/web-design-seo` | The nine most recent |

Both are `<PortfolioGrid>` in `components/portfolio/portfolio-grid.tsx`. Newest
year first, ties broken by name so the order is stable between builds.
