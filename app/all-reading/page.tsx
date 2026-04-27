import React from 'react'
import AllReadings from './components/AllReadings'
import ExportTool from './components/ExportTool'

export default function AllReading() {
    return (
        <section className='flex flex-1  flex-col '>

            <div><h1 className='text-[36px] font-semibold'>All Readings</h1></div>
            <section className='mt-4 flex flex-1  items-stretch gap-x-4'>
                <section className='w-[60%] h-full '>
                    <AllReadings />
                </section>

                <section className='w-[40%] h-full '>
                    <ExportTool />
                </section>

            </section>
        </section>
    )
}
