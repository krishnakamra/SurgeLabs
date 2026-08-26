import { cities, site } from "@/content";
import { cn } from "@/lib/cn";

/**
 * The service area, drawn from the coordinates in content/cities.ts.
 *
 * An equirectangular projection with the longitude scaled by cos(latitude),
 * which at 43.6°N is 0.724. Without that correction the GTA comes out
 * stretched about 38% too wide and Toronto ends up somewhere near Oshawa.
 *
 * Nothing here is fetched and nothing is embedded from a mapping provider:
 * it is sixteen numbers and some maths, so it costs no requests, no consent
 * banner, and no third-party script — and it renders in the site's own
 * colours on both surfaces instead of dropping a bright grey rectangle into
 * the page.
 *
 * ⚠️  It is a picture of where we deliver, not a navigational map. The pin is
 *     approximate (see site.mapPin) and the "Get directions" button beside it
 *     hands Google the street address, which is exact.
 */

const VIEW_W = 1400;
const VIEW_H = 900;
const PAD = 70;

/** Latitude correction. Longitude degrees are shorter than latitude ones. */
const K = Math.cos((43.6 * Math.PI) / 180);

const lats = cities.map((c) => c.lat);
const lngs = cities.map((c) => c.lng);
const LAT_MIN = Math.min(...lats);
const LAT_MAX = Math.max(...lats);
const LNG_MIN = Math.min(...lngs);
const LNG_MAX = Math.max(...lngs);

const SCALE = (VIEW_H - 2 * PAD) / (LAT_MAX - LAT_MIN);
const X0 = (VIEW_W - (LNG_MAX - LNG_MIN) * K * SCALE) / 2;

function project(lat: number, lng: number): [number, number] {
  return [X0 + (lng - LNG_MIN) * K * SCALE, PAD + (LAT_MAX - lat) * SCALE];
}

/**
 * Which side of its dot each label sits on, hand-set.
 *
 * Sixteen fixed points do not need a collision solver, and a solver would
 * make the map shift every time a city is added. If you add one, place it
 * here and look at the result.
 */
const SIDE: Record<string, "left" | "right"> = {
  "halton-hills": "left",
  georgetown: "right",
  milton: "left",
  caledon: "left",
  burlington: "left",
  brampton: "left",
  bolton: "right",
  oakville: "right",
  mississauga: "left",
  woodbridge: "left",
  etobicoke: "right",
  vaughan: "left",
  "north-york": "right",
  toronto: "right",
  markham: "right",
  scarborough: "right",
};

/** Nudges, in viewBox units, where two labels would otherwise touch. */
const NUDGE_Y: Record<string, number> = { etobicoke: 12, georgetown: -6, milton: 10 };

export function ServiceMap({ className }: { className?: string }) {
  const [shopX, shopY] = project(site.mapPin.lat, site.mapPin.lng);
  const names = cities.map((c) => c.name).join(", ");

  return (
    // Wide content scrolls inside its own box rather than widening the page.
    // Below about 34rem the labels would be under 10px and the map would be
    // decoration; letting it scroll keeps it readable instead.
    <div className={cn("overflow-x-auto", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-labelledby="service-map-title service-map-desc"
        className="block min-w-[34rem] w-full border-[length:var(--hairline)] border-rule bg-surface-sunken"
      >
        <title id="service-map-title">Where Surge Labs delivers</title>
        <desc id="service-map-desc">
          A map of the Greater Toronto Area marking the shop on Skymark Avenue in Mississauga and
          the cities it delivers to: {names}.
        </desc>

        <defs>
          {/* Halftone ground. Same idea as the screened plates elsewhere on
              the site — a printed field rather than a satellite tile. */}
          <pattern id="map-screen" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="1.6" fill="currentColor" opacity="0.22" />
          </pattern>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#map-screen)" className="text-fg-faint" />

        {/* Registration rules through the shop, full bleed. */}
        <line x1={shopX} y1="0" x2={shopX} y2={VIEW_H} className="stroke-rule" strokeWidth="1.5" />
        <line x1="0" y1={shopY} x2={VIEW_W} y2={shopY} className="stroke-rule" strokeWidth="1.5" />

        {cities.map((city) => {
          const [x, y] = project(city.lat, city.lng);
          const side = SIDE[city.slug] ?? "right";
          const dy = NUDGE_Y[city.slug] ?? 0;
          const home = city.slug === "mississauga";

          return (
            <g key={city.slug}>
              <circle
                cx={x}
                cy={y}
                r="7"
                className={home ? "fill-accent" : "fill-fg-muted"}
              />
              <text
                x={side === "left" ? x - 16 : x + 16}
                y={y + 9 + dy}
                textAnchor={side === "left" ? "end" : "start"}
                fontSize="27"
                className={cn(
                  "font-display",
                  home ? "fill-fg font-bold" : "fill-fg-muted font-medium",
                )}
              >
                {city.name}
              </text>
            </g>
          );
        })}

        {/* The shop. A registration target, because that is what this design
            language uses for "exactly here", and a leader line out to a label
            placed where nothing else is. */}
        <g>
          {/* The leader goes down and to the RIGHT. Down-left put the
              callout on top of the Mississauga label, which sits ~30 units
              away — the shop is in Mississauga, so those two are always going
              to be neighbours and the label has to be routed around it. */}
          <line
            x1={shopX}
            y1={shopY}
            x2={shopX + 95}
            y2={shopY + 95}
            className="stroke-accent"
            strokeWidth="2.5"
          />
          <circle cx={shopX} cy={shopY} r="17" className="fill-none stroke-accent" strokeWidth="3.5" />
          <line x1={shopX - 27} y1={shopY} x2={shopX + 27} y2={shopY} className="stroke-accent" strokeWidth="3.5" />
          <line x1={shopX} y1={shopY - 27} x2={shopX} y2={shopY + 27} className="stroke-accent" strokeWidth="3.5" />
          <text
            x={shopX + 105}
            y={shopY + 105}
            textAnchor="start"
            fontSize="31"
            className="fill-accent-text font-display font-black"
          >
            SURGE LABS
          </text>
          <text
            x={shopX + 105}
            y={shopY + 141}
            textAnchor="start"
            fontSize="24"
            className="fill-fg-muted font-display font-medium"
          >
            {site.address.streetAddress}
          </text>
        </g>
      </svg>
    </div>
  );
}
