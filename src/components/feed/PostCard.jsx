/**
 * PostCard Component
 *
 * This component is designed to display a single post. It receives a 'post' object
 * as a prop, which contains all necessary data like author, content, and reactions.
 * This structure makes it easy to map over an array of posts fetched from an API.
 */

import Image from "next/image"
import { useState } from "react"
import axios from "axios"

export default function PostCard({ post }) {
  const {
    id,
    author: { username, avatar_url },
    created_at,
    body,
    is_anonymous,
    reactions = [],
  } = post

  const reactionToEmojiMap = {
    F: "F",
    Clown: "🤡",
    Skull: "💀",
    Relatable: "🤝",
  }

  const [reactedEmoji, setReactedEmoji] = useState(null)

  const handleReactionClick = async (emojiName) => {
    try {
      const response = await axios.post("/api/post/react", {
        emojiName,
        postId: id,
      })
      if (response.status === 201) {
        setReactedEmoji(emojiName)
      } else {
        console.error("Failed to react:", response.data.error)
      }
    } catch (error) {
      console.error("Error reacting to post:", error)
    }
  }

  return (
    <article className="bg-dark-secondary border border-dark-border rounded-lg p-6">
      {/* Post Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* avatar */}

        {/* // TODO: Add Link to user profile page  */}
        <div className="w-10 h-10 bg-dark-border rounded-full flex items-center justify-center text-light text-xl flex-shrink-0">
          {is_anonymous ? (
            <Image
              src="/default_avatar.jpg"
              alt="Default Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <Image
              src={avatar_url || "/default_avatar.jpg"}
              alt={`${username}'s avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          {/* //TODO: Figure out nice anonymous name */}
          <div className="font-semibold text-light">
            {is_anonymous ? "Anonymous" : username}
          </div>
          <div className="text-light-secondary text-xs">{created_at}</div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4 text-base text-light whitespace-pre-wrap">
        {body}
      </div>

      {/* Post Actions/Reactions - with counts and updated styling */}
      <div className="flex gap-2 py-3 border-t border-b border-dark-border mb-4 flex-wrap">
        {Object.entries(reactionToEmojiMap).map(([key, emoji]) => {
          const reactionCount =
            reactions.find((reaction) => reaction.reaction === key)?.count || 0

          return (
            <div
              key={key}
              className="flex items-center gap-1 text-light-secondary text-sm cursor-pointer hover:text-light transition-colors"
              onClick={() => handleReactionClick(key)}
              style={{
                backgroundColor:
                  reactedEmoji === key
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                borderRadius: "0.375rem", // Tailwind's rounded-md
                padding: "0.25rem 0.5rem", // Tailwind's px-2 py-1
              }}
            >
              <span className="text-lg">{emoji}</span>
              <span>{reactionCount}</span>
            </div>
          )
        })}
      </div>

      {/* Add Comment Section */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-dark-border rounded-full flex items-center justify-center text-base flex-shrink-0 text-light">
          👤
        </div>
        <div className="bg-dark w-full px-4 py-2.5 rounded-full text-light-secondary text-sm cursor-pointer border border-dark-border hover:border-light-secondary transition-colors">
          Add a comment...
        </div>
      </div>
    </article>
  )
}
