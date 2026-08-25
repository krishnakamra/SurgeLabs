# Brand assets

Everything in this folder is **generated**. Do not edit these files.

```bash
npm run gen:brand
```

That script (`scripts/generate-brand-assets.mjs`) cuts every asset here, plus
`app/icon.svg`, `app/favicon.ico` and `app/apple-icon.png`, from a single
source: **`lib/brand/mark.ts`**. Change the geometry there and re-run. Editing
an SVG by hand is how the favicon and the letterhead end up being different
logos six months apart.

The live site does not load any of these files. It renders
`components/brand/logo.tsx`, which draws the same path inline so it can
inherit `currentColor` from whichever `[data-surface]` section it sits in.
These are the flat files for everyone who is not the website — a sign printer,
an email signature, a supplier's artwork portal.

---

## ⚠️ The wordmark is a placeholder

There is no drawn wordmark yet. Until the client supplies one, **"SURGE LABS"
is live text in Bricolage Grotesque**, tuned in `lib/brand/wordmark.ts` so it
sets as a wordmark rather than as a heading — positive tracking, pinned
optical size, a tightened word space.

Two consequences, and both matter before you send these to anyone:

1. **The lockup SVGs in this folder carry `<text>`, not outlines.** Opened on a
   machine without Bricolage Grotesque installed — which is most machines —
   they fall back to Arial Black and the spacing will be wrong. They are safe
   to look at and not yet safe to hand to a printer.
2. **The mark SVGs are final in the sense that matters**: pure geometry, no
   type, no font dependency. `surge-labs-mark-*.svg` can go to a vinyl plotter
   today.

`components/brand/logo.tsx` has the four-step swap for real artwork above the
`Wordmark` function. Re-run `npm run gen:brand` afterwards and this caveat
stops being true.

---

## What is here

| File | Use |
|---|---|
| `surge-labs-horizontal-{ink,stock}.svg` | Default lockup. Anything wider than it is tall. |
| `surge-labs-stacked-{ink,stock}.svg` | Square and tall spaces — footers, social avatars, the OG card. |
| `surge-labs-mark-{ink,stock}.svg` | The S alone. Favicons, stamps, embroidery, anywhere under 24px. |
| `icon-192.png`, `icon-512.png` | Web app manifest, `purpose: any`. |
| `icon-maskable-512.png` | Web app manifest, `purpose: maskable`. The mark is pulled in to clear Android's safe zone. |

**`ink` sets on the press bed** (light mark on `#0C0C0E`).
**`stock` sets on paper** (dark mark on `#EDEDE8`). Pick by what is behind it.

Every lockup file has **the clear space built into its viewBox** — a margin of
one bar on all four sides, filled with the surface colour. Place the file as
supplied at any size and the clear space rule is already honoured.

---

## The rules, short version

The full spec, rendered at real sizes on both surfaces, is at **`/brand`** on
the site. It is a working page, `noindex`, and it is the thing to send a client
who asks for brand guidelines.

- **Clear space is the bar** — the stroke weight of the S, which is 14/64 of the
  mark's height. Nothing sets inside it.
- **Minimum sizes**: horizontal 24px / 10mm · stacked 32px / 12mm · mark 16px / 6mm.
- **One colour.** The logo is `--color-fg` on whatever it sits on. It is not
  magenta. Magenta is the accent, and the one place it fills the mark is the
  app icon, where the S is knocked out of a solid plate.
- **Never** re-space the wordmark, re-draw the mark with a stroke, put the
  lockup on a busy photograph, or rebuild the horizontal lockup by setting the
  mark next to typed text. Use the file.
