import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/sections";
import { Breadcrumbs, SectionFrame } from "@/components/ui";
import { site } from "@/content";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  OWNER: THIS IS ACCURATE, NOT BOILERPLATE — AND IT IS NOT LEGAL ADVICE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every claim below was written by reading the code that actually runs:
 *
 *   · the fields the form collects  →  app/quote/actions.ts
 *   · where a submission is stored  →  lib/quote/storage.ts (Postgres)
 *   · who it is emailed to          →  lib/quote/email.ts (Resend)
 *   · what tracking loads           →  components/analytics/meta-pixel.tsx
 *
 * That means it stops being true the moment one of those changes. If you add
 * Google Analytics, a chat widget, a CRM or a newsletter, this page has to
 * change in the same commit.
 *
 * THREE THINGS ONLY YOU CAN DECIDE, marked in the copy below:
 *   1. How long you keep a quote request. A number has to go in.
 *   2. Who a privacy request goes to. Right now it is the general inbox.
 *   3. Whether you are comfortable with the Meta Pixel running without a
 *      consent banner. See the note in the tracking section.
 *
 * Have a lawyer read it before you spend money on ads pointing at it. It is
 * written to be honest, which is most of the work, but it is not a legal
 * opinion and nothing in this repository is.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PATH = "/privacy";
const UPDATED = "26 August 2026";

export const metadata: Metadata = {
  title: `Privacy Policy | ${site.name}`,
  description: `How Surge Labs in Mississauga collects, uses and stores the details you send through this website. Questions: ${site.email}.`,
  alternates: { canonical: PATH },
  // Indexable on purpose. A privacy policy nobody can find is not notice.
  robots: { index: true, follow: true },
};

const P = "mt-5 max-w-[68ch] text-md text-fg-muted";
const H2 = "mt-16 max-w-[26ch] font-display text-xl font-extrabold text-fg";
const LI = "flex gap-4 text-md text-fg-muted";
const BULLET = (
  <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-4 shrink-0 bg-rule-strong" />
);

export default function PrivacyPage() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <SectionFrame
          surface="ink"
          as="header"
          padding="md"
          ticket={{ number: "00", label: "PRIVACY", spec: `UPDATED ${UPDATED.toUpperCase()}` }}
        >
          <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Privacy", path: PATH }]} />
          <h1 className="mt-10 max-w-[20ch] font-display text-3xl font-extrabold text-fg">
            Privacy policy
          </h1>
          <p className="mt-8 max-w-[62ch] text-md text-fg-muted">
            This says what happens to the details you send us through this website. It is written
            to be read rather than to be defensible, and it describes what the site actually does
            — not what a template says a website might do.
          </p>
          <p className="mt-5 font-utility text-2xs uppercase tracking-utility text-fg-faint">
            Last updated {UPDATED}
          </p>
        </SectionFrame>

        <SectionFrame surface="stock" padding="md" ticket={{ number: "01", label: "WHAT WE COLLECT", spec: "PLAINLY" }}>
          <h2 className="max-w-[26ch] font-display text-2xl font-extrabold text-fg">
            What we collect, and only when you give it to us.
          </h2>

          <p className={P}>
            You can read every page on this site without telling us anything. We collect personal
            information in exactly one place: when you fill in a form or send us an email.
          </p>

          <h3 className={H2}>When you request a quote or leave your number</h3>
          <ul className="mt-6 space-y-3">
            {[
              "Your name, and your business name if you give one",
              "Your phone number, your email address, or both — one of them is enough",
              "Your city, so we know where it is going",
              "What you told us about the job: what you need, roughly when, and any notes",
              "Any artwork file you attach",
            ].map((line) => (
              <li key={line} className={LI}>
                {BULLET}
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className={P}>
            That is all. There is no account to create, no password, and we never ask for payment
            details on this website — invoices are handled separately once a job is agreed.
          </p>

          <h3 className={H2}>What we do not collect</h3>
          <p className={P}>
            We do not sell, rent or trade your information to anyone. We do not add you to a mailing
            list because you asked for a quote. There is no newsletter sign-up on this site, so
            there is nothing to unsubscribe from.
          </p>
        </SectionFrame>

        <SectionFrame surface="ink" padding="md" ticket={{ number: "02", label: "WHAT WE DO WITH IT", spec: "ONE PURPOSE" }}>
          <h2 className="max-w-[26ch] font-display text-2xl font-extrabold text-fg">
            We use it to quote your job. That is the whole purpose.
          </h2>
          <p className={P}>
            When you submit a form, two things happen. The submission is written to our database,
            and it is emailed to {site.email} so a person sees it. If you gave an email address you
            also get a copy of exactly what we recorded, so you can correct it before we quote.
          </p>
          <p className={P}>
            We then contact you about that job — by phone if you left a number, by email if you left
            an address. If the job goes ahead, we keep the details so the reorder does not start
            from scratch. If it does not, we do not chase you.
          </p>

          <h3 className={H2}>Who else sees it</h3>
          <ul className="mt-6 space-y-3">
            {[
              "Our email provider, Resend, which delivers the notification and your confirmation.",
              "Our hosting and database provider, which runs this website and stores the submission.",
              "Nobody else. We produce everything in our own building, so a print job does not get forwarded to a third-party supplier along with your details.",
            ].map((line) => (
              <li key={line} className={LI}>
                {BULLET}
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className={P}>
            Those providers process the data on our instructions and are not permitted to use it for
            anything of their own. Some of them operate servers outside Canada, which means your
            information may be stored or handled in another country and can be subject to the laws
            of that country.
          </p>
        </SectionFrame>

        <SectionFrame surface="stock" padding="md" ticket={{ number: "03", label: "TRACKING", spec: "ONE PIXEL" }}>
          <h2 className="max-w-[26ch] font-display text-2xl font-extrabold text-fg">
            One piece of tracking, and what it does.
          </h2>
          <p className={P}>
            This website loads the <strong className="font-bold text-fg">Meta Pixel</strong>, which
            is a small script from Meta (Facebook and Instagram). It records that a page was viewed
            and, if you submit a form, that a form was submitted. We use it for one thing: to see
            whether the advertising we pay for is bringing anyone here.
          </p>
          <p className={P}>
            The pixel does not receive the contents of your form. It is told that a submission
            happened, not what was in it. Meta may still combine the visit with information it
            already holds about you if you have a Facebook or Instagram account, which is how their
            advertising works generally. You can limit that in your Meta account settings, and most
            browsers and ad blockers will stop the script loading at all.
          </p>
          <p className={P}>
            There is no Google Analytics on this site, no advertising cookie of our own, no session
            recording and no chat widget.
          </p>
          {/* OWNER: this paragraph is the one to review with a lawyer. Canada
              does not currently require a cookie banner the way the EU does,
              but Quebec's Law 25 and the direction PIPEDA is moving both point
              at explicit consent for tracking of this kind. Saying plainly
              that it runs, and where to turn it off, is the honest floor. */}
        </SectionFrame>

        <SectionFrame surface="ink" padding="md" ticket={{ number: "04", label: "HOW LONG", spec: "AND YOUR RIGHTS" }}>
          <h2 className="max-w-[26ch] font-display text-2xl font-extrabold text-fg">
            How long we keep it, and how to get it back.
          </h2>
          <p className={P}>
            {/* ⚠️  OWNER: PUT A REAL NUMBER HERE. Under PIPEDA you have to be
                able to say how long you keep personal information and to
                actually destroy it when the purpose is finished. "As long as
                necessary" is what a template says; it is not a retention
                policy. Two years for a quote that went nowhere, and the life
                of the business relationship plus your tax-record obligation
                for one that became a job, is a common and defensible answer —
                but it has to be your answer. */}
            We keep quote requests for as long as we need them to do the work and to answer
            questions about a job afterwards. Artwork stays on file so reorders skip the setup, and
            you can ask us to delete it at any time.
          </p>
          <p className={P}>
            Under Canada&rsquo;s Personal Information Protection and Electronic Documents Act you can
            ask us what we hold about you, ask for it to be corrected, and ask us to delete it. Email{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-bold text-fg underline decoration-[length:var(--hairline)] underline-offset-4"
            >
              {site.email}
            </a>{" "}
            or call{" "}
            <a
              href={site.phoneHref}
              className="font-bold text-fg underline decoration-[length:var(--hairline)] underline-offset-4"
            >
              {site.phone}
            </a>
            . We will come back to you within 30 days.
          </p>
          <p className={P}>
            If you are not happy with how we handled it, you can complain to the Office of the
            Privacy Commissioner of Canada.
          </p>

          <h3 className={H2}>Keeping it safe</h3>
          <p className={P}>
            The site is served over HTTPS, form submissions are stored in an access-controlled
            database, and the notification goes to a single business inbox. No system is perfect and
            we will not pretend otherwise — but nothing sensitive is asked for here, and we do not
            hold payment details on this website.
          </p>
        </SectionFrame>

        <SectionFrame surface="stock" padding="md" ticket={{ number: "05", label: "CONTACT", spec: "MON–FRI 9–6" }}>
          <h2 className="max-w-[24ch] font-display text-2xl font-extrabold text-fg">
            Ask us anything about this.
          </h2>
          <address className="mt-8 max-w-[40ch] text-md not-italic text-fg-muted">
            <span className="font-bold text-fg">{site.name}</span>
            <br />
            {site.address.streetAddress}
            <br />
            {site.address.locality}, {site.address.region}
            <br />
            <a href={site.phoneHref} className="underline decoration-[length:var(--hairline)] underline-offset-4">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="underline decoration-[length:var(--hairline)] underline-offset-4">
              {site.email}
            </a>
          </address>
          <p className={P}>
            If we change this policy we will change the date at the top of the page. This version
            replaces anything said elsewhere on the site.
          </p>
          <p className="mt-10">
            <Link
              href="/contact"
              className="font-utility text-2xs uppercase tracking-utility text-link underline decoration-[length:var(--hairline)] underline-offset-[6px]"
            >
              Directions, hours and the delivery map
            </Link>
          </p>
        </SectionFrame>
      </main>
      <SiteFooter />
    </>
  );
}
