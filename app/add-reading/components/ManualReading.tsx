import OverviewCard from '@/components/UI/OverviewCard'
import fileText from "@/assets/images/green-fileText.svg"
import Image from 'next/image'

export default function ManualReading() {
  const headerTopContent = (
    <section className='flex items-center justify-between gap-x-3 pt-2'>
      <div className='flex-2 flex items-center gap-x-3 text-base text-gray-700 font-medium'>
        <Image src={fileText} alt="Latest Readings" width={50} height={50} />
        <div className='dark:text-foreground'>Latest Readings</div>
      </div>

      <div className='topContent text-xs font-medium text-gray-500 dark:text-white-200 underline underline-offset-2'>
        Upload picture instead
      </div>
    </section>
  )

  return (
    <section>
      <OverviewCard
        image={fileText}
        title="Latest Readings"
        topContent={headerTopContent}
      >
        <section className='p-4'>
          <form action="" className='space-y-4'>
            <section className='flex items-center gap-x-4 justify-between'>
              <div className='space-y-3 w-1/2'>
                <label htmlFor="systolic" className='labelStyle'>Systolic (Top mmHg)</label>
                <input type="number"
                  name="systolic"
                  id="systolic"
                  className='inputStyle'
                  placeholder='120' />
              </div>

              <div className='space-y-3 w-1/2'>
                <label htmlFor="diastolic" className='labelStyle'>Diastolic (Bottom mmHg)</label>
                <input type="number"
                  name="diastolic"
                  id="diastolic"
                  className='inputStyle'
                  placeholder='80' />
              </div>
            </section>
            <div>
              <label htmlFor="pulse" className='labelStyle'>Pulse</label>
              <input type="number"
                name="pulse"
                id="pulse"
                className='inputStyle'
                placeholder='70' />
            </div>

            <div>
              <label htmlFor="datetime" className='labelStyle'>Date/Time</label>
              <input type="datetime-local"
                name="datetime"
                id="datetime"
                className='inputStyle'
                placeholder='Select date and time' />
            </div>

            <div>
              <label htmlFor="note" className='labelStyle'>Note</label>
              <textarea name="note" id="note" className='inputStyle' placeholder='Add any notes about this reading (optional)' rows={4}></textarea>
            </div>

            
            {/* 🚨 Actions  */}

            <section className='flex gap-x-4 items-center'>
              <button type="submit" className='px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300'>Save Reading</button>
                      <button type="reset" className='px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg  transition-colors duration-300'>Clear</button>
            </section>


          </form>
        </section>
      </OverviewCard>
    </section>
  )
}
