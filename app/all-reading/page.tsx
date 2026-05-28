import React from 'react'
import AllReadings from './components/AllReadings'
import ExportTool from './components/ExportTool'

export default function AllReading() {
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
