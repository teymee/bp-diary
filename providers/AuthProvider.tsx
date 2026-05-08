'use client'

import { createContext, useContext, useEffect, useState } from "react"
import type { Session } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase/client"

type AuthContextType = {
    session: Session | null,
    sessionLoader: boolean
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    sessionLoader: true
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [session, setSession] = useState<Session | null>(null)
    const [sessionLoader, setSessionLoader] = useState(true)


    useEffect(() => {
        // Get session once
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setSessionLoader(false)
        })

        // Listen for changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => {
            listener.subscription.unsubscribe()

        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, sessionLoader }}>
            {children}
        </AuthContext.Provider>
    )


}