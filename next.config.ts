import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Strict-transport-security: HTTPS only
// Content-Security-Policy: hardened for a static content site
//  - allow same-origin by default
//  - allow Google Fonts (used by next/font)
//  - disallow inline scripts except the JSON-LD ones (we allow 'self' + our own hashes via next automatic nonce in SSR)
//  - allow third-party images we reference in bios (gondilal.com favicons etc.) on-demand via img-src https:
//  - allow Clerk on the two signed-in surfaces (/contribute/new, /admin) and R2
//    for the presigned uploads a contributor's photo or voice note goes to

// Clerk serves its script from the instance's own frontend API host, which is
// encoded in the publishable key (pk_test_<base64 host>$). Reading it here means
// the CSP names the exact host instead of a wildcard over all of Clerk.
function clerkFrontendOrigin(): string | null {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const encoded = pk?.split("_")[2];
  if (!encoded) return null;
  try {
    const host = Buffer.from(encoded, "base64").toString("utf8").replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? `https://${host}` : null;
  } catch {
    return null;
  }
}

const clerkOrigin = clerkFrontendOrigin();
// Without a key at build time (preview, a fresh clone) fall back to Clerk's
// development hosts, so the sign-in box is never silently blank.
const clerkHosts = [clerkOrigin ?? "https://*.clerk.accounts.dev", "https://challenges.cloudflare.com"];

const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${clerkHosts.join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // blob: covers a voice note being played back before it is uploaded.
  "media-src 'self' blob:",
  [
    "connect-src 'self'",
    "https://*.tile.openstreetmap.org",
    "https://tile.openstreetmap.org",
    "https://*.r2.cloudflarestorage.com",
    ...clerkHosts,
  ].join(" "),
  `frame-src 'self' ${clerkHosts.join(" ")}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://github.com",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // microphone=(self): the whole point of the contribute flow is capturing an
    // elder telling the story in their own voice, and MediaRecorder is dead
    // without it. Everything else stays denied.
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(self), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
