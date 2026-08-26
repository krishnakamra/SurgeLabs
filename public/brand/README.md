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

## The artwork is the supplied file

Every path in these files is the client's own logo, byte for byte. Nothing has
been redrawn, re-traced or re-spaced. The paths in `lib/brand/mark.ts` are
deliberately left exactly as the exporter wrote them — a tidied path is a
different logo.

**One thing changed: the colour.** The file arrived two-tone, in `#F9F9FA` and
`#325FAC`. The structure is kept — *Surge* in the foreground, *Labs* in the
accent — but both literal values were replaced, because a fixed near-white
cannot sit on paper and the blue has no place in a gold-and-ink system.

**The mark is the wordmark's own S.** The supplied file is a wordmark only, at
8.32:1, which cannot be a favicon, a phone masthead or a loading state. Rather
than pair it with an invented symbol, the first glyph is lifted unaltered. It
proofs cleanly at 16px — heavy strokes, wide apertures, no counter fine enough
to close up.

**There is no mark-plus-wordmark lockup**, because the wordmark opens with the
S. Setting them side by side would print the letter twice. The stacked lockup
splits the wordmark onto two lines instead.

---

## What is here

| File | Use |
|---|---|
| `surge-labs-horizontal-{ink,stock}.svg` | The wordmark as supplied. The default. 8.32:1. |
| `surge-labs-stacked-{ink,stock}.svg` | *Surge* over *Labs*. Square and tall spaces — footers, avatars, the OG card. |
| `surge-labs-mark-{ink,stock}.svg` | The S alone. Favicons, stamps, embroidery, anywhere the wordmark will not fit. |
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

- **Clear space is a quarter of the artwork's height**, on all four sides.
  Height, not width — the wordmark is 8.32:1 and the mark is 1.36:1, so a
  width-based rule would mean something different for each. Nothing sets
  inside it.
- **Minimum sizes**: horizontal 18px tall (≈150px wide) · stacked 30px ·
  mark 16px.
- **Height drives everything.** Set a height and let the width follow. Sizing
  by width squashes an 8.32:1 wordmark the moment the container changes.
- **One colour, or foil.** The logo is `--color-fg` on whatever it sits on.
  It may also be struck in foil — a gold gradient that moves with the light —
  on the masthead, a primary CTA and the foil section, and nowhere else. The
  app icon is the one place the mark is knocked out of a solid gold plate.
- **Never** re-space the wordmark, re-draw the mark with a stroke, put the
  lockup on a busy photograph, or rebuild the horizontal lockup by setting the
  mark next to typed text. Use the file.
