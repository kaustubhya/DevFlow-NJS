/* In the notes I have said that server actions have changed, but we might not face issues even if we go with the old code structure

We have gone with the code taught in Next JS 13

*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions: true,
    mdxRs: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
};

export default nextConfig;
