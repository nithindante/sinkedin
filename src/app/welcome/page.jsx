"use client"

import { useState } from "react"
import {
  Camera,
  RefreshCw,
  User,
  MapPin,
  Briefcase,
  Calendar,
  ArrowRight,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const [username, setUsername] = useState("DisasterPro42")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [experience, setExperience] = useState("")
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Generate random usernames for fun
  const randomUsernames = [
    "FailureKing99",
    "RejectMaster",
    "InterviewGhost",
    "CareerChaos",
    "EpicFailBot",
    "DisasterPro42",
    "JoblessJoke",
    "ResumeReject",
    "HiringHell",
    "WorkplaceWreck",
    "CVCatastrophe",
    "FailFast404",
    "BurnoutBuddy",
    "CrashAndBurn",
    "DeadEndDave",
  ]

  const generateRandomUsername = () => {
    const randomName =
      randomUsernames[Math.floor(Math.random() * randomUsernames.length)]
    setUsername(randomName)
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    console.log("Profile setup:", {
      username,
      bio,
      location,
      jobTitle,
      experience,
      avatar: avatarPreview,
    })
    // Navigate to main app
  }

  const handleSkip = () => {
    console.log("Skipped setup, using defaults")
    // Navigate to main app with default values
    router.replace("/") // Assuming this is the main app route
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--color-light)" }}
          >
            Welcome to S
            <span
              className="line-through"
              style={{ color: "var(--color-accent)" }}
            >
              in
            </span>
            kedIn!
          </h1>
          <p
            className="text-lg"
            style={{ color: "var(--color-light-secondary)" }}
          >
            Let's set up your professional disaster profile
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-lg border p-8 mb-6"
          style={{
            backgroundColor: "var(--color-dark-secondary)",
            borderColor: "var(--color-dark-border)",
          }}
        >
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div
                className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-4 overflow-hidden"
                style={{ borderColor: "var(--color-dark-border)" }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className="w-10 h-10"
                    style={{ color: "var(--color-light-secondary)" }}
                  />
                )}
              </div>

              <label
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "var(--color-accent)",
                  borderColor: "var(--color-dark-border)",
                }}
              >
                <Camera
                  className="w-4 h-4"
                  style={{ color: "var(--color-light)" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--color-light-secondary)" }}
            >
              Upload your best disaster face (optional)
            </p>
          </div>

          {/* Username Section */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-light)" }}
            >
              Username *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border outline-none transition-colors"
                style={{
                  backgroundColor: "var(--color-dark)",
                  borderColor: "var(--color-dark-border)",
                  color: "var(--color-light)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-dark-border)")
                }
              />
              <button
                onClick={generateRandomUsername}
                className="px-4 py-3 rounded-lg border hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "var(--color-dark)",
                  borderColor: "var(--color-dark-border)",
                }}
                title="Generate random username"
              >
                <RefreshCw
                  className="w-5 h-5"
                  style={{ color: "var(--color-accent)" }}
                />
              </button>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--color-light-secondary)" }}
            >
              This is how other failures will know you
            </p>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-light)" }}
            >
              Bio (Optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors resize-none"
              style={{
                backgroundColor: "var(--color-dark)",
                borderColor: "var(--color-dark-border)",
                color: "var(--color-light)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-accent)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-dark-border)")
              }
              placeholder="Tell us about your epic career disasters..."
              maxLength={200}
            />
            <p
              className="text-xs mt-1"
              style={{ color: "var(--color-light-secondary)" }}
            >
              {bio.length}/200 characters
            </p>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-light)" }}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                style={{
                  backgroundColor: "var(--color-dark)",
                  borderColor: "var(--color-dark-border)",
                  color: "var(--color-light)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-dark-border)")
                }
                placeholder="Where you're failing from"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-light)" }}
              >
                <Briefcase className="w-4 h-4 inline mr-1" />
                Dream Job (Optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
                style={{
                  backgroundColor: "var(--color-dark)",
                  borderColor: "var(--color-dark-border)",
                  color: "var(--color-light)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-dark-border)")
                }
                placeholder="What you'll never get"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div className="mb-8">
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--color-light)" }}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Years of Professional Suffering (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["0-1 years", "2-5 years", "5-10 years", "10+ years"].map(
                (exp) => (
                  <button
                    key={exp}
                    onClick={() => setExperience(exp)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      experience === exp ? "border-accent" : ""
                    }`}
                    style={{
                      backgroundColor:
                        experience === exp
                          ? "var(--color-accent)"
                          : "var(--color-dark)",
                      borderColor:
                        experience === exp
                          ? "var(--color-accent)"
                          : "var(--color-dark-border)",
                      color:
                        experience === exp
                          ? "var(--color-light)"
                          : "var(--color-light-secondary)",
                    }}
                  >
                    {exp}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-light)",
              }}
            >
              Complete Setup
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--color-dark-border)",
                color: "var(--color-light-secondary)",
              }}
            >
              Skip for Now
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-light-secondary)" }}
          >
            Don't worry, you can change all of this later in your profile
            settings.
            <br />
            Or not. We're not your boss (yet).
          </p>
        </div>
      </div>
    </div>
  )
}
