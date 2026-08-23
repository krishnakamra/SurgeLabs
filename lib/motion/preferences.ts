export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Defaults to `true` off the browser. Server-rendering and the moment before
 * hydration should both behave as if motion is unwelcome — the fallback is
 * always the finished state, never a hidden one.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Mouse or trackpad, not a finger. Gates pointer-follow effects. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

/**
 * True when the element starts below the fold.
 *
 * Primitives that hide their content before revealing it (StockFlip's clip,
 * CounterRoll's reset to zero) call this before arming. Above the fold they
 * simply don't arm — the SSR markup is already the finished state, and the
 * rule is that JS never removes something the user has already been shown.
 */
export function startsBelowFold(element: Element, slack = 24): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top >= window.innerHeight - slack;
}
