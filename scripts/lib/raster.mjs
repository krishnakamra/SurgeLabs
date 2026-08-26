/**
 * A polygon rasteriser, a PNG encoder and an ICO container — in about 150
 * lines, with no dependencies.
 *
 * This exists because the favicon set has to be cut from the same geometry as
 * everything else (lib/brand/mark.ts), and the alternative was adding sharp or
 * ImageMagick to a project whose entire build is Node and a register hook.
 * The mark is one closed polygon of straight edges, which is the one case
 * where writing the rasteriser is genuinely smaller than installing one.
 */
import { deflateSync } from "node:zlib";

/* ── Rasteriser ─────────────────────────────────────────────────────────── */

/**
 * Coverage of `poly` over a `size`×`size` grid, 0–1 per pixel.
 *
 * Supersampled at SS×SS with the samples offset to pixel-subcentres, so a
 * 45° cut lands as a clean ramp rather than a stair. 8×8 = 64 samples is well
 * past the point where more stops being visible at 16px.
 */
export function coverage(poly, size, ss = 8) {
  const out = new Float32Array(size * size);
  const step = 1 / ss;
  const first = step / 2;

  // Bounding box, so the 60% of an icon that is outside the mark costs nothing.
  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;
  for (const [x, y] of poly) {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  const y0 = Math.max(0, Math.floor(minY));
  const y1 = Math.min(size - 1, Math.ceil(maxY));
  const x0 = Math.max(0, Math.floor(minX));
  const x1 = Math.min(size - 1, Math.ceil(maxX));

  for (let py = y0; py <= y1; py++) {
    for (let px = x0; px <= x1; px++) {
      let hits = 0;
      for (let sy = 0; sy < ss; sy++) {
        const y = py + first + sy * step;
        for (let sx = 0; sx < ss; sx++) {
          if (inside(poly, px + first + sx * step, y)) hits++;
        }
      }
      out[py * size + px] = hits / (ss * ss);
    }
  }
  return out;
}

/**
 * Flatten an SVG path's curves into a polygon.
 *
 * The old geometric mark was twelve straight edges and needed none of this.
 * The supplied artwork is a typographic S — all cubic beziers — so the
 * favicon set has to sample them. 24 segments per curve is well past the
 * point where more is visible at 48px, let alone 16.
 *
 * Handles M/L/H/V/C/S and their relative forms, which is everything Illustrator
 * emits for this artwork. Arcs and quadratics would need adding if the
 * artwork ever changes to include them — it throws rather than silently
 * dropping a command, because a mark missing a segment is worse than a build
 * that stops.
 */
export function flattenPath(d, segments = 24) {
  const tokens = [...d.matchAll(/([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/g)].map(
    (m) => (m[1] ? { cmd: m[1] } : { num: Number.parseFloat(m[2]) }),
  );

  const pts = [];
  let cur = [0, 0];
  let start = [0, 0];
  let prevC2 = null;
  let cmd = null;
  let i = 0;

  const bezier = (p0, p1, p2, p3) => {
    for (let k = 1; k <= segments; k++) {
      const t = k / segments;
      const mt = 1 - t;
      pts.push([
        mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0],
        mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1],
      ]);
    }
  };

  while (i < tokens.length) {
    if (tokens[i].cmd) {
      cmd = tokens[i].cmd;
      i++;
      if (cmd === "Z" || cmd === "z") {
        cur = [...start];
        pts.push(cur);
        continue;
      }
    }
    const nums = [];
    while (i < tokens.length && tokens[i].num !== undefined) nums.push(tokens[i++].num);

    const rel = cmd === cmd.toLowerCase();
    let type = cmd.toUpperCase();
    let j = 0;
    while (j < nums.length) {
      if (type === "M" || type === "L") {
        const [x, y] = [nums[j], nums[j + 1]];
        j += 2;
        cur = rel ? [cur[0] + x, cur[1] + y] : [x, y];
        if (type === "M") start = [...cur];
        pts.push(cur);
        // A second coordinate pair after M is an implicit lineto.
        if (type === "M") type = "L";
      } else if (type === "H") {
        const x = nums[j++];
        cur = rel ? [cur[0] + x, cur[1]] : [x, cur[1]];
        pts.push(cur);
      } else if (type === "V") {
        const y = nums[j++];
        cur = rel ? [cur[0], cur[1] + y] : [cur[0], y];
        pts.push(cur);
      } else if (type === "C") {
        const a = nums.slice(j, j + 6);
        j += 6;
        const p1 = rel ? [cur[0] + a[0], cur[1] + a[1]] : [a[0], a[1]];
        const p2 = rel ? [cur[0] + a[2], cur[1] + a[3]] : [a[2], a[3]];
        const p3 = rel ? [cur[0] + a[4], cur[1] + a[5]] : [a[4], a[5]];
        bezier(cur, p1, p2, p3);
        prevC2 = p2;
        cur = p3;
      } else if (type === "S") {
        const a = nums.slice(j, j + 4);
        j += 4;
        const p2 = rel ? [cur[0] + a[0], cur[1] + a[1]] : [a[0], a[1]];
        const p3 = rel ? [cur[0] + a[2], cur[1] + a[3]] : [a[2], a[3]];
        // The reflected control point. Without it an S curve kinks visibly.
        const p1 = prevC2 ? [2 * cur[0] - prevC2[0], 2 * cur[1] - prevC2[1]] : cur;
        bezier(cur, p1, p2, p3);
        prevC2 = p2;
        cur = p3;
      } else {
        throw new Error(`flattenPath: unsupported command "${cmd}" — add it rather than skipping it`);
      }
    }
  }
  return pts;
}

/** Even-odd crossing test. The mark is a simple polygon, so it agrees with nonzero. */
function inside(poly, x, y) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Scale a polygon about the centre of a `size`×`size` box and re-centre it. */
export function fit(poly, from, to, scale) {
  const target = to * scale;
  const k = target / from;
  const offset = (to - target) / 2;
  return poly.map(([x, y]) => [x * k + offset, y * k + offset]);
}

/**
 * Composite one polygon over a flat background. `fg` is laid down where the
 * polygon covers, so on the plate icons the S is a knockout — the paper
 * showing through a solid magenta fill, which is exactly what it is in print.
 */
export function compose(cov, size, bg, fg) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const a = cov[i];
    rgba[i * 4] = Math.round(bg[0] + (fg[0] - bg[0]) * a);
    rgba[i * 4 + 1] = Math.round(bg[1] + (fg[1] - bg[1]) * a);
    rgba[i * 4 + 2] = Math.round(bg[2] + (fg[2] - bg[2]) * a);
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

/** Same, but the background stays transparent and `fg` carries the alpha. */
export function composeTransparent(cov, size, fg) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4] = fg[0];
    rgba[i * 4 + 1] = fg[1];
    rgba[i * 4 + 2] = fg[2];
    rgba[i * 4 + 3] = Math.round(cov[i] * 255);
  }
  return rgba;
}

export function rgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/* ── PNG ────────────────────────────────────────────────────────────────── */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** 8-bit RGBA, no interlacing, every scanline filtered `none`. */
export function encodePNG(size, rgba) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: truecolour + alpha
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── ICO ────────────────────────────────────────────────────────────────── */

/**
 * Classic BMP frames rather than PNG-in-ICO. PNG frames are the newer form and
 * every current browser reads them, but favicon.ico is precisely the asset
 * that gets opened by things that are not current browsers — a BMP DIB is read
 * by all of them, and at 16/32/48 the size difference is a few kilobytes.
 *
 * The DIB header lies about the height on purpose: it declares 2× so the
 * format can carry an AND mask under the colour data. Ours is all zeros
 * because the alpha channel already does that job, but it has to be there.
 */
export function encodeICO(frames) {
  const dibs = frames.map(({ size, rgba }) => {
    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0);
    header.writeInt32LE(size, 4);
    header.writeInt32LE(size * 2, 8); // colour data + mask
    header.writeUInt16LE(1, 12); // planes
    header.writeUInt16LE(32, 14); // bits per pixel
    header.writeUInt32LE(0, 16); // BI_RGB

    // BGRA, bottom-up.
    const xor = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      const src = (size - 1 - y) * size * 4;
      for (let x = 0; x < size; x++) {
        const s = src + x * 4;
        const d = (y * size + x) * 4;
        xor[d] = rgba[s + 2];
        xor[d + 1] = rgba[s + 1];
        xor[d + 2] = rgba[s];
        xor[d + 3] = rgba[s + 3];
      }
    }

    // 1bpp AND mask, rows padded to 4 bytes.
    const maskStride = Math.ceil(size / 32) * 4;
    const and = Buffer.alloc(maskStride * size);
    header.writeUInt32LE(xor.length + and.length, 20);

    return Buffer.concat([header, xor, and]);
  });

  const count = frames.length;
  const dir = Buffer.alloc(6 + count * 16);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(count, 4);

  let offset = dir.length;
  frames.forEach(({ size }, i) => {
    const at = 6 + i * 16;
    dir[at] = size >= 256 ? 0 : size; // 0 means 256
    dir[at + 1] = size >= 256 ? 0 : size;
    dir[at + 2] = 0; // palette size
    dir[at + 3] = 0;
    dir.writeUInt16LE(1, at + 4); // planes
    dir.writeUInt16LE(32, at + 6); // bpp
    dir.writeUInt32LE(dibs[i].length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += dibs[i].length;
  });

  return Buffer.concat([dir, ...dibs]);
}
