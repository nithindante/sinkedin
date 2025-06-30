/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://pbelkncykqidzqofiyph.supabase.co/storage/v1/object/public/avatars/**"
      ),
    ],
  },
}

export default nextConfig
