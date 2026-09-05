/**
 * The photo version of the price card.
 *
 * scripts/ad/template.mjs is the typographic card — prices set large on the
 * ink ground, no imagery. This one is the same offer with the product
 * photography carrying it, because the thing being sold is physical and a
 * flyer that shows no flyer is a harder ask than one that does.
 *
 * The rules from the typographic card still hold and are the reason this is
 * composed rather than generated:
 *
 *   · The type is real type. Image models garble numerals, and a card with
 *     "$1O0" on it is a price representation nobody meant to make.
 *   · The logo is the client's own vector, inlined from public/brand. Never
 *     generated, never redrawn.
 *   · The prices are read out of content/packages.ts at render time, so the
 *     card cannot drift away from the website.
 *
 * The photographs ARE generated (Higgsfield, seedream_v4_5 — see
 * content/media.ts for the job ids and the exact prompts). They are staged
 * product shots of stock with no lettering on it, which is what they are
 * captioned as. They are not photographs of jobs this shop ran, and none of
 * the copy says they are.
 */

/**
 * `u` is the type scale, set by whichever dimension is scarce rather than by
 * the width — see the note in template.mjs. `cols` is the photo grid: the
 * wide card is 628 tall and cannot stack two rows of photography, so it runs
 * its four cells in a single line.
 */
export const FORMATS = {
  square: { w: 1080, h: 1080, u: 1, cols: 2, label: "Feed post (Instagram, Facebook)" },
  story: { w: 1080, h: 1920, u: 1.05, cols: 2, label: "Story / Reel cover" },
  wide: {
    w: 1200,
    h: 628,
    u: 0.62,
    cols: 4,
    headline: "One shop for everything your brand gets printed on.",
    label: "Link ad, LinkedIn, email header",
  },
};

const esc = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * @param photos  Map of offer key → a URL the renderer can load. Data URIs
 *                keep the render off the network entirely, which is what the
 *                sandbox path uses; file:// paths work locally.
 */
export function photoAdHtml({ format, offers, site, logoSvg, fonts, photos, headline, kicker }) {
  const f = FORMATS[format];
  const head = f.headline ?? headline;
  const tall = f.h > f.w;

  const cells = offers
    .map(
      (o) => `
      <figure class="cell">
        <img src="${photos[o.key]}" alt="">
        <figcaption>
          <div class="nm">${esc(o.name)}</div>
          <div class="sp">${esc(o.spec)}</div>
          <div class="pr">${esc(o.price)}</div>
        </figcaption>
      </figure>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en-CA"><head><meta charset="utf-8"><style>
@font-face{font-family:Montserrat;font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${fonts.display}) format("woff2")}
@font-face{font-family:Satoshi;font-weight:300 900;font-style:normal;src:url(data:font/woff2;base64,${fonts.body}) format("woff2")}

*{margin:0;padding:0;box-sizing:border-box;min-width:0;min-height:0}

:root{
  --ink:#0A0A0B; --fg:#EFEDE8; --muted:#A3A29E; --faint:#777673;
  --lime:#CCFF00;            /* 16.84:1 on ink — carries the prices */
  --rule:#26262A;
  --u:${f.u};
}

html,body{width:${f.w}px;height:${f.h}px}
body{
  background:var(--ink); color:var(--fg);
  font-family:Satoshi,-apple-system,"Segoe UI",sans-serif;
  font-feature-settings:"tnum" 1;   /* prices line up column-wise */
  -webkit-font-smoothing:antialiased;
  display:flex; flex-direction:column;
  padding:calc(46px * var(--u)) calc(46px * var(--u)) calc(38px * var(--u));
  overflow:hidden;
}

/* ── masthead ─────────────────────────────────────────────────────────── */
.top{display:flex;align-items:center;justify-content:space-between;gap:calc(24px * var(--u));flex:none}
.top svg{height:calc(34px * var(--u));width:auto;display:block}
/* The logo file carries its own ink-coloured backing rect, which matches the
   page ground exactly, so it drops in without a seam. */
.tel{
  font-family:Montserrat;font-weight:700;
  font-size:calc(21px * var(--u));letter-spacing:.01em;white-space:nowrap;
}

/* ── headline ─────────────────────────────────────────────────────────── */
.head{flex:none;padding:calc(${tall ? 34 : 26}px * var(--u)) 0 calc(${tall ? 28 : 22}px * var(--u))}
.kick{
  font-family:Montserrat;font-weight:600;text-transform:uppercase;
  font-size:calc(14px * var(--u));letter-spacing:.16em;color:var(--lime);
  margin-bottom:calc(14px * var(--u));
}
h1{
  font-family:Montserrat;font-weight:800;
  font-size:calc(${tall ? 62 : 50}px * var(--u));line-height:1.03;
  letter-spacing:-.022em;max-width:${tall ? "15ch" : "20ch"};
}

/* ── the photo grid ───────────────────────────────────────────────────── */
.grid{
  flex:1; display:grid; gap:calc(12px * var(--u));
  grid-template-columns:repeat(${f.cols},minmax(0,1fr));
  grid-auto-rows:minmax(0,1fr);
}
.cell{position:relative;overflow:hidden;border-radius:calc(6px * var(--u));background:#141416}
.cell img{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;object-position:center;
  /* The plates are shot on charcoal already; this only seats them onto the
     same black so four separate frames read as one card. */
  filter:saturate(.94) contrast(1.04) brightness(.94);
}
.cell figcaption{
  position:absolute;left:0;right:0;bottom:0;
  padding:calc(${f.cols === 4 ? 18 : 22}px * var(--u));
  background:linear-gradient(to top,rgba(10,10,11,.96) 0%,rgba(10,10,11,.88) 42%,rgba(10,10,11,0) 100%);
  padding-top:calc(64px * var(--u));
}
.nm{
  font-family:Montserrat;font-weight:700;
  font-size:calc(${f.cols === 4 ? 20 : 26}px * var(--u));line-height:1.12;
  letter-spacing:-.01em;
}
.sp{
  font-size:calc(${f.cols === 4 ? 13 : 15}px * var(--u));line-height:1.35;
  color:var(--muted);margin-top:calc(5px * var(--u));
}
.pr{
  font-family:Montserrat;font-weight:800;color:var(--lime);
  font-size:calc(${f.cols === 4 ? 30 : 40}px * var(--u));line-height:1;
  letter-spacing:-.02em;margin-top:calc(10px * var(--u));
}

/* ── footer ───────────────────────────────────────────────────────────── */
.foot{
  flex:none;margin-top:calc(22px * var(--u));padding-top:calc(18px * var(--u));
  border-top:1px solid var(--rule);
  display:flex;align-items:baseline;justify-content:space-between;gap:calc(20px * var(--u));
  font-size:calc(15px * var(--u));color:var(--faint);
}
.site{font-family:Montserrat;font-weight:700;color:var(--fg);font-size:calc(19px * var(--u));letter-spacing:-.01em}
.addr{text-align:right}
</style></head><body>

  <header class="top">
    ${logoSvg}
    <div class="tel">${esc(site.phone)}</div>
  </header>

  <div class="head">
    <div class="kick">${esc(kicker)}</div>
    <h1>${esc(head)}</h1>
  </div>

  <div class="grid">${cells}
  </div>

  <footer class="foot">
    <div class="site">${esc(site.domain)}</div>
    <div class="addr">${esc(site.address)}</div>
  </footer>

</body></html>`;
}
