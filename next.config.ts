/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' during development
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/appointment-scheduler' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/appointment-scheduler' : '',
}

module.exports = nextConfig