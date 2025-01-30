/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  transpilePackages: ['@suspensive/react', '@suspensive/react-query-5'],
  experimental: {
    typedRoutes: true,
  },
}
