import OverviewCard from '@/components/UI/OverviewCard'
import reminder from "@/assets/images/reminder.svg"
import empty from "@/assets/images/empty.svg"
import Image from 'next/image'
import recentReading from "@/assets/images/recent-reading.svg"


import add from "@/assets/images/add.svg"

export default function SecondRow() {
    const latestData = null
    return (
        <section className='flex flex-1 h-full gap-x-4 items-stretch'>

          

            <section className='h-full w-full  '>
                <OverviewCard image={ recentReading} title="Recent Readings">
                    <section className='text-white-200 text-sm h-55'>
                        {
                            !latestData && (
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
