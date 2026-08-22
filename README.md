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

## Scripts

```
npm run dev        npm run build       npm run start
npm run lint       npm run typecheck
```
