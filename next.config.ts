import type { NextConfig } from "next";
import { redirectMap } from "./lib/redirects";
import { site } from "./content/site";

/**
 * Content Security Policy.
 *
 * Deliberately host-restrictive and script-permissive, and it is worth being
 * clear about why rather than shipping a policy that looks stricter than it
 * is.
 *
 * A nonce-based policy is the only way `'unsafe-inline'` comes off script-src,
 * and in the App Router that means generating a nonce per request in
 * middleware — which makes every page dynamic and throws away the static
 * generation the whole build rests on. This site renders no user-supplied
 * HTML anywhere: the quote form's only output is an email and a database row,
 * and the blog is MDX written in the repo. The XSS surface CSP would be
 * guarding is close to empty.
 *
 * What the policy does buy, and the reason it is here: the host allowlist. If
 * a dependency is ever compromised, it cannot open a socket to an attacker's
 * collector or pull a script from one — every destination has to be named
 * below. That is the threat this site actually has.
 */
/**
 * Third-party hosts, grouped by the tag that needs them.
 *
 * The Meta Pixel is the simple case: connect.facebook.net serves the script,
 * www.facebook.com takes the beacon, and it does not move.
 *
 * Google Ads is one list used in four directives, which looks lazy and is
 * not. gtag.js is a loader, and it chooses its transport and its endpoint at
 * runtime from consent state, experiment flags and what the browser allows —
 * the same page load sends the conversion as an image one time and a script
 * the next, to googleads.g.doubleclick.net one time and
 * googleadservices.com/ccm/conversion the next. Splitting these hosts by
 * directive means guessing that mapping correctly for every combination,
 * forever.
 *
 * It was guessed wrong three times here, each caught only by opening the
 * live site in a browser and reading the console:
 *
 *   1. the whole list missing, so gtag.js itself was refused
 *   2. ad.doubleclick.net absent, and the beacon's script transport refused
 *      because googleads.g was in img-src but not script-src
 *   3. googleadservices.com/ccm/conversion refused as an image, because that
 *      host was in script-src only — on /thank-you, which IS the conversion
 *
 * Each of those is silent. Nothing a visitor sees breaks, the tag is right
 * there in the page source, and Google Ads reports fewer conversions than
 * happened while the campaign keeps spending. The security this buys back by
 * being precise is nil: these are four hosts belonging to one vendor, and
 * that vendor is already trusted to run script on the page. So the list is
 * flat, and the only question asked of a host is whether it belongs to the
 * tag.
 *
 * `www.google.ca` sits beside `www.google.com` because the audience ping
 * follows the visitor's country ccTLD, and those two cover this business's
 * traffic. An unlisted ccTLD costs a remarketing audience, never a
 * conversion.
 *
 * If these ever change, the check is not to re-read this file. It is to load
 * the live landing page, click through to another route, then open
 * /thank-you, with the console filtered to "Refused to" — see the note in
 * scripts/verify-live.mjs.
 */
const metaScript = "https://connect.facebook.net";
const metaBeacon = "https://www.facebook.com https://facebook.com";
const googleAds = [
  "https://www.googletagmanager.com",
  "https://www.googleadservices.com",
  // A wildcard, because enumerating Google's ad subdomains is a game you lose
  // quietly — googleads.g, td, stats and ad have all turned up, and the list
  // was wrong twice. All of doubleclick.net is the same vendor as the rest of
  // this list.
  "https://*.doubleclick.net",
  "https://www.google.com",
  "https://www.google.ca",
].join(" ");

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' — see above. 'unsafe-eval' is NOT granted.
  `script-src 'self' 'unsafe-inline' ${metaScript} ${googleAds}`,
  // Next injects style tags, and components set style attributes for the
  // registration offsets and panel counts.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${metaBeacon} ${googleAds}`,
  // next/font self-hosts every face, so no font CDN is needed.
  "font-src 'self'",
  `connect-src 'self' ${metaScript} ${metaBeacon} ${googleAds}`,
  "media-src 'self'",
  // Was 'none', and would be again but for the Google Ads conversion iframe
  // fallback described above. Nothing on this site frames anything by design.
  `frame-src ${googleAds}`,
  "object-src 'none'",
  "base-uri 'self'",
  // The quote form posts to a server action on this origin and nowhere else.
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    // Two years, subdomains included, and preload-eligible. Only submit to the
    // preload list once www and apex both serve HTTPS — it is hard to undo.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  // Stops a browser second-guessing a Content-Type, which is how a .txt
  // upload becomes a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors above is the modern control; this covers browsers that
  // still only read the legacy header.
  { key: "X-Frame-Options", value: "DENY" },
  // Send the full URL to ourselves, origin only to third parties, nothing at
  // all when downgrading to HTTP.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site needs any of these. Denying them means an injected
  // script cannot ask for them either.
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Removes the x-powered-by: Next.js header. Free, and there is no reason to
  // advertise the framework and its major version to a scanner.
  poweredByHeader: false,

  images: {
    // AVIF first, WebP second, original last.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Higgsfield's CDN, where the generated stills and loops are hosted.
        // scripts/fetch-media.mjs downloads them into public/media for
        // production, so nothing in the app should reference these at
        // runtime — this exists so a direct reference works during review
        // rather than failing with an unconfigured-host error.
        protocol: "https",
        hostname: "d8j0ntlcm91z4.cloudfront.net",
        pathname: "/**",
      },
    ],
    // Left off deliberately. The local page plates are SVG and are rendered
    // with `unoptimized`, which bypasses the optimizer entirely and does not
    // need this. Turning it on would let any SVG reaching the optimizer carry
    // script.
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Hashed filenames, so the content behind a given URL never changes.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Generated media is replaced by editing the file, not by changing
        // the URL, so it gets a day of freshness and a week of stale-while-
        // revalidate rather than immutability.
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // www to apex. Most hosts will do this themselves once the apex is set as
      // primary domain, but that is a dashboard setting someone can undo
      // without noticing. This makes it part of the build.
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${new URL(site.url).hostname}` }],
        destination: `${site.url}/:path*`,
        statusCode: 301,
      },
      ...redirectMap.map((r) => ({
        source: r.from,
        destination: r.to,
        statusCode: 301 as const,
      })),
    ];
  },
};

export default nextConfig;
