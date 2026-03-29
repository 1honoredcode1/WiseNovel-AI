import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      {
        protocol: "https",
        hostname: "ujqnp2rjca3dli5k.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
