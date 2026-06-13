import { supabase } from '@/lib/supabase/client'
import { AuthError, User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserStore = {
    user: User | null,
    loading: boolean,
    error: AuthError | null,
    getUser: () => Promise<void>,
    logout: () => Promise<void>
}


export const useAuthStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,
            getUser: async () => {

                try {
                    set({ loading: true })
                    const { data, error } = await supabase.auth.getSession()
                    console.log(data, 'vvvv')
                    set({ user: data?.session?.user, error })
                } finally {
                    set({ loading: false })
                }

            },
            logout: async () => {
                set({ loading: true })
                await supabase.auth.signOut()
                set({
                    user: null,
                    loading: false,
                    error: null
                })
            }
        }),
        {
            // 🚨 CHANGE STORAGE TO COOKIE OR SESSION 
            name: 'user-auth',
            partialize: (state) => ({
                user: state.user
            })
        }
    )
)