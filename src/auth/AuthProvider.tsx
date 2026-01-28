import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { AxiosError } from 'axios'

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
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await api.get('/auth/me')
      // Backend returns data directly, not nested in data.data
      const data = response.data
      setUser(data.user)
      setProfile(data.profile)
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        // Token invalid, clear it
        clearTokens()
        setUser(null)
        setProfile(null)
      }
    } finally {
      setIsLoading(false)
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
  }, [fetchCurrentUser]) // Added dependency

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
