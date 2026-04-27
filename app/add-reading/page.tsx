import React from 'react'
import ManualReading from './components/ManualReading'
import ReadingTips from './components/ReadingTips'

export default function AddReading() {
  return (
    <section>
      <div><h1 className='text-[36px] font-semibold'>Add Reading</h1></div>


      <section className='mt-4 flex items-start gap-x-4'>
        <section className='w-[60%]'>
          <ManualReading />
        </section>

        <section className='w-[40%]'>
          <ReadingTips />
        </section>
      </section>
    </section>


  )
}
