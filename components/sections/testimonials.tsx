import { Eyebrow, SectionFrame } from "@/components/ui";
import { testimonials } from "@/content";

/**
 * Renders nothing while content/testimonials.ts is empty — no placeholder
 * cards, no "coming soon", no invented quotes. An absent section reads as
 * a site that hasn't got round to it; a fabricated one is a false
 * endorsement.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <SectionFrame
      surface="stock"
      id="testimonials"
      padding="lg"
      ticket={{ number: "07", label: "TESTIMONIALS", spec: "ATTRIBUTED" }}
    >
      <Eyebrow number="07" spec="REAL NAMES ONLY">
        What clients say
      </Eyebrow>

      <ul className="mt-16 grid gap-gutter lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li key={`${testimonial.name}-${testimonial.business}`}>
            <figure className="flex h-full flex-col border-[length:var(--hairline)] border-rule bg-surface-raised p-8">
              <blockquote className="flex-1 font-display text-lg font-bold text-fg">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t-[length:var(--hairline)] border-rule pt-6">
                <p className="font-utility text-2xs uppercase tracking-utility text-fg">
                  {testimonial.name}
                </p>
                <p className="mt-2 text-sm text-fg-muted">{testimonial.business}</p>
                <p className="mt-3 font-utility text-2xs uppercase tracking-utility text-fg-faint">
                  {testimonial.work}
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
