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

            <section className='h-full w-[30%]'>
                <OverviewCard image={reminder} title="Today’s Reminder">
                    <section className='text-white-200 text-sm h-55'>
                        {
                            !latestData && (
                                <section className='flex flex-col items-center justify-between gap-y-3 h-full'>
                                    <Image src={empty} alt="No data available" />
                                    <div className='text-center'>
                                        <h2 className='text-lg font-medium'>No reminders Set</h2>
                                        <p>Add a reminder to get notified</p>
                                    </div>


                                    <div className="bg-primary-200 px-3 flex items-center gap-x-2 rounded-full text-primary-100 py-1.5">
                                        <p>Add Reading</p>
                                        <Image src={add} alt="Avatar" width={25} height={25} className="rounded-full" />
                                    </div>
                                </section>
                            )
                        }
                    </section>
                </OverviewCard>
            </section>

            <section className='h-full w-[70%]  '>
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
