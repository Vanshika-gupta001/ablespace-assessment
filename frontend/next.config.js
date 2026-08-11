/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces a minimal, self-contained server bundle for the Docker image
  // (see frontend/Dockerfile) instead of requiring the full node_modules tree.
  output: 'standalone',
};

module.exports = nextConfig;
