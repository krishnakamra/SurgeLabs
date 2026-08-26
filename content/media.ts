/**
 * Generated media registry.
 *
 * Every asset on this page was produced through the Higgsfield MCP server on
 * 2026-08-24. The `jobId` on each entry is the authoritative handle: it can be
 * replayed to fetch the original, and the `model` + `prompt` beside it are the
 * exact inputs, so any asset can be regenerated or varied without guesswork.
 *
 * ⚠️  THE FILES ARE NOT IN THIS REPO YET.
 *
 *     The session that generated them could not download them: this
 *     organisation's egress policy denies d8j0ntlcm91z4.cloudfront.net (and
 *     higgsfield.ai) at the proxy, so `remoteUrl` was reachable to write down
 *     but not to fetch. Run `node scripts/fetch-media.mjs` from a machine that
 *     can reach the CDN — it downloads every entry below, encodes the MP4 and
 *     WebM, extracts the posters, and writes them to the `local*` paths. Until
 *     that runs, PressLoop falls back to its poster, and the poster falls back
 *     to the existing generated plate. Nothing on the site breaks in the
 *     meantime; it just has no footage.
 *
 * ⚠️  NOT FOR BRANDMARKS. No logo or wordmark was generated here and none
 *     should be. That stays with the client's own design work.
 */

/**
 * Whether public/media has actually been populated.
 *
 * Committed as false, and `node scripts/fetch-media.mjs` rewrites this line to
 * true once every asset has been downloaded and encoded. Components read it
 * and keep their existing placeholders while it is false, so the wiring below
 * can ship before the files do without pointing the site at 404s. If the
 * media folder is ever cleared, set it back to false.
 */
export const MEDIA_PRESENT = false;

export type Aspect = "16:9" | "9:16" | "3:2" | "4:3";

export type GeneratedAsset = {
  /** Stable key used in code. Never reuse one for different footage. */
  id: string;
  jobId: string;
  model: string;
  prompt: string;
  aspect: Aspect;
  /** Descriptive, honest alt/label. Used as <video aria-label> or <img alt>. */
  alt: string;
};

export type VideoAsset = GeneratedAsset & {
  seconds: number;
  /** Source render, on Higgsfield's CDN. Not fetchable from every network. */
  remoteUrl: string;
  /** The keyframe the loop starts and ends on — Higgsfield serves it directly. */
  remotePosterUrl: string;
  /** Where scripts/fetch-media.mjs writes the encoded output. */
  localMp4: string;
  localWebm: string;
  localPoster: string;
};

export type ImageAsset = GeneratedAsset & {
  remoteUrl: string;
  localPath: string;
  width: number;
  height: number;
};

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3HIEeigdQwB131Po1s53Xd8vSx4";

/* ═══════════════════════════════════════════════════════════════════════════
   VIDEO — Kling v3.0, sound off.

   Every loop was generated with the SAME keyframe in both `start_image` and
   `end_image`. That is what makes them seamless: the last frame is the first
   frame, so the browser's loop has nothing to cut across. It also means the
   poster and frame 1 are the same picture, so there is no flash when playback
   starts. Do not regenerate one of these with only a start frame and expect it
   to still loop cleanly.
   ═══════════════════════════════════════════════════════════════════════════ */

const HERO_PROMPT =
  "Extreme macro of an offset printing press in operation, magenta ink rolling across a chrome cylinder, shallow depth of field, ink catching a single hard key light, deep black background, fine paper fibres visible, slow lateral dolly, anamorphic, film grain, no text, no logos, cinematic, 24fps";
const WEB_PROMPT =
  "Macro of a modern display's surface at an oblique angle, cyan and magenta subpixels resolving into focus, dark reflective glass, slow rack focus, no readable text, moody studio lighting, cinematic";
const PRINT_PROMPT =
  "Macro of a freshly printed sheet lifting off a stack, crisp paper edge, CMYK registration marks and colour bars visible at the trim edge, slow rotation, hard raking light, deep shadow, cinematic";
const APPAREL_PROMPT =
  "Extreme macro of an industrial embroidery machine needle punching thread into black cotton twill, magenta thread, slow motion, shallow depth of field, dust motes in a single beam of light, cinematic";
const TEXTURE_PROMPT =
  "Black ink bleeding and spreading across wet white paper from the centre outward, extreme macro, high contrast, no colour except black and white, slow motion, top-down";

const HERO_ALT =
  "Magenta ink rolling across a chrome cylinder on an offset press, shot in extreme macro.";
const WEB_ALT =
  "Cyan and magenta subpixels on a display surface resolving into focus at an oblique angle.";
const PRINT_ALT =
  "A freshly printed sheet lifting off a stack, registration marks and colour bars visible at the trim edge.";
const APPAREL_ALT =
  "An industrial embroidery needle punching magenta thread into black cotton twill.";
const TEXTURE_ALT = "Black ink bleeding outward across wet white paper, shot top-down.";

function video(
  id: string,
  jobId: string,
  stamp: string,
  posterJobId: string,
  posterStamp: string,
  aspect: Aspect,
  seconds: number,
  prompt: string,
  alt: string,
): VideoAsset {
  const dir = aspect === "9:16" ? "reels" : "loops";
  return {
    id,
    jobId,
    model: "kling3_0",
    prompt,
    aspect,
    seconds,
    alt,
    remoteUrl: `${CDN}/hf_20260824_${stamp}_${jobId}.mp4`,
    remotePosterUrl: `${CDN}/hf_20260824_${posterStamp}_${posterJobId}.png`,
    localMp4: `/media/${dir}/${id}.mp4`,
    localWebm: `/media/${dir}/${id}.webm`,
    localPoster: `/media/${dir}/${id}.jpg`,
  };
}

/** The five loops the site uses. 16:9. */
export const loops = {
  hero: video("hero", "86f0e05b-6748-4b7e-851c-c21aaedf35e9", "134115",
    "ea89ceda-9c7e-4c7c-957b-0d3b6f12c586", "133513", "16:9", 8, HERO_PROMPT, HERO_ALT),
  web: video("web", "3b51ae9b-0b2d-42e6-a589-b9e68d7fc7ee", "134115",
    "acb233ba-6bf4-496e-96e7-9154b2f59584", "133513", "16:9", 6, WEB_PROMPT, WEB_ALT),
  print: video("print", "80d44760-4c77-477c-ba03-cf7d6129d0a4", "134116",
    "15e24ead-7158-41cc-8620-fda778e1cc6d", "133513", "16:9", 6, PRINT_PROMPT, PRINT_ALT),
  apparel: video("apparel", "176a8b13-8884-4480-ba9e-92417c1b17f4", "134115",
    "026d4dfb-a402-45e0-b99f-3b96d2e905f0", "133513", "16:9", 6, APPAREL_PROMPT, APPAREL_ALT),
  texture: video("texture", "4aba0dcc-f12d-4039-9fba-86181cf42669", "134115",
    "4dcb9119-c11f-456c-b0b0-9bf5c5c91c47", "133513", "16:9", 4, TEXTURE_PROMPT, TEXTURE_ALT),
} as const;

/**
 * Which loop belongs to which service page. The loop keys are short because
 * they name the footage; the service slugs are long because they carry
 * keywords. Mapping them here keeps that difference from leaking into the
 * components.
 */
export const loopForService: Record<string, VideoAsset> = {
  "web-design-seo": loops.web,
  "printing-signage": loops.print,
  "custom-apparel": loops.apparel,
};

/**
 * 9:16 cuts of the same five, for reels and stories.
 *
 * Nothing on the website references these — they are here so the footage
 * exists when someone wants to post, and so the prompt that made the
 * landscape version is one line away from the vertical one.
 */
export const reels = {
  hero: video("hero", "f759db80-37b6-43fe-87dd-c337748709ca", "134115",
    "a0a56b09-87e5-405f-af47-7032f4a3f0fb", "133513", "9:16", 8, HERO_PROMPT, HERO_ALT),
  web: video("web", "d121735b-fc6d-41ac-b154-55605a8a89f3", "134115",
    "39564cfd-6208-4e18-8a52-0a0d8f64bd67", "133513", "9:16", 6, WEB_PROMPT, WEB_ALT),
  print: video("print", "b1030131-1b87-40e4-8874-6facc8ca65e0", "134115",
    "3a41af53-49c4-4705-b72d-3e3c4d14e861", "133513", "9:16", 6, PRINT_PROMPT, PRINT_ALT),
  apparel: video("apparel", "0922d330-eb1f-43d7-951e-d66a41b57e9b", "134115",
    "29ef2d52-c848-4c86-bb58-65edaf87b7e0", "133514", "9:16", 6, APPAREL_PROMPT, APPAREL_ALT),
  texture: video("texture", "bdcd6f48-740c-447c-a01a-6c36cefce561", "134115",
    "21ed731f-179e-4139-8b21-20a8b19968af", "133513", "9:16", 4, TEXTURE_PROMPT, TEXTURE_ALT),
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   STILLS — Seedream 4.5, quality "high".

   The package flat lays carry the contents of the tier they belong to, taken
   from content/packages.ts. Those deliverables are still marked DRAFT there,
   so if the owner corrects a package's scope, the matching flat lay is now
   also wrong — regenerate it from the prompt on the entry.
   ═══════════════════════════════════════════════════════════════════════════ */

function still(
  id: string,
  jobId: string,
  stamp: string,
  prompt: string,
  alt: string,
  model = "seedream_v4_5",
  width = 4992,
  height = 3328,
): ImageAsset {
  return {
    id,
    jobId,
    model,
    prompt,
    aspect: "3:2",
    alt,
    width,
    height,
    remoteUrl: `${CDN}/hf_20260824_${stamp}_${jobId}.png`,
    localPath: `/media/stills/${id}.jpg`,
  };
}

/**
 * The same thing for the second generation run, on 2026-08-26.
 *
 * `still()` above hard-codes both the run date and a 3:2 frame, which was
 * right when every image came out of one submission. This batch is mixed —
 * 4:3 for the service panels, 3:2 for the flat lays, 16:9 for a blog header
 * — so the shape is a parameter here rather than a constant.
 *
 * `width`/`height` are NOMINAL: they carry the ratio, which is all next/image
 * needs to reserve the box and avoid layout shift. The files were never
 * fetchable from this network (see the CDN note at the top), so the exact
 * pixel dimensions are unverified. scripts/fetch-media.mjs re-encodes to JPEG
 * and is the place to correct them if it ever matters.
 */
function shot(
  id: string,
  jobId: string,
  stamp: string,
  aspect: Aspect,
  prompt: string,
  alt: string,
): ImageAsset {
  const SIZE: Record<Aspect, readonly [number, number]> = {
    "3:2": [4992, 3328],
    "4:3": [4096, 3072],
    "16:9": [4992, 2808],
    "9:16": [2808, 4992],
  };
  const [w, h] = SIZE[aspect];
  return {
    id,
    jobId,
    model: "seedream_v4_5",
    prompt,
    aspect,
    alt,
    width: w,
    height: h,
    remoteUrl: `${CDN}/hf_20260826_${stamp}_${jobId}.png`,
    localPath: `/media/stills/${id}.jpg`,
  };
}

const FLATLAY_PROMPT =
  "Flat lay of a print production bundle on a matte charcoal surface: a stack of thick business cards with a visible cut edge, a folded flyer, a rolled vinyl banner, a folded black embroidered polo shirt, arranged on a precise grid, hard directional light, crisp geometric shadows, shot straight top-down, no text, no logos, no lettering on any item, editorial product photography, photorealistic";

export const stills = {
  /** The general production bundle. Two renders of one prompt — pick one. */
  bundle: still("bundle", "329b51ac-fcd4-465a-aa3d-b6d797ed15b0", "133513", FLATLAY_PROMPT,
    "A print production bundle photographed top-down: business cards, a folded flyer, a rolled banner and a folded embroidered polo."),
  /**
   * Same prompt, different model. Submitted as nano_banana_pro; the server
   * ran nano_banana_2. Kept as an alternate take, not a duplicate to ship.
   */
  bundleAlt: still("bundle-alt", "69458d0d-de25-4c00-9db0-875e7fa97f37", "133513", FLATLAY_PROMPT,
    "A print production bundle photographed top-down: business cards, a folded flyer, a rolled banner and a folded embroidered polo.",
    "nano_banana_2", 5056, 3392),
} as const;

/** One flat lay per package tier, keyed by the slug in content/packages.ts. */
export const packageStills: Record<string, ImageAsset> = {
  "launch-kit": still("launch-kit", "7a2c53bf-29af-4ec5-8220-eddedb53238e", "134326",
    "Flat lay on a matte charcoal surface, arranged on a precise grid: a modest bundle of a slim laptop showing a blank dark screen, a single printed brand colour-and-type sheet, and a small stack of thick matte business cards with a visible cut edge. Sparse composition with generous empty space, hard directional light from one side, crisp geometric shadows, shot straight top-down, no text, no logos, no lettering or writing on any item, editorial product photography, photorealistic",
    "The Launch Kit deliverables photographed top-down: a laptop, a printed brand sheet and a stack of business cards."),
  "momentum-kit": still("momentum-kit", "41fd255d-07ff-49a1-ad8d-233de88eab91", "134326",
    "Flat lay on a matte charcoal surface, arranged on a precise grid: a stack of thick matte business cards with a visible cut edge, a fanned pile of glossy flyers, two corrugated plastic lawn signs with folded wire H-stakes beside them, and a neatly folded black polo shirt with a plain embroidered left chest. Hard directional light from one side, crisp geometric shadows, shot straight top-down, no text, no logos, no lettering or writing on any item, editorial product photography, photorealistic",
    "The Momentum Kit deliverables photographed top-down: business cards, flyers, coroplast lawn signs with H-stakes and a folded embroidered polo."),
  "storefront-kit": still("storefront-kit", "4c215bba-4f2c-4ec8-8c20-e7de6376e77d", "134327",
    "Flat lay on a matte charcoal surface, arranged on a precise grid: a retail packaging box with a plain adhesive label, a row of blank card hang tags on string, a stack of postcards, a sheet of round blank stickers, folded tissue paper, a rolled length of frosted window vinyl, and a folded black staff polo. Hard directional light from one side, crisp geometric shadows, shot straight top-down, no text, no logos, no lettering or writing on any item, editorial product photography, photorealistic",
    "The Storefront Kit deliverables photographed top-down: labelled packaging, hang tags, postcards, stickers, tissue, window vinyl and a staff polo."),
  "full-surge": still("full-surge", "a225439f-2067-47b5-bb82-e98bbd88ea10", "134326",
    "Abundant flat lay on a matte charcoal surface, arranged on a precise grid: a full stationery set of letterhead sheets and envelopes and business cards, a stack of folded brochures, a rolled fabric trade show backdrop, a folded table throw, two furled feather flags on poles, a roll of cut vinyl lettering, small wayfinding plates, and a stack of folded black decorated garments. Dense but orderly composition, hard directional light from one side, crisp geometric shadows, shot straight top-down, no text, no logos, no lettering or writing on any item, editorial product photography, photorealistic",
    "The Full Surge deliverables photographed top-down: a full stationery set, brochures, a trade show backdrop and feather flags, vehicle lettering and decorated garments."),

  // ── The 2026-08-26 run, for the restructured five-tier list. ──────────────
  // "storefront-kit" and "full-surge" above are no longer package slugs; both
  // scopes now sit inside Custom Build. They stay in this map because the
  // renders exist and are good, and because deleting the entry would delete
  // the prompt that made them. Nothing looks them up.
  "business-cards": shot("pkg-business-cards", "a68109e6-abb3-471c-b5da-d8f2b441b1c8", "034616", "3:2",
    "Flat lay on a matte charcoal surface: one neat stack of thick matte black business cards with a clean visible cut edge, three blank cards fanned beside it face up, and a small printed proof sheet carrying a CMYK colour control bar. Sparse composition with generous empty space, hard directional light from one side, crisp geometric shadows, shot straight top-down. No text, no words, no logos, no lettering or writing on any item. Editorial product photography, photorealistic",
    "A stack of thick matte business cards with three fanned beside it, photographed top-down next to a printed proof sheet."),
  website: shot("pkg-website", "0fed4b8b-022e-4001-b2af-1195ee0c7271", "034617", "3:2",
    "Flat lay on a matte charcoal surface, arranged on a precise grid: a slim laptop open showing a blank dark grey screen made only of faint rectangular placeholder blocks, a phone beside it showing the same blank dark layout, and one printed sheet carrying a CMYK colour control bar. Sparse composition with generous empty space, hard directional light from one side, crisp geometric shadows, shot straight top-down. No text, no words, no logos, no lettering or writing. Editorial product photography, photorealistic",
    "A laptop and a phone photographed top-down, both showing a blank page layout, beside a printed sheet with a colour control bar."),
  "custom-build": shot("pkg-custom-build", "21440d9c-d156-4ce4-a4ef-8cc73295f3fd", "034617", "3:2",
    "Abundant flat lay on a matte charcoal surface arranged on a precise grid: a slim laptop with a blank dark screen, a stack of thick matte business cards, a rolled vinyl banner, a corrugated plastic lawn sign with a folded wire H-stake, a neatly folded black polo shirt with a plain embroidered left chest, a roll of cut vinyl, and a printed proof sheet with a CMYK colour bar. Dense but orderly, hard directional light from one side, crisp geometric shadows, shot straight top-down. No text, no words, no logos, no lettering or writing on any item. Editorial product photography, photorealistic",
    "A full spread photographed top-down: a laptop, business cards, a rolled banner, a lawn sign with its stake, a folded polo and a roll of cut vinyl."),
};

/**
 * One production shot per service, keyed by the slug in content/services.ts.
 *
 * These replace the screened "Plate 01" placeholder on the homepage panels.
 * The placeholder was a finished-looking thing in this design language and it
 * still is — but the owner's point stands: someone deciding whether to hand
 * over a thousand dollars wants to see the machine, not a print-shop in-joke.
 *
 * Every prompt says "no text, no words, no lettering" several ways on
 * purpose. A generated sign or card with invented lettering on it is a
 * fabricated brand, and this shop's own rule is that we do not put words on
 * things we did not print.
 */
export const panelStills: Record<string, ImageAsset> = {
  "web-design-seo": shot("panel-web", "cbf86e58-82de-4dae-ad4e-b39ca0716423", "034616", "4:3",
    "A web designer's desk inside a print workshop, photographed at a slight angle: a large monitor displaying an abstract dark grey page layout made only of blank rectangular placeholder blocks and thin rules, a printed colour proof sheet with a CMYK control bar lying beside the keyboard, a loupe, and a small stack of thick matte cards. Matte charcoal desk, hard directional light from the left, crisp shadows, shallow depth of field. No text, no words, no logos, no lettering or writing on any surface. Editorial product photography, photorealistic",
    "A designer's desk beside the press: a monitor showing a blank page layout, a printed colour proof with a CMYK control bar, a loupe and a stack of cards."),
  "printing-signage": shot("panel-print", "f06d11ab-8ef3-4d82-a38e-2ebe5a0c6104", "034616", "4:3",
    "A commercial digital printing press mid-run, photographed close: freshly cut thick matte sheets stacked on the delivery tray with a clean visible cut edge, a CMYK colour control bar printed along the trim edge of the top sheet, registration crosshair marks in the trim area, ink rollers softly out of focus behind. Matte charcoal and brushed steel, hard directional light, crisp shadows. No text, no words, no logos, no lettering. Editorial industrial photography, photorealistic",
    "A commercial press mid-run: freshly cut sheets on the delivery tray, a CMYK control bar along the trim edge and registration marks in the margin."),
  "custom-apparel": shot("panel-apparel", "7a1506c8-b57f-4159-ab7d-d4382431c6ef", "034616", "4:3",
    "An industrial multi-head embroidery machine mid-stitch, photographed close: thread cones on the rack in muted colours, a needle head stitching an abstract geometric shape onto a folded black polo shirt held in the hoop, thread tension discs sharp in the foreground. Matte charcoal workshop, warm hard directional light, crisp shadows. No text, no words, no logos, no lettering or writing. Editorial industrial photography, photorealistic",
    "An industrial embroidery machine mid-stitch: thread cones on the rack and a needle head sewing onto a black polo held in the hoop."),
  "gold-foil-stationery": shot("panel-foil", "97a58255-ed61-4ca6-a0cc-3addc9432361", "034617", "4:3",
    "A hot foil stamping press photographed close: a heated magnesium die mounted in the platen, a roll of gold metallic foil feeding through the machine, a thick uncoated card sheet below showing a deep blind impression of an abstract geometric shape, gold leaf catching hard directional light. Matte charcoal machinery with brass tones, crisp shadows. No text, no words, no logos, no lettering or writing. Editorial industrial photography, photorealistic",
    "A hot foil press: a heated die in the platen, a roll of gold leaf feeding through, and a thick card sheet showing the impression."),
  "graphic-design": shot("panel-design", "62e83263-530b-41e5-a4ae-f6b5826f2489", "034617", "4:3",
    "A graphic designer's layout desk photographed straight down: a large sheet of tracing paper covered in hand-drawn abstract geometric mark sketches in pencil, shapes only and no letters, a fanned Pantone colour swatch book open on a green page, a steel ruler, a technical pen, and a printed colour proof with a CMYK control bar. Matte charcoal surface, hard directional light from one side, crisp geometric shadows. No text, no words, no logos, no lettering or writing anywhere. Editorial product photography, photorealistic",
    "A design desk from above: pencil sketches on tracing paper, an open Pantone swatch book, a steel ruler and a printed colour proof."),
};

/**
 * Imagery for the pages that are about the business rather than a product.
 *
 * The workshop interior and the entrance are GENERIC. They are not
 * photographs of 2800 Skymark Ave, and nothing on the site says or implies
 * they are — the alt text describes a workshop, not "our workshop", and no
 * caption claims otherwise. Replace them with real photographs of the unit
 * when there are any; a customer who drives over expecting the building in
 * the picture is a promise the site should not have made.
 */
export const pageStills = {
  workshop: shot("about-workshop", "fa90dec2-d5f7-49c7-8d87-584d5dea49eb", "034616", "3:2",
    "Wide interior of a small modern print and signage workshop: a digital press on the left, a wide-format roll printer on the right, a multi-head embroidery machine at the back, flat boxes and rolls of vinyl stacked on steel shelving, polished concrete floor, daylight from high windows mixing with overhead work lights. Nobody in frame. No text, no words, no logos, no signage lettering anywhere. Editorial architectural photography, photorealistic",
    "The inside of a print and signage workshop: a digital press, a wide-format roll printer, an embroidery machine and shelved rolls of vinyl."),
  proofing: shot("about-proofing", "99e44819-0b89-4f61-bec1-f5d265df269a", "034616", "3:2",
    "Close-up of two pairs of hands over a workbench inspecting a printed proof sheet against a CMYK colour control bar, one hand holding a printer's loupe, the other steadying a stack of thick cards. Matte charcoal bench, hard directional light, faces out of frame. No text, no words, no logos, no lettering or writing. Editorial documentary photography, photorealistic",
    "Two pairs of hands checking a printed proof against a colour control bar, one holding a printer's loupe over the sheet."),
  entrance: shot("contact-entrance", "f795c7c5-209f-46dc-9c2a-d0e06ea840b2", "034617", "3:2",
    "The glass entrance of a small commercial unit in a modern low-rise business park at dusk, warm interior light spilling onto the concrete walkway, a roll-up loading shutter partly visible to one side, a parked delivery van in silhouette. No text, no words, no logos, no signage lettering anywhere. Editorial architectural photography, photorealistic",
    "The glass entrance of a commercial unit in a low-rise business park at dusk, with a loading shutter to one side."),
  bench: shot("blog-bench", "79585695-a195-4824-a33f-c4ae1635975f", "034618", "16:9",
    "Overhead of an open blank production notebook on a matte charcoal bench beside a printed colour proof carrying a CMYK control bar, a steel ruler, a printer's loupe and a fanned stack of paper stock swatches in different weights and finishes. Hard directional light from one side, crisp geometric shadows. No text, no words, no logos, no lettering or writing anywhere. Editorial product photography, photorealistic",
    "A production bench from above: an open notebook, a printed colour proof, a steel ruler, a loupe and a fan of paper stock swatches."),
} as const;

/**
 * Where a component should point an <Image> right now.
 *
 * Once scripts/fetch-media.mjs has run, that is the self-hosted file under
 * public/media — optimised by Next, served from the same origin, and stable.
 * Until then it is the CDN original, which next.config.ts already allows as a
 * remote pattern.
 *
 * ⚠️  The CDN branch is a bridge, not a destination. Higgsfield's URLs are not
 *     promised to live forever, and an expired one is a broken image on a
 *     customer's screen. Run the fetch script and flip MEDIA_PRESENT before
 *     anyone is relying on this site for work.
 */
export function imageSrc(asset: ImageAsset): string {
  return MEDIA_PRESENT ? asset.localPath : asset.remoteUrl;
}

/** Every asset, for scripts/fetch-media.mjs to walk. */
export const allVideos: VideoAsset[] = [...Object.values(loops), ...Object.values(reels)];
export const allImages: ImageAsset[] = [
  ...Object.values(stills),
  ...Object.values(packageStills),
  ...Object.values(panelStills),
  ...Object.values(pageStills),
];
