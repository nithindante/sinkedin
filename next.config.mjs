/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL(process.env.SUPABASE_AVATARS_URL)],
  },
}

export default nextConfig
