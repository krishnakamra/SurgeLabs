/**
 * The ad card, as HTML.
 *
 * WHY THIS IS NOT A GENERATED IMAGE. The obvious way to make an ad is to
 * describe it to an image model. That fails here for two specific reasons:
 *
 *   1. Image models garble text. This card carries four prices, four product
 *      names, a phone number and a URL. A model will hand back "$1O0" and
 *      "busines cards", and an ad with a wrong price on it is worse than no
 *      ad — it is a price representation you did not intend to make.
 *   2. The logo is the client's own artwork. The brief for this project says
 *      never to generate the brandmark, and the real vector is in the repo.
 *
 * So the type is real type, the logo is the real logo, and the prices are
 * read out of content/packages.ts at render time — which means the ad cannot
 * disagree with the website even after a price changes.
 */

/**
 * Formats, in the sizes the platforms actually want.
 *
 * `u` is the type scale, and it is set by whichever dimension is scarce
 * rather than by the width. Square and story are both 1080 wide with height
 * to spare, so they run at 1. The wide card is 628 tall — deriving its scale
 * from its width made everything BIGGER on the shortest card, and the
 * headline ran off the bottom.
 *
 * `headline` overrides the copy where a three-line headline will not fit.
 */
export const FORMATS = {
  square: { w: 1080, h: 1080, u: 1, label: "Feed post (Instagram, Facebook)" },
  story: { w: 1080, h: 1920, u: 1, label: "Story / Reel cover" },
  wide: {
    w: 1200,
    h: 628,
    u: 0.6,
    headline: "One shop for everything your brand gets printed on.",
    label: "Link ad, LinkedIn, email header",
  },
};

const esc = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function adHtml({ format, offers, site, logoSvg, fonts, headline, kicker }) {
  const f = FORMATS[format];
  const head = f.headline ?? headline;

  return `<!doctype html>
<html lang="en-CA"><head><meta charset="utf-8"><style>
@font-face{font-family:Montserrat;font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${fonts.display}) format("woff2")}
@font-face{font-family:Satoshi;font-weight:300 900;font-style:normal;src:url(data:font/woff2;base64,${fonts.body}) format("woff2")}

*{margin:0;padding:0;box-sizing:border-box}

:root{
  --ink:#0A0A0B; --stock:#EFEDE8;
  --fg:#EFEDE8; --muted:#A3A29E; --faint:#6E6D6A;
  --accent:#FF3D9E;          /* magenta, 5.98:1 on ink */
  --lime:#CCFF00;            /* 16.84:1 on ink */
  --rule:#2A2A2C;
  --u:${f.u};                /* every size is a multiple of this */
}

html,body{width:${f.w}px;height:${f.h}px}
body{
  background:var(--ink);color:var(--fg);
  font-family:Satoshi,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  position:relative;overflow:hidden;
}

/* Screened ground. The house texture: a printed field, not a gradient. */
.screen{
  position:absolute;inset:0;
  background-image:radial-gradient(circle at 1px 1px, #FFFFFF14 1px, transparent 0);
  background-size:calc(22px * var(--u)) calc(22px * var(--u));
}
.glow{
  position:absolute;inset:0;
  background:radial-gradient(58% 44% at 76% 18%, #FF3D9E1F 0%, transparent 70%);
}

/* Crop marks, one per corner. */
.crop{position:absolute;width:calc(46px * var(--u));height:calc(46px * var(--u))}
.crop::before,.crop::after{content:"";position:absolute;background:var(--faint)}
.crop::before{width:100%;height:1.5px;top:50%}
.crop::after{height:100%;width:1.5px;left:50%}
.crop.tl{top:calc(30px * var(--u));left:calc(30px * var(--u))}
.crop.tr{top:calc(30px * var(--u));right:calc(30px * var(--u))}
.crop.bl{bottom:calc(30px * var(--u));left:calc(30px * var(--u))}
.crop.br{bottom:calc(30px * var(--u));right:calc(30px * var(--u))}

.sheet{
  position:relative;z-index:2;height:100%;
  display:flex;flex-direction:column;
  padding:calc(70px * var(--u)) calc(70px * var(--u)) calc(60px * var(--u));
}

/* ── masthead ─────────────────────────────────────────────────────── */
.top{display:flex;align-items:center;justify-content:space-between;gap:calc(24px * var(--u))}
.logo svg{display:block;height:calc(34px * var(--u));width:auto}
.tel{
  font-family:Montserrat,sans-serif;font-weight:900;
  font-size:calc(30px * var(--u));letter-spacing:-.01em;color:var(--accent);
  font-variant-numeric:tabular-nums;white-space:nowrap;
}

.kicker{
  margin-top:calc(34px * var(--u));
  font-family:ui-monospace,SFMono-Regular,monospace;
  font-size:calc(15px * var(--u));letter-spacing:.19em;text-transform:uppercase;
  color:var(--lime);
}
h1{
  margin-top:calc(20px * var(--u));
  font-family:Montserrat,sans-serif;font-weight:800;
  font-size:calc(58px * var(--u));line-height:.96;letter-spacing:-.022em;
  max-width:20ch;text-wrap:balance;
}

/* ── the price rows ───────────────────────────────────────────────── */
.rows{
  margin-top:calc(36px * var(--u));flex:1;
  display:flex;flex-direction:column;justify-content:center;
}
/* Separators are borders, not a background showing through the gaps. The
   gap trick works on the wide card, where four cells fill the grid exactly;
   on the square and the story the rows are shorter than the space they sit
   in, and the leftover showed up as two grey slabs. */
.row + .row{border-top:1.5px solid var(--rule)}
.row{
  display:flex;align-items:baseline;gap:calc(28px * var(--u));
  padding:calc(21px * var(--u)) 0;
}
.row .name{
  flex:1;min-width:0;
  font-family:Montserrat,sans-serif;font-weight:800;
  font-size:calc(35px * var(--u));line-height:1.03;letter-spacing:-.015em;
}
.row .spec{
  margin-top:calc(9px * var(--u));
  font-size:calc(19px * var(--u));line-height:1.35;color:var(--muted);
  font-weight:400;letter-spacing:0;font-family:Satoshi,sans-serif;
}
.row .price{
  font-family:Montserrat,sans-serif;font-weight:900;
  font-size:calc(52px * var(--u));line-height:.9;letter-spacing:-.03em;
  color:var(--accent);font-variant-numeric:tabular-nums;
  white-space:nowrap;text-align:right;
}
.row .price .from{
  display:block;font-size:calc(17px * var(--u));font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;color:var(--muted);
  margin-bottom:calc(7px * var(--u));
}

/* ── foot ─────────────────────────────────────────────────────────── */
.foot{
  margin-top:auto;
  border-top:1.5px solid var(--rule);padding-top:calc(26px * var(--u));
  display:flex;align-items:flex-end;justify-content:space-between;gap:calc(24px * var(--u));
}
.foot .site{
  font-family:Montserrat,sans-serif;font-weight:800;
  font-size:calc(31px * var(--u));letter-spacing:-.01em;
}
.foot .where{
  margin-top:calc(8px * var(--u));
  font-size:calc(18px * var(--u));color:var(--muted);
}
.terms{
  max-width:34ch;text-align:right;
  font-size:calc(15px * var(--u));line-height:1.45;color:var(--faint);
}

/* ── story: more air, bigger type ─────────────────────────────────── */
body[data-format="story"] h1{font-size:calc(82px * var(--u));max-width:15ch}

body[data-format="story"] .row{padding:calc(40px * var(--u)) 0}
body[data-format="story"] .row .name{font-size:calc(46px * var(--u))}
body[data-format="story"] .row .price{font-size:calc(70px * var(--u))}
body[data-format="story"] .row .spec{font-size:calc(22px * var(--u))}
body[data-format="story"] .kicker{margin-top:calc(70px * var(--u))}

/* ── wide: two columns, tighter everything ────────────────────────── */
body[data-format="wide"] .sheet{padding:calc(64px * var(--u)) calc(66px * var(--u)) calc(56px * var(--u))}
body[data-format="wide"] h1{font-size:calc(72px * var(--u));max-width:26ch;margin-top:calc(18px * var(--u));line-height:1.02}
body[data-format="wide"] .kicker{margin-top:calc(34px * var(--u));font-size:calc(21px * var(--u))}
body[data-format="wide"] .logo svg{height:calc(48px * var(--u))}
body[data-format="wide"] .tel{font-size:calc(44px * var(--u))}
body[data-format="wide"] .crop{width:calc(58px * var(--u));height:calc(58px * var(--u))}
body[data-format="wide"] .rows{
  margin-top:calc(34px * var(--u));flex:1;
  display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;
  gap:calc(3px * var(--u));background:var(--rule);
}
body[data-format="wide"] .row{background:var(--ink)}
body[data-format="wide"] .row + .row{border-top:0}
body[data-format="wide"] .row{padding:calc(26px * var(--u)) calc(32px * var(--u));align-items:center}
body[data-format="wide"] .row .name{font-size:calc(40px * var(--u))}
body[data-format="wide"] .row .price{font-size:calc(58px * var(--u))}
body[data-format="wide"] .row .price .from{font-size:calc(20px * var(--u))}
body[data-format="wide"] .row .spec{font-size:calc(23px * var(--u));margin-top:calc(7px * var(--u))}
body[data-format="wide"] .foot{padding-top:calc(24px * var(--u))}
body[data-format="wide"] .foot .site{font-size:calc(40px * var(--u))}
body[data-format="wide"] .foot .where{font-size:calc(23px * var(--u))}
body[data-format="wide"] .terms{font-size:calc(19px * var(--u));max-width:44ch}
</style></head>
<body data-format="${format}">
  <div class="screen"></div><div class="glow"></div>
  <div class="crop tl"></div><div class="crop tr"></div>
  <div class="crop bl"></div><div class="crop br"></div>

  <div class="sheet">
    <div class="top">
      <div class="logo">${logoSvg}</div>
      <div class="tel">${esc(site.phone)}</div>
    </div>

    <p class="kicker">${esc(kicker)}</p>
    <h1>${esc(head)}</h1>

    <div class="rows">
      ${offers
        .map(
          (o) => `<div class="row">
        <div class="name">${esc(o.name)}<div class="spec">${esc(o.spec)}</div></div>
        <div class="price">${o.from ? '<span class="from">Starting at</span>' : ""}${esc(o.price)}</div>
      </div>`,
        )
        .join("\n      ")}
    </div>

    <div class="foot">
      <div>
        <div class="site">surgelabs.ca</div>
        <div class="where">${esc(site.address.streetAddress)}, ${esc(site.address.locality)}</div>
      </div>
      <p class="terms">Starting prices in CAD, GTA delivery included. The card price is fixed. Everything else is quoted — you get the real number in writing within one business day.</p>
    </div>
  </div>
</body></html>`;
}
