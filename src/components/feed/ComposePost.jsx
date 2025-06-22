"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import axios from "axios"

// TODO: Adding post should appear instantly in feed without refresh
// ? mostly will need context or state management solution like Redux or Zustand

export default function ComposePost() {
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      if (session) {
        setUserId(session.user.id)
      } else {
        setUserId(null)
      }
    }

    checkAuth()
  }, [])

  const handleAnonymousChange = (e) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to post anonymously.")
      e.preventDefault() // Prevent checkbox from changing
      return
    }
    setIsAnonymous(e.target.checked)
  }

  const handlePostClick = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to post.")
      return
    }

    if (content.trim() === "") {
      toast.error("Content cannot be empty.")
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post("/api/post/create", {
        content: content.trim(),
        isAnonymous: isAnonymous,
      })
      if (response.status === 201) {
        toast.success("Post created successfully!")
        setContent("")
        setIsAnonymous(false)
      } else {
        toast.error("Failed to create post.")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(
        "Failed to create post. ",
        error.message || "Please try again later."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-dark-secondary border border-dark-border rounded-lg p-6">
      <textarea
        className="w-full bg-dark border border-dark-border rounded-lg p-4 text-light text-lg resize-y min-h-[100px] placeholder:text-light-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder={
          isAuthenticated
            ? "What went wrong today? Share your latest failure..."
            : "Please log in to share your thoughts..."
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        rows={3}
      ></textarea>
      <div className="flex justify-between items-center mt-4">
        <div>
          <label
            className={`flex items-center gap-2 text-sm text-light-secondary ${
              isAuthenticated
                ? "cursor-pointer hover:text-light"
                : "cursor-not-allowed text-light-secondary"
            } transition-colors`}
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-dark border-dark-border text-accent focus:ring-accent"
              checked={isAnonymous}
              onChange={handleAnonymousChange}
              disabled={!isAuthenticated}
            />
            Post anonymously
          </label>
        </div>
        <button
          className={`bg-accent text-white border-none px-6 py-[0.7rem] rounded-md font-semibold transition-colors duration-200 hover:bg-accent-hover ${
            isAuthenticated
              ? "cursor-pointer hover:bg-accent-hover"
              : "cursor-not-allowed bg-light-secondary "
          } disabled:bg-light-secondary`}
          onClick={handlePostClick}
          disabled={!isAuthenticated}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  )
}
