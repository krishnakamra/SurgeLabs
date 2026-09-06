# Deploying surgelabs.ca

The code is ready and `main` is pushed. What's left needs a Vercel login,
which is yours, not something this repo can hold. Fifteen minutes end to end.

---

## 1 · Import the repo (3 min)

1. Go to **vercel.com/new** and sign in with GitHub.
2. Pick **krishnakamra/SurgeLabs**.
3. **Production branch: `main`.** Vercel guesses the repo's default branch,
   and this repo's default is still one of the `claude/*` branches — change it
   in the import screen, or flip the default to `main` first under
   GitHub → Settings → General → Default branch.
4. Framework preset should already say **Next.js**. `vercel.json` sets the
   region to `cle1` (Cleveland — closest Vercel edge to the GTA).
5. **Do not deploy yet.** Add the environment variables below on the same
   screen, then deploy. Deploying first just means redeploying after.

---

## 2 · Environment variables

Add these under **Settings → Environment Variables**, scoped to Production
(and Preview, if you want the preview URLs to work properly).

### Required, or the quote form breaks

| Variable | Value | What breaks without it |
|---|---|---|
| `QUOTE_DATABASE_URL` | your Postgres connection string | **Every lead is lost.** The form returns an error rather than pretending to succeed — deliberate, but it means no one can reach you through the site. |
| `RESEND_API_KEY` | `re_...` from resend.com | No email lands. The lead is still saved to the database, so nothing is lost, but nobody is told about it. |

Storage runs *before* email on purpose: a lead survives an email outage. It
does not survive having no database.

**Getting a database, fastest path:** Vercel → Storage → Create → Postgres.
It sets `POSTGRES_URL` automatically and the code reads that as a fallback,
so you can skip `QUOTE_DATABASE_URL` entirely if you go this route.

### Required if you want email to actually send

| Variable | Value |
|---|---|
| `QUOTE_TO_EMAIL` | `hello@surgelabs.ca` |
| `QUOTE_FROM_EMAIL` | `Surge Labs <quotes@surgelabs.ca>` |

**Resend will not send from surgelabs.ca until you verify the domain** —
resend.com → Domains → Add → paste the DKIM/SPF records into your DNS.
Until that's done, sending fails even with a valid key. Do this first; DNS
takes a few minutes to propagate.

### Optional

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | your pixel id | Only if you're running the Meta ads. Read `/privacy` first — the policy describes a pixel, and firing one without the consent banner is a decision you're making, not a default. |

Do **not** set `QUOTE_LOG_FILE` in production. It writes leads to a file on
a serverless instance that gets thrown away.

---

## 3 · The domain (5 min + DNS wait)

Vercel → Settings → Domains → Add `surgelabs.ca`, then add `www.surgelabs.ca`
and let Vercel redirect it to the apex.

At your registrar:

    A      @      76.76.21.21
    CNAME  www    cname.vercel-dns.com

Vercel shows the exact records for your setup — use those if they differ.
SSL is automatic once DNS resolves.

---

## 4 · Check it worked

- **Submit the quote form yourself.** Use a real phone number. Confirm the row
  lands in the database and the email arrives. This is the only test that
  matters; everything else on the site is a static page.
- `/start` should return **noindex** — it's the paid-ad landing page and must
  not compete with the homepage in search.
- `/sitemap.xml` and `/robots.txt` should both load.
- Open it on your phone. That's how most of your traffic will arrive.

---

## Still outstanding before you point ads at it

None of these block the deploy, but each is a real gap:

- **`node scripts/fetch-media.mjs` has never been run.** 70 images and videos
  are still loading from Higgsfield's CDN instead of your own domain. The site
  works, but it's slower and it breaks the day that CDN changes. Run it from
  your machine, commit `public/media`, and set `MEDIA_PRESENT = true` in
  `content/media.ts` (the script does this for you).
- **Prices marked unconfirmed.** `content/packages.ts` flags which numbers you
  confirmed and which I set as drafts. Launch Kit and Momentum Kit are still
  quote-only because you never gave me a floor for them.
- **`/privacy` has not been read by a lawyer.** It's written from what the code
  actually does, which is more than most sites manage, but three decisions in
  it are marked in the source as yours to make.
- **No portfolio.** `content/portfolio.ts` is empty, so the gallery sections
  render nothing. See `docs/PORTFOLIO.md`.
