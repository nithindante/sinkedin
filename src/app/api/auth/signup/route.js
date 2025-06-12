import { NextResponse } from "next/server"
import supabaseServerClient from "@/lib/supabase/server"

export async function POST(request) {
  const { email, password, confirmPassword } = await request.json()

  // --- 1. Backend Validation ---
  if (!email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    )
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format." },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    // Supabase has a default 6-character minimum, so we enforce it here.
    return NextResponse.json(
      { error: "Password must be at least 6 characters long." },
      { status: 400 }
    )
  }

  // --- 2. Supabase Logic ---

  // Construct the redirect URL for the confirmation email
  const confirmationUrl = `${request.nextUrl.origin}/api/auth/callback`

  const { data, error } = await supabaseServerClient.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: confirmationUrl, // Redirect URL after email confirmation
    },
  })

  // --- 3. Error Handling ---
  if (error) {
    console.error("Supabase signup error:", error)
    // You can customize error messages based on the error code
    if (error.code === "user_already_exists") {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      ) // 409 Conflict
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // --- 4. Success Response ---
  // IMPORTANT: The 'user' object in the response will be non-null, but session will be null
  // because the user hasn't confirmed their email yet.
  return NextResponse.json(
    {
      message:
        "Confirmation email sent. Please check your inbox to complete signup.",
      user: data.user, // You can send back the user data if needed
    },
    { status: 201 } // 201 Created
  )
}
