import type { Metadata } from "next";
import { Logo } from "@/components/brand";
import { Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import {
  CLEAR_SPACE,
  MARK_ASPECT,
  MARK_H,
  MARK_W,
  MINIMUM_SIZE,
  PLATE_COLOR,
  SURFACE_COLOR,
  WORDMARK_ASPECT,
  WORDMARK_H,
  WORDMARK_W,
  type LogoVariant,
} from "@/lib/brand/mark";

export const metadata: Metadata = {
  title: "Brand — Surge Labs",
  robots: { index: false, follow: false },
};

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/* ── shared bits ─────────────────────────────────────────────────────────── */

/**
 * A logo sitting on a named bed, with the bed labelled.
 *
 * The point of rendering these side by side is that the two calls inside are
 * identical — same variant, same size, no colour anywhere. Everything that
 * differs between them is inherited from the [data-surface] on this wrapper.
 */
function Field({
  surface,
  children,
  label,
  className,
}: {
  surface: "ink" | "stock";
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div data-surface={surface} className={`border-[length:var(--hairline)] border-rule bg-surface ${className ?? ""}`}>
      <div className="flex min-h-[9rem] items-center justify-center p-8">{children}</div>
      {label ? (
        <p className={`${SPEC} border-t-[length:var(--hairline)] border-rule px-4 py-3 text-fg-faint`}>{label}</p>
      ) : null}
    </div>
  );
}

/** One row of the size ladder: the logo, then what it is and what it is for. */
function SizeRow({
  variant,
  size,
  note,
}: {
  variant: LogoVariant;
  size: number;
  note?: string;
}) {
  const floor = MINIMUM_SIZE[variant].screen;
  const below = size < floor;

  return (
    <tr className="border-t-[length:var(--hairline)] border-rule align-middle">
      <td className="py-6 pr-8">
        <Logo variant={variant} size={size} />
      </td>
      <td className={`${SPEC} py-6 pr-8 whitespace-nowrap text-fg`}>{size}px</td>
      <td className="py-6 pr-8 text-sm text-fg-muted">{note}</td>
      <td className={`${SPEC} py-6 whitespace-nowrap ${below ? "text-accent-text" : "text-fg-faint"}`}>
        {below ? "below minimum" : size === floor ? "minimum" : ""}
      </td>
    </tr>
  );
}

/**
 * The clear space diagram.
 *
 * Gold hairline = the lockup's own bounding box. Dashed rule = the limit of
 * the clear space. The band between them is one bar, resolved from the same
 * constant the component uses, so this diagram cannot drift from the rule it
 * is describing.
 */
function ClearSpace({ variant, size }: { variant: LogoVariant; size: number }) {
  const pad = `calc(${size}px * ${CLEAR_SPACE})`;
  return (
    <div className="relative inline-block" style={{ padding: pad }}>
      <span
        aria-hidden="true"
        className="absolute inset-0 border-[length:var(--hairline)] border-dashed border-rule-strong"
      />
      <span
        aria-hidden="true"
        className="absolute border-[length:var(--hairline)] border-accent"
        style={{ inset: pad }}
      />
      <Logo variant={variant} size={size} />
    </div>
  );
}

/** A misuse tile. The example is always wrong on purpose. */
function Dont({ title, why, children }: { title: string; why: string; children: React.ReactNode }) {
  return (
    <div className="border-[length:var(--hairline)] border-rule">
      <div className="relative flex min-h-[10rem] items-center justify-center overflow-hidden bg-surface-raised p-8">
        {children}
      </div>
      <div className="border-t-[length:var(--hairline)] border-rule p-5">
        <p className={`${SPEC} text-accent-text`}>Don&rsquo;t — {title}</p>
        <p className="mt-3 text-sm text-fg-muted">{why}</p>
      </div>
    </div>
  );
}

const FILES: ReadonlyArray<{ file: string; use: string }> = [
  { file: "surge-labs-horizontal-ink.svg", use: "Default lockup, on the press bed" },
  { file: "surge-labs-horizontal-stock.svg", use: "Default lockup, on paper" },
  { file: "surge-labs-stacked-ink.svg", use: "Square and tall spaces, on the press bed" },
  { file: "surge-labs-stacked-stock.svg", use: "Square and tall spaces, on paper" },
  { file: "surge-labs-mark-ink.svg", use: "Mark alone — stamps, plotters, embroidery" },
  { file: "surge-labs-mark-stock.svg", use: "Mark alone, on paper" },
  { file: "icon.svg", use: "App icon — the mark knocked out of the accent plate" },
  { file: "icon-192.png", use: "Web app manifest — 192px" },
  { file: "icon-512.png", use: "Web app manifest — 512px" },
  { file: "icon-maskable-512.png", use: "Web app manifest — maskable, Android safe zone" },
];

/* ── page ────────────────────────────────────────────────────────────────── */

export default function BrandPage() {
  return (
    <main id="main" tabIndex={-1}>
      {/* 00 — masthead */}
      <SectionFrame
        surface="ink"
        as="header"
        padding="lg"
        id="sec-00"
        ticket={{ number: "00", label: "BRAND", spec: "IDENTITY v1" }}
        className="overflow-hidden"
      >
        <HalftoneField plate="m" pitch={7} dot={1.5} opacity={0.2} fade="radial" seed={19} />
        <Eyebrow spec="SURGE LABS">Identity</Eyebrow>
        <h1 className="mt-8 font-display text-4xl font-normal text-fg">The logo</h1>
        <p className="mt-8 max-w-[60ch] text-md text-fg-muted">
          Three lockups, one mark, no colour of its own. Everything on this page is rendered by the
          same component the site uses, from the same geometry the favicon is cut from — so if a
          rule here is wrong, the site is wrong with it rather than quietly disagreeing.
        </p>

        <div
          data-surface="stock"
          className="mt-14 flex max-w-3xl items-center justify-center border-[length:var(--hairline)] border-rule bg-surface p-14"
        >
          <Logo variant="horizontal" size={64} />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#sec-06" variant="outline" size="md">
            Files to send a supplier
          </Button>
          <Button href="/styleguide" variant="ghost" size="md">
            The rest of the design system
          </Button>
        </div>
      </SectionFrame>

      {/* 01 — the three lockups */}
      <SectionFrame
        surface="stock"
        id="sec-01"
        padding="lg"
        ticket={{ number: "01", label: "LOCKUPS", spec: "3 VARIANTS" }}
      >
        <Eyebrow number="01" spec="ONE GEOMETRY">
          Lockups
        </Eyebrow>
        <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-normal text-fg">
          Three ways to set it. Pick by the shape of the hole.
        </h2>
        <p className="mt-6 max-w-[60ch] text-fg-muted">
          Not by preference. A horizontal lockup in a square space leaves the mark stranded at one
          end; a stacked lockup in a masthead wastes the height it is asking for.
        </p>

        <div className="mt-12 grid gap-gutter lg:grid-cols-3">
          <Field surface="stock" label="Horizontal — default">
            <Logo variant="horizontal" size={40} />
          </Field>
          <Field surface="stock" label="Stacked">
            <Logo variant="stacked" size={48} />
          </Field>
          <Field surface="stock" label="Mark">
            <Logo variant="mark" size={48} />
          </Field>
        </div>

        <dl className="mt-12 grid gap-x-gutter gap-y-8 border-t-[length:var(--hairline)] border-rule pt-10 sm:grid-cols-3">
          <div>
            <dt className={`${SPEC} text-fg`}>Horizontal</dt>
            <dd className="mt-3 text-sm text-fg-muted">
              The default, and the site masthead. Anything wider than it is tall: letterheads, email
              signatures, the top of a vehicle wrap.
            </dd>
          </div>
          <div>
            <dt className={`${SPEC} text-fg`}>Stacked</dt>
            <dd className="mt-3 text-sm text-fg-muted">
              Square and tall spaces: the site footer, the social card, an avatar, a roll-up banner.
              The wordmark sets smaller here and runs about twice the mark&rsquo;s width.
            </dd>
          </div>
          <div>
            <dt className={`${SPEC} text-fg`}>Mark</dt>
            <dd className="mt-3 text-sm text-fg-muted">
              Alone below 24px and wherever the name is already on the page: favicon, the masthead
              under 480px, loading states, a foil stamp on the back of a card.
            </dd>
          </div>
        </dl>
      </SectionFrame>

      {/* 02 — surfaces */}
      <SectionFrame
        surface="ink"
        id="sec-02"
        padding="lg"
        ticket={{ number: "02", label: "SURFACES", spec: "INK / STOCK" }}
      >
        <Eyebrow number="02" spec="NO COLOUR PROP">
          Ink and stock
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          There is no light version and no dark version.
        </h2>
        <p className="mt-6 max-w-[60ch] text-fg-muted">
          The mark is filled with <code className={`${SPEC} text-accent-text`}>currentColor</code>{" "}
          and the wordmark is ordinary text, so both take{" "}
          <code className={`${SPEC} text-accent-text`}>--color-fg</code> from whichever section they
          are dropped into. The two panels below are the same call, character for character. Only
          the <code className={`${SPEC} text-accent-text`}>data-surface</code> on the panel differs.
        </p>

        <div className="mt-12 grid gap-gutter md:grid-cols-2">
          <Field surface="ink" label={`Ink — ${SURFACE_COLOR.ink.fg} on ${SURFACE_COLOR.ink.bg}`}>
            <Logo variant="horizontal" size={48} />
          </Field>
          <Field
            surface="stock"
            label={`Stock — ${SURFACE_COLOR.stock.fg} on ${SURFACE_COLOR.stock.bg}`}
          >
            <Logo variant="horizontal" size={48} />
          </Field>
        </div>

        <p className="mt-8 max-w-[60ch] text-sm text-fg-muted">
          For a fixed plate that has no surface to ask — a gold panel, a photograph, someone
          else&rsquo;s slide template — pass <code className={`${SPEC} text-accent-text`}>surface</code>{" "}
          and it stops inheriting. That is the only reason the prop exists.
        </p>
      </SectionFrame>

      {/* 03 — construction */}
      <SectionFrame
        surface="stock"
        id="sec-03"
        padding="lg"
        ticket={{ number: "03", label: "CONSTRUCTION", spec: "SUPPLIED ARTWORK" }}
      >
        <Eyebrow number="03" spec="UNALTERED PATHS">
          Construction
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          Their artwork, and the two numbers that govern it.
        </h2>

        <div className="mt-12 grid items-start gap-gutter lg:grid-cols-2">
          <Field surface="stock" className="lg:col-span-1">
            <Logo variant="mark" size={200} />
          </Field>

          <dl className="grid gap-x-gutter gap-y-6 sm:grid-cols-2">
            {[
              {
                term: "Wordmark",
                value: `${WORDMARK_W} × ${WORDMARK_H}`,
                note: `Supplied artwork, unaltered. ${WORDMARK_ASPECT.toFixed(2)}:1 — long, so height drives every layout and width follows.`,
              },
              {
                term: "Mark",
                value: `${MARK_W} × ${MARK_H}`,
                note: `The wordmark's own S, lifted unaltered and cropped to its bounding box. ${MARK_ASPECT.toFixed(2)}:1 — wider than tall, never square.`,
              },
              {
                term: "Colour",
                value: "Two tokens",
                note: "Surge takes currentColor, Labs takes the accent. The supplied blue and near-white are gone; the two-tone structure is not.",
              },
              {
                term: "Drawn as",
                value: "Filled paths",
                note: "No strokes anywhere. A stroke would need re-weighting at every size; filled outlines are the same shape at 16px and on a wall.",
              },
              {
                term: "Stacked",
                value: "Two lines",
                note: "Surge over Labs, sharing a baseline grid — not a mark above a wordmark, because the wordmark's first glyph IS the mark.",
              },
              {
                term: "Smallest",
                value: `${MINIMUM_SIZE.mark.screen}px`,
                note: "The mark at favicon size. Proofed at 16, 24, 32 and 48 before it was adopted — heavy strokes, wide apertures, nothing that closes up.",
              },
            ].map((row) => (
              <div key={row.term}>
                <dt className={`${SPEC} text-fg-faint`}>{row.term}</dt>
                <dd className="mt-2 font-display text-lg font-medium text-fg">{row.value}</dd>
                <dd className="mt-2 text-sm text-fg-muted">{row.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14 border-t-[length:var(--hairline)] border-rule pt-10">
          <h3 className={`${SPEC} text-fg-faint`}>This is the real artwork</h3>
          <p className="mt-4 max-w-[62ch] text-sm text-fg-muted">
            Every path in the logo is the supplied file, byte for byte. Nothing has been redrawn,
            re-spaced or re-traced, and the paths in{" "}
            <code className={`${SPEC} text-accent-text`}>lib/brand/mark.ts</code> are deliberately
            left as the exporter wrote them — a tidied path is a different logo.
          </p>
          <p className="mt-4 max-w-[62ch] text-sm text-fg-muted">
            One thing did change: the colour. The file arrived two-tone, in a near-white and a mid
            blue. The structure is kept — Surge in the foreground, Labs in the accent — but both
            literal values are replaced by tokens, because a fixed near-white cannot sit on paper
            and the blue has no place in a gold-and-ink system.
          </p>
        </div>
      </SectionFrame>

      {/* 04 — clear space and minimum size */}
      <SectionFrame
        surface="ink"
        id="sec-04"
        padding="lg"
        ticket={{ number: "04", label: "CLEAR SPACE", spec: "1 BAR" }}
      >
        <Eyebrow number="04" spec={`${Math.round(CLEAR_SPACE * 100)}% OF HEIGHT`}>
          Clear space
        </Eyebrow>
        <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-normal text-fg">
          A quarter of the height, on every side.
        </h2>
        <p className="mt-6 max-w-[60ch] text-fg-muted">
          Measured off the artwork&rsquo;s height, which is the one dimension all three lockups
          share — the wordmark is 8.32:1 and the mark is 1.36:1, so a rule based on width would
          mean something different for each. Nothing sets inside it: no type, no rule, no image
          edge, no other logo, no trim. It scales with the logo, so there is one rule rather than a
          table of millimetres.
        </p>

        <div className="mt-12 grid gap-gutter md:grid-cols-2">
          <Field surface="ink" label="Horizontal">
            <ClearSpace variant="horizontal" size={44} />
          </Field>
          <Field surface="ink" label="Mark">
            <ClearSpace variant="mark" size={72} />
          </Field>
        </div>
        <p className={`${SPEC} mt-6 text-fg-faint`}>
          Gold rule — the lockup&rsquo;s own box. Dashed rule — the limit of the clear space.
        </p>
        <p className="mt-6 max-w-[60ch] text-sm text-fg-muted">
          The SVGs in the handoff pack have this margin built into their viewBox and filled with the
          surface colour, so placing one as supplied already honours the rule.
        </p>
      </SectionFrame>

      {/* 05 — sizes */}
      <SectionFrame
        surface="stock"
        id="sec-05"
        padding="lg"
        ticket={{ number: "05", label: "SIZES", spec: "MINIMUMS" }}
      >
        <Eyebrow number="05" spec="PROOFED, NOT GUESSED">
          Size
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          Below the minimum, use the next lockup down.
        </h2>
        <p className="mt-6 max-w-[60ch] text-fg-muted">
          Every logo below is rendered at its true size — measure them on the screen. The floors are
          where the counters start to close, and the answer at that point is never to shrink further:
          it is to drop the wordmark and set the mark alone.
        </p>

        <div className="mt-12 grid gap-x-gutter gap-y-10 sm:grid-cols-3">
          {(["horizontal", "stacked", "mark"] as const).map((variant) => {
            const min = MINIMUM_SIZE[variant];
            return (
              <div key={variant} className="border-t-2 border-fg pt-5">
                <p className={`${SPEC} text-fg-faint`}>{variant}</p>
                <p className="mt-3 font-display text-xl font-normal text-fg">
                  {min.screen}px <span className="text-fg-faint">/</span> {min.print}
                </p>
                <p className="mt-3 text-sm text-fg-muted">{min.note}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <caption className="sr-only">The logo rendered at each working size</caption>
            <tbody>
              <SizeRow variant="horizontal" size={64} note="Feature use — a cover, a title slide." />
              <SizeRow variant="horizontal" size={32} note="The site masthead, above 640px." />
              <SizeRow variant="horizontal" size={26} note="The site masthead on a phone." />
              <SizeRow variant="horizontal" size={24} note="The floor. An email signature." />
              <SizeRow variant="horizontal" size={18} note="Too small — the wordmark has gone muddy." />
              <SizeRow variant="stacked" size={64} note="The social card, a roll-up banner." />
              <SizeRow variant="stacked" size={44} note="The site footer." />
              <SizeRow variant="stacked" size={32} note="The floor." />
              <SizeRow variant="mark" size={48} note="Loading states, an avatar." />
              <SizeRow variant="mark" size={26} note="The masthead under 480px, where the wordmark drops." />
              <SizeRow variant="mark" size={16} note="The floor — and the favicon, where the plate version takes over." />
            </tbody>
          </table>
        </div>
      </SectionFrame>

      {/* 06 — the icon set and the files */}
      <SectionFrame
        surface="ink"
        id="sec-06"
        padding="lg"
        ticket={{ number: "06", label: "FILES", spec: "GENERATED" }}
      >
        <Eyebrow number="06" spec="NPM RUN GEN:BRAND">
          The app icon, and the files
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          The tab icon is a knockout, not the bare mark.
        </h2>
        <p className="mt-6 max-w-[60ch] text-fg-muted">
          At 16px a figure made of hairlines disappears and a solid fill with a hole in it does not,
          so the icon is the mark knocked out of the accent plate —{" "}
          <code className={`${SPEC} text-accent-text`}>{PLATE_COLOR.fill}</code> under{" "}
          <code className={`${SPEC} text-accent-text`}>{PLATE_COLOR.knockout}</code>, the same pair
          the primary button uses, at 8.22:1. It is also the right way round for foil: on a stamped
          card the leaf is the light and the paper showing through is the dark.
        </p>

        <div className="mt-12 flex flex-wrap items-end gap-10">
          {[16, 32, 48, 64, 96].map((size) => (
            <div key={size} className="flex flex-col items-center gap-4">
              {/* The generated file, at true size — this is the actual favicon. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/icon.svg" alt="" width={size} height={size} />
              <span className={`${SPEC} text-fg-faint`}>{size}px</span>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-[60ch] text-sm text-fg-muted">
          Shipped as <code className={SPEC}>favicon.ico</code> (16, 32 and 48 in one file),{" "}
          <code className={SPEC}>icon.svg</code>, a 180px apple-touch-icon, and 192/512 PNGs for the
          web app manifest with a separate maskable cut for Android&rsquo;s safe zone. All of it is
          generated from the geometry above by <code className={SPEC}>npm run gen:brand</code>. None
          of it is hand-drawn, and none of it should be hand-edited.
        </p>

        <div className="mt-14 overflow-x-auto border-t-[length:var(--hairline)] border-rule pt-10">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className={`${SPEC} pb-6 text-left text-fg-faint`}>
              public/brand — the handoff pack
            </caption>
            <tbody>
              {FILES.map((row) => (
                <tr key={row.file} className="border-t-[length:var(--hairline)] border-rule">
                  <td className="py-4 pr-8">
                    <a
                      href={`/brand/${row.file}`}
                      download
                      className={`${SPEC} text-link underline decoration-1 underline-offset-4`}
                    >
                      {row.file}
                    </a>
                  </td>
                  <td className="py-4 text-sm text-fg-muted">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-[62ch] text-sm text-fg-muted">
          <strong className="text-fg">Before sending a lockup to a printer:</strong> the two lockup
          SVGs carry the wordmark as live text, because there is no drawn wordmark yet. On a machine
          without Bodoni Moda they fall back and the spacing goes wrong. The mark files have
          no type in them at all and are safe to send today.
        </p>
      </SectionFrame>

      {/* 07 — misuse */}
      <SectionFrame
        surface="stock"
        id="sec-07"
        padding="lg"
        ticket={{ number: "07", label: "MISUSE", spec: "FOUR WAYS" }}
      >
        <Eyebrow number="07" spec="ALL OF THESE ARE WRONG">
          Misuse
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          Use the file.
        </h2>
        <p className="mt-6 max-w-[60ch] text-fg-muted">
          Almost every version of these comes from someone rebuilding the logo instead of placing it.
          There is a file for every case above.
        </p>

        <div className="mt-12 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          <Dont
            title="recolour it"
            why="The logo is the foreground colour of whatever it sits on, or foil. It is never a third colour — and cyan is reserved for links."
          >
            <Logo variant="mark" size={56} className="text-link" />
          </Dont>

          <Dont
            title="stretch it"
            why="The bar is the unit the whole identity is measured in. Scale it on one axis and every rule on this page is describing a different logo."
          >
            <span className="inline-block" style={{ transform: "scaleX(1.45)" }}>
              <Logo variant="mark" size={56} />
            </span>
          </Dont>

          <Dont
            title="crowd it"
            why="One bar on every side, and nothing inside it. A rule touching the mark reads as part of the mark."
          >
            <span className="inline-flex items-center gap-1">
              <Logo variant="mark" size={56} />
              <span className="h-14 w-[var(--hairline)] bg-fg" />
              <span className="font-display text-lg font-normal text-fg">GTA</span>
            </span>
          </Dont>

          <Dont
            title="retype the wordmark"
            why="Setting the name next to the mark in the nearest available font is not the lockup. The spacing is a specification, not a default."
          >
            <span className="inline-flex items-center gap-3">
              <Logo variant="mark" size={40} />
              <span className="text-lg text-fg">Surge Labs</span>
            </span>
          </Dont>
        </div>
      </SectionFrame>
    </main>
  );
}
