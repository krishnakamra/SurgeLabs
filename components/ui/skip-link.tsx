/**
 * Skip to content.
 *
 * Off-screen until focused, then it lands as a real button at the top-left.
 * It is the first thing in the tab order on every page, which is the whole
 * point: without it a keyboard user tabs through the rail and the breadcrumb
 * on every single navigation before reaching anything they came for.
 *
 * Not `display: none` or `visibility: hidden` — either would make it
 * unfocusable and therefore useless. Clipped and moved off-canvas is the
 * technique that keeps it in the tab order.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="absolute left-4 top-4 z-[100] -translate-y-[200%] rounded-[2px] bg-accent px-5 py-3 font-utility text-2xs uppercase tracking-utility text-accent-fg transition-transform duration-[var(--dur-snap)] ease-press focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      Skip to content
    </a>
  );
}
