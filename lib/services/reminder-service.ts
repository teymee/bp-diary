import { getUserId } from "@/utils"
import { supabase } from "../supabase/client"
import { CreateReminderType } from "@/utils/types"

const userId = await getUserId()
export const serviceFetchReminders = async () => {
    const { data, error } = await supabase.from('reminders').select('*').eq('user_id', userId).order('time')
    if (error) throw error
    return data
}

export const serviceCreateReminder = async (reminder: CreateReminderType) => {
    const params = {
        ...reminder,
        user_id: userId,
        created_at: new Date()
    }
    const { data, error } = await supabase.from('reminders').insert(params)

    if (error) throw error

    return data
}