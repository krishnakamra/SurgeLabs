import { MEDIA_PRESENT, type VideoAsset } from "@/content/media";
import { cn } from "@/lib/cn";
import { HalftoneField } from "./halftone-field";
import { PressLoop } from "./press-loop";
import { RegistrationTarget } from "./press-marks";
import type { Plate } from "@/lib/halftone";

export type PanelMediaProps = {
  /** Looping footage. Until the files are fetched, the plate below stands in. */
  asset?: VideoAsset;
  plate?: Plate;
  numeral: string;
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
 * Both branches are decoration — a screened plate, or texture behind copy
 * that already says what the service is — so neither carries a label. The
 * descriptive text for each clip lives on its entry in content/media.ts, for
 * the places where the footage is the content rather than the backdrop.
 */
export function PanelMedia({ asset, plate = "m", numeral, className }: PanelMediaProps) {
  // MEDIA_PRESENT is false until scripts/fetch-media.mjs has run, so an
  // asset can be wired up here long before its bytes exist.
  const showLoop = asset && MEDIA_PRESENT;
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden border-[length:var(--hairline)] border-rule bg-surface-sunken",
        className,
      )}
    >
      {showLoop ? (
        <PressLoop asset={asset} className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 45vw" />
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
              className="font-display text-4xl leading-none font-normal text-fg/10"
            >
              {numeral}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
