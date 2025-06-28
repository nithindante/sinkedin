"use client"

import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function Header() {
  // We'll store the full profile info here, including the avatar
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient()

      // 1. Get the current user session
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // 2. If user exists, fetch their profile from the 'profiles' table
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("avatar_url, username")
          .eq("id", user.id)
          .single() // We expect only one profile per user

        if (error) {
          console.error("Error fetching profile:", error)
          setProfile(null) // Fallback if profile is missing
        } else {
          setProfile(profileData)
        }
      }

      setIsLoading(false)
    }

    fetchUserProfile()
  }, [])

  return (
    <header className="bg-dark-secondary border-b border-dark-border px-0 py-3 sticky top-0 z-50">
      <div className="max-w-[800px] mx-auto flex items-center justify-between px-6">
        <Link
          href="/feed"
          className="text-[1.8rem] font-bold text-light no-underline"
          scroll={false}
        >
          S<strike className="text-accent no-underline">in</strike>kedIn
        </Link>

        {isLoading ? (
          <div className="w-[40px] h-[40px] bg-dark-border rounded-full animate-pulse" />
        ) : profile ? (
          <Link
            href="/profile"
            className="w-[40px] h-[40px] relative"
            scroll={false}
          >
            <Image
              // Use the fetched avatar_url, with a fallback
              src={profile.avatar_url || "/default_avatar.jpg"}
              alt="Profile Icon"
              fill
              className="rounded-full object-cover"
            />
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="text-light no-underline"
            scroll={false}
          >
            <button className="bg-accent text-white border-none px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors">
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
