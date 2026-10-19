import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  /* SILK II — the wire law: AVIF first (smaller than webp at equal quality),
   * webp fallback; the 1.27MB art/ library and the menu hero re-encode
   * on the fly (sharp is already in the build). */
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /* M24 W9 THE STAGE — the media house rides the SAME origin as the page:
   * /rt/* proxies to the self-hosted LiveKit (WHIP ingest / WHEP playback)
   * on loopback :7880. Same-origin means no CORS dance and one deploy door
   * (the W12 guide's nginx `/rt` proxy carries the identical shape). The
   * wire mints TOKENS; the page adds the origin. */
  async rewrites() {
    return [
      {
        source: "/rt/:path*",
        destination: "http://127.0.0.1:7880/:path*",
      },
    ];
  },
};

export default nextConfig;
