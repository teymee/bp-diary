'use client'

import { createContext, useContext, useEffect, useState } from "react"
import type { Session } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase/client"

type AuthContextType = {
    session: Session | null,
    sessionLoader: boolean,
    userId: string | null
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    sessionLoader: true,
    userId: null
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [session, setSession] = useState<Session | null>(null)
    const [sessionLoader, setSessionLoader] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        // Get session once
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUserId(session?.user?.id || null)
            setSessionLoader(false)
        })

        // Listen for changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUserId(session?.user?.id || null)
        })

        return () => {
            listener.subscription.unsubscribe()

        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, sessionLoader, userId }}>
            {children}
        </AuthContext.Provider>
    )


}