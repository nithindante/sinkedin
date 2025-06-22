"use client"

import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function EditProfileAndLogout() {
  const router = useRouter()
  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Logout failed. Please try again.")
    } else {
      toast.success("Logged out successfully!")
      router.push("/auth/login") // Redirect to login page after logout
      router.refresh() // Refresh the page to ensure state is updated
    }
  }

  return (
    <div className="mt-4 flex justify-center sm:justify-start gap-3">
      <button
        className="bg-transparent border border-dark-border text-light-secondary px-4 py-2 rounded-md font-semibold text-sm hover:border-light hover:text-light transition-colors"
        onClick={() => {
          toast.error("Edit profile will be available soon!")
        }}
      >
        Edit Profile
      </button>
      <button
        className="bg-accent text-white border-none px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
