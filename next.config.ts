import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this 'images' configuration block
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // The '**' wildcard allows images from any external HTTPS source.
        // This is necessary because the product API uses domains like i.imgur.com.
        hostname: '**', 
      },
    ],
  },
  
  /* other config options here */
};

export default nextConfig;