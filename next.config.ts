/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/appointment-scheduler',
  assetPrefix: '/appointment-scheduler',
}

module.exports = nextConfig