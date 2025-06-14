import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  // This is the URL the user will be redirected to after the code is exchanged.
  // We'll send them to the welcome page.
  const redirectTo = `${origin}/welcome`

  // Create a Supabase client instance
  const supabaseServerClient = await createClient()
  if (code) {
    const { error } = await supabaseServerClient.auth.exchangeCodeForSession(
      code
    )

    if (error) {
      console.error("Supabase callback error:", error.message)
      // Optionally, redirect to an error page
      return NextResponse.redirect(`${origin}/login?error=auth_error`) // TODO: Change to a proper error page
    }
  }

  // Redirect to the final destination
  return NextResponse.redirect(redirectTo)
}
