/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.pinimg.com',
      'pinterest.com',
      'media.istockphoto.com',
      'unsplash.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pinterest.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig