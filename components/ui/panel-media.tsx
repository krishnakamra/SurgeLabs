import { cn } from "@/lib/cn";
import { HalftoneField } from "./halftone-field";
import { RegistrationTarget } from "./press-marks";
import type { Plate } from "@/lib/halftone";

export type PanelMediaProps = {
  /** Looping video. Until one exists, the printed plate below stands in. */
  src?: string;
  poster?: string;
  plate?: Plate;
  numeral: string;
  label: string;
  className?: string;
};

/**
 * Panel media, with its box reserved either way.
 *
 * The aspect ratio is fixed in CSS, so swapping the placeholder for a real
 * loop later changes nothing about layout and books no CLS. Until then this
 * renders as a printed plate — a screened field, a registration target and
 * the plate number — which is a finished-looking thing in this design
 * language rather than an obvious hole where an asset should be.
 *
 * Video is muted, inline and looping; MotionProvider pauses it with
 * everything else when the tab goes away.
 */
export function PanelMedia({ src, poster, plate = "m", numeral, label, className }: PanelMediaProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden border border-rule bg-surface-sunken",
        className,
      )}
    >
      {src ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          aria-label={label}
        />
      ) : (
        <>
          <HalftoneField plate={plate} pitch={8} dot={2} opacity={0.42} seed={17} fade="radial" />
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <RegistrationTarget className="size-5 text-mark" />
              <p className="font-utility text-2xs uppercase tracking-utility text-fg-faint">
                Plate {numeral}
              </p>
            </div>
            <p
              aria-hidden="true"
              className="font-display text-4xl leading-none font-extrabold text-fg/10"
            >
              {numeral}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
