
'use client'
import AverageRange from './components/AverageRange'
import AverageGraphTrend from './components/AverageGraphTrend'
import { useEffect } from 'react'
import Loader from '@/components/UI/Loader'
import { readingsSelectors, useReadingStore } from '@/store/readingsStore'
import { useCalendarStore } from '@/store/calendarStore'


export default function BloodPressureAverage() {

    const loading = useReadingStore(readingsSelectors.loading)
    const fetchReading = useReadingStore(s => s.getReadings)
    const selectedDate = useCalendarStore((state) => state.selectedDate)

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
        <section className='flex flex-1  flex-col '>

            <div><h1 className='text-3xl font-semibold sm:text-4xl'>BP Insights</h1></div>

            {
                loading && <Loader />
            }

            {
                !loading && (
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

        </section>
    )

}
