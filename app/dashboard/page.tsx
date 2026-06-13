'use client'
import { useEffect } from 'react'
import FirstRow from './components/FirstRow'
import SecondRow from './components/SecondRow'
import HeartComponent from '@/components/UI/Heart'
import Loader from '@/components/UI/Loader'
import { readingsSelectors, useReadingStore } from '@/store/readingsStore'

export default function Dashboard() {

    // 🚨 Stores 
    const fetchReadings = useReadingStore((s) => s.getReadings)
    const loading = useReadingStore(readingsSelectors.loading)
    const readings = useReadingStore(readingsSelectors.readings)


    useEffect(() => {
        fetchReadings()
    }, [])

    return (
        <section className='flex h-full flex-col items-stretch gap-y-4 md:gap-y-6'>

            {
                loading && <Loader />
            }

            {
                !loading && readings && (<section className='relative flex flex-1 flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:gap-10 xl:gap-16'>
                    <section className='w-full lg:sticky lg:top-24 lg:w-[35%] lg:self-start lg:h-fit'>
                        <HeartComponent />
                    </section>

                    <section className='w-full lg:w-[65%] lg:mt-0 mt-24'>
                        <section className='flex h-full flex-col'>

                            <section className='space-y-3'>
                                <FirstRow />
                                <section className='flex-1'>
                                    <SecondRow />
                                </section>
                            </section>

                        </section>
                    </section>

                </section>)
            }
        </section>






    )
}
