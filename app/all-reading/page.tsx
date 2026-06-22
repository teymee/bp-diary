'use client'
import  { useEffect } from 'react'
import AllReadings from './components/AllReadings'
import ExportTool from './components/ExportTool'
import { readingsSelectors, useReadingStore } from "@/store/readingsStore";
import { useCalendarStore } from "@/store/calendarStore";



export default function AllReading() {
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

            <div><h1 className='text-3xl font-semibold sm:text-4xl'>All Readings</h1></div>
            <section className='mt-4 flex flex-1  items-stretch gap-4 [ lg:flex-row flex-col ] '>
                <section className='lg:w-[60%] h-full w-full '>
                    <AllReadings />
                </section>

                <section className='lg:w-[40%] h-full w-full '>
                    <ExportTool />
                </section>

            </section>
        </section>
    )
}
