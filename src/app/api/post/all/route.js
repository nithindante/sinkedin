import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
        author: profiles!posts_user_id_fkey (username, avatar_url)
        reactions (user_id, reaction)
      `
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
      return NextResponse.json(
        { error: "Failed to fetch posts." },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
