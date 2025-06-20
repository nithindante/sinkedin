import Header from "@/components/feed/Header"
import { notFound } from "next/navigation"

// --- PSEUDOCODE for data fetching ---
async function getUserProfile(username) {
  // In a real app, you would fetch this from your database
  // const { data: profile, error } = await supabase.from('profiles').select('*').eq('username', username).single();
  // if (error || !profile) return null;
  // return profile;

  // For demonstration, we'll simulate a database lookup
  const profiles = {
    sad_engineer: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      username: "sad_engineer",
      headline: "Professional Bug Creator & Full-Time Failure Enthusiast",
      avatar_url: "https://placehold.co/256x256/30363d/e6edf3?text=SAD",
      bio: "Turning coffee into code that almost works. My portfolio is a graveyard of abandoned side projects. Currently sinking my teeth into another idea destined for the digital dustbin.",
      created_at: "2023-10-26T10:00:00Z",
    },
    sarah_m: {
      id: "234e...",
      username: "sarah_m",
      headline: "Overqualified but Underexperienced",
      avatar_url: "https://placehold.co/256x256/30363d/e6edf3?text=😭",
      bio: "Collecting rejection letters like they're Pokémon cards. My consistent streak of 47 this month is my greatest achievement.",
      created_at: "2023-08-15T10:00:00Z",
    },
  }
  return profiles[username] || null
}

// Placeholder for getting the currently logged-in user
async function getCurrentUser() {
  // This would be the same auth logic as in the redirector page
  return { id: "123e4567-e89b-12d3-a456-426614174000" } // Simulating we are 'sad_engineer'
}
// --- END PSEUDOCODE ---

function formatJoinDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export default async function UserProfilePage({ params }) {
  const { username } = await params
  const profile = await getUserProfile(username)
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
              src={profile.avatar_url}
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
              {isOwnProfile && (
                <div className="mt-4 flex justify-center sm:justify-start gap-3">
                  <button className="bg-transparent border border-dark-border text-light-secondary px-4 py-2 rounded-md font-semibold text-sm hover:border-light hover:text-light transition-colors">
                    Edit Profile
                  </button>
                  <button className="bg-accent text-white border-none px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors">
                    Logout
                  </button>
                </div>
              )}
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
