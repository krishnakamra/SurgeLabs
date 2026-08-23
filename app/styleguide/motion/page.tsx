import type { Metadata } from "next";
import {
  CounterRoll,
  MagneticCTA,
  MarqueeSpec,
  PlateWipe,
  RegistrationReveal,
  StockFlip,
} from "@/components/motion";
import { Button, Eyebrow, SectionFrame } from "@/components/ui";

export const metadata: Metadata = {
  title: "Motion — Surge Labs Styleguide",
  robots: { index: false, follow: false },
};

const SPEC = "font-utility text-2xs uppercase tracking-utility";

const SPECS = [
  "16PT MATTE",
  "SPOT UV",
  "5 BUSINESS DAYS",
  "GTA DELIVERY",
  "4C PROCESS BOTH SIDES",
  "NO MINIMUMS ON DTF",
  "SAME-DAY RUSH",
  "MISSISSAUGA, ON",
];

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-accent bg-surface-raised p-8">
      <p className={`${SPEC} text-fg-faint`}>{title}</p>
      <p className="mt-4 max-w-[64ch] text-sm text-fg-muted">{children}</p>
    </div>
  );
}

export default function MotionStyleguidePage() {
  return (
    <main>
      {/* 00 — masthead. Deliberately NOT animated: it is above the fold. */}
      <SectionFrame
        surface="ink"
        as="header"
        padding="lg"
        id="sec-motion-00"
        ticket={{ number: "00", label: "MOTION", spec: "GSAP + LENIS" }}
      >
        <Eyebrow spec="STYLEGUIDE">Motion infrastructure</Eyebrow>
        <h1 className="mt-8 font-display text-4xl font-extrabold text-fg">Press Run</h1>
        <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
          Six primitives on one clock. Everything below is scroll-driven; nothing above this
          line is, because it is above the fold and the rule is that JS never removes
          something already painted.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <MagneticCTA>
            <Button size="lg">Magnetic primary</Button>
          </MagneticCTA>
          <Button variant="outline" size="lg" href="/styleguide">
            Back to tokens
          </Button>
        </div>
      </SectionFrame>

      <MarqueeSpec items={SPECS} />

      {/* 01 — RegistrationReveal */}
      <SectionFrame
        surface="stock"
        padding="lg"
        id="sec-motion-01"
        ticket={{ number: "01", label: "REGISTRATION", spec: "SCRUB 0→1" }}
      >
        <Eyebrow number="01" spec="--reg-p">
          RegistrationReveal
        </Eyebrow>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Scroll slowly. Four plates converge as the headline crosses the viewport, scrubbed
          against its own progress. One tweened custom property drives four transforms and two
          opacities.
        </p>

        <div className="mt-24 mb-24">
          <RegistrationReveal
            as="h2"
            offset="0.12em"
            className="font-display text-3xl font-extrabold uppercase"
          >
            Surge Labs
          </RegistrationReveal>
        </div>

        <Note title="First paint">
          This headline ships <code className={SPEC}>data-reg=&quot;scrub&quot;</code> in its SSR
          HTML, but the off-register styles are gated on{" "}
          <code className={SPEC}>html[data-motion=&quot;ready&quot;]</code>, set by a synchronous
          script before the first frame. View source: the words are plain text in the markup.
          Disable JS and it renders as solid black-on-paper type.
        </Note>
      </SectionFrame>

      {/* 02 — PlateWipe across the boundary */}
      <SectionFrame
        surface="ink"
        padding="lg"
        id="sec-motion-02"
        ticket={{ number: "02", label: "PLATE WIPE", spec: "DOT 0→MAX→0" }}
        className="overflow-hidden"
      >
        <PlateWipe plate="m" edge="top" maxDot={5} pitch={11} />
        <Eyebrow number="02" spec="SCRUB">
          PlateWipe
        </Eyebrow>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          A magenta screen straddles the boundary above. Its dot radius grows from nothing to
          full coverage and back as the edge crosses the viewport, so this section appears to
          print over the one before it, then lift off.
        </p>
        <div className="mt-16">
          <Note title="What actually animates">
            One length inside a background gradient —{" "}
            <code className={SPEC}>--plate-dot</code>. No opacity crossfade of a whole section,
            no layout, and the band is absolutely positioned so it cannot shift its neighbours.
          </Note>
        </div>
      </SectionFrame>

      {/* 03 — StockFlip */}
      <StockFlip>
        <SectionFrame
          surface="stock"
          padding="lg"
          id="sec-motion-03"
          ticket={{ number: "03", label: "STOCK FLIP", spec: "CLIP + EDGE" }}
        >
          <Eyebrow number="03" spec="1PX MAGENTA">
            StockFlip
          </Eyebrow>
          <h2 className="mt-6 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
            The sheet comes off the press.
          </h2>
          <p className="mt-6 max-w-[58ch] text-fg-muted">
            This whole section entered from the bottom under a clip-path, led by a 1px magenta
            rule riding the clip line. Reload and scroll down to see it again.
          </p>
          <div className="mt-16">
            <Note title="Above-the-fold guard">
              StockFlip measures its own position before arming. If the section is already on
              screen it does nothing at all and leaves the server&rsquo;s finished markup alone.
              Same guard in CounterRoll.
            </Note>
          </div>
        </SectionFrame>
      </StockFlip>

      {/* 04 — CounterRoll */}
      <SectionFrame
        surface="ink"
        padding="lg"
        id="sec-motion-04"
        ticket={{ number: "04", label: "COUNTER", spec: "NO CLS" }}
      >
        <Eyebrow number="04" spec="MONO WHEELS">
          CounterRoll
        </Eyebrow>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Each digit is a wheel of 0–9. The whole number is tweened and the wheels are set from
          its digits, so units spin while thousands barely turn — the way a real counter behaves.
        </p>

        <div className="mt-16 grid gap-gutter border-y border-rule py-12 sm:grid-cols-3">
          {[
            { value: 1240, suffix: "+", label: "Jobs run", separator: true },
            { value: 48, suffix: "H", label: "Rush turnaround" },
            { value: 100, suffix: "%", label: "In-house" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-extrabold text-fg">
                <CounterRoll
                  value={stat.value}
                  suffix={stat.suffix}
                  separator={stat.separator}
                  className="text-inherit"
                />
              </p>
              <p className={`${SPEC} mt-4 text-fg-faint`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Note title="Reserved by construction">
            The wheels render at their final positions server-side, the box is{" "}
            <code className={SPEC}>Nch</code> wide in a monospace face, and digits are
            zero-padded to the final width — so the character count and the box width are
            identical for every intermediate value. Only transforms move.
          </Note>
        </div>
      </SectionFrame>

      <MarqueeSpec items={SPECS} reverse />

      {/* 05 — MagneticCTA */}
      <SectionFrame
        surface="stock"
        padding="lg"
        id="sec-motion-05"
        ticket={{ number: "05", label: "MAGNETIC", spec: "FINE POINTER" }}
      >
        <Eyebrow number="05" spec="DESKTOP ONLY">
          MagneticCTA
        </Eyebrow>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Hover with a mouse. Gated on{" "}
          <code className={SPEC}>(hover: hover) and (pointer: fine)</code>, so a touch device
          never arms it.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-10">
          <MagneticCTA>
            <Button size="lg">Get a quote</Button>
          </MagneticCTA>
          <MagneticCTA strength={0.45} maxOffset={20}>
            <Button size="lg" variant="outline">
              Stronger pull
            </Button>
          </MagneticCTA>
          <Button size="lg" variant="ghost">
            No magnet
          </Button>
        </div>

        <div className="mt-16">
          <Note title="Reduced motion">
            No primitive on this page calls <code className={SPEC}>matchMedia</code> itself.
            Each supplies <code className={SPEC}>animate</code> and, where the finished state
            isn&rsquo;t already what the server rendered, <code className={SPEC}>settle</code>;
            the <code className={SPEC}>useMotion</code> hook decides which runs. Flip the OS
            setting with this page open — it re-decides live, without a reload.
          </Note>
        </div>
      </SectionFrame>

      <SectionFrame
        surface="ink"
        padding="lg"
        id="sec-motion-06"
        ticket={{ number: "06", label: "END OF RUN" }}
      >
        <Eyebrow spec="END OF RUN">Press check</Eyebrow>
        <p className="mt-6 max-w-[58ch] text-fg-muted">
          Switch to another tab and back: the ticker sleeps, every ScrollTrigger is disabled,
          looping marquees stop, and any video pauses — then only the videos this page paused
          are resumed.
        </p>
      </SectionFrame>
    </main>
  );
}
