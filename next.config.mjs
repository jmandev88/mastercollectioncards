/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      "images.pokemontcg.io", // 👈 Add this line
    ],
  },
};

export default nextConfig;
