"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { startsBelowFold } from "@/lib/motion/preferences";
import { useMotion } from "@/lib/motion/use-motion";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export type CounterRollProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Group thousands. Leading zeros are kept — a counter shows all its wheels. */
  separator?: boolean;
  /** Roll duration in seconds. */
  duration?: number;
  className?: string;
};

function format(value: number, width: number, separator: boolean): string {
  const digits = Math.max(0, Math.round(value)).toString().padStart(width, "0");
  if (!separator) return digits;
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * A press counter: each digit is a wheel of 0–9 that rolls to its value.
 *
 * The whole number is tweened and the wheels are positioned from its digits,
 * so they roll at genuinely different rates — units spinning, thousands
 * barely turning — the way a mechanical counter does.
 *
 * No layout shift, by construction:
 *  - the wheels render at their FINAL positions server-side, so first paint
 *    is the finished number;
 *  - the box is `Nch` wide in the monospace utility face, so the width is
 *    identical for every intermediate value;
 *  - digits are zero-padded to the final width, so the character count never
 *    changes mid-roll;
 *  - only transforms animate.
 *
 * The visible wheels are aria-hidden; the value reaches assistive tech as
 * ordinary text that is correct from the first byte of HTML.
 */
export function CounterRoll({
  value,
  prefix = "",
  suffix = "",
  separator = false,
  duration = 1.8,
  className,
}: CounterRollProps) {
  const root = useRef<HTMLSpanElement | null>(null);
  const wheels = useRef<Array<HTMLSpanElement | null>>([]);

  const width = Math.max(1, Math.round(Math.abs(value))).toString().length;
  const formatted = format(value, width, separator);
  const characters = [...formatted];

  useMotion({
    scope: root,
    deps: [value, duration, separator],
    animate({ gsap, scope }) {
      if (!scope) return;

      const paint = (n: number) => {
        const digits = [...format(n, width, separator)].filter((c) => /\d/.test(c));
        digits.forEach((digit, index) => {
          const wheel = wheels.current[index];
          // `y: 0` is load-bearing. The wheels ship with an inline
          // translateY(-N%) so the server renders the final number; GSAP
          // parses that off the computed matrix into its own `y` cache in px
          // and then applies yPercent *in addition* to it, landing on exactly
          // twice the intended offset — a counter reading 6 for a value of 3.
          // Zeroing y each time makes yPercent the only vertical term.
          if (wheel) gsap.set(wheel, { y: 0, yPercent: -Number(digit) * 10 });
        });
      };

      // On screen already: it is showing the right number, leave it there.
      if (!startsBelowFold(scope)) return;

      const state = { n: 0 };
      paint(0);

      gsap.to(state, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => paint(state.n),
        scrollTrigger: { trigger: scope, start: "top 85%", once: true },
      });
    },
  });

  let wheelIndex = 0;

  return (
    <span ref={root} className={cn("font-numeral font-extrabold tabular-nums", className)}>
      <span className="sr-only">{`${prefix}${formatted}${suffix}`}</span>

      <span aria-hidden="true" className="inline-flex items-baseline leading-none">
        {prefix ? <span>{prefix}</span> : null}

        {characters.map((character, index) => {
          if (!/\d/.test(character)) {
            // Separators are static, but still occupy a full character cell so
            // the strip width is exactly the number of characters.
            return (
              <span key={`sep-${index}`} className="inline-block w-[1ch] text-center">
                {character}
              </span>
            );
          }

          const slot = wheelIndex++;
          return (
            <span
              key={`wheel-${index}`}
              className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-baseline"
            >
              <span
                ref={(node) => {
                  wheels.current[slot] = node;
                }}
                className="absolute inset-x-0 top-0 flex flex-col"
                // Final position, server-side. GSAP takes over from here.
                style={{ transform: `translateY(${-Number(character) * 10}%)` }}
              >
                {DIGITS.map((digit) => (
                  <span key={digit} className="block h-[1em] text-center">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          );
        })}

        {suffix ? <span>{suffix}</span> : null}
      </span>
    </span>
  );
}
