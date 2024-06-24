/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions: true,
    mdxRs: true,
    serverComponentsExternalPackages: ["mongoose"],
  },

  // adding the small user image from clerk for question card before the author name
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        // allow images from all sources come here
      },
      {
        protocol: "http",
        hostname: "*",
        // allow images from all sources come here
      },
    ],
  },
};

export default nextConfig;
