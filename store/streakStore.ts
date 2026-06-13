import { StreakType } from "@/utils/types"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"
import { getUserId } from "@/utils"
import { create } from "zustand"

type StreakStore = {
    loading: boolean,
    error: PostgrestError | null,
    streak: StreakType | null,
    getStreak: () => Promise<void>
}

export const useStreakStore = create<StreakStore>((set) => ({
    loading: false,
    error: null,
    streak: null,
    getStreak: async () => {
        set({ loading: true })
        try {
            const userId = await getUserId()

            const { data, error } = await supabase.from('streaks').select('*').eq('user_id', userId).limit(1).maybeSingle()
            if (error) {
                set({ error })
                return
            }
            set({ streak: data })
        } finally {

            set({ loading: false })
        }
    }

}))


export const streakSelector = {
    streak: (state: StreakStore) => state.streak,
    loading: (state: StreakStore) => state.loading,
    error: (state: StreakStore) => state.error
}