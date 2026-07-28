import { serviceCreateReminder, serviceFetchReminders } from '@/lib/services/reminder-service'
import { CreateReminderType, ReminderType, UpdateReminderType } from '@/utils/types'
import { PostgrestError } from '@supabase/supabase-js'
import { create } from 'zustand'

interface ReminderStore {
    reminders: ReminderType[] | null,
    loading: {
        fetch: boolean,
        update: boolean,
        delete: boolean,
        create: boolean
    },
    error: string | null,

    getReminders: () => Promise<void>,
    create: (reminder: CreateReminderType) => Promise<void>,
    // update: (id: string, reminder: UpdateReminderType) => Promise<void>,
    // delete: (id: string) => Promise<void>

}

export const useReminderStore = create<ReminderStore>((set, get) => ({
    reminders: null,
    loading: {
        fetch: false,
        update: false,
        delete: false,
        create: false
    },
    error: null,

    getReminders: async () => {
        set((state) => ({
            loading: {
                ...state.loading,
                fetch: true
            },
            error: null
        }))
        try {
            const reminders = await serviceFetchReminders()
            set({
                reminders,
            })
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch reminder" })
        } finally {
            set((state) => ({
                loading: {
                    ...state.loading,
                    fetch: false
                },
            }))
        }
    },

    create: async (reminder) => {

        set((state) => ({
            loading: {
                ...state.loading,
                create: true
            },
        }))

        try {
            await serviceCreateReminder(reminder)
            await get().getReminders()

        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch reminder" })
        } finally {
            set((state) => ({
                loading: {
                    ...state.loading,
                    create: false
                },
            }))
        }
    }

}))


export const reminderSelectors = {
    reminders: (state: ReminderStore) => state.reminders,
    loading: (state: ReminderStore) => state.loading,

    getReminders: (state: ReminderStore) => state.getReminders,
    createReminder: (state: ReminderStore) => state.create,
}