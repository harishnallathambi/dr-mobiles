import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Static export for Cloudflare Pages ───────────────────────
  output: 'export',

  // ── Trailing slash so /admin → /admin/index.html on CF Pages ─
  trailingSlash: true,

  // ── Images: unoptimized required for static export ───────────
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
