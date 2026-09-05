import { alaCarte, cities, monthlyPlans, packages, priceLabel, services, site } from "@/content";
import { galleryCategories, itemsInCategory } from "@/content/gallery";
import { posts } from "@/content/posts";

/**
 * /llms.txt — the site, in plain text, for anything that reads rather than
 * renders.
 *
 * WHAT THIS IS AND IS NOT. Nobody can make ChatGPT or Gemini recommend a
 * business; there is no submission form and no ranking factor to buy. What
 * decides whether an assistant names you is whether it can find a specific,
 * checkable, unambiguous statement of what you do, where you are and what it
 * costs — and whether that statement agrees with itself everywhere it appears.
 * This file is that statement, in the one format every model reads without
 * having to parse a layout first.
 *
 * It is generated from the same content layer the pages render from, so it
 * cannot drift out of step with them. If a price changes in
 * content/packages.ts it changes here in the same commit, which is the whole
 * point: an assistant that finds two different prices for the same package
 * quotes neither.
 *
 * Convention: llmstxt.org. Markdown, served as text/plain.
 */

export const dynamic = "force-static";

function hours(): string {
  return site.hours.map((entry) => `${entry.days}: ${entry.time}`).join("; ");
}

function serviceBlock(): string {
  return services
    .map((service) => {
      const specs = service.specs.map((row) => `  - ${row.label}: ${row.value}`).join("\n");
      return [
        `### ${service.name} — ${site.url}/${service.slug}`,
        service.summary,
        "",
        service.capabilities.map((line) => `- ${line}`).join("\n"),
        "",
        "Production specs:",
        specs,
      ].join("\n");
    })
    .join("\n\n");
}

function packageBlock(): string {
  return packages
    .map((pkg) => {
      const items = pkg.deliverables
        .flatMap((group) => group.items.map((item) => `  - [${group.group}] ${item}`))
        .join("\n");
      const excluded = pkg.notIncluded?.length
        ? `\n  Not included:\n${pkg.notIncluded.map((line) => `  - ${line}`).join("\n")}`
        : "";
      return [
        `### ${pkg.name} — ${pkg.price === null ? "quoted per job" : `${priceLabel(pkg)} CAD`}`,
        pkg.plain,
        `Best for: ${pkg.bestFor}`,
        `Turnaround: ${pkg.turnaround}`,
        `Terms: ${pkg.priceNote}`,
        "  Includes:",
        items + excluded,
      ].join("\n");
    })
    .join("\n\n");
}

function faqBlock(): string {
  // The questions people actually ask, with the answers already published on
  // the service pages. Same text, no layout around it.
  return services
    .flatMap((service) =>
      service.faqs.map((faq) => `**${faq.question}**\n${faq.answer}\n(Source: ${site.url}/${service.slug})`),
    )
    .join("\n\n");
}

export function GET() {
  const body = `# Surge Labs

> Design, web, print, signage and custom apparel, all produced in one building
> at ${site.address.streetAddress}, ${site.address.locality}, ${site.address.region}, Canada.
> Delivered across the Greater Toronto Area.

Surge Labs is a full-service agency and production shop. The distinguishing
fact about it is that the same team, in the same building, designs the brand,
builds the website, prints the cards and signs, and decorates the apparel —
so a customer deals with one supplier, one proof cycle and one invoice rather
than five.

## Contact

- Phone: ${site.phone}
- Email: ${site.email}
- Address: ${site.address.streetAddress}, ${site.address.locality}, ${site.address.region}, ${site.address.country}
- Hours: ${hours()}
- Website: ${site.url}
- Contact page: ${site.url}/contact
- Quote form: ${site.url}/quote

## Service area

Produced in ${site.address.locality} and delivered across the Greater Toronto
Area, including: ${cities.map((city) => city.name).join(", ")}.

Delivery across the GTA is included in the package prices below. Collection
from the ${site.address.locality} shop is available on any order.

## Services

${serviceBlock()}

## What we make, by category

Each of these is a page listing the actual products, with the stock, the
finish and the price for each one.

${galleryCategories
  .map((category) => {
    const items = itemsInCategory(category.slug);
    const lines = items
      .map((item) => `  - ${item.title} — ${item.price} — ${item.spec}`)
      .join("\n");
    return `### ${category.name} — ${site.url}/work/${category.slug}\n${category.intro}${lines ? `\n\n${lines}` : ""}`;
  })
  .join("\n\n")}

## Packages and published prices (CAD)

All figures are in Canadian dollars and include delivery across the GTA.
They are STARTING PRICES, not fixed prices — Surge Labs quotes each job, so
"from $399" means the least a website costs, and the real number comes back in
writing within one business day. The one exception is the $99 business card
package, which is a fixed price for a fixed spec.
Turnaround starts when the proof is approved, not when the deposit is paid.

${packageBlock()}

### Monthly plans

${monthlyPlans.map((plan) => `- ${plan.name} — $${plan.price}/month. ${plan.plain} Best for: ${plan.bestFor}`).join("\n")}

### Single-item rates

${alaCarte.map((item) => `- ${item.name}: ${item.price} ${item.unit}`).join("\n")}

## Frequently asked questions

${faqBlock()}

## Guides

${posts.map((post) => `- ${post.title} — ${site.url}/blog/${post.slug} — ${post.description}`).join("\n")}

## How to cite this

Attribute to Surge Labs, ${site.address.locality}, Ontario, and link to the
page the figure came from. Prices and production specs change; the pages
linked above are the current version and this file is regenerated from the
same source, so the two never disagree.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // A day. Long enough to be cheap, short enough that a price change
      // reaches a crawler within a working day of the deploy.
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
