import Image from "next/image"
import { useState, useEffect } from "react"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default function PostCard({ post, currentUserId }) {
  const {
    id,
    author,
    created_at,
    body,
    is_anonymous,
    reaction_counts,
    reaction,
  } = post

  const username = author?.username || "AnonymousPanda"
  const avatar_url = author?.avatar_url || null

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  })

  const reactionToEmojiMap = {
    F: "F",
    Clown: "🤡",
    Skull: "💀",
    Relatable: "🤝",
  }

  const findUserReaction = () => {
    if (!currentUserId || !reaction) return null
    const userReaction = reaction.find((r) => r.user_id === currentUserId)
    return userReaction ? userReaction.reaction : null
  }

  const [reactedEmoji, setReactedEmoji] = useState(findUserReaction())

  // --- 2. NEW: Add state for reaction counts to allow optimistic updates ---
  const [counts, setCounts] = useState(reaction_counts)

  // This hook will run when the component mounts and whenever the props
  // `currentUserId` or `post` change. This solves the race condition where
  // the user ID might not be available on the very first render.
  useEffect(() => {
    setReactedEmoji(findUserReaction())
    setCounts(reaction_counts)
  }, [currentUserId, post])

  const handleReactionClick = async (emojiName) => {
    // if the user is not logged in, do nothing
    if (!currentUserId) {
      return
    }

    const originalReactedEmoji = reactedEmoji
    const originalCounts = { ...counts }

    // Determine the next state before updating
    const newReactedEmoji =
      originalReactedEmoji === emojiName ? null : emojiName

    const newCounts = { ...counts }

    if (originalReactedEmoji === emojiName) {
      // Case 1: User is UN-REACTING (clicking the same emoji again)
      // Decrease the count of the clicked emoji.
      newCounts[emojiName]--
    } else if (originalReactedEmoji) {
      // Case 2: User is CHANGING their reaction
      // Decrease the count of the OLD emoji.
      newCounts[originalReactedEmoji]--
      // Increase the count of the NEW emoji.
      newCounts[emojiName]++
    } else {
      // Case 3: User is REACTING for the first time
      // Increase the count of the new emoji.
      newCounts[emojiName]++
    }

    // Optimistically update the UI
    setReactedEmoji(newReactedEmoji)
    setCounts(newCounts)

    try {
      const response = await axios.post("/api/post/react", {
        emojiName,
        postId: id,
      })

      if (response.status !== 201) {
        // If API call fails, revert the state to the original
        setReactedEmoji(originalReactedEmoji)
        setCounts(originalCounts)
        console.error("Failed to react:", response.data.error)
      }
    } catch (error) {
      // If there's any other error, revert the state
      setReactedEmoji(originalReactedEmoji)
      setCounts(originalCounts)
      console.error("Error reacting to post:", error)
    }
  }

  return (
    <article className="bg-dark-secondary border border-dark-border rounded-lg p-6">
      {/* Post Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link
          href={is_anonymous ? "#" : `/profile/${author.id}`}
          className="flex-shrink-0"
        >
          <div className="w-10 h-10 bg-dark-border rounded-full flex items-center justify-center text-light text-xl">
            <Image
              src={
                is_anonymous
                  ? "/default_avatar.jpg"
                  : avatar_url || "/default_avatar.jpg"
              }
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1">
          <Link
            href={is_anonymous ? "#" : `/profile/${author.id}`}
            className="font-semibold text-light hover:underline"
          >
            {is_anonymous ? "Anonymous Panda" : username}
          </Link>
          <div className="text-light-secondary text-xs">{timeAgo}</div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4 text-base text-light whitespace-pre-wrap">
        {body}
      </div>

      {/* Post Actions/Reactions - with counts and updated styling */}
      <div className="flex gap-2 pt-3 border-t  border-dark-border flex-wrap">
        {Object.entries(counts).map(([emojiName, count]) => {
          const emoji = reactionToEmojiMap[emojiName] || emojiName
          const hasReacted = reactedEmoji === emojiName
          return (
            <button
              key={emojiName}
              className={`flex items-center gap-1 text-light-secondary text-sm hover:text-light transition-colors p-2 rounded-md ${
                hasReacted ? "bg-white/10 text-light" : ""
              }`}
              onClick={() => handleReactionClick(emojiName)}
            >
              <span className="text-lg">{emoji}</span>
              <span>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Move Comment Input to v2*/}
      {/* <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-dark-border rounded-full flex items-center justify-center text-base flex-shrink-0 text-light">
          <Image
            src="/default_avatar.jpg"
            alt="Your Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
        <div className="bg-dark w-full px-4 py-2.5 rounded-full text-light-secondary text-sm cursor-pointer border border-dark-border hover:border-light-secondary transition-colors">
          Add a comment...
        </div>
      </div> */}

      {/* --- NEW STATIC COMMENT SECTION --- */}
      {/* <div className="mt-4 pt-4 border-t border-dark-border flex flex-col gap-4">
        <Comment
          author="CleverCoyote"
          avatar="/default_avatar.jpg"
          text="This is a great point, totally agree with you on this!"
          timestamp="2h ago"
        />
        <Comment
          author="Anonymous Squirrel"
          avatar="/default_avatar.jpg" // Using the panda as a generic anonymous avatar
          text="Hmm, I'm not so sure. Have you considered the other side of the argument?"
          timestamp="1h ago"
        />
      </div> */}
    </article>
  )
}

// function Comment({ author, avatar, text, timestamp }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="w-8 h-8 bg-dark-border rounded-full flex-shrink-0 mt-1">
//         <Image
//           src={avatar || "/default_avatar.jpg"}
//           alt={`${author}'s avatar`}
//           width={32}
//           height={32}
//           className="rounded-full object-cover"
//         />
//       </div>
//       <div className="flex-1 bg-dark px-4 py-2 rounded-lg">
//         <div className="flex items-center gap-2">
//           <span className="font-semibold text-light text-sm">{author}</span>
//           <span className="text-light-secondary text-xs">{timestamp}</span>
//         </div>
//         <p className="text-light whitespace-pre-wrap mt-1 text-sm">{text}</p>
//       </div>
//     </div>
//   )
// }
