import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/workshops", destination: "/places", permanent: false },
      { source: "/warehouses", destination: "/places", permanent: false },
    ];
  },
};

export default nextConfig;
