import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// TODO: Start from reaction click not updating

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { emojiName, postId } = await request.json()

    if (!emojiName) {
      return NextResponse.json(
        { error: "Emoji name is required." },
        { status: 400 }
      )
    }
    const { data: session, error: sessionError } = await supabase.auth.getUser()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json(
        { error: "Failed to retrieve session." },
        { status: 500 }
      )
    }

    const userId = session?.user?.id || null
    const isAuthenticated = !!userId
    // If the user is not authenticated, they cannot react
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "You must be logged in to react." },
        { status: 403 }
      )
    }
    // Upsert the reaction into the database
    const { data, error } = await supabase.from("reactions").upsert({
      post_id: postId,
      user_id: userId,
      reaction: emojiName,
    })
    if (error) {
      console.error("Error upserting reaction:", error)
      return NextResponse.json({ error: "Failed to react." }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Reaction added successfully." },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
