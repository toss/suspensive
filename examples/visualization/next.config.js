/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@suspensive/react', '@suspensive/react-query-5'],
  experimental: {
    typedRoutes: true,
  },
}
