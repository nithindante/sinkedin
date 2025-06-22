/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("http://127.0.0.1:54321/storage/v1/object/public/avatars/**"),
    ],
  },
}

export default nextConfig
