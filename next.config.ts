import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /stats mostraba datos simulados; se retiró y redirige a la home
      { source: "/stats", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
