
import AverageRange from './components/AverageRange'
import AverageGraphTrend from './components/AverageGraphTrend'

export default function BloodPressureAverage() {
    return (
        <section className='flex flex-1  flex-col '>

            <div><h1 className='text-[36px] font-semibold'>Blood Pressure Average</h1></div>
            <section className='mt-4 flex flex-1  items-stretch gap-x-4'>
                <section className='w-[70%] h-full '>
                    <AverageGraphTrend />
                </section>

                <section className='w-[30%] h-full '>
                    <AverageRange />
                </section>

            </section>
        </section>
    )

}
