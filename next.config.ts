import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://cdn.7tv.app/emote/**')],
  },
};

export default nextConfig;
