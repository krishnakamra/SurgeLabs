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
 * The Meta Pixel is the simple case: one script host, one pair of beacon
 * hosts.
 *
 * Google Ads needs more hosts than its four-line snippet suggests, because
 * gtag.js is a loader rather than the tag. `googletagmanager.com` serves
 * gtag.js, which then pulls `conversion_async.js` from
 * `googleadservices.com`. The conversion itself is a beacon to
 * `googleads.g.doubleclick.net`, sent as an image or — when the browser
 * blocks third-party images — an iframe, which is why `frame-src` can no
 * longer be `'none'`. `td.doubleclick.net` and `www.google.com` carry the
 * first-party-conversion and audience pings.
 *
 * Getting this list wrong is expensive in a way most CSP mistakes are not,
 * because the failure is entirely silent. Nothing breaks that a visitor
 * would notice, the tag is right there in the page source, and Google Ads
 * simply reports zero conversions while the campaign keeps spending. That is
 * why every host below is named with the call it serves rather than copied
 * from a blog post.
 *
 * `www.google.ca` sits beside `www.google.com` because the audience ping
 * follows the visitor's country ccTLD, and those two cover this business's
 * traffic. An unlisted ccTLD costs a remarketing audience, never a
 * conversion.
 */
const metaScript = "https://connect.facebook.net";
const metaBeacon = "https://www.facebook.com https://facebook.com";
const googleScript = "https://www.googletagmanager.com https://www.googleadservices.com";
const googleBeacon = [
  // A wildcard rather than a list, because the list was wrong. It named
  // googleads.g, td and stats, and a browser check against the live site
  // found gtag also calling ad.doubleclick.net/ccm/s/collect — twice, once
  // as a fetch and once as an image, both refused. Enumerating Google's ad
  // subdomains is a game you lose quietly: every miss is a measurement hole
  // nobody sees. The whole of doubleclick.net is one vendor, and it is the
  // vendor this tag belongs to.
  "https://*.doubleclick.net",
  "https://www.google.com",
  "https://www.google.ca",
].join(" ");
// Not just googletagmanager and googleadservices. gtag sends the conversion
// beacon by whichever transport the browser allows, and one of them is a
// script tag pointed at googleads.g.doubleclick.net/pagead/viewthroughconversion
// (fmt=4). With that refused it falls back to the image, so the conversion
// still lands — but it is a retry on every page view for no reason, and the
// fallback is not guaranteed to exist forever.
const googleAdServing = "https://*.doubleclick.net";

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' — see above. 'unsafe-eval' is NOT granted.
  `script-src 'self' 'unsafe-inline' ${metaScript} ${googleScript} ${googleAdServing}`,
  // Next injects style tags, and components set style attributes for the
  // registration offsets and panel counts.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${metaBeacon} ${googleBeacon}`,
  // next/font self-hosts every face, so no font CDN is needed.
  "font-src 'self'",
  `connect-src 'self' ${metaScript} ${metaBeacon} ${googleScript} ${googleBeacon}`,
  "media-src 'self'",
  // Was 'none', and would be again but for the Google Ads conversion iframe
  // fallback described above. Nothing on this site frames anything by design.
  `frame-src ${googleAdServing}`,
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
