//api/auth/callback/route.js
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  // The user will be redirected to the homepage after auth
  const next = searchParams.get("next") ?? "/welcome"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Log the full error for better debugging
      console.error("Supabase callback error:", error)
      // Redirect to an error page or the login page with a specific error message
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=auth_error&message=" +
            encodeURIComponent(error.message),
          request.url
        )
      )
    }
  }

  // URL to redirect to after successful auth
  return NextResponse.redirect(new URL(next, request.url))
}
