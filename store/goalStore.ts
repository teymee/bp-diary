import { supabase } from "@/lib/supabase/client"
import { getUserId } from "@/utils"
import { GoalType } from "@/utils/types"
import { PostgrestError } from "@supabase/supabase-js"
import { create } from "zustand"

type GoalStore = {
    loading: boolean,
    error: PostgrestError | null,
    goal: GoalType | null,
    getGoal: () => Promise<void>
}

export const useGoalStore = create<GoalStore>((set) => ({
    loading: false,
    error: null,
    goal: null,
    getGoal: async () => {
        set({ loading: true })
        try {
            const userId = await getUserId()

            const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).limit(1).maybeSingle()
            if (error) {
                set({ error })
                return
            }
            set({ goal: data })
        } finally {

            set({ loading: false })
        }
    }

}))


export const goalSelector = {
    goal: (state: GoalStore) => state.goal,
    loading: (state: GoalStore) => state.loading,
    error: (state: GoalStore) => state.error
}