import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type CalendarStore = {
    isCalendarOpen: boolean;
    selectedDate: DateRange | undefined;
    // toggleOpen: () => void;
    setDate: (date: DateRange | undefined) => void;
    resetDate: () => void;
    setOpen: (open: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
    isCalendarOpen: false,
    // toggleOpen: () => set((state) => ({ isCalendarOpen: !state.isCalendarOpen })),
    selectedDate: undefined,
    setOpen: (open) => set({ isCalendarOpen: open }),
    setDate: (date) => set({ selectedDate: date }),
    resetDate: () => set({ selectedDate: undefined }),
}));