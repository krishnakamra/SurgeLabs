import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // AVIF first, WebP second, original last.
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    // Permanent 301s from the old site's URLs. /custom-apparel keeps its
    // path, so it is deliberately absent — a redirect to itself is a loop.
    //
    // `statusCode: 301` rather than `permanent: true`: the shorthand emits
    // 308, which Google treats identically but which some older tooling and
    // link checkers report as a redirect chain of unknown kind. These URLs
    // only ever receive GET, so there is nothing 308's method preservation
    // buys here.
    return [
      { source: "/digital-web-services", destination: "/web-design-seo", statusCode: 301 },
      { source: "/print-signage", destination: "/printing-signage", statusCode: 301 },
      { source: "/landing", destination: "/packages", statusCode: 301 },
    ];
  },
};

export default nextConfig;
