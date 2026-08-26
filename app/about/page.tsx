import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { serviceProcess, services, site } from "@/content";
import { imageSrc, pageStills } from "@/content/media";
import { buildMetadata, getPageSeo } from "@/lib/seo/page-seo";
import { breadcrumbs, pageGraph, webPage } from "@/lib/seo/schema";

const PATH = "/about";
const seo = getPageSeo(PATH)!;

export const metadata: Metadata = buildMetadata({ path: PATH, seo, ogEyebrow: "Mississauga, ON" });

const SPEC = "font-utility text-2xs uppercase tracking-utility";

/**
 * ⚠️  OWNER: WHAT IS DELIBERATELY MISSING FROM THIS PAGE.
 *
 * There is no founding year, no staff count, no "years of experience", no
 * client count and no awards. None of those were supplied, and an About page
 * is the single easiest place for an invented number to become a claim the
 * business has to stand behind.
 *
 * Everything below is either already true and published elsewhere on this
 * site — the address, the hours, the service list, the in-house production
 * model — or it is a description of the shop's approach, which is opinion
 * rather than fact. When you have the real figures, the obvious places for
 * them are a line in the opening section and a stat in content/stats.ts.
 *
 * The equipment list is derived from the production specs you confirmed in
 * content/services.ts. It does not add a machine those specs do not already
 * imply. If a spec changes there, check this list.
 */

/** Each line is implied by a confirmed spec in content/services.ts. */
const FLOOR: readonly { label: string; detail: string; from: string }[] = [
  {
    label: "Wide-format press",
    detail: "54\" seamless roll — banners, vinyl, coroplast and vehicle lettering",
    from: "printing-signage",
  },
  {
    label: "Sheet-fed digital",
    detail: "16pt C2S, 18pt uncoated and 32pt painted-edge card stock",
    from: "printing-signage",
  },
  {
    label: "Foil press",
    detail: "Hot foil stamping, blind deboss and letterpress, dies kept on file",
    from: "gold-foil-stationery",
  },
  {
    label: "Screen line",
    detail: "Up to six colours per design, from 24 pieces",
    from: "custom-apparel",
  },
  {
    label: "DTF printer",
    detail: "Up to 13 × 19 inches, no minimum — one piece is an order",
    from: "custom-apparel",
  },
  {
    label: "Embroidery heads",
    detail: "Up to 15 thread colours in a single design, digitised in-house",
    from: "custom-apparel",
  },
  {
    label: "Design desks",
    detail: "Logos drawn here, and old ones redrawn as vector files that print",
    from: "graphic-design",
  },
];

function graph() {
  return pageGraph([
    webPage({ path: PATH, name: seo.title, description: seo.description }),
    breadcrumbs([
      { name: "Home", path: "/" },
      { name: "About", path: PATH },
    ]),
  ]);
}

export default function AboutPage() {
  const { address } = site;

  return (
    <>
      <Schema graph={graph()} />
      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="lg"
          ticket={{ number: "00", label: "ABOUT", spec: "SKYMARK AVE" }}
          className="overflow-hidden"
        >
          <HalftoneField plate="k" pitch={8} dot={1.5} opacity={0.15} fade="radial" seed={23} />
          <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "About", path: PATH }]} />
          <Eyebrow spec={site.serviceArea}>About</Eyebrow>
          <h1 className="mt-10 max-w-[18ch] font-display text-3xl font-extrabold text-fg">{seo.h1}</h1>

          <p className="mt-10 max-w-[62ch] text-md text-fg-muted">
            Surge Labs is a design, print, signage and apparel shop in Mississauga. We build
            websites, draw logos, print cards and signs, and stitch shirts &mdash; all of it in the
            same building, by the same people. The reason the blue on your website matches the blue
            on your van is that nobody had to email it to anybody.
          </p>

          {/* The three facts people open an About page to find, put where they
              cannot be missed. Address, hours and phone all render from
              content/site.ts, which is the one place they are written down. */}
          <dl className="mt-12 grid gap-x-gutter gap-y-8 border-t-[length:var(--hairline)] border-rule pt-10 sm:grid-cols-3">
            <div>
              <dt className={`${SPEC} text-fg-faint`}>Where we are</dt>
              <dd className="mt-4 font-display text-lg leading-snug font-bold text-fg">
                {address.streetAddress}
                <br />
                {address.locality}, {address.region}
              </dd>
            </div>
            <div>
              <dt className={`${SPEC} text-fg-faint`}>When we are open</dt>
              <dd className="mt-4 font-display text-lg leading-snug font-bold text-fg">
                {site.hours[0]!.days}
                <br />
                {site.hours[0]!.time}
              </dd>
            </div>
            <div>
              <dt className={`${SPEC} text-fg-faint`}>Phone</dt>
              <dd className="mt-4">
                <a
                  href={site.phoneHref}
                  className="font-numeral text-xl leading-none font-black tabular-nums text-accent-text underline decoration-2 decoration-transparent underline-offset-[10px] transition-colors hover:decoration-accent-text"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>

          <p className="mt-8">
            <Link
              href="/contact"
              className={`${SPEC} text-link underline decoration-[length:var(--hairline)] underline-offset-[6px]`}
            >
              Directions, full hours and a map of where we deliver
            </Link>
          </p>
        </SectionFrame>

        {/* 01 — the model */}
        <SectionFrame
          surface="stock"
          id="model"
          padding="lg"
          ticket={{ number: "01", label: "THE MODEL", spec: "IN-HOUSE" }}
        >
          <Eyebrow number="01" spec="NO SUBCONTRACTING">
            How it works
          </Eyebrow>
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
            <span className="text-accent-text">Five vendors</span> is five chances to be off brand.
          </h2>

          <div className="mt-12 grid gap-x-gutter gap-y-10 lg:grid-cols-2">
            <div className="space-y-8">
              <p className="max-w-[60ch] text-md text-fg-muted">
                Most businesses buy their brand from five different places. A web person builds the
                site. A designer draws the logo, usually once, years ago. A printer does the cards.
                A sign company does the storefront and the van. Somebody&rsquo;s cousin does the
                shirts.
              </p>
              <p className="max-w-[60ch] text-md text-fg-muted">
                Every one of them gets your logo a little bit wrong. The blue shifts. The logo gets
                stretched to fit a shape it was not drawn for. Somebody works from a JPG off an old
                card because that is all they were sent. None of it is bad enough to phone about,
                and all of it adds up: your van, your shirts and your website end up looking like
                three separate companies.
              </p>
              <p className="max-w-[60ch] text-md text-fg-muted">
                We do all five on one floor at {address.streetAddress}. One set of files, one
                colour build, one proof to approve, one bill at the end. When the sign colour and
                the polo colour have to match, the two people responsible are standing near each
                other.
              </p>
            </div>
            <div className="space-y-8">
              <p className="max-w-[60ch] text-md text-fg-muted">
                It is not a claim about being cheaper. Doing it in-house removes the coordination,
                not the cost &mdash; what you stop paying for is being the project manager between
                five suppliers who each think their part is finished.
              </p>
              <p className="max-w-[60ch] text-md text-fg-muted">
                What it does change is time. A reorder skips straight to production because the file
                is already here. A rush job does not wait for someone else&rsquo;s queue. And when
                something is wrong, there is one number to call and nobody to blame it on.
              </p>
              <p className="max-w-[60ch] text-md text-fg-muted">
                The trade-off is honest, so here it is. A specialist agency will out-build us on a
                very large web project, and a dedicated sign shop will out-scale us on a fifty-store
                rollout. If that is your job, we will tell you on the phone. What we are good at is
                a whole brand, made once, that matches everywhere it lands.
              </p>
            </div>
          </div>

          <div className="relative mt-16 aspect-[3/2] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken sm:aspect-[21/9]">
            <Image
              src={imageSrc(pageStills.workshop)}
              alt={pageStills.workshop.alt}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
            />
          </div>
        </SectionFrame>

        {/* 02 — the floor */}
        <SectionFrame
          surface="ink"
          id="floor"
          padding="lg"
          ticket={{ number: "02", label: "THE FLOOR", spec: "WHAT RUNS HERE" }}
        >
          <Eyebrow number="02" spec="ONE BUILDING">
            The floor
          </Eyebrow>
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
            What actually runs on the premises.
          </h2>
          <p className="mt-8 max-w-[60ch] text-fg-muted">
            Every line below is the equipment behind a production spec published on the service
            pages. If a spec is on this site, the machine that makes it is in this building.
          </p>

          <dl className="mt-14 grid gap-x-gutter gap-y-12 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {FLOOR.map((item) => (
              <div key={item.label}>
                <dt className="font-display text-lg font-bold text-fg">{item.label}</dt>
                <dd className="mt-4 max-w-[34ch] text-sm text-fg-muted">{item.detail}</dd>
                <dd className="mt-5">
                  <Link
                    href={`/${item.from}`}
                    className={`${SPEC} text-link underline decoration-[length:var(--hairline)] underline-offset-4`}
                  >
                    See the specs
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </SectionFrame>

        {/* 03 — how we work */}
        <SectionFrame
          surface="stock"
          id="principles"
          padding="lg"
          ticket={{ number: "03", label: "HOW WE WORK", spec: "PLAINLY" }}
        >
          <Eyebrow number="03" spec="FOUR RULES">
            How we work
          </Eyebrow>
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-extrabold text-fg">
            Four things we will not do.
          </h2>

          <ol className="mt-14 grid gap-x-gutter gap-y-14 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "Quote a price we cannot hold",
                d: "Written quotes, weekdays, within one business day. If a stock price moves before you approve, we tell you before the job runs, not on the invoice.",
              },
              {
                n: "02",
                t: "Publish a spec we cannot honour",
                d: "Every stock weight, turnaround and minimum on this site is a real one. If we cannot do it on a Tuesday afternoon in February, it does not go on the page.",
              },
              {
                n: "03",
                t: "Hold your files hostage",
                d: "Domain, hosting, code, analytics and artwork stay yours. Foil dies stay on file here so reorders are cheaper, and you can have them.",
              },
              {
                n: "04",
                t: "Take a job that is wrong for us",
                d: "Under 250 pieces you do not want foil, you want metallic digital. We would rather tell you that on the phone than sell you a setup charge.",
              },
            ].map((rule) => (
              <li key={rule.n}>
                <p className={`${SPEC} text-accent-text`}>{rule.n}</p>
                <h3 className="mt-5 max-w-[20ch] font-display text-lg font-bold text-fg">
                  {rule.t}
                </h3>
                <p className="mt-5 max-w-[52ch] text-sm text-fg-muted">{rule.d}</p>
              </li>
            ))}
          </ol>
        </SectionFrame>

        {/* 04 — what happens when you get in touch */}
        <SectionFrame
          surface="ink"
          id="what-happens"
          padding="lg"
          ticket={{ number: "04", label: "WHAT HAPPENS", spec: "FOUR STEPS" }}
        >
          <Eyebrow number="04" spec="NO SURPRISES">
            What happens next
          </Eyebrow>
          <h2 className="mt-8 max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            What actually happens after you call.
          </h2>
          <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
            The same four steps on every job, whether it is a hundred dollars of business cards or
            a full rebrand. Nothing goes to production until you have seen it and said yes.
          </p>

          <ol className="mt-14 grid gap-x-gutter gap-y-12 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {serviceProcess.map((step) => (
              <li key={step.step}>
                <p className="font-numeral text-2xl leading-none font-black tabular-nums text-accent-text">
                  {step.step}
                </p>
                <h3 className="mt-5 font-display text-lg font-bold text-fg">{step.title}</h3>
                <p className="mt-4 max-w-[34ch] text-sm text-fg-muted">{step.detail}</p>
              </li>
            ))}
          </ol>

          <div className="relative mt-16 aspect-[3/2] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken sm:aspect-[21/9]">
            <Image
              src={imageSrc(pageStills.proofing)}
              alt={pageStills.proofing.alt}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
            />
          </div>
        </SectionFrame>

        {/* 05 — find us. The full version, with the map, lives on /contact;
            this is the short one, because an About page is where people look
            for an address and it should not send them away to get it. */}
        <SectionFrame
          surface="stock"
          id="find-us"
          padding="lg"
          ticket={{ number: "05", label: "FIND US", spec: "MON–FRI 9–6" }}
        >
          <Eyebrow number="05" spec={site.serviceArea}>
            Find us
          </Eyebrow>
          <h2 className="mt-8 max-w-[20ch] font-display text-2xl font-extrabold text-fg">
            Come and look at the stock.
          </h2>
          <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
            Paper is hard to choose on a screen. A 16pt matte card and a 32pt painted-edge card
            cost very different amounts and feel completely different in a hand. If you are
            anywhere near Mississauga, twenty minutes with the sample box before you approve a
            proof is worth the drive.
          </p>

          <div className="mt-14 grid gap-x-gutter gap-y-10 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-3">
            <div>
              <p className={`${SPEC} text-fg-faint`}>Address</p>
              <address className="mt-5 font-display text-lg leading-snug font-bold not-italic text-fg">
                {address.streetAddress}
                <br />
                {address.locality}, {address.region}
                {address.postalCode ? ` ${address.postalCode}` : ""}
              </address>
            </div>
            <div>
              <p className={`${SPEC} text-fg-faint`}>Hours</p>
              <dl className="mt-5 space-y-3">
                {site.hours.map((entry) => (
                  <div key={entry.days} className="text-sm text-fg-muted">
                    <dt className="inline">{entry.days}: </dt>
                    <dd className="inline font-bold text-fg">{entry.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className={`${SPEC} text-fg-faint`}>What we make</p>
              <ul className="mt-5 space-y-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}`}
                      className="text-sm text-fg-muted underline decoration-[length:var(--hairline)] decoration-transparent underline-offset-4 transition-colors hover:text-fg hover:decoration-mark"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-6">
            <Button href={site.phoneHref} size="lg">
              Call {site.phone}
            </Button>
            <Button href="/contact" size="lg" variant="outline">
              Directions and map
            </Button>
          </div>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
