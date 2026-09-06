# Deploying surgelabs.ca on Netlify

The code is ready, `main` is pushed, and `netlify.toml` is in the repo. What's
left needs your Netlify login, which is yours and not something this repo can
hold. About fifteen minutes, most of it DNS propagation.

**Start here:** https://app.netlify.com/start — it prompts for login and goes
straight to the repo picker.

---

## 1 · Import the repo

1. **Add new site → Import an existing project → GitHub**, authorise Netlify
   if it asks, and pick **krishnakamra/SurgeLabs**.
2. **Branch to deploy: `main`.** Netlify offers the repo's default branch,
   and this repo's default is still one of the `claude/*` branches — change
   it here, or set `main` as the default first under GitHub → Settings →
   General.
3. Build command and publish directory are read from `netlify.toml`. Leave
   them as Netlify shows them; don't type over them.
4. **Add the environment variables below before the first deploy.** Netlify
   bakes `NEXT_PUBLIC_*` values in at build time, so a deploy that ran without
   them has to be redeployed, not just reconfigured.

---

## 2 · Environment variables

**Site configuration → Environment variables.**

### Required, or the quote form breaks

| Variable | Value | What breaks without it |
|---|---|---|
| `QUOTE_DATABASE_URL` | your Postgres connection string | **Every lead is lost.** The form returns an error rather than pretending to succeed — deliberate, but it means nobody can reach you through the site. |
| `RESEND_API_KEY` | `re_...` from resend.com | No email lands. The lead is still saved to the database, so nothing is lost, but nobody is told about it. |

Storage runs *before* email on purpose: a lead survives an email outage. It
does not survive having no database.

**Netlify does not bundle a database**, so unlike Vercel there is no free
`POSTGRES_URL` set for you — `QUOTE_DATABASE_URL` is genuinely required.
Fastest option is Neon (Netlify has a one-click extension for it under
Extensions → Neon) or Supabase. Any Postgres works; the code uses the plain
`postgres` driver, nothing vendor-specific.

### Required if you want email to actually send

| Variable | Value |
|---|---|
| `QUOTE_TO_EMAIL` | `hello@surgelabs.ca` |
| `QUOTE_FROM_EMAIL` | `Surge Labs <quotes@surgelabs.ca>` |

**Resend will not send from surgelabs.ca until you verify the domain** —
resend.com → Domains → Add → paste the DKIM and SPF records into your DNS.
Until that is done, sending fails even with a valid key. Do this first, since
DNS takes a few minutes either way.

### Optional

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | your pixel id | Only if you're running the Meta ads. Read `/privacy` first — the policy describes a pixel, and firing one without a consent banner is a decision you are making, not a default. `netlify.toml` already tells Netlify's secret scanner this one is meant to be public; without that the build fails. |

Do **not** set `QUOTE_LOG_FILE` in production. It writes leads to a file on a
serverless instance that is thrown away between requests.

---

## 3 · The domain

**Domain management → Add a domain →** `surgelabs.ca`.

Simplest path is to let Netlify run DNS: it gives you four nameservers, you
paste them at your registrar, and the apex, `www` and SSL all configure
themselves.

If you'd rather keep DNS where it is, at your registrar:

    A      @      75.2.60.5
    CNAME  www    <your-site-name>.netlify.app

Netlify shows the exact values for your site — use those if they differ from
these. SSL provisions automatically once DNS resolves; it can take up to an
hour.

---

## 4 · Check it worked

- **Submit the quote form yourself, with a real phone number.** Confirm the
  row lands in the database and the email arrives. This is the only test that
  matters — everything else on the site is a static page.
- `/start` must return **noindex**. It's the paid-ad landing page and must not
  compete with the homepage in search.
- `/sitemap.xml` and `/robots.txt` should both load.
- Open it on your phone. That is how most of your traffic will arrive.

---

## If the build fails

- **"Unknown option --experimental-strip-types"** → Node is too old. The
  prebuild checks need 22.6+. `netlify.toml` pins `NODE_VERSION = "22"`; check
  it wasn't overridden by a `NODE_VERSION` set in the Netlify UI, which wins.
- **"Secrets scanning found secrets in build output"** naming a
  `NEXT_PUBLIC_` variable → that value is public by design. Add its name to
  `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml`. Don't disable scanning wholesale.
- **A prebuild check fails** (`check:seo`, `check:routes`, `check:local`,
  `check:portfolio`, `check:env`) → that is the repo refusing to ship
  something broken, not a Netlify problem. The error names the page and the
  rule. These same checks pass locally on `npm run build`.

---

## 5 · Google Search Console

1. **Add the property** at search.google.com/search-console. Choose **Domain**,
   not URL prefix, so `surgelabs.ca`, `www.surgelabs.ca` and both protocols
   are covered by one property. Verify with the TXT record it gives you.
2. **Submit the sitemap**: Sitemaps → `sitemap.xml` → Submit.
3. **Request indexing on the money pages**, in this order — these are the ones
   with commercial intent behind them:

   ```
   https://surgelabs.ca/
   https://surgelabs.ca/packages
   https://surgelabs.ca/quote
   https://surgelabs.ca/web-design-seo
   https://surgelabs.ca/printing-signage
   https://surgelabs.ca/custom-apparel
   https://surgelabs.ca/business-cards/mississauga
   https://surgelabs.ca/web-design/mississauga
   https://surgelabs.ca/seo/mississauga
   https://surgelabs.ca/signage/mississauga
   ```

   There's a daily quota on manual requests, so spread the local and blog
   pages over the following days. The sitemap gets them crawled regardless;
   manual requests only hurry the ones that matter.
4. **Check Enhancements after a week.** The structured data was validated
   against the schema.org vocabulary at build time, so Breadcrumbs, FAQs,
   Products and Articles should report cleanly. Anything flagged there is
   worth reading — it sees things a validator can't.

Also connect **Bing Webmaster Tools**, which imports the Search Console
property in one click. Ten minutes, and Bing feeds Copilot and DuckDuckGo.

---

## Still outstanding before you point ads at it

None of these block the deploy. Each is a real gap.

- **`node scripts/fetch-media.mjs` has never been run.** 70 images and videos
  still load from Higgsfield's CDN instead of your own domain. The site works,
  but it is slower and it breaks the day that CDN changes. Run it from your
  machine, commit `public/media`, and the script sets `MEDIA_PRESENT = true`
  in `content/media.ts` for you.
- **`SAME_AS_TODO` in `lib/seo/schema.ts` is empty.** It should list your real
  Google Business Profile, Facebook, Instagram and LinkedIn URLs. Empty means
  Google has to guess which business this is. A `sameAs` pointing at a 404 is
  worse than none, so only add live ones.
- **The unit number is still missing from `content/site.ts`.** The postal code
  is in (L4W 5A6); 2800 Skymark Ave is multi-tenant and a wrong unit is worse
  than none. Copy it from the Google Business Profile character for character.
- **Four blog tables are still marked `draft`** in `content/blog-tables.ts`.
  They render a visible "indicative, not a quote" note to the reader until you
  flip the status, which is the honest default but not a good look forever.
- **The `VERIFY` block at the top of `content/services.ts`.** Every stock
  weight, print width, minimum and turnaround on the service pages is a claim
  about your equipment, and none of them were supplied by you.
- **Prices marked unconfirmed** in `content/packages.ts`. Launch Kit and
  Momentum Kit are still quote-only because no floor was ever set for them.
- **`/privacy` has not been read by a lawyer.** The page exists and is written
  from what the code actually does, which is more than most sites manage, but
  three decisions in it are marked in the source as yours to make — retention
  period, who a privacy request goes to, and whether the Meta Pixel fires
  without a consent banner. That last one is a PIPEDA question and a larger
  Law 25 question if you take Quebec clients.
- **No portfolio.** `content/portfolio.ts` is empty, so the gallery sections
  render nothing. The most visible gap on a site selling design work. See
  `docs/PORTFOLIO.md`.
