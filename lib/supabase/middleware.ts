import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig } from './config'
import { DEV_ADMIN_COOKIE } from '@/lib/dev-auth'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let url: string
  let publishableKey: string
  try {
    const config = getSupabaseConfig()
    url = config.url
    publishableKey = config.publishableKey
  } catch {
    // Supabase env vars are missing — let the request through without
    // session refresh so the app can render its own error or login page
    // instead of crashing with a 502.
    console.error('[middleware] Supabase is not configured. Skipping session refresh.')
    return supabaseResponse
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  let user: Record<string, unknown> | null = null
  try {
    const { data } = await supabase.auth.getClaims()
    user = data?.claims ?? null
  } catch (err) {
    console.error('[middleware] Failed to get auth claims:', err)
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // In development, allow access with the dev-admin cookie
  if (!user && isAdminRoute && process.env.NODE_ENV === 'development') {
    const devCookie = request.cookies.get(DEV_ADMIN_COOKIE)
    if (devCookie?.value === 'true') {
      return supabaseResponse
    }
  }

  if (!user && isAdminRoute) {
    // no user, redirect to the login page and preserve the intended destination
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
    redirectUrl.searchParams.set('next', nextPath)
    return NextResponse.redirect(redirectUrl)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
