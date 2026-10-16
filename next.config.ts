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
};

export default nextConfig;
