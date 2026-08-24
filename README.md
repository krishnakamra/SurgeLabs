# Surge Labs

Next.js 15 · TypeScript · Tailwind v4 · GSAP + Lenis · Vercel

## Press Room — the design system

The visual language comes from the print shop floor: CMYK process inks, crop
marks, registration targets, halftone screens, job tickets. Nothing here is
"tech startup" furniture.

Run `npm run dev` and open **`/styleguide`** — every token, the type scale,
each component and a computed contrast audit.

### Two surfaces, one set of classes

Sections alternate between the press bed and the sheet:

```tsx
<SectionFrame surface="ink"   ticket={{ number: "03", label: "SERVICES", spec: "4C PROCESS" }}>
<SectionFrame surface="stock" ticket={{ number: "04", label: "PACKAGES" }}>
```

`data-surface` re-declares the semantic `--color-*` tokens on that element, so
`bg-surface`, `text-fg`, `border-rule`, `text-mark` and `--reg-blend` are all
correct on either bed. Surfaces nest in both directions.

**There is no `dark:` variant in this codebase, and there must never be one.**

### Invariants

Break these and the system stops holding together:

1. **No second class set.** If something needs a `dark:` variant, the token is
   missing — add it to both `[data-surface]` blocks instead.
2. **No global section-padding rule.** Vertical rhythm is the `padding` prop on
   `SectionFrame`, resolved to one utility class. Do not add `.section` /
   `.cta` rules to `globals.css`; that is how cancelling specificity starts.
3. **Tokens are declared in `@theme static`.** Without `static`, Tailwind emits
   only the variables a generated utility references, and tokens read from
   inline styles or JS resolve to nothing.
4. **The palette is closed.** `--color-*: initial` clears Tailwind's stock
   theme, so off-system colours have no utility class. Same for `--text-*`,
   `--font-*` and `--radius-*`.
5. **Radius is 0 everywhere except buttons (2px).**
6. **Yellow never runs on paper.** It reads at 1.03:1 on `--stock`, so the
   functional `--color-mark` role hands off to magenta there. Yellow survives
   on stock only in the decorative registration layer, where a faint Y plate is
   authentic.
7. **Reduced motion is not a degraded mode.** The resolved state is the SSR
   output. Animation only delays arrival at something the page already renders
   correctly.

### Registration — the signature element

`RegistrationText` sets the same word five times: one solid layer that carries
the real text, plus four `aria-hidden` plates in C, M, Y and K. State lives in
CSS, driven by `data-reg` on the root:

| `data-reg`  | Behaviour                                              |
| ----------- | ------------------------------------------------------ |
| *(absent)*  | Registered. Solid text, plates hidden. **SSR output.** |
| `"armed"`   | Off-register, CSS-transitioned. Toggle to animate.     |
| `"scrub"`   | Off-register, transitions off — GSAP owns transforms.  |

Only `transform` and `opacity` ever change. Scroll wiring targets
`[data-registration-plate]`.

### Layout

12-column grid, 1440 max (`max-w-page`), 24px gutter → 40px at ≥1024px
(`px-gutter`). The job-ticket rail is fixed at the left edge from 1200px
(`rail:` variant, `--rail-w`); `body` pays for it with `padding-left` so
full-bleed sections start after it.

Section ids must not start with a digit — `id="sec-03"`, not `id="03"` —
or `querySelector('#03')` throws.

## Motion

GSAP ScrollTrigger + Lenis. Open **`/styleguide/motion`** for live primitives.

`MotionProvider` (mounted once in the root layout) owns the scroll loop: Lenis
is driven by GSAP's ticker with `lagSmoothing(0)`, so smooth scroll and every
ScrollTrigger read the same clock. Two rAF loops fighting each other is what
makes scrubbed animation jitter. It also refreshes ScrollTrigger on font load
and on debounced resize, and sleeps the ticker, disables every trigger and
pauses video when the tab is hidden.

### The one place motion preference is checked

`useMotion` — nothing else in the codebase calls `matchMedia` for it.
Primitives supply `animate` and, only when the finished state isn't already
what the server rendered, `settle`; the hook picks which runs. You cannot
write a primitive that forgets to check, because checking isn't yours to do.
Everything lands in a `gsap.context()`, so a route change, a dependency
change, or the user flipping the OS setting mid-session reverts it cleanly.

```tsx
useMotion({
  scope: ref,
  animate({ gsap, ScrollTrigger, scope, cleanup }) { /* … */ },
  settle({ gsap, scope }) { /* instant final state */ },
});
```

### Primitives

| Component             | What moves                                                  |
| --------------------- | ----------------------------------------------------------- |
| `RegistrationReveal`  | `--reg-p` 1→0 on scrub — CMYK plates converging into register |
| `PlateWipe`           | `--plate-dot` 0→max→0 across a section boundary              |
| `StockFlip`           | `clip-path` sheet entering from the bottom, 1px magenta edge  |
| `CounterRoll`         | Digit wheels, `yPercent` per wheel                           |
| `MagneticCTA`         | `quickTo` x/y, fine pointer only                             |
| `MarqueeSpec`         | `xPercent` -50 on a doubled track, eases to 0 on hover        |

### Rules these enforce

1. **Nothing above the fold is hidden by JS on first paint.** A synchronous
   script in `<body>` sets `html[data-motion="ready"]` before the first frame,
   and every pre-reveal style is gated on it. So a hero can ship
   `data-reg="scrub"` in its SSR HTML and be off-register from the very first
   painted frame — or, with no JS or reduced motion, the gate never opens and
   the solid headline the server sent simply stands. The real words are in the
   markup either way. `StockFlip` and `CounterRoll` additionally measure their
   own position and refuse to arm if they're already on screen.
2. **No animation causes CLS.** Only `transform`, `opacity`, `clip-path` and
   custom properties inside gradients are animated. `CounterRoll` reserves
   `Nch` in the monospace face and zero-pads to the final width, so the box is
   identical for every intermediate value. Measured 0 in both modes.
3. **Never declare `scroll-behavior: smooth`.** Lenis *is* the smooth scroll
   while mounted, and the two animating the same scroll position fight on
   every anchor jump — worse, scroll-restoration code reads the computed value
   and writes it back as an *inline* style on `<html>`, which no rule can then
   override.
4. **Rotated screen layers size by container-query units**, not `inset: -50%`.
   A square of side `max(200cqw, 200cqh)` covers the container's rotated
   bounding box at any angle and aspect ratio; a fixed inset shows cut corners
   on a wide, short band at 75°.

## Content layer

Typed data in `/content`, no CMS. Pages generate statically from it.

Three files carry owner instructions at the top and **must be reviewed before
launch** — read the comment, don't just edit the values:

| File | What needs doing |
| ---- | ---------------- |
| `site.ts` | NAP must match the Google Business Profile character for character. `streetAddress` is empty — fill it or keep it a service-area business. |
| `packages.ts` | **Every price is a placeholder.** Nothing else hardcodes a price. |
| `stats.ts` | Numbers are true by construction and checkable. Do not add review counts. |
| `testimonials.ts` | Empty by design. The section does not render while it is. Real, attributed reviews only. |

## Homepage

Section order and the components behind each:

| # | Section | Notes |
| - | ------- | ----- |
| 01 | Hero | `RegistrationReveal trigger="load"` — already on screen, so nothing to scrub against |
| 02 | The split | `SplitPress` — five suppliers as five badly-registered plates, coming into register one at a time over a 90vh hold |
| 03 | Services | Three `PinnedPanel`s, 60vh hold each |
| 04 | Proof | `CounterRoll` press wheels |
| 05 | Packages | From `content/packages.ts` |
| 06 | Industries | Mono list; the detail line is always visible, hover only raises contrast |
| 07 | Testimonials | Renders nothing while the array is empty |
| 08 | CTA + footer | NAP, hours, every service and city route |

Footer service and city links point at routes that do not exist yet — they
come in a later pass and are generated from the content layer, so they light
up on their own.

### Two traps worth knowing about

**GSAP `yPercent` on top of an SSR inline transform doubles it.** `CounterRoll`
ships each wheel with an inline `translateY(-N%)` so the server renders the
final number. GSAP parses that off the computed matrix into a px `y` cache and
then applies `yPercent` *in addition*, so a counter for 3 reads 6. Always pass
`y: 0` alongside `yPercent` when an element already carries a transform.

**Scrub an effect against the distance the reader actually spends on it.** The
split originally scrubbed against its section height and had fully resolved a
third of the way in — the animation carrying the argument was over before
anyone had read it. It now runs across a sticky hold, so the misregistration
is on screen for as long as it takes to scroll past.

## /packages

The conversion page. Four one-time packages, three monthly plans, a real
comparison matrix and a single-item rate card.

**Desktop:** the four packages run sideways while the page scrolls down —
`HorizontalPanels`, held with `position: sticky` and a height the stylesheet
works out from the panel count (`100svh + count × panelWidth − 100vw`).
Nothing is measured in JS to lay it out; GSAP only sets a transform on the
track. Verified: the track travels exactly `trackWidth − viewportWidth`.

**Everywhere else:** the same panels are an ordinary stack of cards. The
horizontal layout is gated on the `motion-ready` variant *and* the `lg`
breakpoint, so a phone, a reader with reduced motion and anyone with JS off
all get a page they can operate. Nobody meets a sideways price list they
cannot scroll.

`@custom-variant motion-ready (html[data-motion="ready"] &)` is what makes
that decision in CSS, before first paint, with no second render.

### Structured data

Each package and plan is a `Product` carrying a single `Offer` — the shape
that actually earns a price in the result, since a fixed-price package has
one offer, not a range. One `AggregateOffer` sits on the `OfferCatalog` and
describes the real span of the list ($899–$6,999), which is what an
AggregateOffer is for. All CAD, `InStock`, with `areaServed` from
`content/cities.ts`.

### Two things that bit, both narrow-viewport

- A flex or grid child defaults to `min-width: auto`, so a single long word
  set at display size ("Storefront" at 60px) widens its whole panel past a
  phone viewport. `min-w-0` plus a smaller heading below `sm` fixes it.
- A **fixed** element still books CLS if its own box changes. The mobile
  package bar is bottom-anchored, so when its CTA mounted the bar grew and
  its top edge moved. It now has a fixed height, and CLS is back to 0.

## Service pages

`/web-design-seo`, `/printing-signage`, `/custom-apparel` — three thin route
files over one `ServicePage` component, all content from
`content/services.ts`.

Each carries a unique H1 with a location modifier, 700–800 words of body
prose, the full orderable catalogue, a production-spec table, the four-step
process, 7–8 FAQs, and links to every city page and to `/packages`.
Structured data per page: `Service` with `areaServed` and an offer catalogue,
`FAQPage`, and `BreadcrumbList`.

**The specificity is the point, and it is also a liability.** Naming a 13oz
scrim banner, a 54-inch max width and a 24-piece screen-print minimum is what
lets these pages rank against shops that have been here twenty years. But
those are claims about equipment and process, none of which were supplied —
they are written to industry standards and flagged in a block at the top of
`content/services.ts`. The FAQ answers in particular are published to Google
as answers, so a turnaround quoted there is one the business is standing
behind in the results page before anyone clicks. Read that block as a
checklist.

### CLS and `<details>`

Expanding an FAQ pushes the ones below it down, which looks like a 0.04 CLS
hit — but only when the click is synthetic. A real tap sets `hadRecentInput`
on the shift and it is excluded, leaving CLS 0. Worth knowing before
"fixing" a shift that was never counted: verify with `page.click()`, not
`element.click()`.

## Local landing pages — `/[service]/[city]`

10 services × 16 cities is 160 URLs. **25 exist.** The other 135 return 404,
and that is the feature.

Generating all 160 from a template is textbook doorway spam, and Google
penalises the domain rather than the thin pages. So the system is built so
the shortcut is not available:

1. **`content/local-pages.ts` is the only thing that creates a page.** It
   validates at module scope, so `next build` fails the moment an entry is
   missing 250 words of its own copy, its named neighbourhoods, a delivery
   line, three FAQs or an image.
2. **The strongest check is that a named neighbourhood must appear in the
   prose.** Listing "Meadowvale" without writing about Meadowvale fails. That
   is what stops the field being filled in to satisfy a count while the copy
   stays generic.
3. **`npm run check:local`** (wired to `prebuild`) adds two checks the module
   cannot: image files exist on disk, and no two intros share more than 25% of
   their 8-word phrasing. Current worst pair: **3%**.
4. **`dynamicParams = false`** enforces the same rule at the routing layer —
   a combination nobody wrote copy for 404s rather than rendering from a
   template.

Verified by injecting a plausible thin entry: the build stopped with all
seven distinct failures named.

```
npm run check:local        # report every problem at once
npm run gen:local-images   # regenerate the per-page plates
```

### Live coverage

`mississauga` 10 · `brampton` 3 · `toronto` 3 · `vaughan` 3 · `oakville` 3 ·
`markham` 3 — 7,168 words of city-specific copy, min 251 per page.

`/service-areas` links every live page and lists the rest of the delivery
area as plain text, saying plainly that we deliver there and have not written
a page yet. `/sitemap.ts` carries only pages that passed the check.

⚠️ **The images are designed placeholders, not photographs.** They are
genuinely unique files — different plate, angle, pitch and composition per
page — so the gate passes honestly rather than by pointing 25 pages at one
graphic. A real photo of real work in that city does a job no generated
graphic can, and a reused stock image across a local cluster is one of the
signals that gets it read as templated. Replace them as photos exist.

## /quote — the conversion path

Four steps, controlled state, no `<form>` submit. The job ticket beside the
questions fills in live and is rendered from the *same* `ticketRows` used by
the confirmation emails and the success page — so what someone watches being
built is literally the sheet that reaches the shop floor, not a summary that
can drift from it.

### Storage runs before email, deliberately

Email is the thing most likely to fail, and a lead that exists in a table can
be recovered from it; one that only ever existed in a failed API call cannot.
So `app/quote/actions.ts` writes first, sends second, and reports the two
outcomes separately:

| stored | emailed | what the visitor gets |
| ------ | ------- | --------------------- |
| ✓ | ✓ | Success, printable spec sheet, reference |
| ✓ | ✗ | Success **plus a notice** that the confirmation didn't send, and the phone number |
| ✗ | ✓ | Success — the shop has it |
| ✗ | ✗ | **Failure.** Phone number and email, form state preserved. Never a fake "thanks!" |

That last row is the point. Telling somebody their request is in when it is
not costs a customer.

### Setup

```bash
cp .env.example .env.local
psql "$QUOTE_DATABASE_URL" -f db/schema.sql
```

Set **one** of `QUOTE_DATABASE_URL` / `POSTGRES_URL` / `DATABASE_URL`
(Postgres — Vercel, Supabase, Neon), or `QUOTE_LOG_FILE` for local work.
With neither set the action fails loudly rather than dropping leads.
`RESEND_API_KEY` enables both emails; the sending domain must be verified in
Resend first. Artwork rides along as an attachment on the internal email —
no blob storage to configure.

### Spam

Honeypot first, then a minimum fill time of 4s, then a 5-per-10-minutes rate
limit by IP. A tripped honeypot returns a plausible success and silently
discards everything — verified: stored rows did not move.

⚠️ The rate limit is in module memory, so it is **per serverless instance**.
It is a speed bump for a stuck submit button or one bot. If real spam
appears, move it to Upstash or Vercel KV so the counter is shared, and only
then consider a captcha.

### Verified end to end

Drove the real form in a browser: `?service=` preselects the branch, the
ticket builds as you answer, the submit gate holds until name and a valid
email exist, the submission **persisted with its full spec**, the redirect
carried the reference, and the success page showed the honest
email-failed notice (no `RESEND_API_KEY` in that environment). Both-channels-
down stays on `/quote` with the phone number. CLS 0 and no overflow on
desktop and mobile. `/quote/sent` is `noindex, nofollow, nocache`; `/quote`
is in the sitemap.

## Scripts

```
npm run dev        npm run build       npm run start
npm run lint       npm run typecheck
```
