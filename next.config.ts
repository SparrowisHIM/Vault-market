import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
      },
      {
        protocol: "https",
        hostname: "images.pokemontcg.io",
      },
      {
        protocol: "https",
        hostname: "images.ygoprodeck.com",
      },
      {
        protocol: "https",
        hostname: "image.optcg.gg",
      },
    ],
  },
};

export default nextConfig;
