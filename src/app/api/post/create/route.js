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
    const { data: session, error: sessionError } = await supabase.auth.getUser()
    console.log("Session data:", session)

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json(
        { error: "Failed to retrieve session." },
        { status: 500 }
      )
    }

    const userId = session?.user?.id || null
    console.log("User ID:", userId)
    const isAuthenticated = !!userId
    console.log("Is authenticated:", isAuthenticated)

    // If the user is not authenticated and tries to post anonymously, return an error
    if (isAnonymous && !isAuthenticated) {
      return NextResponse.json(
        { error: "You must be logged in to post anonymously." },
        { status: 403 }
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

    if (postError) {
      console.error("Post insertion error:", postError)
      return NextResponse.json(
        { error: "Failed to create post." },
        { status: 500 }
      )
    }
    console.log("Post created:", post)

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    )
  }
}
