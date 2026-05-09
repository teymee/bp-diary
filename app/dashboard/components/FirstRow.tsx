import OverviewCard from '@/components/UI/OverviewCard'
import React from 'react'
import latestReading from "@/assets/images/latest-reading.svg"
import bpAverage from "@/assets/images/BP-average.svg"
import normalTag from "@/assets/images/normal-tag.svg"
import empty from "@/assets/images/empty.svg"
import Image from 'next/image'
import heartPulse from "@/assets/images/heart-pulse.svg"
import { formatDate, getLevelImage, ReadingType } from '@/utils'

export default function FirstRow({ readings }: { readings: ReadingType[] }) {
    const latestData = readings[0]
    const { systolic, diastolic, pulse, recorded_at } = latestData || {}

    const averagePulse = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.pulse, 0) / readings.length) : null
    const averageSystolic = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length) : null
    const averageDiastolic = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length) : null

    return (
        <section className='grid grid-cols-3 items-stretch gap-x-4'>

            <section className='h-full'>
                <OverviewCard image={latestReading} title="Latest Readings">
                    <section className=' text-white-200 text-sm'>
                        {
                            latestData && (
                                <section className='space-y-3'>
                                    <section className='space-y-2'>
                                        <div className='bg-white-400 py-3 rounded-lg px-3 '>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-3xl text-black font-semibold'>{latestData.systolic} </p>
                                                <span className='text-white-200 font-medium! text-base'>/ {latestData.diastolic} mmhg</span>
                                            </div>
                                        </div>

                                        <div className='bg-white-400 py-3 rounded-lg px-3 '>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-3xl text-black font-semibold'>{latestData.pulse} </p>
                                                <span className='text-white-200 font-medium! text-base'>bpm</span>
                                            </div>
                                        </div>

                                    </section>

                                    <section className='space-y-2'>
                                        <Image src={getLevelImage(systolic, diastolic, pulse)} alt="Blood pressure level" />

                                        <div className='flex justify-between items-center text-[11px]'>
                                            <p>Last Updated</p>
                                            <p>{formatDate(recorded_at, "MMM Do, YYYY, hh:mma")}</p>
                                        </div>
                                    </section>
                                </section>
                            )
                        }
                    </section>
                </OverviewCard>
            </section>

            <section className='h-full'>
                <OverviewCard image={bpAverage} title="Blood Pressure Average">
                    <section className='text-white-200 text-sm h-full'>
                        {
                            averageDiastolic && (
                                <section className='flex flex-col items-center justify-center gap-y-3 h-full'>
                                    <Image src={empty} alt="No data available" />
                                    <div className='text-center'>
                                        <h2 className='text-lg font-medium'>No readings recorded</h2>
                                        <p>Recorded readings will appear here</p>
                                    </div>
                                </section>
                            )
                        }
                      
                    </section>
                </OverviewCard>
            </section>

            <section className='h-full'>
                <OverviewCard image={heartPulse} title="Heart Pulse Average">
                    <section className='text-white-200 text-sm h-full'>
                        {
                            averagePulse && (
                                <section className='flex flex-col items-center justify-center gap-y-3 h-full'>
                                    <Image src={empty} alt="No data available" />
                                    <div className='text-center'>
                                        <h2 className='text-lg font-medium'>No readings recorded</h2>
                                        <p>Recorded readings will appear here</p>
                                    </div>
                                </section>
                            )
                        }
                    </section>
                </OverviewCard>
            </section>
        </section>
    )
}
