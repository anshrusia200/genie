/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ai-studio-assets.limewire.media",
        port: "",
        pathname: "/u/795af9a4-c4b3-437d-b399-d7721918b3a4/image/**",
      },
    ],
  },
};

export default nextConfig;
