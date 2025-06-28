import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const INITIAL_COMMENT_FETCH_COUNT = 1

// Fetch all posts with username and avatar URL
export async function GET() {
  try {
    const supabase = await createClient()
    // TODO: Check if whether neeeds to send user_id in response or not
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        body,
        is_anonymous,
        created_at,
        profiles!posts_user_id_fkey (
          id,
          username,
          avatar_url
        ),
        reactions (
          user_id,
          reaction,
          profiles!reactions_user_id_fkey (
            id,
            username,
            avatar_url
          )
        ),
        comments (
          id,
          body,
          created_at,
          profiles!comments_user_id_fkey (
            id,
            username,
            avatar_url
          )
        )
      `
      )
      .order("created_at", { ascending: false })
      .order("created_at", { referencedTable: "comments", ascending: false })
      .limit(INITIAL_COMMENT_FETCH_COUNT, { foreignTable: "comments" })
    if (error) {
      console.error("Error fetching posts:", error)
      return NextResponse.json(
        { error: "Failed to fetch posts." },
        { status: 500 }
      )
    }

    const transformedPosts = posts.map((post) => {
      // Count reactions by type
      const reactionCounts = {
        F: 0,
        Clown: 0,
        Skull: 0,
        Relatable: 0,
      }

      post.reactions.forEach((reaction) => {
        reactionCounts[reaction.reaction]++
      })

      // Transform comments to match expected frontend structure
      const formattedComments = post.comments
        .map((comment) => ({
          id: comment.id,
          body: comment.body,
          created_at: comment.created_at,
          author: {
            id: comment.profiles.id,
            username: comment.profiles.username,
            avatar_url: comment.profiles.avatar_url,
          },
        }))
        .reverse() // Reverse to show oldest of the latest first

      return {
        id: post.id,
        user_id: post.user_id,
        body: post.body,
        is_anonymous: post.is_anonymous,
        created_at: post.created_at,
        author: post.is_anonymous
          ? null
          : {
              id: post.profiles?.id,
              username: post.profiles?.username,
              avatar_url: post.profiles?.avatar_url,
            },
        reaction_counts: reactionCounts,
        reaction: post.reactions,
        comments: formattedComments,
      }
    })

    return NextResponse.json({ posts: transformedPosts }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
