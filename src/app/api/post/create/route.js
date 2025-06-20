import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request) {
  try {
    const { content, isAnonymous } = await request.json()

    // Validate input
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content cannot be empty." },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: session, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json(
        { error: "Failed to retrieve session." },
        { status: 500 }
      )
    }

    const userId = session?.session?.user?.id || null
    const isAuthenticated = !!userId

    // If the user is not authenticated and tries to post anonymously, return an error
    if (isAnonymous && !isAuthenticated) {
      return NextResponse.json(
        { error: "You must be logged in to post anonymously." },
        { status: 403 }
      )
    }
    // If the user is authenticated, they can post anonymously or with their user ID
    if (isAuthenticated && isAnonymous && !userId) {
      return NextResponse.json(
        { error: "User ID is required for authenticated users." },
        { status: 400 }
      )
    }

    // Insert the post into the database
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        body: content.trim(),
        is_anonymous: isAnonymous,
      })
      .select()
      .single()

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    )
  }
}
