import React from 'react'
import ManualReading from './components/ManualReading'
import ReadingTips from './components/ReadingTips'

export default function AddReading() {
  return (
    <section>
      <div><h1 className='text-3xl font-semibold sm:text-4xl'>Add Reading</h1></div>


      <section className='mt-4 flex items-start  gap-4 [ lg:flex-row flex-col ]'>
        <section className='lg:w-[60%] w-full'>
          <ManualReading />
        </section>

        <section className='lg:w-[40%]'>
          <ReadingTips />
        </section>
      </section>
    </section>


  )
}
