/**
 * Downloads every asset in content/media.ts and encodes it for the web.
 *
 * WHY THIS IS A SCRIPT AND NOT A COMMITTED FOLDER OF FILES: the session that
 * generated the footage could not reach Higgsfield's CDN. This organisation's
 * egress proxy denies d8j0ntlcm91z4.cloudfront.net, so the URLs could be
 * recorded but not fetched. Run this from anywhere that can reach the CDN and
 * it fills in public/media/ from the registry.
 *
 *   node scripts/fetch-media.mjs            # everything
 *   node scripts/fetch-media.mjs --videos   # loops and reels only
 *   node scripts/fetch-media.mjs --images   # stills only
 *   node scripts/fetch-media.mjs --force    # re-encode files already present
 *
 * Requires ffmpeg and ffprobe on PATH.
 */
import { execFileSync, execFile } from "node:child_process";
import { mkdirSync, existsSync, statSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { allVideos, allImages } = await import(join(root, "content", "media.ts"));

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const only = args.has("--videos") ? "videos" : args.has("--images") ? "images" : "all";

const PUBLIC = join(root, "public");
const TMP = join(root, ".media-cache");
mkdirSync(TMP, { recursive: true });

/**
 * Delivery budgets, in bytes.
 *
 * hero and loop are the numbers the site is held to — those are bytes a
 * visitor downloads. `reel` is deliberately looser: the 9:16 cuts are upload
 * masters for Instagram and TikTok, which re-encode everything on ingest, so
 * squeezing them only throws away quality before the platform does.
 */
const BUDGET = { hero: 1_500_000, loop: 800_000, reel: 6_000_000, still: 400_000 };

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

function need(bin) {
  try {
    execFileSync(bin, ["-version"], { stdio: "ignore" });
  } catch {
    console.error(`✗ ${bin} is not on PATH. Install ffmpeg and try again.`);
    process.exit(1);
  }
}
need("ffmpeg");
need("ffprobe");

/**
 * MEDIA_BASE repoints every fetch at another origin — a local mirror, a
 * re-host, or a directory served over http. The filename is all that carries
 * identity, so a mirror only has to keep the basenames.
 */
function resolve(url) {
  const base = process.env.MEDIA_BASE;
  if (!base) return url;
  return `${base.replace(/\/$/, "")}/${url.split("/").pop()}`;
}

async function download(url, dest) {
  if (existsSync(dest) && !force) return dest;
  const target = resolve(url);
  const res = await fetch(target);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${target}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

async function probe(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,nb_frames,duration",
    "-of", "json", file,
  ]);
  return JSON.parse(stdout).streams[0];
}

/**
 * Encode once, to a size budget.
 *
 * The obvious approach — pick a CRF, check the size, try a higher CRF —
 * costs a full re-encode per guess and still misses: on the hardest
 * material tested here even CRF 47 came back at 18 MB. A delivery budget is
 * not a quality setting, it is a bitrate ceiling, and both encoders take one
 * directly. So derive the ceiling from budget ÷ duration and hand it over:
 * constrained quality, which spends the CRF when the shot is easy and caps
 * the bitrate when it is not. One pass, and the number it lands on is the
 * number that was asked for.
 */
function bitrateFor(budgetBytes, seconds) {
  // 8% back. 4% was not enough: the rate control works to a local average, so
  // it spends over the cap on hard passages and makes it back on easy ones,
  // and a clip that is hard end to end has nothing easy to make it back on.
  return Math.floor((budgetBytes * 8 * 0.92) / seconds);
}

async function encode({ input, output, args, label, budget }) {
  await run("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", "-i", input, ...args, output], {
    maxBuffer: 1 << 26,
  });
  const size = statSync(output).size;
  const ok = size <= budget;
  console.log(`    ${ok ? "\u2713" : "\u26a0 over"} ${label} ${kb(size)} / ${kb(budget)}`);
  return { size, ok };
}

/**
 * One pass at the computed ceiling, and if the muxed file still lands over,
 * exactly one more at 80% of it. Bounded on purpose: an encoder that misses
 * its cap twice is telling you the budget is wrong for the material, and
 * that is a decision for a person, not another loop iteration.
 */
const overBudget = [];

async function encodeCapped({ input, output, budget, label, build }) {
  const first = await encode({ input, output, budget, label, args: build(1) });
  if (first.ok) return first;
  console.log(`    \u21ba ${label}: retrying at 80% of the ceiling`);
  const second = await encode({ input, output, budget, label: `${label} (retry)`, args: build(0.8) });
  if (!second.ok) overBudget.push({ output, size: second.size, budget });
  return second;
}

/** Long edge cap. Site loops render at most ~1280 wide; reels stay 1080×1920. */
function scaleFilter(aspect) {
  return aspect === "9:16"
    // -2 keeps the other dimension even, which h264 yuv420p requires.
    ? "scale=1080:-2:flags=lanczos"
    : "scale=1280:-2:flags=lanczos";
}

async function doVideo(v) {
  const budget = v.aspect === "9:16" ? BUDGET.reel : v.id === "hero" ? BUDGET.hero : BUDGET.loop;
  const mp4 = join(PUBLIC, v.localMp4);
  const webm = join(PUBLIC, v.localWebm);
  const poster = join(PUBLIC, v.localPoster);
  mkdirSync(dirname(mp4), { recursive: true });

  if (!force && existsSync(mp4) && existsSync(webm) && existsSync(poster)) {
    console.log(`  – ${v.aspect} ${v.id}: already built`);
    return;
  }

  console.log(`  ${v.aspect} ${v.id}  (job ${v.jobId})`);
  const src = await download(v.remoteUrl, join(TMP, `${v.jobId}.mp4`));
  const meta = await probe(src);
  console.log(`    source ${meta.width}×${meta.height}, ${Number(meta.duration).toFixed(1)}s`);

  const scale = scaleFilter(v.aspect);

  const seconds = Number(meta.duration) || v.seconds;
  const cap = bitrateFor(budget, seconds);

  await encodeCapped({
    input: src, output: mp4, label: "mp4", budget,
    build: (k) => [
      "-an", "-vf", scale,
      "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
      // crf is the quality floor; maxrate/bufsize is the ceiling that makes
      // the budget real. An easy shot comes in under both.
      "-crf", "24", "-maxrate", String(Math.floor(cap * k)), "-bufsize", String(Math.floor(cap * k)),
      "-preset", "slow",
      // Without faststart the moov atom lands at the end of the file and the
      // browser has to buffer the whole thing before the first frame shows.
      "-movflags", "+faststart",
    ],
  });

  await encodeCapped({
    input: src, output: webm, label: "webm", budget,
    build: (k) => [
      "-an", "-vf", scale,
      "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p",
      // -b:v alone is a target VP9 will overshoot; maxrate is what caps it.
      "-crf", "32", "-b:v", String(Math.floor(cap * k)), "-maxrate", String(Math.floor(cap * k)), "-bufsize", String(Math.floor(cap * k * 2)),
      // cpu-used 2 spent minutes per clip for a few percent of size.
      "-row-mt", "1", "-deadline", "good", "-cpu-used", "4",
      "-tile-columns", "2", "-frame-parallel", "1",
    ],
  });

  // Poster from frame 1 of the ENCODED mp4, not the source: it then matches
  // the first painted video frame exactly, at exactly the same dimensions, so
  // swapping poster for video is invisible. This is the LCP element.
  await run("ffmpeg", [
    "-y", "-loglevel", "error", "-i", mp4,
    "-frames:v", "1", "-q:v", "4", poster,
  ]);
  const p = await probe(poster);
  console.log(`    ✓ poster ${p.width}×${p.height} → ${kb(statSync(poster).size)}`);
}

async function doImage(img) {
  const out = join(PUBLIC, img.localPath);
  mkdirSync(dirname(out), { recursive: true });
  if (!force && existsSync(out)) {
    console.log(`  – ${img.id}: already built`);
    return;
  }
  console.log(`  ${img.id}  (job ${img.jobId}, ${img.model})`);
  const src = await download(img.remoteUrl, join(TMP, `${img.jobId}.png`));

  // The source renders are ~5000px wide. Next's optimizer will resample from
  // whatever is committed, so 2000px is the point past which the repo grows
  // for no delivered pixels.
  // Stills have no duration to divide by, so quality stepping is the only
  // lever — but a JPEG re-encode is a second, not a minute.
  for (let q = 4; q <= 13; q += 3) {
    const { ok } = await encode({
      input: src, output: out, label: `jpg q${q}`, budget: BUDGET.still,
      args: ["-vf", "scale=2000:-2:flags=lanczos", "-q:v", String(q)],
    });
    if (ok) break;
  }
}

console.log(`\nfetch-media — ${only}\n`);
let failures = 0;
if (only !== "images") {
  console.log("videos:");
  for (const v of allVideos) {
    try { await doVideo(v); } catch (e) { failures++; console.error(`  ✗ ${v.aspect} ${v.id}: ${e.message}`); }
  }
}
if (only !== "videos") {
  console.log("\nimages:");
  for (const img of allImages) {
    try { await doImage(img); } catch (e) { failures++; console.error(`  ✗ ${img.id}: ${e.message}`); }
  }
}

if (!failures && !args.has("--keep-cache")) rmSync(TMP, { recursive: true, force: true });

// A file that missed its budget twice is still written — it is better to have
// a heavy loop than no loop — but it must not slip out in a wall of ✓ lines.
if (overBudget.length) {
  console.log(`\n\u26a0  ${overBudget.length} file(s) still over budget after the retry:`);
  for (const o of overBudget) {
    console.log(`   ${o.output.replace(root, "")}  ${kb(o.size)} / ${kb(o.budget)}`);
  }
  console.log("   Shorten the clip, drop the resolution, or raise the budget in BUDGET.");
}

// Flip the flag the components gate on, but only on a clean full run — a
// partial fetch that claimed the media was present would point the site at
// the half of it that is missing.
if (!failures && only === "all") {
  const registry = join(root, "content", "media.ts");
  const src = readFileSync(registry, "utf8");
  const flipped = src.replace("export const MEDIA_PRESENT = false;", "export const MEDIA_PRESENT = true;");
  if (flipped !== src) {
    writeFileSync(registry, flipped);
    console.log("\ncontent/media.ts: MEDIA_PRESENT → true");
  }
}

console.log(failures ? `\n${failures} asset(s) failed.\n` : "\nAll assets built into public/media.\n");
process.exit(failures ? 1 : 0);
