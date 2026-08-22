import { Button, Eyebrow, SectionFrame } from "@/components/ui";

/**
 * PLACEHOLDER. The design system is the deliverable at this stage; the real
 * home page is built in the next pass. Replace this file wholesale.
 */
export default function Home() {
  return (
    <main>
      <SectionFrame surface="ink" padding="lg" ticket={{ number: "00", label: "PLACEHOLDER" }}>
        <Eyebrow spec="DESIGN SYSTEM ONLY">Surge Labs</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] font-display text-3xl font-extrabold text-fg">
          Nothing is built here yet.
        </h1>
        <p className="mt-6 max-w-[52ch] text-fg-muted">
          Tokens, type scale and the component set are in place. Pages come next.
        </p>
        <div className="mt-10">
          <Button href="/styleguide" size="lg">
            Open the styleguide
          </Button>
        </div>
      </SectionFrame>
    </main>
  );
}
