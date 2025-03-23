import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  try {
    // Create Supabase client for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    )
    
    // Get session from cookies - check multiple possible cookie names
    const cookieStore = request.cookies
    const supabaseSessionCookie = 
      cookieStore.get('sb-access-token')?.value || 
      cookieStore.get('supabase-auth-token')?.value ||
      cookieStore.get('sb-refresh-token')?.value
    
    if (supabaseSessionCookie) {
      // Set the session cookie for the Supabase client
      supabase.auth.setSession({
        access_token: supabaseSessionCookie,
        refresh_token: ''
      })
    }

    // Log all cookies for debugging
    console.log("Available cookies:", [...cookieStore.getAll()].map(c => c.name));

    const { data: { session } } = await supabase.auth.getSession()

    // If user is authenticated and on the home page, redirect to chat
    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      try {
        const { data: homeWorkspace, error } = await supabase
          .from("workspaces")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("is_home", true)
          .single()

        if (homeWorkspace) {
          return NextResponse.redirect(
            new URL(`/${homeWorkspace.id}/chat`, request.url)
          )
        } else {
          // If no home workspace exists, try to create one or redirect to login
          console.error("No home workspace found for user:", session.user.id);
          return NextResponse.redirect(new URL("/login", request.url))
        }
      } catch (error) {
        console.error("Error fetching home workspace:", error)
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    return NextResponse.next()
  } catch (e) {
    console.error("Middleware error:", e)
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
