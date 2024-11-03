/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@suspensive/react', '@suspensive/react-query'],
  experimental: {
    typedRoutes: true,
  },
}
