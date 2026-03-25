import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig, getCookieOptions } from './config'

export function createClient() {
  const { url, publishableKey } = getSupabaseConfig()

  return createBrowserClient(
    url,
    publishableKey,
    {
      cookieOptions: getCookieOptions(),
    }
  )
}
