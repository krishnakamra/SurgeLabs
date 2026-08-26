import { SplitPress } from "@/components/motion";
import { Eyebrow, SectionFrame } from "@/components/ui";

const BEFORE = [
  "A web guy who ghosts",
  "A print shop across town",
  "A sign place with a two-week queue",
  "An embroiderer who needs new files",
  "An SEO agency sending PDFs",
];

const AFTER = [
  "One team that already has your files",
  "One invoice at the end of the month",
  "One set of colours, matched across every surface",
  "One phone number when something is wrong",
  "One shop that can rush it",
];

export function Split() {
  return (
    <SectionFrame
      surface="stock"
      id="the-split"
      padding="md"
      ticket={{ number: "02", label: "THE SPLIT", spec: "REGISTRATION" }}
    >
      <Eyebrow number="02" spec="SCROLL TO REGISTER">
        The split
      </Eyebrow>

      <h2 className="mt-6 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
        <span className="text-accent-text">Five vendors</span> is five chances to be off brand.
      </h2>
      <p className="mt-6 max-w-[58ch] text-md text-fg-muted">
        Your sign guy, your printer, your shirt guy, your web guy and whoever does your SEO. Each
        one gets your logo a little bit wrong. Not enough that you would phone anyone about it —
        enough that your van, your shirts and your website look like three different companies.
      </p>
      <p className="mt-5 max-w-[58ch] text-md text-fg-muted">
        We do all five here. Keep scrolling and watch it line up.
      </p>

      <div className="mt-14">
        <SplitPress
          beforeLabel="What most businesses juggle"
          beforeItems={BEFORE}
          afterLabel="What you get here"
          afterItems={AFTER}
        />
      </div>
    </SectionFrame>
  );
}
