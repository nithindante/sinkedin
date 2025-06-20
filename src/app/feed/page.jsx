"use client"

import Header from "@/components/feed/Header"
import ComposePost from "@/components/feed/ComposePost"
import PostCard from "@/components/feed/PostCard"
import { useState, useEffect } from "react"
import axios from "axios"

const fetchPosts = async () => {
  try {
    // Simulating an API call to fetch posts
    // In a real application, you would replace this with an actual API endpoint
    const response = await axios.get("/api/post/all")
    console.log("Fetched posts:", response.data.posts)
    return response.data.posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// This is static data to simulate fetching from a database.
// In a real application, you would fetch this data from an API endpoint.
const postsData = [
  {
    id: 1,
    author: {
      name: "Sarah M.",
      avatar: "😭",
    },
    timestamp: "2h ago",
    content: `Got rejected from my dream job today after 6 rounds of interviews. They said I was "overqualified but underexperienced" - like what does that even mean? 😂\n\nAt least I'm consistent with my rejection streak of 47 this month!`,
    reactions: [
      { emoji: "F", count: 47 },
      { emoji: "💀", count: 12 },
      { emoji: "🤡", count: 33 },
      { emoji: "😂", count: 99 },
      { emoji: "🎩", count: 2 },
    ],
  },
  {
    id: 2,
    author: {
      name: "Mike R.",
      avatar: "🤡",
    },
    timestamp: "4h ago",
    content: `My third startup just died. Burned through $50k of savings building an app that literally nobody wanted.\n\nThe best part? My mom was the only user and she uninstalled it after a week. Time to update my LinkedIn... I mean SinkedIn bio! 🎉`,
    reactions: [
      { emoji: "F", count: 152 },
      { emoji: "💀", count: 88 },
      { emoji: "🤡", count: 401 },
      { emoji: "😂", count: 210 },
      { emoji: "🎩", count: 5 },
    ],
  },
  {
    id: 3,
    author: {
      name: "Alex T.",
      avatar: "💀",
    },
    timestamp: "6h ago",
    content: `Showed up to a first date at the wrong restaurant. Waited 2 hours. Texted them asking where they were.\n\nTurns out there are TWO "Tony's Pizza" in this city. They went home. I ate pizza alone and cried a little. The waiter gave me free breadsticks out of pity.`,
    reactions: [
      { emoji: "F", count: 230 },
      { emoji: "💀", count: 98 },
      { emoji: "🤡", count: 111 },
      { emoji: "😂", count: 300 },
      { emoji: "🎩", count: 22 },
    ],
  },
]

// Maybe here we need to show the loading skeleton while fetching posts

export default function HomePage() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPosts()
      setPosts(fetchedPosts)
    }
    loadPosts()
  }, [])

  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto my-8 px-6 flex flex-col gap-6">
        <ComposePost />

        {/* This section maps over the static data to render the posts.
            This is where you would map over data fetched from your database. */}

        {/* If posts is empty show loading */}
        {posts.length === 0 && (
          <div className="text-center text-gray-500">Loading posts...</div>
        )}

        {posts.length > 0 && (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
