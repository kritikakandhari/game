import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, getRefreshToken, setTokens, clearTokens } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'

type User = {
  id: string
  email: string
  email_verified: boolean
  account_status: string
}

type Profile = {
  id: string
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  region: string
}

type AuthContextValue = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCurrentUser = useCallback(async () => {
    try {
      // OFFLINE MODE: Skip Backend, use Supabase Session directly
      const { data: { session } } = await supabase.auth.getSession();

      if (session && session.user) {
        // Create local user state from session
        setUser({
          id: session.user.id,
          email: session.user.email!,
          email_verified: !!session.user.confirmed_at,
          account_status: 'active'
        });

        // Create local profile state from session metadata
        setProfile({
          id: session.user.id,
          user_id: session.user.id,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
          display_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          region: 'NA'
        });
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching Supabase session:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [])

  // Sync Supabase Auth state to LocalStorage for API
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // If we have a Supabase session, sync the tokens to where api.ts expects them
        setTokens(session.access_token, session.refresh_token)

        await fetchCurrentUser()
      } else if (event === 'SIGNED_OUT') {
        clearTokens()
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchCurrentUser]) // Removed user dependency to avoid loop

  // Initial load
  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const signOut = useCallback(async () => {
    try {
      // Sign out from Supabase as well
      await supabase.auth.signOut()

      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken })
      }
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error)
    } finally {
      clearTokens()
      setUser(null)
      setProfile(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    await fetchCurrentUser()
  }, [fetchCurrentUser])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github' | 'discord') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/app/discover`,
      },
    })
    if (error) throw error
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      signOut,
      refreshUser,
      signInWithOAuth,
    }),
    [user, profile, isLoading, signOut, refreshUser, signInWithOAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
