// src/hooks/useAuth.js
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * useAuth — single hook used by Navbar, AuthModal, GamesPage, etc.
 *
 * Returns:
 *   user, loading, displayName, avatar,
 *   signUpEmail({ email, password, full_name, phone }),
 *   signInEmail({ email, password }),
 *   signInGoogle(),
 *   signOut()
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initial session + subscribe to auth changes
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Derived values
  const meta = user?.user_metadata ?? {}
  const displayName =
    meta.full_name ||
    meta.name ||
    user?.email?.split('@')[0] ||
    'Guest'
  const avatar = meta.avatar_url || meta.picture || null

  // ── Auth actions ────────────────────────────────────────────
  const signUpEmail = useCallback(
    async ({ email, password, full_name, phone }) => {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, phone },
          emailRedirectTo: `${window.location.origin}/`,
        },
      })
    },
    []
  )

  const signInEmail = useCallback(async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signInGoogle = useCallback(async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
  }, [])

  const signOut = useCallback(async () => {
    return await supabase.auth.signOut()
  }, [])

  return {
    user,
    loading,
    displayName,
    avatar,
    signUpEmail,
    signInEmail,
    signInGoogle,
    signOut,
  }
}
