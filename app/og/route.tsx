import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { FOIL_STOPS, MARK_PATH, MARK_SIZE, STACK_GAP } from "@/lib/brand/mark";
import { WORDMARK_SCALE, WORDMARK_TEXT, WORDMARK_TRACKING } from "@/lib/brand/wordmark";

export const runtime = "nodejs";

const INK = "#0A0A0B";
const STOCK = "#EFEDE8";
const GOLD = "#C8A24A";
const GOLD_HI = "#E8CE84";
const FAINT = "#8A887F";

/**
 * Satori renders ttf, otf and woff — not woff2. Google Fonts serves woff2 to
 * a modern user agent and ttf to an old one, so the request deliberately
 * claims to be an ancient browser to get a format that will actually render.
 *
 * Cached in module scope: on a warm instance every later card skips the
 * fetch. If it fails the card still renders in the fallback sans rather than
 * erroring — a plain OG image beats a broken one.
 */
let displayFont: ArrayBuffer | null | undefined;

async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  if (displayFont !== undefined) return displayFont;
  try {
    const css = await fetch(
      // opsz 96 and weight 400: the display cut of the Didone, which is the
      // whole reason for the face. Satori has no variable-font support, so
      // the axis has to be pinned in the request rather than set in CSS.
      "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@96,400&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    displayFont = url ? await fetch(url).then((response) => response.arrayBuffer()) : null;
  } catch {
    displayFont = null;
  }
  return displayFont ?? null;
}

/** Two hairlines meeting at a corner with a gap — the same mark as the site. */
function CropMark({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const v = corner[0] === "t" ? { top: 40 } : { bottom: 40 };
  const h = corner[1] === "l" ? { left: 40 } : { right: 40 };
  const arm = { position: "absolute" as const, background: GOLD, opacity: 0.55 };
  return (
    <div style={{ position: "absolute", ...v, ...h, width: 44, height: 44, display: "flex" }}>
      <div style={{ ...arm, ...(corner[0] === "t" ? { top: 0 } : { bottom: 0 }), ...(corner[1] === "l" ? { left: 0 } : { right: 0 }), width: 28, height: 1 }} />
      <div style={{ ...arm, ...(corner[0] === "t" ? { top: 0 } : { bottom: 0 }), ...(corner[1] === "l" ? { left: 0 } : { right: 0 }), width: 1, height: 28 }} />
    </div>
  );
}

/**
 * The stacked lockup, drawn from the same geometry as everything else
 * (lib/brand/mark.ts) rather than approximated in Satori's subset of CSS.
 *
 * This replaced a magenta rule with the words "Surge Labs" under it, which
 * was a stand-in for a logo the build did not have. Satori renders <path>, so
 * the mark here is the mark — not a picture of one.
 *
 * The wordmark is still live text and inherits the placeholder's tuning:
 * positive tracking, 800 weight, the display face when the fetch above
 * succeeded. Satori has no font-variation-settings, so the pinned optical
 * size cannot follow it here; the face is loaded at a single 800 instance and
 * every card gets the same letterforms anyway, which is what pinning it was
 * for. Satori also wants letter-spacing in px, so the em ratio is resolved
 * against the font size rather than passed through.
 */
function StackedLockup({ hasFont, size = 64 }: { hasFont: boolean; size?: number }) {
  const wordSize = size * WORDMARK_SCALE.stacked;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: Math.round(size * STACK_GAP),
      }}
    >
      {/* Foil, baked. A static card cannot follow a pointer, so the highlight
          sits at 50% — the same place --foil-pos starts on the site, so the
          card and the masthead agree about where the light is. */}
      <svg width={size} height={size} viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}>
        <defs>
          <linearGradient id="foil" x1="0" y1="0" x2="1" y2="0.18">
            <stop offset="0%" stopColor={FOIL_STOPS.lo} />
            <stop offset="28%" stopColor={FOIL_STOPS.lo} />
            <stop offset="50%" stopColor={GOLD_HI} />
            <stop offset="72%" stopColor={FOIL_STOPS.lo} />
            <stop offset="100%" stopColor={FOIL_STOPS.lo} />
          </linearGradient>
        </defs>
        <path d={MARK_PATH} fill="url(#foil)" />
      </svg>
      <div
        style={{
          display: "flex",
          fontSize: wordSize,
          lineHeight: 1,
          letterSpacing: wordSize * WORDMARK_TRACKING,
          color: GOLD,
          fontWeight: 400,
          fontFamily: hasFont ? "Bodoni" : "serif",
        }}
      >
        {WORDMARK_TEXT}
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = (params.get("title") ?? "Surge Labs").slice(0, 110);
  const eyebrow = (params.get("eyebrow") ?? "Mississauga, ON").slice(0, 60);

  const font = await loadDisplayFont();
  // Long headlines need to come down a step or they overflow the card.
  const size = title.length > 68 ? 62 : title.length > 42 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          position: "relative",
          fontFamily: font ? "Bodoni" : "serif",
        }}
      >
        <CropMark corner="tl" />
        <CropMark corner="tr" />
        <CropMark corner="bl" />
        <CropMark corner="br" />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 1, background: GOLD, display: "flex" }} />
          <div style={{ fontSize: 22, letterSpacing: 4, color: FAINT, textTransform: "uppercase", fontFamily: "sans-serif" }}>
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: size,
            lineHeight: 1.05,
            // -0.02em, resolved against the rendered size. Satori wants px.
            letterSpacing: size * -0.02,
            color: STOCK,
            // 400. Bolding a Didone thickens the hairline faster than the
            // stem and throws away the contrast that makes it look like this.
            fontWeight: 400,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <StackedLockup hasFont={Boolean(font)} />
          <div style={{ fontSize: 20, letterSpacing: 2.5, color: FAINT, textTransform: "uppercase", fontFamily: "sans-serif" }}>
            Web · Print · Apparel
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(font ? { fonts: [{ name: "Bodoni", data: font, weight: 400, style: "normal" as const }] } : {}),
    },
  );
}
