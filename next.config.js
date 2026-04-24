/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
  },

  swcMinify: false, // fallback for restricted environments

  webpack: (config) => {
    config.cache = false; // 🔥 fixes EIO / cache issues
    return config;
  },
};

module.exports = nextConfig;