import Link from "next/link";
import { PinnedPanel } from "@/components/motion";
import { Eyebrow, PanelMedia } from "@/components/ui";
import { services } from "@/content";
import { loopForService } from "@/content/media";

/**
 * Three panels, each holding for 60vh of scroll. The hold is `position:
 * sticky` inside a box that reserves its own distance — see PinnedPanel for
 * why that beats ScrollTrigger's pin here.
 *
 * Surfaces alternate so the run reads as sheets going through the press.
 */
export function Services() {
  return (
    <section id="services">
      {services.map((service, index) => {
        const surface = index % 2 === 0 ? "ink" : "stock";

        return (
          <div
            key={service.slug}
            data-surface={surface}
            data-ticket-number="03"
            data-ticket-label={service.name.toUpperCase()}
            data-ticket-spec={`${index + 1} OF ${services.length}`}
            className="relative isolate bg-surface text-fg"
          >
            <PinnedPanel hold="60vh" revealSelector="[data-reveal]">
              <div className="mx-auto grid w-full max-w-page items-center gap-x-gutter gap-y-12 px-gutter lg:grid-cols-12">
                <div className="lg:col-span-6 xl:col-span-5">
                  <div data-reveal className="flex items-baseline gap-6">
                    <span
                      aria-hidden="true"
                      className="font-utility text-3xl leading-[0.8] font-normal text-mark"
                    >
                      {service.number}
                    </span>
                    <Eyebrow mark={false}>Service</Eyebrow>
                  </div>

                  <h2
                    data-reveal
                    className="mt-8 font-display text-2xl font-normal text-fg"
                  >
                    {service.name}
                  </h2>

                  <p data-reveal className="mt-5 max-w-[46ch] text-md text-fg-muted">
                    {service.summary}
                  </p>

                  <ul data-reveal className="mt-10 grid gap-x-gutter gap-y-3 sm:grid-cols-2">
                    {service.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex gap-3 text-sm text-fg-muted"
                      >
                        <span aria-hidden="true" className="mt-[0.7em] h-[var(--hairline)] w-3 shrink-0 bg-rule-strong" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>

                  <p
                    data-reveal
                    className="mt-10 border-t-[length:var(--hairline)] border-rule pt-6 font-utility text-2xs uppercase tracking-utility text-fg-faint"
                  >
                    {service.spec}
                  </p>

                  <p data-reveal className="mt-8">
                    <Link
                      href={`/${service.slug}`}
                      className="font-utility text-2xs uppercase tracking-utility-tight text-fg underline decoration-1 underline-offset-[7px] decoration-rule-strong transition-colors hover:decoration-mark"
                    >
                      {service.name} in detail
                    </Link>
                  </p>
                </div>

                <div data-reveal className="lg:col-span-6 lg:col-start-7">
                  <PanelMedia
                    numeral={service.number}
                    plate={index === 0 ? "c" : index === 1 ? "m" : "k"}
                    asset={loopForService[service.slug]}
                  />
                </div>
              </div>
            </PinnedPanel>
          </div>
        );
      })}
    </section>
  );
}
