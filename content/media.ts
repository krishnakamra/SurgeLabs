/**
 * Generated media registry.
 *
 * Every asset on this page was produced through the Higgsfield MCP server on
 * 2026-08-26. The `jobId` on each entry is the authoritative handle: it can be
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
 *     The URLs were also WRONG until 2026-09-05: they were built with the
 *     date 20260824 when every file is stamped 20260826, so the CDN answered
 *     AccessDenied to all seventy of them and the earlier 403s read as an
 *     egress-policy problem when they were partly this. The date now comes
 *     from the generation records (show_generation_by_ids), which is the only
 *     place it is authoritative. If a fetch 403s again, check there first
 *     before blaming the network.
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
    remoteUrl: `${CDN}/hf_20260826_${stamp}_${jobId}.mp4`,
    remotePosterUrl: `${CDN}/hf_20260826_${posterStamp}_${posterJobId}.png`,
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
    remoteUrl: `${CDN}/hf_20260826_${stamp}_${jobId}.png`,
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
/**
 * `stamp` is the time part, HHMMSS. `date` is the day, and it defaults to the
 * run that produced everything on this page — pass it only for a later run.
 * It is a parameter rather than a constant because assuming one date for the
 * whole file is exactly the mistake that made all seventy URLs 403 (see the
 * note at the top). Both halves come from the generation record.
 */
function shot(
  id: string,
  jobId: string,
  stamp: string,
  aspect: Aspect,
  prompt: string,
  alt: string,
  date = "20260826",
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
    remoteUrl: `${CDN}/hf_${date}_${stamp}_${jobId}.png`,
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
 * One photograph per job on /work and the homepage recap.
 *
 * Keyed by the slug in content/work.ts. Every job in that file is described
 * by sector and city rather than by a client name, and these follow the same
 * rule: no invented company appears in any of them, because none of them
 * carries any lettering at all. They show the WORK — vinyl going onto a door,
 * foil catching the light on a menu card — not a brand that does not exist.
 *
 * Replace them with photographs of real jobs as permission to publish those
 * arrives. That is the point of the note at the top of content/work.ts.
 */
export const workStills: Record<string, ImageAsset> = {
  "hvac-fleet-and-site": shot("work-hvac", "ad3459a1-1b42-4437-b4db-a1307bf5b5e6", "035748", "3:2",
    "Close-up of two hands applying a cut vinyl graphic to the door of a plain white service van, a felt-edged squeegee pressing the film down and clear transfer tape lifting away from an abstract dark grey geometric shape. Bright overcast daylight, shallow depth of field. No text, no words, no logos, no letters anywhere in the graphic or on the van. Editorial documentary photography, photorealistic",
    "Hands squeegeeing a cut vinyl graphic onto a white van door, transfer tape peeling back from the film."),
  "restaurant-foil-menus": shot("work-menus", "40a3f023-ea0b-4939-8004-2eee18803fd5", "035748", "3:2",
    "Close-up of a stack of dark matte menu cards on a walnut restaurant table, the top card showing a deep gold foil impression of an abstract geometric border catching low warm light, a folded linen napkin and a water glass softly out of focus behind. No text, no words, no logos, no lettering anywhere. Editorial food-and-beverage photography, photorealistic",
    "A stack of dark matte menu cards on a restaurant table, the top one catching light on a gold foil border."),
  "trades-crew-apparel": shot("work-crew", "de8e85fb-bf60-4262-a365-f33eb5e01e85", "035748", "3:2",
    "A neatly folded stack of hi-vis yellow and black work jackets and polo shirts on a matte charcoal bench, each carrying a plain embroidered geometric shape on the left chest, a pair of work gloves beside them. Hard directional light from one side, crisp shadows. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Folded hi-vis jackets and work polos with embroidered left chests, stacked on a bench beside a pair of gloves."),
  "clinic-signage-programme": shot("work-wayfinding", "a85c9d30-0c01-43db-ad93-43f7b4f263b8", "035748", "3:2",
    "A run of brushed aluminium and white acrylic wayfinding plates laid out in a row on a matte charcoal surface, each carrying a plain directional arrow and nothing else, small chrome standoff fixings arranged beside them. Hard directional light, crisp geometric shadows, shot straight top-down. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A row of brushed aluminium and acrylic wayfinding plates with directional arrows, laid out beside their standoff fixings."),
  "law-firm-stationery": shot("work-stationery", "2e507fee-f883-4bdd-b7ae-d89a946c079c", "035748", "3:2",
    "Flat lay of a stationery set on a dark oak desk: heavy uncoated letterhead sheets, matching envelopes, and a stack of thick uncoated business cards showing a deep blind deboss of an abstract geometric mark, a fountain pen laid diagonally across the corner. Warm low directional light, crisp shadows, shot straight top-down. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A stationery set on a dark oak desk: uncoated letterhead, envelopes and blind-debossed cards with a fountain pen across them."),
  "retail-shopify-and-packaging": shot("work-retail", "4ffbde93-6973-4bd2-b772-21facf539705", "035748", "3:2",
    "Flat lay on a pale plaster surface: a kraft retail box closed with a plain round sticker seal, folded tissue paper, a row of blank card hang tags on cotton string, a canvas tote bag, and a phone showing a blank dark product page made only of rectangular placeholder blocks. Soft directional light, shot straight top-down. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Retail packaging photographed top-down: a sealed kraft box, tissue, hang tags on string, a canvas tote and a phone showing a product page."),
  "trade-show-package": shot("work-booth", "f6ceb824-8798-446d-affc-524fd94b4cb9", "035748", "3:2",
    "A compact exhibition stand set up in an empty trade show hall: a fabric backdrop wall in flat dark grey, a fitted table cover, and two furled feather flags on poles, every surface completely blank. Polished concrete floor, even overhead light. No text, no words, no logos, no graphics or lettering anywhere. Editorial architectural photography, photorealistic",
    "A compact trade show stand in an empty hall: a fabric backdrop, a fitted table cover and two feather flags."),
  "cafe-opening-kit": shot("work-cafe", "435b3c6c-8ca4-4845-a485-36d3f7b04cfd", "035748", "3:2",
    "Flat lay on a warm concrete counter: a stack of takeaway coffee cups with plain kraft sleeves, a folded A-frame sign insert, a stack of thick loyalty cards, a folded canvas apron, and a rolled sheet of frosted window vinyl. Morning directional light, crisp shadows, shot straight top-down. No text, no words, no logos, no lettering on any item. Editorial product photography, photorealistic",
    "A café opening kit photographed top-down: takeaway cups with kraft sleeves, an A-frame insert, loyalty cards, an apron and window vinyl."),
};

/** One header per blog category, keyed by the slug in content/posts.ts. */
export const categoryStills: Record<string, ImageAsset> = {
  print: shot("cat-print", "bbb5efb1-58c8-473d-92dc-7e3fcec6fdac", "035748", "16:9",
    "Close-up of a guillotine paper cutter blade coming down on a stack of freshly printed sheets on a matte steel bed, a clean paper edge and fine dust catching hard directional light. Matte charcoal and brushed steel. No text, no words, no logos, no lettering. Editorial industrial photography, photorealistic",
    "A guillotine cutter blade coming down on a stack of freshly printed sheets."),
  signage: shot("cat-signage", "9a94e94f-6986-4c6b-a397-d659e2e137aa", "035748", "16:9",
    "A wide-format roll printer mid-print, a length of white vinyl feeding out over the take-up roller carrying a printed abstract grey gradient field, printheads softly out of focus behind. Matte charcoal machinery, hard directional light, crisp shadows. No text, no words, no logos, no lettering. Editorial industrial photography, photorealistic",
    "A wide-format roll printer mid-print, vinyl feeding out over the take-up roller."),
  apparel: shot("cat-apparel", "53222ae9-1b61-4ff4-83d8-1938488ad47d", "035748", "16:9",
    "A heat press closing onto a black t-shirt laid flat on the platen, a sheet of transfer film lifting at one corner to reveal an abstract geometric shape, faint steam and warm directional light. Matte charcoal workshop. No text, no words, no logos, no lettering. Editorial industrial photography, photorealistic",
    "A heat press closing onto a black t-shirt, transfer film lifting at one corner."),
  industries: shot("cat-industries", "2acbfb69-26d3-4433-9837-d334bbea2a51", "074427", "16:9",
    "Overhead of a matte charcoal workbench laid out with one item from each trade a print shop serves, arranged on a precise grid: a blank menu card, a folded hi-vis work shirt, a small corrugated plastic yard sign with a wire stake, a brushed aluminium wayfinding plate with a plain arrow, and a stack of thick blank business cards. Hard directional light from one side, crisp geometric shadows, shot straight top-down. No text, no words, no logos, no lettering or writing on any item. Editorial product photography, photorealistic",
    "A workbench from above holding one item from each trade: a menu card, a hi-vis shirt, a yard sign with its stake, a wayfinding plate and a stack of cards."),
  "web-seo": shot("cat-web", "ba76f872-0fab-43b1-bd22-f9391be55eb3", "035748", "16:9",
    "A laptop and a phone on a matte charcoal desk photographed from a low three-quarter angle, both screens showing blank dark grey wireframe layouts made of rectangular placeholder blocks, a printed colour proof with a CMYK control bar and a printer's loupe beside them. Hard directional light from one side, crisp shadows. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A laptop and a phone showing blank page layouts, beside a printed colour proof and a loupe."),
};

/**
 * The product galleries under /work.
 *
 * Keyed by the item slug in content/gallery.ts, which is where the editorial
 * side of each one lives — the title, the spec, the price note. This file
 * holds only what is needed to reproduce the image: the job id, the model and
 * the exact prompt.
 *
 * ⚠️  THESE ARE GENERATED, NOT PHOTOGRAPHS OF OUR WORK. Every prompt says "no
 *     text, no words, no lettering" several ways, so nothing in them carries
 *     an invented brand — they show a stock, a finish and a process, which is
 *     what the galleries are actually about. Replace them with real product
 *     photography as it is shot; the alt text and the aspect stay the same, so
 *     it is a file swap and nothing else moves.
 */
export const galleryStills: Record<string, ImageAsset> = {
  "cards-16pt": shot("g-cards-16pt", "7792aa17-565a-446f-8b73-7b116ff5d017", "161710", "4:3",
    "A neat stack of thick matte black business cards on a matte charcoal surface, the clean guillotine cut edge sharp in the foreground, three cards fanned beside the stack face up and completely blank. Hard directional light from one side, crisp geometric shadows, shot from a low three-quarter angle. No text, no words, no logos, no lettering or writing on any card. Editorial product photography, photorealistic",
    "A stack of thick matte black business cards with three fanned beside it, the cut edge sharp in the foreground."),
  "cards-spot-uv": shot("g-cards-spot-uv", "f2650295-f389-4626-8a06-f992ea9c9e80", "161710", "4:3",
    "Extreme close-up of a soft-touch matte laminated business card held at a raking angle, a glossy raised spot UV varnish in an abstract geometric shape catching the light against the velvety matte surface around it. Matte charcoal background, single hard light source, shallow depth of field. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A soft-touch card at a raking angle, a glossy raised spot UV shape catching the light against the matte surface."),
  "cards-painted-edge": shot("g-cards-painted-edge", "5e4b822a-f2ae-4e52-819b-3a6b8772002a", "161710", "4:3",
    "A fanned stack of very thick 32pt business cards standing on edge, a bright painted colour core running as a visible stripe through the middle of every card between two layers of dark matte stock. Matte charcoal surface, hard directional light, crisp shadows, macro detail on the painted edge. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "32pt cards standing on edge, a painted colour core running as a visible stripe through the middle of each one."),
  "cards-foil": shot("g-cards-foil", "8bcbc30b-2c64-4e6d-a12a-26becb8d4eb9", "161710", "4:3",
    "A dark uncoated business card photographed at a steep raking angle, a hot-foil stamped abstract geometric border in bright gold metal leaf catching a single hard light, the foil visibly brighter and more reflective than any ink could be. Matte charcoal surface, deep shadows. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A dark uncoated card with a hot-foil stamped gold border catching a single hard light."),
  "cards-letterpress": shot("g-cards-letterpress", "bef5d04a-db16-4f90-86f5-17f3b8638bbc", "161711", "4:3",
    "Macro of a heavy uncoated cotton business card showing a deep blind deboss of an abstract geometric mark pressed into the paper, no ink at all, raking side light making the impression read as shadow and the paper fibres visible at the edge. Matte charcoal surface. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A heavy uncoated card with a deep blind deboss pressed into it, the impression reading as shadow under raking light."),
  "cards-cut": shot("g-cards-cut", "1407eb8f-892b-410b-bc0e-a4063de95e52", "161711", "4:3",
    "A freshly guillotined lift of thick printed cards sitting on the steel bed of a paper cutter, the blade raised above them, the cut face of the stack perfectly flush and catching hard directional light, fine paper dust in the air. Brushed steel and matte charcoal. No text, no words, no logos, no lettering. Editorial industrial photography, photorealistic",
    "A freshly guillotined lift of cards on the steel bed of a paper cutter, the blade raised above them."),
  "print-flyers": shot("g-print-flyers", "26ae940c-d55d-4e55-88bd-448cdd63f4d7", "161710", "4:3",
    "A wide fan of glossy letter-size flyers spread across a matte charcoal surface like a hand of cards, the gloss coating catching a hard directional light along the sweep, edges crisp. Shot from a low three-quarter angle. No text, no words, no logos, no lettering or writing on any sheet. Editorial product photography, photorealistic",
    "A wide fan of glossy letter-size flyers, the coating catching the light along the sweep."),
  "print-brochures": shot("g-print-brochures", "9f52fcfe-0b6a-4ae0-bcb6-cdc0f9819e84", "161710", "4:3",
    "A stack of folded tri-fold brochures on a matte charcoal surface with one standing open in a Z shape behind it, heavy matte paper, clean folds with no cracking on the spine. Hard directional light from one side, crisp geometric shadows. No text, no words, no logos, no lettering on any panel. Editorial product photography, photorealistic",
    "A stack of tri-fold brochures with one standing open behind it, showing clean uncracked folds."),
  "print-menus": shot("g-print-menus", "d5a7538a-bf5d-4739-84ad-f092cec126ae", "161710", "4:3",
    "A short stack of folded takeaway menus on a warm concrete restaurant counter, the top one half open, heavy uncoated paper, a folded napkin and a water glass softly out of focus behind. Morning directional light, crisp shadows. No text, no words, no logos, no lettering anywhere. Editorial food-and-beverage photography, photorealistic",
    "A stack of folded takeaway menus on a restaurant counter, the top one half open."),
  "print-stationery": shot("g-print-stationery", "718d6781-c3c1-440f-80b1-bfb3660abf18", "161710", "4:3",
    "Flat lay of a complete stationery set on a matte charcoal surface arranged on a precise grid: blank letterhead sheets, matching envelopes with the flaps open, a chipboard-backed notepad, and a stack of thick business cards. Hard directional light from one side, crisp geometric shadows, shot straight top-down. No text, no words, no logos, no lettering on any item. Editorial product photography, photorealistic",
    "A stationery set photographed top-down: letterhead, envelopes with the flaps open, a notepad and a stack of cards."),
  "print-folders": shot("g-print-folders", "772f467d-0939-4f2f-8954-9ae639acfcd3", "161710", "4:3",
    "Two heavy card presentation folders on a matte charcoal surface, one closed and one open to show the glued interior pocket and the diagonal card slits cut into it, a few blank sheets tucked inside. Hard directional light, crisp shadows, low three-quarter angle. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Two presentation folders, one open to show the glued pocket and the diagonal card slits cut into it."),
  "print-ncr": shot("g-print-ncr", "cfac6467-90e0-42c4-af9c-0968ffdd651b", "161710", "4:3",
    "A stack of carbonless NCR form pads on a matte charcoal workbench, the top sheet lifted at one corner to reveal the yellow and pink copies underneath, ruled boxes visible as plain lines only, a pen resting beside them. Hard directional light, crisp shadows. No text, no words, no logos, no lettering or writing in any field. Editorial product photography, photorealistic",
    "Carbonless NCR pads with the top sheet lifted to show the yellow and pink copies underneath."),
  "sign-banner": shot("g-sign-banner", "1c12bc16-30e1-4332-9030-0acedf874d0e", "161732", "4:3",
    "A large blank vinyl banner stretched tight across a construction site fence, hemmed on all four sides with brass grommets every 60 centimetres and bungee cords through them, the surface flat and untorn. Overcast daylight, shallow depth of field on the fence behind. No text, no words, no logos, no lettering or graphics on the banner. Editorial documentary photography, photorealistic",
    "A vinyl banner stretched tight across a site fence, hemmed all round with grommets and bungee cords."),
  "sign-lawn": shot("g-sign-lawn", "6802764a-4ad4-44af-ad6d-dd80b1d91d97", "161732", "4:3",
    "Three blank corrugated plastic lawn signs pushed into a green suburban boulevard on folded wire H-stakes, seen from a low angle with the corrugation flutes visible along the top edge, soft late afternoon light, houses out of focus behind. No text, no words, no logos, no lettering or graphics on the signs. Editorial documentary photography, photorealistic",
    "Three corrugated plastic lawn signs on wire H-stakes in a suburban boulevard, the flutes visible along the top edge."),
  "sign-aframe": shot("g-sign-aframe", "f4f62652-f530-484f-9ccf-d7870cb3b066", "161732", "4:3",
    "A blank A-frame sidewalk sign standing on a city pavement outside a shopfront at dusk, metal hinges and a plain white insert panel in the frame, warm light spilling from the window behind it. No text, no words, no logos, no lettering or graphics on the panel. Editorial architectural photography, photorealistic",
    "An A-frame sidewalk sign on a pavement at dusk, its insert panel blank, warm light from the shopfront behind."),
  "sign-display": shot("g-sign-display", "6603897e-c2fa-4a57-92be-f5250f8e0f0e", "161732", "4:3",
    "A retractable roll-up banner stand fully extended beside two furled feather flags on poles in an empty exhibition hall, every printed surface completely blank flat grey, aluminium cartridge base visible. Polished concrete floor, even overhead light. No text, no words, no logos, no graphics or lettering anywhere. Editorial architectural photography, photorealistic",
    "A retractable banner stand extended beside two feather flags in an empty hall, the aluminium cartridge base visible."),
  "sign-vehicle": shot("g-sign-vehicle", "06ac165e-6829-42f8-9cfe-c0d4412a8842", "161732", "4:3",
    "Close-up of finished cut vinyl graphics on the door of a clean white work van, an abstract dark grey geometric shape with a crisp knife-cut edge conforming over the door seam and handle recess. Bright overcast daylight, shallow depth of field. No text, no words, no logos, no letters anywhere in the graphic. Editorial documentary photography, photorealistic",
    "Cut vinyl on a white van door, the knife-cut edge conforming over the door seam and the handle recess."),
  "sign-window": shot("g-sign-window", "9f4cddca-1273-46ea-80c9-87e70b5d6130", "161732", "4:3",
    "Storefront glass with a band of frosted etch privacy vinyl applied across it at seated height, reading as sandblasted glass, an abstract geometric shape cut out of the frost so clear glass shows through, warm interior light behind. No text, no words, no logos, no lettering. Editorial architectural photography, photorealistic",
    "A band of frosted etch vinyl across storefront glass at seated height, with a shape cut out so clear glass shows through."),
  "wear-polos": shot("g-wear-polos", "3913573c-c3b3-4093-a88f-ac7f3cf6193b", "161732", "4:3",
    "A neat stack of folded black cotton polo shirts on a matte charcoal bench, the top one turned to show a plain embroidered abstract geometric shape on the left chest, the stitch texture crisp and raised. Hard directional light from one side, macro detail on the thread. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Folded black polo shirts, the top one showing an embroidered left chest with the stitch texture crisp and raised."),
  "wear-hoodies": shot("g-wear-hoodies", "8ea18991-a379-4211-a6a5-647876a63716", "161732", "4:3",
    "Two heavyweight hoodies laid flat and overlapping on a matte charcoal surface, one charcoal and one black, each with a plain embroidered abstract geometric shape on the left chest and a drawstring hood. Hard directional light, crisp shadows, shot straight top-down. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Two heavyweight hoodies laid flat and overlapping, each with an embroidered left chest and a drawstring hood."),
  "wear-tees": shot("g-wear-tees", "1c40447a-af33-4361-b148-41d68e462d5e", "161732", "4:3",
    "A stack of screen printed cotton t-shirts folded on a matte charcoal bench, the top shirt showing a bold flat abstract geometric print across the chest with the slightly raised plastisol ink texture visible, a screen printing squeegee resting beside them. Hard directional light, crisp shadows. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Folded screen printed t-shirts with a squeegee beside them, the raised plastisol ink texture visible on the top shirt."),
  "wear-caps": shot("g-wear-caps", "9e7e8b6b-c6f4-4323-abe1-a48fcec9f200", "161733", "4:3",
    "Four structured baseball caps arranged in a row on a matte charcoal surface, each with a plain embroidered abstract geometric shape on the front panel, curved brims, one turned to show the closure at the back. Hard directional light from one side, crisp shadows. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Four structured caps in a row, each embroidered on the front panel, one turned to show the closure at the back."),
  "wear-hivis": shot("g-wear-hivis", "f4266b20-f2a5-4ce6-98d4-cb0eddcc0e88", "161732", "4:3",
    "Hi-vis yellow safety vests and a long-sleeve hi-vis work shirt folded in a stack on a matte charcoal bench, reflective silver tape catching the light, a plain embroidered abstract shape on the chest of the top piece, work gloves and a hard hat beside them. Hard directional light, crisp shadows. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "Folded hi-vis vests and a work shirt with reflective tape catching the light, gloves and a hard hat beside them."),
  "wear-aprons": shot("g-wear-aprons", "ce2a9939-f0ad-4b67-895f-5af10a8350a3", "161732", "4:3",
    "A folded canvas apron with crossback straps and a natural canvas tote bag laid side by side on a warm concrete counter, each carrying a plain embroidered abstract geometric shape, the weave of the canvas visible. Morning directional light, crisp shadows, shot straight top-down. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A crossback canvas apron and a canvas tote side by side, each embroidered, the weave of the canvas visible."),
  "design-brand-sheet": shot("g-design-brand-sheet", "7650b3e6-596e-4259-9b16-1b131e3c2747", "161749", "4:3",
    "A printed brand guideline sheet lying open on a matte charcoal desk, showing a row of large solid colour swatch blocks with plain numeric-free rectangles beneath each, and a grid of abstract geometric mark variations at different sizes. No readable text anywhere, no words, no logos, no lettering — shapes and colour blocks only. Hard directional light from one side, crisp shadows, shot straight top-down. Editorial product photography, photorealistic",
    "A printed brand sheet open on a desk, showing a row of solid colour blocks and a grid of mark variations at different sizes."),
  "design-sketches": shot("g-design-sketches", "57895505-f1b2-47ea-9c28-49d64ee4f1b8", "161749", "4:3",
    "A large sheet of tracing paper on a matte charcoal desk covered in hand-drawn pencil sketches of abstract geometric marks, shapes only and no letters, a mechanical pencil and a kneaded eraser resting on it, the pencil graphite catching raking light. Shot straight top-down, hard directional light, crisp shadows. No text, no words, no lettering anywhere. Editorial product photography, photorealistic",
    "Tracing paper covered in hand-drawn pencil sketches of marks, with a mechanical pencil and eraser resting on it."),
  "design-pantone": shot("g-design-pantone", "f950451d-cdbd-4050-97f7-8547f09ac8ec", "161749", "4:3",
    "A Pantone-style fan deck of colour chips opened into a wide arc on a matte charcoal surface, the chips spanning greens and blues, a printed colour proof sheet with a CMYK control bar beneath it and a printer's loupe resting on the proof. Hard directional light, crisp geometric shadows, low three-quarter angle. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A fan deck of colour chips opened into an arc over a printed proof with a CMYK control bar and a loupe."),
  "design-brand-kit": shot("g-design-brand-kit", "96d58ee4-2448-4467-98e3-c7ba4055e717", "161749", "4:3",
    "Eight printed brand kit pages laid out in a precise grid on a matte charcoal surface, each page carrying only colour blocks, plain rules, spacing diagrams with thin measurement lines, and abstract geometric mark variations. No readable text anywhere, no words, no lettering, no logos — layout and colour only. Shot straight top-down, hard directional light, crisp shadows. Editorial product photography, photorealistic",
    "Eight printed brand kit pages laid out in a grid, carrying colour blocks, spacing diagrams and mark variations."),
  "design-vector": shot("g-design-vector", "81c83c59-34ff-4da6-820a-35543e7ce793", "161749", "4:3",
    "A designer's monitor on a matte charcoal desk showing vector artwork in a drawing application: an abstract geometric shape with visible bezier anchor points, handles and a blue outline path, surrounded by plain grey interface panels with no readable labels. A graphics tablet and pen beside the keyboard. Hard directional light from one side, shallow depth of field. No text, no words, no logos, no lettering. Editorial product photography, photorealistic",
    "A monitor showing vector artwork with visible bezier anchor points and handles, a graphics tablet beside the keyboard."),
};

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

/* ═══════════════════════════════════════════════════════════════════════════
   AD PHOTOGRAPHY

   Shot separately from everything above, and for a different job. The plates
   in `stills` are deliberately blank stock on a clean charcoal ground —
   correct for a website that must not imply work it did not do. They read as
   catalogue photography, and the owner's note on seeing them in an ad was
   exactly right: "this doesn't look like what we do."

   These four are staged in a working shop instead — a scuffed steel table, a
   press delivery tray, ink on the bench. Still generated, still blank of any
   lettering, still not photographs of a job this shop ran. Nothing captions
   them as one. They exist so the price card has something behind the numbers
   that looks like a print shop rather than a catalogue.

   Replace them the moment there are real photographs from the floor. That is
   what PHOTO_DIR on scripts/make-photo-ad.mjs is for.
   ═══════════════════════════════════════════════════════════════════════════ */

export const adShots = {
  cards: shot("ad-cards", "2ce15199-1be8-441c-a7ec-e248f29719e5", "014642", "4:3",
    "A tight stack of thick 16pt matte business cards resting on a scuffed steel work table in a small commercial print shop, the clean guillotine-cut edge sharp and in focus in the foreground, three more cards fanned out beside the stack, all cards completely blank with a plain deep navy and white colour block design and no lettering. A paper guillotine and stacked cartons slightly out of focus behind. Warm overhead shop lighting mixed with daylight from a bay door, real working environment, mild wear on the table. Shot on a 50mm lens at f/2.8, slight grain. No text, no words, no numbers, no logos, no lettering anywhere.",
    "A stack of thick matte business cards on a steel work table in a print shop, cut edge sharp in the foreground.",
    "20260905"),
  flyers: shot("ad-flyers", "43571594-879a-40a6-8282-61d0d8c94627", "014642", "4:3",
    "Freshly cut letter-size gloss flyers stacked in a neat block on the delivery tray of a commercial digital press, the top few fanned across the stack so the gloss coating catches the light, printed with plain abstract colour blocks and photo panels but absolutely no lettering. The press housing and control panel visible but out of focus behind. Warm workshop light, real small-business print shop, honest and slightly utilitarian. Shot on a 35mm lens, natural grain. No text, no words, no numbers, no logos, no lettering anywhere.",
    "Gloss flyers stacked on the delivery tray of a digital press, the top few fanned so the coating catches the light.",
    "20260905"),
  tees: shot("ad-tees", "adf249e5-c389-4aba-aa1a-3baccbd06be0", "014642", "4:3",
    "A stack of folded cotton t-shirts in black, white and heather grey on a worn wooden bench beside a manual screen printing carousel, the top shirt showing a bold flat two-colour abstract geometric print across the chest with the slightly raised plastisol ink texture catching the light. A squeegee and a screen leaning against the bench. Real small apparel shop, warm light, a bit of ink on the bench. Shot on a 50mm lens at f/2.5. No text, no words, no numbers, no logos, no lettering on the shirts or anywhere.",
    "Folded printed t-shirts on a bench beside a screen printing carousel, the top shirt showing raised plastisol ink.",
    "20260905"),
  web: shot("ad-web", "12352c44-4251-48f6-9a02-59fe9affa719", "014642", "4:3",
    "A laptop and a phone side by side on a matte charcoal desk in a small design studio, both screens showing the same dark clean website layout rendered only as blank rectangular placeholder blocks, thin rules and grey photo panels, with no readable text of any kind. A printed colour proof sheet with a CMYK control bar and a stack of thick matte cards beside them, tying the screen work to the print work. Hard directional light from the left, crisp shadows. Shot on a 35mm lens. No text, no words, no numbers, no logos, no lettering anywhere.",
    "A laptop and phone showing the same blank website layout, beside a printed colour proof and a stack of cards.",
    "20260905"),
} as const;

/** Every asset, for scripts/fetch-media.mjs to walk. */
export const allVideos: VideoAsset[] = [...Object.values(loops), ...Object.values(reels)];
export const allImages: ImageAsset[] = [
  ...Object.values(stills),
  ...Object.values(packageStills),
  ...Object.values(panelStills),
  ...Object.values(pageStills),
  ...Object.values(workStills),
  ...Object.values(categoryStills),
  ...Object.values(galleryStills),
  ...Object.values(adShots),
];
