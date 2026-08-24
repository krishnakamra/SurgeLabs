# Deploying Surge Labs

Everything in this file is a step someone with the accounts has to take. It is written so it can be followed once, in order, without decisions.

> **These steps were not performed by the build.** The session that produced this repo had no Vercel or Google credentials, and this network's egress policy blocks `vercel.com`, `api.vercel.com` and `google.com` outright. Deploying to a production domain and submitting a property to Search Console are also account-level actions that should be taken by whoever owns those accounts. What follows is the exact sequence, and `npm run verify:live` checks the result.

---

## 1. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel link          # create or link the project
vercel --prod
```

Or import the Git repository at **vercel.com/new** and let it deploy on push. The framework preset is detected from `vercel.json` (`"framework": "nextjs"`); no build or output settings need changing.

**Set the environment variables before the first production build**, in Project → Settings → Environment Variables. `.env.example` documents all of them and `npm run check:env` fails the build if the code reads one that is not documented.

Minimum for a working production site:

| Variable | Value |
|---|---|
| `QUOTE_DATABASE_URL` | Postgres connection string (or use Vercel Postgres, which sets `POSTGRES_URL` for you) |
| `RESEND_API_KEY` | From resend.com, after the sending domain is verified |
| `QUOTE_FROM_EMAIL` | `Surge Labs <quotes@surgelabs.ca>` |
| `QUOTE_TO_EMAIL` | `hello@surgelabs.ca` |

`NEXT_PUBLIC_META_PIXEL_ID` is optional — a default is compiled in. Set it empty to switch tracking off.

Run `db/schema.sql` against the database once before the first submission. Without a database the quote form fails loudly rather than dropping a lead, which is the intended behaviour but not the one you want in production.

`regions` is set to `cle1` (Cleveland) in `vercel.json` — the closest Vercel region to Toronto. It only affects `/quote` and `/og`, which are the two routes that run server-side; the other 52 pages are static and served from the edge everywhere.

---

## 2. Connect surgelabs.ca

In Project → Settings → Domains, add **both**:

- `surgelabs.ca`
- `www.surgelabs.ca`

Set **`surgelabs.ca` as the primary domain.** Vercel then redirects www to it automatically. The repo does not rely on that — `next.config.ts` carries its own www→apex 301 — but having both agree is correct, and the Vercel setting is what fixes the certificate and the canonical host.

At the DNS provider:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Confirm those two values against what the Vercel dashboard shows you — they are Vercel's published defaults and they do occasionally change. The dashboard is authoritative.

Then wait for DNS to propagate and the certificate to issue. Both usually complete within minutes; DNS can take up to 48 hours depending on the previous TTL.

---

## 3. Verify

```bash
npm run verify:live -- https://surgelabs.ca
```

Checks the apex serves 200, www 301s to the apex **and keeps the path**, all six security headers are present and survived the CDN, `x-powered-by` is gone, robots and sitemap are served and point at the canonical host, all three legacy 301s resolve in one hop, and every one of the 45 sitemap URLs returns 200.

The www→apex rule cannot be checked from Node — `Host` is a forbidden header in the fetch spec — so verify it directly:

```bash
curl -sI https://www.surgelabs.ca/packages | grep -iE "^HTTP|^location"
# expect: 301, and location: https://surgelabs.ca/packages
```

Two things to check by eye, because no script can:

- **HTTPS on both hosts** before submitting to the HSTS preload list. The header is already set with `preload`, but submitting at `hstspreload.org` is hard to undo — do it only once you are certain every subdomain will serve HTTPS forever.
- **The Meta Pixel fires.** Install Meta's Pixel Helper extension and load the site. It should report one PageView per page, including after clicking through to another page without a reload — that client-side case is the one the stock snippet gets wrong and this build fixes.

---

## 4. Google Search Console

1. **Add the property** at search.google.com/search-console. Choose **Domain** (not URL prefix) so `surgelabs.ca`, `www.surgelabs.ca` and both protocols are covered by one property. Verify with the TXT record it gives you.
2. **Submit the sitemap**: Sitemaps → enter `sitemap.xml` → Submit. It should report 45 discovered URLs. If it reports fewer, `npm run verify:live` will have told you which URL is failing.
3. **Request indexing on the money pages.** URL Inspection → paste the URL → Request Indexing. Do these first, in this order — they are the pages with commercial intent behind them:

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

   There is a daily quota on manual requests, so spread the remaining local and blog pages over the following days. The sitemap will get them crawled regardless; manual requests only hurry the ones that matter.

4. **Check the Enhancements reports after a week.** The structured data was validated against the schema.org vocabulary at build time — every `@type` is real, every property is valid for its type, and no `@id` reference dangles — so Search Console should report Breadcrumbs, FAQs, Products and Articles cleanly. Anything it flags there is worth reading; it sees things a validator cannot.

Also connect **Bing Webmaster Tools**, which can import the Search Console property in one click. It is ten minutes and Bing feeds Copilot and DuckDuckGo.

---

## Before you call it live

Things the build could not do and a person still has to:

- [ ] Run `node scripts/fetch-media.mjs` so the generated footage is actually in `public/media`. Until then the site shows its printed-plate placeholders — which look finished, so this is easy to forget.
- [ ] Fill in `SAME_AS_TODO` in `lib/seo/schema.ts` with the real Google Business Profile, Facebook, Instagram and LinkedIn URLs. Empty means Google has to guess which business this is.
- [ ] Add the postal code and unit number to `content/site.ts`. Both were left blank rather than guessed — 2800 Skymark Ave is multi-tenant and a wrong unit is worse than none. They must match the Google Business Profile character for character.
- [ ] Replace the geo coordinates in `lib/seo/schema.ts` with the exact pin from the Business Profile. They currently point at Mississauga city centre.
- [ ] Correct every table still marked `draft` in `content/blog-tables.ts`. Those render a visible "indicative, not a quote" note to the reader until the status is flipped.
- [ ] Read the `VERIFY` block at the top of `content/services.ts`. Every stock weight, print width, minimum and turnaround on the service pages is a claim about your equipment, and none of them were supplied.
- [ ] Decide about a privacy policy and cookie consent. The Meta Pixel sends visitor data to Meta on every page view, and there is currently no privacy policy and no consent gate. Under PIPEDA that is a gap; under Quebec's Law 25 it is a larger one if you take clients there.
