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

export type Aspect = "16:9" | "9:16" | "3:2";

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
};

/** Every asset, for scripts/fetch-media.mjs to walk. */
export const allVideos: VideoAsset[] = [...Object.values(loops), ...Object.values(reels)];
export const allImages: ImageAsset[] = [
  ...Object.values(stills),
  ...Object.values(packageStills),
];
