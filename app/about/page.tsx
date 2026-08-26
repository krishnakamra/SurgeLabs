import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/sections";
import { Schema } from "@/components/seo/schema";
import { Breadcrumbs, Button, Eyebrow, HalftoneField, SectionFrame } from "@/components/ui";
import { services, site } from "@/content";
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
          <h1 className="mt-10 max-w-[18ch] font-display text-3xl font-normal text-fg">{seo.h1}</h1>
          <p className="mt-10 max-w-[60ch] text-md text-fg-muted">
            One shop, one floor, four things that are usually four suppliers. The reason the blue on
            your website matches the blue on your van is that the same people made both.
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
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-normal text-fg">
            Everything is made here, which is the whole argument.
          </h2>

          <div className="mt-12 grid gap-x-gutter gap-y-10 lg:grid-cols-2">
            <div className="space-y-8">
              <p className="max-w-[60ch] text-fg-muted">
                Most businesses buy their brand from four places. A web agency builds the site, a
                print broker sources the cards, a sign company does the storefront and someone&rsquo;s
                cousin does the shirts. Each one gets the logo slightly wrong — not enough to
                complain about, enough that the four of them do not look like the same company.
              </p>
              <p className="max-w-[60ch] text-fg-muted">
                We do all four on one floor at {address.streetAddress}. That means one colour build,
                one set of files, one proof cycle and one invoice. It also means when the sign
                colour and the polo colour have to match, the two people responsible are standing
                near each other.
              </p>
            </div>
            <div className="space-y-8">
              <p className="max-w-[60ch] text-fg-muted">
                It is not a claim about being cheaper. Doing it in-house removes coordination, not
                cost — you stop being the project manager between four vendors who each think their
                part is finished.
              </p>
              <p className="max-w-[60ch] text-fg-muted">
                The trade-off is honest: a specialist agency will out-build us on a very large web
                project, and a dedicated sign shop will out-scale us on a fifty-store rollout. If
                that is the job, we will say so. What we are good at is a whole brand, produced
                once, that matches everywhere it lands.
              </p>
            </div>
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
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-normal text-fg">
            What actually runs on the premises.
          </h2>
          <p className="mt-8 max-w-[60ch] text-fg-muted">
            Every line below is the equipment behind a production spec published on the service
            pages. If a spec is on this site, the machine that makes it is in this building.
          </p>

          <dl className="mt-14 grid gap-x-gutter gap-y-12 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {FLOOR.map((item) => (
              <div key={item.label}>
                <dt className="font-display text-lg font-medium text-fg">{item.label}</dt>
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
          <h2 className="mt-8 max-w-[22ch] font-display text-2xl font-normal text-fg">
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
                <h3 className="mt-5 max-w-[20ch] font-display text-lg font-medium text-fg">
                  {rule.t}
                </h3>
                <p className="mt-5 max-w-[52ch] text-sm text-fg-muted">{rule.d}</p>
              </li>
            ))}
          </ol>
        </SectionFrame>

        {/* 04 — find us */}
        <SectionFrame
          surface="ink"
          id="find-us"
          padding="lg"
          ticket={{ number: "04", label: "FIND US", spec: "MON–FRI 9–6" }}
        >
          <Eyebrow number="04" spec={site.serviceArea}>
            Find us
          </Eyebrow>
          <h2 className="mt-8 max-w-[20ch] font-display text-2xl font-normal text-fg">
            Come and look at the stock.
          </h2>
          <p className="mt-8 max-w-[58ch] text-md text-fg-muted">
            Paper is difficult to choose on a screen. If you are anywhere near Mississauga, it is
            worth twenty minutes with the sample box before you approve a proof.
          </p>

          <div className="mt-14 grid gap-x-gutter gap-y-10 border-t-[length:var(--hairline)] border-rule pt-12 sm:grid-cols-3">
            <div>
              <p className={`${SPEC} text-fg-faint`}>Address</p>
              <address className="mt-4 text-sm not-italic text-fg-muted">
                {address.streetAddress}
                <br />
                {address.locality}, {address.region}
                {address.postalCode ? ` ${address.postalCode}` : ""}
              </address>
            </div>
            <div>
              <p className={`${SPEC} text-fg-faint`}>Hours</p>
              <dl className="mt-4 space-y-2">
                {site.hours.map((entry) => (
                  <div key={entry.days} className="text-sm text-fg-muted">
                    <dt className="inline">{entry.days}: </dt>
                    <dd className="inline text-fg">{entry.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className={`${SPEC} text-fg-faint`}>Services</p>
              <ul className="mt-4 space-y-2">
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
            <Button href="/quote" size="lg">
              Get a quote
            </Button>
            <Button href={site.phoneHref} size="lg" variant="outline">
              Call {site.phone}
            </Button>
          </div>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
