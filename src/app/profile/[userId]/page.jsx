import Header from "@/components/Header"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import EditProfileAndLogout from "@/components/profile/ProfileAction"

async function getUserProfile(userId) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  // The 'single()' method returns an error if no row is found.
  // We can treat that as a 404 case.
  if (error || !profile) {
    return null
  }
  return profile
}

async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user // Returns the full user object (including id) or null
}

function formatJoinDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export default async function UserProfilePage({ params }) {
  const { userId } = await params
  const profile = await getUserProfile(userId)
  const loggedInUser = await getCurrentUser()

  // If no profile is found for the given username, show a 404 page
  if (!profile) {
    notFound()
  }

  // Check if the profile being viewed belongs to the logged-in user
  const isOwnProfile = loggedInUser?.id === profile.id

  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto my-8 px-6">
        <div className="bg-dark-secondary border border-dark-border rounded-lg p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={profile.avatar_url || "/default_avatar.jpg"}
              alt={`${profile.username}'s avatar`}
              className="w-32 h-32 rounded-full border-2 border-dark-border"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-light">
                {profile.username}
              </h1>
              <p className="text-lg text-light-secondary mt-1">
                {profile.headline}
              </p>
              <p className="text-sm text-light-secondary mt-2">
                Sinking since {formatJoinDate(profile.created_at)}
              </p>

              {/* Only show Edit and Logout buttons if it's the user's own profile */}
              {isOwnProfile && <EditProfileAndLogout />}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-dark-border">
            <h2 className="text-xl font-semibold text-light">About</h2>
            <p className="text-light-secondary mt-2 whitespace-pre-wrap">
              {profile.bio ||
                "This user prefers to keep their failures a mystery..."}
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
