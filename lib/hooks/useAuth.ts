"use client";

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'

type UserProfile = Database['public']['Tables']['users']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 현재 사용자 가져오기
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // 사용자 프로필 가져오기
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUserProfile(profile)
      }
      
      setLoading(false)
    }

    getUser()

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserProfile(null)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setUserProfile(data)
    }

    return { data, error }
  }

  return {
    user,
    userProfile,
    loading,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  }
}