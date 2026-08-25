import { Logo } from "@/components/brand";

/**
 * The mark, alone, holding the page.
 *
 * The third documented use of the mark-only lockup, after the favicon and the
 * phone masthead: a loading state has no room for a wordmark and no time for
 * one to be read. It pulses between fg-faint and fg rather than spinning —
 * the system has no spinners in it, and a plate coming up to density is the
 * one idea here that is actually about printing.
 *
 * Under reduced motion it simply sits there, which is a fine loading state.
 *
 * On a site this static it will rarely be seen: every route is prerendered,
 * so this shows only when a navigation has to wait on the network. It is here
 * so that when that does happen the page is still the brand's.
 */
export default function Loading() {
  return (
    <div
      data-surface="ink"
      className="flex min-h-[60svh] items-center justify-center bg-surface text-fg"
    >
      <Logo
        variant="mark"
        size={48}
        title="Loading"
        className="animate-plate-pulse text-fg-faint motion-reduce:animate-none"
      />
    </div>
  );
}
