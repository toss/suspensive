/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@suspensive/react', '@suspensive/react-query'],
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
