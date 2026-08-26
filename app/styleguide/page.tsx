import type { Metadata } from "next";
import {
  Button,
  CropMarks,
  Eyebrow,
  HalftoneField,
  RegistrationTarget,
  SectionFrame,
} from "@/components/ui";
import { contrastRatio, formatRatio } from "@/lib/contrast";
import { RegistrationDemo } from "./_components/registration-demo";
import {
  CONTRAST_CHECKS,
  DERIVED_INKS,
  PRESS_INKS,
  SCREEN_ANGLES,
  SEMANTIC_TOKENS,
  TYPE_SCALE,
  type InkSwatch,
} from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Styleguide — Surge Labs",
  robots: { index: false, follow: false },
};

/* ── shared bits ─────────────────────────────────────────────────────────── */

const SPEC = "font-utility text-2xs uppercase tracking-utility";

function Swatch({ swatch }: { swatch: InkSwatch }) {
  return (
    <div className="border-[length:var(--hairline)] border-rule">
      <div className="h-24 w-full border-b-[length:var(--hairline)] border-rule" style={{ backgroundColor: swatch.hex }} />
      <div className="p-4">
        <p className="font-display text-sm font-medium text-fg">{swatch.name}</p>
        <p className={`${SPEC} mt-2 text-accent-text`}>{swatch.hex}</p>
        <p className={`${SPEC} mt-1 text-fg-faint`}>{swatch.token}</p>
        <p className="mt-3 text-sm text-fg-muted">{swatch.role}</p>
      </div>
    </div>
  );
}

/**
 * Rendered twice below, on both beds, with byte-identical class names.
 * If anything here needs a `dark:` variant the token system has failed.
 */
function SurfaceProof() {
  return (
    <div className="bg-surface p-8">
      <Eyebrow number="00" spec="4C PROCESS">
        Identical markup
      </Eyebrow>
      <h3 className="mt-5 font-display text-xl font-medium text-fg">Same classes, either bed.</h3>
      <p className="mt-4 text-sm text-fg-muted">
        Secondary copy sits on <span className="text-fg-faint">fg-muted</span> and metadata on
        fg-faint.
      </p>
      <p className="mt-4 text-sm">
        <a href="#sec-02" className="text-link underline decoration-1 underline-offset-4">
          A link resolves to cyan
        </a>{" "}
        <span className="text-fg-muted">— deepened on paper so it clears 4.5:1.</span>
      </p>
      <div className="mt-6 border-t-[length:var(--hairline)] border-rule pt-6">
        <div className="bg-surface-raised p-4">
          <p className={`${SPEC} text-fg-faint`}>surface-raised</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Button size="sm">Get a quote</Button>
        <Button variant="outline" size="sm">
          See packages
        </Button>
      </div>
    </div>
  );
}

function ContrastRow({
  label,
  fg,
  bg,
  min,
  expectFail,
}: {
  label: string;
  fg: string;
  bg: string;
  min: number;
  expectFail?: boolean;
}) {
  const ratio = contrastRatio(fg, bg);
  const passes = ratio >= min;
  const verdict = expectFail ? "BY DESIGN" : passes ? "PASS" : "FAIL";
  const tone = expectFail ? "text-fg-faint" : passes ? "text-link" : "text-accent-text";

  return (
    <tr className="border-t-[length:var(--hairline)] border-rule align-middle">
      <td className="py-3 pr-4">
        <span
          className="inline-block size-6 shrink-0 border-[length:var(--hairline)] border-rule-strong align-middle"
          style={{ backgroundColor: bg }}
        >
          <span className="block px-1 text-center text-[10px] leading-6" style={{ color: fg }}>
            Aa
          </span>
        </span>
      </td>
      <td className="py-3 pr-6 text-sm text-fg">{label}</td>
      <td className={`${SPEC} py-3 pr-6 whitespace-nowrap text-fg-muted`}>{formatRatio(ratio)}</td>
      <td className={`${SPEC} py-3 pr-6 whitespace-nowrap text-fg-faint`}>min {min}:1</td>
      <td className={`${SPEC} py-3 whitespace-nowrap ${tone}`}>{verdict}</td>
    </tr>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default function StyleguidePage() {
  return (
    <main>
      {/* 00 — masthead */}
      <SectionFrame
        surface="ink"
        as="header"
        padding="lg"
        id="sec-00"
        ticket={{ number: "00", label: "STYLEGUIDE", spec: "PRESS ROOM v1" }}
        className="overflow-hidden"
      >
        <HalftoneField plate="m" pitch={7} dot={1.5} opacity={0.22} fade="radial" seed={11} />
        <Eyebrow spec="SURGE LABS">Design system</Eyebrow>
        <h1 className="mt-8 font-display text-4xl font-normal text-fg">Press Room</h1>
        <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
          Two surfaces, one set of classes. Every section declares{" "}
          <code className={`${SPEC} text-accent-text`}>data-surface</code> and the semantic tokens
          re-declare themselves on that element — so <code className={SPEC}>text-fg</code> is correct
          on the press bed and on paper, and there is no <code className={SPEC}>dark:</code> variant
          anywhere in the system.
        </p>
        <div className="mt-10">
          <Button href="/styleguide/motion" variant="outline" size="lg">
            Motion primitives
          </Button>
        </div>
      </SectionFrame>

      {/* 01 — palette */}
      <SectionFrame
        surface="stock"
        id="sec-01"
        padding="lg"
        ticket={{ number: "01", label: "PALETTE", spec: "PROCESS INKS" }}
      >
        <Eyebrow number="01" spec="7 LITERAL INKS">
          Palette
        </Eyebrow>
        <h2 className="mt-6 max-w-[20ch] font-display text-2xl font-normal text-fg">
          Gold, ink and paper. The process set is still here, and demoted.
        </h2>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Gold carries the brand and appears as a fill, a rule and — sparingly — as foil. The
          four-colour set is not deleted, because the presses are real and the registration
          animation is a picture of one: cyan carries links and data, magenta is confined to the
          registration layer and the production sections, and yellow survives only as a plate.
        </p>

        <div className="mt-12 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {PRESS_INKS.map((swatch) => (
            <Swatch key={swatch.token} swatch={swatch} />
          ))}
        </div>

        <h3 className={`${SPEC} mt-16 text-fg-faint`}>Derived — tints and shades of the same inks</h3>
        <p className="mt-4 max-w-[58ch] text-sm text-fg-muted">
          Legibility only. A process ink laid down at less than 100% is still that ink; these exist
          because gold reads at 2.06:1 on paper and pure cyan at 2.54:1, and running text needs 4.5:1.
        </p>
        <div className="mt-8 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {DERIVED_INKS.map((swatch) => (
            <Swatch key={swatch.token} swatch={swatch} />
          ))}
        </div>
      </SectionFrame>

      {/* 02 — surfaces */}
      <SectionFrame
        surface="ink"
        id="sec-02"
        padding="lg"
        ticket={{ number: "02", label: "SURFACES", spec: "INK / STOCK" }}
      >
        <Eyebrow number="02" spec="ONE CLASS SET">
          Surfaces
        </Eyebrow>
        <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-normal text-fg">
          Sheets running through a press.
        </h2>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Sections alternate ink, stock, ink, stock. Both blocks below are the same component with
          the same class names — only the wrapper&rsquo;s <code className={SPEC}>data-surface</code>{" "}
          differs.
        </p>

        <div className="mt-12 grid gap-gutter lg:grid-cols-2">
          <div data-surface="ink" className="border-[length:var(--hairline)] border-rule">
            <p className={`${SPEC} border-b-[length:var(--hairline)] border-rule bg-surface-sunken px-8 py-3 text-fg-faint`}>
              data-surface=&quot;ink&quot;
            </p>
            <SurfaceProof />
          </div>
          <div data-surface="stock" className="border-[length:var(--hairline)] border-rule">
            <p className={`${SPEC} border-b-[length:var(--hairline)] border-rule bg-surface-sunken px-8 py-3 text-fg-faint`}>
              data-surface=&quot;stock&quot;
            </p>
            <SurfaceProof />
          </div>
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <thead>
              <tr>
                {["Token", "Utility", "On ink", "On stock", "Role"].map((head) => (
                  <th key={head} className={`${SPEC} pb-3 pr-6 font-normal text-fg-faint`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SEMANTIC_TOKENS.map((row) => (
                <tr key={row.token} className="border-t-[length:var(--hairline)] border-rule">
                  <td className={`${SPEC} py-3 pr-6 whitespace-nowrap text-fg`}>{row.token}</td>
                  <td className={`${SPEC} py-3 pr-6 whitespace-nowrap text-accent-text`}>
                    {row.utility}
                  </td>
                  <td className={`${SPEC} py-3 pr-6 whitespace-nowrap text-fg-muted`}>{row.onInk}</td>
                  <td className={`${SPEC} py-3 pr-6 whitespace-nowrap text-fg-muted`}>
                    {row.onStock}
                  </td>
                  <td className="py-3 text-sm text-fg-muted">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionFrame>

      {/* 03 — type */}
      <SectionFrame
        surface="stock"
        id="sec-03"
        padding="lg"
        ticket={{ number: "03", label: "TYPE", spec: "3 VOICES" }}
      >
        <Eyebrow number="03" spec="VARIABLE, next/font">
          Type
        </Eyebrow>
        <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-normal text-fg">
          Three roles. No fourth face.
        </h2>

        <div className="mt-12 grid gap-gutter lg:grid-cols-3">
          {[
            {
              role: "Display",
              face: "Bodoni Moda",
              detail: "700–800 · tight tracking · optical sizing on",
              cls: "font-display text-xl font-normal",
              sample: "Same-day rush",
            },
            {
              role: "Body",
              face: "Satoshi",
              detail: "400 / 500",
              cls: "font-body text-md",
              sample: "Embroidery, DTF and screen printing, all in-house.",
            },
            {
              role: "Utility",
              face: "Geist Mono",
              detail: "400 · uppercase · wide tracking",
              cls: `${SPEC} text-fg`,
              sample: "JOB #2418 — 4C PROCESS — 14PT C2S",
            },
          ].map((voice) => (
            <div key={voice.role} className="border-[length:var(--hairline)] border-rule bg-surface-raised p-8">
              <p className={`${SPEC} text-fg-faint`}>{voice.role}</p>
              <p className={`mt-6 ${voice.cls} text-fg`}>{voice.sample}</p>
              <p className="mt-8 border-t-[length:var(--hairline)] border-rule pt-4 text-sm text-fg-muted">{voice.face}</p>
              <p className={`${SPEC} mt-1 text-fg-faint`}>{voice.detail}</p>
            </div>
          ))}
        </div>

        <h3 className={`${SPEC} mt-16 text-fg-faint`}>
          Scale — 12 / 14 / 16 / 18 / 21 / 28 / 40 / 60 / 88 / 128
        </h3>
        <div className="mt-8 divide-y divide-rule border-y-[length:var(--hairline)] border-rule">
          {TYPE_SCALE.map((row) => (
            <div key={row.utility} className="grid gap-4 py-6 lg:grid-cols-[10rem_1fr]">
              <div>
                <p className={`${SPEC} text-accent-text`}>{row.utility}</p>
                <p className={`${SPEC} mt-1 text-fg-faint`}>{row.size}px</p>
                <p className="mt-2 text-sm text-fg-muted">{row.role}</p>
              </div>
              <p
                className={[
                  row.utility,
                  row.family === "display"
                    ? "font-display font-normal"
                    : row.family === "utility"
                      ? "font-utility uppercase tracking-utility"
                      : "font-body",
                  "min-w-0 truncate text-fg",
                ].join(" ")}
              >
                Mississauga &amp; the GTA
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-[58ch] text-sm text-fg-muted">
          Everything from <code className={SPEC}>text-md</code> up is fluid via{" "}
          <code className={SPEC}>clamp()</code>. Tailwind&rsquo;s stock scale is cleared with{" "}
          <code className={SPEC}>--text-*: initial</code>, so <code className={SPEC}>text-7xl</code>{" "}
          does not exist.
        </p>
      </SectionFrame>

      {/* 04 — buttons */}
      <SectionFrame
        surface="ink"
        id="sec-04"
        padding="lg"
        ticket={{ number: "04", label: "BUTTONS", spec: "3 VARIANTS" }}
      >
        <Eyebrow number="04" spec="RADIUS 2PX">
          Buttons
        </Eyebrow>
        <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-normal text-fg">
          No radius, anywhere.
        </h2>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          A primary CTA is a foil hairline around nothing until you reach for it, and then the whole
          shape floods to a flat gold plate with the type knocked out in ink — 8.22:1 on either bed.
          The edge is foil and the fill is not, deliberately: the gradient&rsquo;s darkest stop is
          3.99:1, so a foil fill could never carry type.
        </p>

        {(["ink", "stock"] as const).map((surface) => (
          <div key={surface} data-surface={surface} className="mt-12 border-[length:var(--hairline)] border-rule bg-surface">
            <p className={`${SPEC} border-b-[length:var(--hairline)] border-rule bg-surface-sunken px-8 py-3 text-fg-faint`}>
              data-surface=&quot;{surface}&quot;
            </p>
            <div className="space-y-10 p-8">
              {(["primary", "outline", "ghost"] as const).map((variant) => (
                <div key={variant}>
                  <p className={`${SPEC} mb-5 text-fg-faint`}>{variant}</p>
                  <div className="flex flex-wrap items-center gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <Button key={size} variant={variant} size={size}>
                        Get a quote
                      </Button>
                    ))}
                    <Button variant={variant} size="md" disabled>
                      Disabled
                    </Button>
                    <Button variant={variant} size="md" href="tel:9055983960">
                      905-598-3960
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </SectionFrame>

      {/* 05 — registration */}
      <SectionFrame
        surface="stock"
        id="sec-05"
        padding="lg"
        ticket={{ number: "05", label: "REGISTRATION", spec: "SIGNATURE" }}
      >
        <Eyebrow number="05" spec="TRANSFORM ONLY">
          Registration
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          Four plates of the same word, pulled into register.
        </h2>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Plates blend <code className={SPEC}>multiply</code> on paper and{" "}
          <code className={SPEC}>screen</code> on the bed, via a{" "}
          <code className={SPEC}>--reg-blend</code> token that flips with the surface — so
          misregistration reads as real ink either way.
        </p>

        <div className="mt-14 grid gap-gutter lg:grid-cols-2">
          <div data-surface="stock" className="border-[length:var(--hairline)] border-rule bg-surface p-8 sm:p-12">
            <RegistrationDemoBlock label="On stock — subtractive, multiply" />
          </div>
          <div data-surface="ink" className="border-[length:var(--hairline)] border-rule bg-surface p-8 sm:p-12">
            <RegistrationDemoBlock label="On ink — additive, screen" />
          </div>
        </div>

        <div className="mt-12 border-l-2 border-accent bg-surface-raised p-8">
          <p className={`${SPEC} text-fg-faint`}>Reduced motion</p>
          <p className="mt-4 max-w-[62ch] text-sm text-fg-muted">
            The registered state is the SSR output — no <code className={SPEC}>data-reg</code>{" "}
            attribute means solid, legible text. Animation only ever delays arrival at a state the
            page already renders correctly, and{" "}
            <code className={SPEC}>prefers-reduced-motion</code> forces registration with{" "}
            <code className={SPEC}>!important</code> regardless of what any script has set.
          </p>
        </div>
      </SectionFrame>

      {/* 06 — halftone */}
      <SectionFrame
        surface="ink"
        id="sec-06"
        padding="lg"
        ticket={{ number: "06", label: "HALFTONE", spec: "SCREEN ANGLES" }}
      >
        <Eyebrow number="06" spec="feTurbulence">
          Halftone
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          A dot grid at the real screen angles.
        </h2>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Yellow 0°, cyan 15°, key 45°, magenta 75° — the offsets that stop moiré on a real press.
          Density is modulated by <code className={SPEC}>feTurbulence</code> inlined as a data URI,
          so no filter id ever lands in the document to collide with another instance.
        </p>

        <div className="mt-12 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {SCREEN_ANGLES.map((screen) => (
            <div key={screen.plate} className="border-[length:var(--hairline)] border-rule">
              <div className="relative h-48 overflow-hidden bg-surface-sunken">
                <HalftoneField plate={screen.plate} pitch={6} dot={1.5} opacity={0.9} seed={9} />
              </div>
              <div className="border-t-[length:var(--hairline)] border-rule p-4">
                <p className="font-display text-sm font-medium text-fg">{screen.label}</p>
                <p className={`${SPEC} mt-2 text-fg-faint`}>{screen.angle}°</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className={`${SPEC} mt-16 text-fg-faint`}>Fades</h3>
        <div className="mt-8 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {(["none", "top", "bottom", "radial"] as const).map((fade) => (
            <div key={fade} className="border-[length:var(--hairline)] border-rule">
              <div className="relative h-40 overflow-hidden bg-surface-sunken">
                <HalftoneField plate="c" fade={fade} pitch={5} dot={1.3} opacity={0.85} seed={3} />
              </div>
              <p className={`${SPEC} border-t-[length:var(--hairline)] border-rule p-4 text-fg-faint`}>fade=&quot;{fade}&quot;</p>
            </div>
          ))}
        </div>
      </SectionFrame>

      {/* 07 — marks */}
      <SectionFrame
        surface="stock"
        id="sec-07"
        padding="lg"
        ticket={{ number: "07", label: "MARKS", spec: "TRIM & TARGET" }}
      >
        <Eyebrow number="07" spec="PREPRESS">
          Marks
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          Crop marks, not corner boxes.
        </h2>

        <div className="mt-12 grid gap-gutter lg:grid-cols-3">
          <div className="border-[length:var(--hairline)] border-rule bg-surface-raised">
            <div className="relative h-64">
              <CropMarks />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={`${SPEC} text-fg-faint`}>trim box</p>
              </div>
            </div>
            <p className={`${SPEC} border-t-[length:var(--hairline)] border-rule p-4 text-fg-faint`}>
              Two hairlines per corner, stopping short of the corner point
            </p>
          </div>

          <div className="border-[length:var(--hairline)] border-rule bg-surface-raised">
            <div className="flex h-64 items-center justify-center gap-8">
              <RegistrationTarget className="size-10 text-fg" />
              <RegistrationTarget className="size-6 text-mark" />
              <RegistrationTarget className="size-4 text-accent" />
            </div>
            <p className={`${SPEC} border-t-[length:var(--hairline)] border-rule p-4 text-fg-faint`}>
              Registration target — circle plus crosshair
            </p>
          </div>

          <div className="border-[length:var(--hairline)] border-rule bg-surface-raised">
            <div className="flex h-64 flex-col justify-center gap-6 p-8">
              <Eyebrow number="03" spec="4C PROCESS">
                Services
              </Eyebrow>
              <Eyebrow spec="NO MINIMUMS" tone="accent">
                DTF transfer
              </Eyebrow>
              <Eyebrow mark={false} number="12">
                Packages
              </Eyebrow>
            </div>
            <p className={`${SPEC} border-t-[length:var(--hairline)] border-rule p-4 text-fg-faint`}>
              Eyebrow — the job-ticket line
            </p>
          </div>
        </div>

        <div className="mt-12 border-l-2 border-accent bg-surface-raised p-8">
          <p className={`${SPEC} text-fg-faint`}>Job ticket rail</p>
          <p className="mt-4 max-w-[62ch] text-sm text-fg-muted">
            Fixed to the left edge at 1200px and up — widen this window to see it. It reads{" "}
            <code className={SPEC}>data-ticket-*</code> straight off the sections on this page, so
            nothing is declared twice, and it adopts the current section&rsquo;s surface as you
            scroll. The vertical readout is <code className={SPEC}>aria-hidden</code> because it
            restates the heading you just passed; the tick stack underneath is real anchors with real
            accessible names.
          </p>
        </div>
      </SectionFrame>

      {/* 08 — contrast */}
      <SectionFrame
        surface="ink"
        id="sec-08"
        padding="lg"
        ticket={{ number: "08", label: "CONTRAST", spec: "WCAG 2.1 AA" }}
      >
        <Eyebrow number="08" spec="COMPUTED, NOT CLAIMED">
          Contrast
        </Eyebrow>
        <h2 className="mt-6 max-w-[24ch] font-display text-2xl font-normal text-fg">
          Every pair, measured at render time.
        </h2>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Ratios below are computed from the real hex values, not quoted from a comment. 4.5:1 for
          running text, 3:1 for large text, UI borders and focus rings.
        </p>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr>
                {["", "Pair", "Ratio", "Required", "Verdict"].map((head, index) => (
                  <th
                    key={head || index}
                    className={`${SPEC} pb-3 pr-6 font-normal text-fg-faint`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTRAST_CHECKS.map((check) => (
                <ContrastRow
                  key={check.label}
                  label={check.label}
                  fg={check.fg}
                  bg={check.bg}
                  min={check.min}
                  expectFail={check.expectFail}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SectionFrame>
    </main>
  );
}

/* Local wrapper so the demo can sit inside two different surfaces. */
function RegistrationDemoBlock({ label }: { label: string }) {
  return (
    <>
      <p className={`${SPEC} mb-8 text-fg-faint`}>{label}</p>
      <RegistrationDemo text="Surge" />
    </>
  );
}
