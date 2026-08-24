/**
 * One JSON-LD graph per page.
 *
 * Rendering it through a component rather than inline keeps the serialisation
 * identical everywhere, and makes it obvious at a glance which pages have
 * structured data and which have been forgotten.
 */
export function Schema({ graph }: { graph: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The graph is built from typed content in this repo, never from user
      // input, so there is nothing here to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
