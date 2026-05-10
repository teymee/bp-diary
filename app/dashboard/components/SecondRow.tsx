import OverviewCard from '@/components/UI/OverviewCard'
import empty from "@/assets/images/empty.svg"
import Image from 'next/image'
import recentReading from "@/assets/images/recent-reading.svg"


import { ReadingType } from '@/utils/types'
import ReadingRow from '@/app/all-reading/components/ReadingRow'

export default function SecondRow({ readings }: { readings: ReadingType[] }) {
    const latestReading = readings.slice(0, 5)
    return (
        <section className='flex flex-1 h-full gap-x-4 items-stretch'>



            <section className='h-full w-full  '>
                <OverviewCard image={recentReading} title="Recent Readings">
                    <section className='text-white-200 text-sm py-10 px-4 max-h-100 overflow-y-scroll'>
                        {
                            !latestReading || latestReading.length === 0 && (
                                <section className='flex flex-col items-center justify-center gap-y-3 h-full'>
                                    <Image src={empty} alt="No data available" />
                                    <div className='text-center'>
                                        <h2 className='text-lg font-medium'>No readings recorded</h2>
                                        <p>Recorded readings will appear here</p>
                                    </div>
                                </section>
                            )


                        }

                        {
                            latestReading && latestReading.length > 0 && (<section className="space-y-4">
                                {
                                    latestReading.map((reading) => {
                                        return (
                                            <ReadingRow key={reading.id} reading={reading} />

                                        )
                                    })
                                }
                            </section>)
                        }
                    </section>
                </OverviewCard>
            </section>
        </section>
    )
}
