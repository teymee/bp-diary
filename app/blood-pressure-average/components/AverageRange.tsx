import OverviewCard from '@/components/UI/OverviewCard'
import waveTriangle from "@/assets/images/wave-triangle.svg"
import Image from 'next/image'

import normalTag from "@/assets/images/normal-tag.svg"
import trendUp from "@/assets/images/trend-up.svg"
import trendDown from "@/assets/images/trend-down.svg"
import whiteTrend from "@/assets/images/white-trend.svg"

export default function AverageRange() {
    const latestData = null
    return (
        <section className='space-y-4'>
            <OverviewCard image={waveTriangle} title="Average Reading">
                <section className=' text-white-200 text-sm'>
                    {
                        !latestData && (
                            <section className='py-3'>
                                <section className='space-y-4 text-white-200'>
                                    <div className=' rounded-lg px-3 '>
                                        <p className='text-base font-semibold'>Average BP:</p>
                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-3xl font-semibold'>0 </p>
                                            <span className=' font-medium! text-base'>/ 0 mmhg</span>
                                        </div>
                                    </div>

                                    <div className=' rounded-lg px-3 '>
                                        <p className='text-base font-semibold'>Total Readings:</p>
                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-3xl  font-semibold'>0 </p>
                                        </div>
                                    </div>

                                    <Image src={normalTag} alt="Normal tag" />
                                </section>


                            </section>
                        )
                    }
                </section>
            </OverviewCard>


            <OverviewCard image={whiteTrend} title="Range">
                <section className=' text-white-200 text-sm'>
                    {
                        !latestData && (
                            <section className='py-3 space-y-4' >

                                <section className='space-y-2'>
                                    <div className='flex items-center gap-x-2 text-base font-semibold'>
                                        <Image src={trendUp} alt="Trend up" />
                                        <p>Systolic Range</p>
                                    </div>

                                    <p>115 - 128 mmHg</p>
                                </section>

                                <section className='space-y-2'>
                                    <div className='flex items-center gap-x-2 text-base font-semibold'>
                                        <Image src={trendDown} alt="Trend down" />
                                        <p>Diastolic Range</p>
                                    </div>

                                    <p>75 - 85 mmHg</p>
                                </section>





                            </section>
                        )
                    }
                </section>
            </OverviewCard>
        </section>
    )
}
