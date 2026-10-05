/**
 * The route segment exists for one line of layout: the marker that drops the
 * body gutter reserved for the job-ticket rail, which a bare route does not
 * render. See the `body:has([data-bare-route])` rule in globals.css.
 */
export default function FreeHomepageLayout({ children }: { children: React.ReactNode }) {
  return <div data-bare-route>{children}</div>;
}
