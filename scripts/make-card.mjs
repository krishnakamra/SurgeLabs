/**
 * Renders the gold-foil business card, front and back, at press resolution.
 *
 *   node scripts/make-card.mjs            → cards/*.png at 600 dpi
 *   node scripts/make-card.mjs --guides   → …plus a bleed/trim/safe overlay
 *
 * WHY THIS IS RENDERED AND NOT GENERATED. An image model cannot be handed a
 * vector. Ask one for "a card with the Surge Labs wordmark" and it draws its
 * own approximation of the mark — close enough to recognise and wrong in
 * every detail that matters. So the photography comes from a model and the
 * card comes from here, where the logo is the actual file off disk and the
 * type is real type.
 *
 * The logo is used as a MASK, not as artwork with its own colours. The file
 * ships a two-colour lockup (stock wordmark, magenta "Labs"); a single foil
 * pass is one colour by definition, so the whole mark is knocked out of one
 * gradient. That is also what the die does in real life.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const OUT = join(root, "cards");
const DPI = 600;
const IN = (v) => Math.round(v * DPI);

/* ── Press geometry, in inches ────────────────────────────────────────────
   North American business card. Bleed and safe are the standard eighth-inch;
   the corner radius is the common 1/8" die. Change RADIUS here if the shop
   running it uses a 1/4" die — they are not interchangeable and a design set
   for one looks wrong cut with the other. */
const TRIM_W = 3.5;
const TRIM_H = 2;
const BLEED = 0.125;
const SAFE = 0.125;
const RADIUS = 0.125;

const CARD_W = IN(TRIM_W + BLEED * 2);
const CARD_H = IN(TRIM_H + BLEED * 2);

/* ── Foil ─────────────────────────────────────────────────────────────────
   On press this is one spot foil, not a gradient — the gradient exists so a
   flat PNG reads as metal on a screen. When you set this in Illustrator the
   artwork is 100% of a single spot swatch named for the foil, and this file
   is only the visual reference for what that will look like. */
const FOIL =
  "linear-gradient(115deg, #8a6a1e 0%, #c9a227 18%, #f3e0a1 34%, #fbf3d4 42%, #e3c877 52%, #b8912f 68%, #f0dc9e 84%, #a97f22 100%)";
const STOCK = "#ffffff";
const INK = "#1a1a1a";

const logoSvg = readFileSync(join(root, "public", "brand", "surge-labs-horizontal-ink.svg"), "utf8");
const markSvg = readFileSync(join(root, "public", "brand", "surge-labs-mark-ink.svg"), "utf8");

/** Strip the backing plate and flatten every fill, so the file works as a mask. */
function toMask(svg) {
  const flat = svg
    .replace(/<\?xml[^>]*\?>/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<rect[^>]*\/>/, "") // the ink backing plate
    .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="#000"');
  // Unquoted on purpose. These get interpolated into a style="..." attribute,
  // and a double-quoted url() inside one closes the attribute early — which
  // renders a blank white card and no error anywhere. base64 contains nothing
  // that needs quoting.
  return `url(data:image/svg+xml;base64,${Buffer.from(flat).toString("base64")})`;
}

const b64 = (p) => readFileSync(p).toString("base64");
const satoshi = b64(join(root, "public", "fonts", "Satoshi-Variable.woff2"));

const site = {
  phone: "905-598-3960",
  email: "hello@surgelabs.ca",
  domain: "surgelabs.ca",
  addr: "2800 Skymark Ave, Mississauga ON L4W 5A6",
};

const guides = process.argv.includes("--guides");

function page(face) {
  const foilLogo = (mask, width) => `
    <div style="
      width:${width}px; aspect-ratio: 1684 / 286;
      background:${FOIL};
      -webkit-mask-image:${mask}; mask-image:${mask};
      -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
      -webkit-mask-size:contain; mask-size:contain;
      -webkit-mask-position:center; mask-position:center;"></div>`;

  const body =
    face === "front"
      ? `<div style="display:flex;align-items:center;justify-content:center;height:100%">
           ${foilLogo(toMask(logoSvg), IN(2.15))}
         </div>`
      : `<div style="display:flex;flex-direction:column;justify-content:space-between;height:100%;
                     padding:${IN(0.3)}px ${IN(0.34)}px">
           <div style="
             width:${IN(0.42)}px;height:${IN(0.42)}px;background:${FOIL};
             -webkit-mask-image:${toMask(markSvg)};mask-image:${toMask(markSvg)};
             -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
             -webkit-mask-size:contain;mask-size:contain;"></div>
           <div>
             <div style="height:${Math.max(2, IN(0.006))}px;background:${FOIL};width:${IN(0.7)}px;
                         margin-bottom:${IN(0.12)}px"></div>
             <div style="font-size:${IN(0.105)}px;line-height:1.55;color:${INK};letter-spacing:0.005em">
               <div style="font-weight:700">${site.phone}</div>
               <div>${site.email}</div>
               <div>${site.domain}</div>
             </div>
             <div style="margin-top:${IN(0.09)}px;font-size:${IN(0.072)}px;line-height:1.45;
                         color:#6b6b6b;letter-spacing:0.02em">${site.addr}</div>
           </div>
         </div>`;

  const overlay = guides
    ? `<div style="position:absolute;inset:0;pointer-events:none">
         <div style="position:absolute;inset:${IN(BLEED)}px;outline:${Math.max(2, IN(0.004))}px solid #ff3d9e;
                     outline-offset:0"></div>
         <div style="position:absolute;inset:${IN(BLEED + SAFE)}px;outline:${Math.max(2, IN(0.004))}px dashed #00a3ff"></div>
       </div>`
    : "";

  return `<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:S;src:url(data:font/woff2;base64,${satoshi}) format("woff2");font-weight:300 900}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${CARD_W}px;height:${CARD_H}px;background:#d8d8d8}
    body{font-family:S,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
    .card{position:absolute;inset:0;background:${STOCK};
          /* The die radius is measured from the TRIM, so on a bleed-sized
             artboard it has to be drawn inset by the bleed or the curve is
             in the wrong place once the card is cut. */
          clip-path: inset(${IN(BLEED)}px round ${IN(RADIUS)}px);}
  </style>
  <div class="card">${body}</div>${overlay}`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  for (const face of ["front", "back"]) {
    const pg = await browser.newPage({ viewport: { width: CARD_W, height: CARD_H } });
    await pg.setContent(page(face), { waitUntil: "load" });
    await pg.evaluate(() => document.fonts.ready);
    const name = `surge-labs-card-${face}${guides ? "-guides" : ""}.png`;
    await pg.screenshot({ path: join(OUT, name), omitBackground: false });
    await pg.close();
    console.log(`  ✓ ${name}  ${CARD_W}×${CARD_H}px  (${TRIM_W}×${TRIM_H}in + ${BLEED}in bleed @ ${DPI}dpi)`);
  }
  await browser.close();
}
await main();
