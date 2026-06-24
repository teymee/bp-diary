
'use client'
import AverageRange from './components/AverageRange'
import AverageGraphTrend from './components/AverageGraphTrend'
import CalendarView from './components/CalendarView'
import { useEffect, useState } from 'react'
import Loader from '@/components/UI/Loader'
import { readingsSelectors, useReadingStore } from '@/store/readingsStore'
import { useCalendarStore } from '@/store/calendarStore'

type ViewTab = 'insights' | 'calendar'

export default function BloodPressureAverage() {

    const loading = useReadingStore(readingsSelectors.loading)
    const fetchReading = useReadingStore(s => s.getReadings)
    const selectedDate = useCalendarStore((state) => state.selectedDate)
    const [activeView, setActiveView] = useState<ViewTab>('insights')

    useEffect(() => {
        fetchReading()
    }, [fetchReading])

    useEffect(() => {
        if (selectedDate === undefined) {
            fetchReading('all')
        } else if (selectedDate?.from && selectedDate?.to) {
            fetchReading(selectedDate)
        }

    }, [selectedDate, fetchReading])

    return (
        <section className='flex flex-1 flex-col'>

            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-3xl font-semibold sm:text-4xl'>BP Insights</h1>
                
                <div className='flex gap-2'>
                    <button
                        onClick={() => setActiveView('insights')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeView === 'insights'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white-100 dark:bg-black-100 text-foreground hover:bg-white-200 dark:hover:bg-black-200'
                        }`}
                    >
                        Insights
                    </button>
                    <button
                        onClick={() => setActiveView('calendar')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeView === 'calendar'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white-100 dark:bg-black-100 text-foreground hover:bg-white-200 dark:hover:bg-black-200'
                        }`}
                    >
                        Calendar
                    </button>
                </div>
            </div>

            {
                loading && <Loader />
            }

            {
                !loading && activeView === 'insights' && (
                    <section className='mt-4 flex flex-1 [ lg:flex-row flex-col ]  items-stretch gap-4'>
                        <section className='lg:w-[70%] h-full '>
                            <AverageGraphTrend />
                        </section>

                        <section className='lg:w-[30%] h-full '>
                            <AverageRange />
                        </section>

                    </section>
                )
            }

            {
                !loading && activeView === 'calendar' && (
                    <section className='mt-4 flex flex-1 items-stretch'>
                        <CalendarView />
                    </section>
                )
            }

        </section>
    )

}
