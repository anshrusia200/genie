/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ai-studio-assets.limewire.media",
        port: "",
        pathname: "/u/4a025d0d-aefa-4698-ac62-ebb0dcdccf65/image/**",
      },
    ],
  },
};

export default nextConfig;
