/**
 * Post-deploy verification, against the real domain.
 *
 * Everything here was verified against localhost during the build. None of it
 * proves anything about production until it runs against the deployed origin,
 * because the things most likely to be wrong on day one — DNS, the apex/www
 * pair, the certificate, headers surviving the CDN, the canonical host — do
 * not exist locally at all.
 *
 *   node scripts/verify-live.mjs https://surgelabs.ca
 */
const base = (process.argv[2] ?? "https://surgelabs.ca").replace(/\/$/, "");
const host = new URL(base).hostname;
// Run it against localhost as a pre-deploy smoke test and the DNS-shaped
// checks are meaningless — there is no www.localhost and no certificate.
// Skip those rather than report six failures that are not failures.
const isLocal = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(host);
if (isLocal) console.log("(local target — skipping the www, HSTS and canonical-host checks)");
const problems = [];
const ok = (label, pass, detail = "") => {
  console.log(`  ${pass ? "✓" : "✗"} ${label}${detail ? `  ${detail}` : ""}`);
  if (!pass) problems.push(label);
};

const head = async (url, redirect = "manual") => {
  try {
    const r = await fetch(url, { redirect, headers: { "user-agent": "surgelabs-verify" } });
    return { status: r.status, headers: r.headers, url: r.url };
  } catch (e) {
    return { status: 0, error: String(e), headers: new Headers() };
  }
};

console.log(`\nverifying ${base}\n`);

console.log("apex and www:");
const apex = await head(`${base}/`, "follow");
ok("apex serves 200", apex.status === 200, `(${apex.status})`);

if (!isLocal) {
  const www = await head(`https://www.${host}/packages`);
  const wwwLoc = www.headers.get("location") ?? "";
  ok("www redirects", www.status === 301 || www.status === 308, `(${www.status})`);
  ok("www lands on the apex", wwwLoc.includes(host) && !wwwLoc.includes(`www.${host}`), wwwLoc);
  ok("www redirect keeps the path", wwwLoc.endsWith("/packages"), wwwLoc);
} else {
  // `Host` is a forbidden header in the fetch spec, so the www rule cannot be
  // exercised from Node against a local server. curl can:
  //   curl -sI -H "Host: www.surgelabs.ca" http://localhost:3000/packages
  console.log("  – www→apex rule: not testable from fetch (Host is a forbidden header)");
  console.log('       curl -sI -H "Host: www.surgelabs.ca" ' + base + "/packages");
}

console.log("\nsecurity headers:");
const h = apex.headers;
if (!isLocal) ok("Strict-Transport-Security", !!h.get("strict-transport-security"), h.get("strict-transport-security") ?? "");
ok("Content-Security-Policy", !!h.get("content-security-policy"));
ok("X-Content-Type-Options: nosniff", h.get("x-content-type-options") === "nosniff");
ok("X-Frame-Options", !!h.get("x-frame-options"), h.get("x-frame-options") ?? "");
ok("Referrer-Policy", !!h.get("referrer-policy"), h.get("referrer-policy") ?? "");
ok("Permissions-Policy", !!h.get("permissions-policy"));
ok("x-powered-by is absent", !h.get("x-powered-by"));

console.log("\ncrawl surface:");
const robots = await fetch(`${base}/robots.txt`).then((r) => r.text()).catch(() => "");
ok("robots.txt served", robots.includes("Sitemap:"));
if (!isLocal) ok("robots points at this host's sitemap", robots.includes(`${base}/sitemap.xml`), "");
const sitemapRes = await fetch(`${base}/sitemap.xml`);
const sitemap = await sitemapRes.text().catch(() => "");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok("sitemap.xml served", sitemapRes.status === 200 && locs.length > 0, `${locs.length} URLs`);
if (!isLocal) {
  ok("sitemap URLs use the canonical host", locs.every((l) => l.startsWith(base)),
     locs.find((l) => !l.startsWith(base)) ?? "");
}

// The sitemap always carries absolute production URLs. Against a local
// target, fetch the same paths from the target instead.
const toCheck = locs.map((l) => (isLocal ? base + new URL(l).pathname : l));

console.log("\nredirects:");
const { redirectMap } = await import("../lib/redirects.ts").catch(() => ({ redirectMap: [] }));
for (const r of redirectMap) {
  const res = await head(`${base}${r.from}`);
  const loc = res.headers.get("location") ?? "";
  ok(`${r.from} → ${r.to}`, res.status === 301 && loc.endsWith(r.to), `${res.status} ${loc}`);
}

console.log("\nevery sitemap URL resolves:");
let bad = 0;
for (const loc of toCheck) {
  const res = await head(loc, "manual");
  if (res.status !== 200) { bad++; console.log(`  ✗ ${res.status} ${loc}`); }
}
ok(`all ${toCheck.length} sitemap URLs return 200`, bad === 0, bad ? `${bad} failing` : "");

// The summary line names the target. A clean run against localhost used to
// print "✓ live site verified", which is how a smoke test got reported here
// as proof the deployment was up — it was not, and the 45 URLs it had just
// confirmed were the local ones. A pass against a local server is a pass
// against a local server and the line now says so.
console.log(
  problems.length
    ? `\n✗ ${problems.length} problem(s) at ${base}:`
    : isLocal
      ? `\n✓ local build verified at ${base} — this proves NOTHING about the deployment.\n` +
        "  Re-run against the real origin before reporting it as live:\n" +
        "    node scripts/verify-live.mjs https://surgelabs.ca\n"
      : `\n✓ live site verified at ${base}\n`,
);
for (const p of problems) console.log(`  - ${p}`);
process.exit(problems.length ? 1 : 0);
