import { supabase } from '@/lib/supabase/client';
import { getUserId } from '@/utils';
import { ReadingType } from '@/utils/types';
import { PostgrestError } from '@supabase/supabase-js';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type ReadingStore = {
    readings: ReadingType[] | null,
    loading: boolean,
    error: PostgrestError | null,
    getReadings: (range?: DateRange | 'all') => void,
}

export const useReadingStore = create<ReadingStore>((set) => ({
    readings: null,
    loading: false,
    error: null,
    getReadings: async (range?: DateRange | 'all') => {
        try {

            set({ loading: true })
            const userId = await getUserId()
            if (range && range !== 'all' && range?.from && range?.to) {
                const { data, error } = await supabase.from('readings').select('*').eq('user_id', userId).gte('created_at', range?.from?.toISOString()).lte('created_at', range?.to?.toISOString()).order('created_at', { ascending: true })
                set({
                    readings: data,
                    error: error
                })
                return
            }
            const { data, error } = await supabase.from('readings').select('*').eq('user_id', userId).order('created_at', { ascending: true })

            set({
                readings: data,
                error: error
            })
        } finally {
            set({ loading: false })
        }

    }

}))

export const readingsSelectors = {
    readings: (state: ReadingStore) => state.readings,
    loading: (state: ReadingStore) => state.loading,
    error: (state: ReadingStore) => state.error
}