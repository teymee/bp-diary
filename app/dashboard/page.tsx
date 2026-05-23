'use client'
import { useEffect, useState } from 'react'
import FirstRow from './components/FirstRow'
import SecondRow from './components/SecondRow'
import HeartComponent from '@/components/UI/Heart'
import Loader from '@/components/UI/Loader'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { ReadingType } from '@/utils/types'

export default function Dashboard() {

    const [loading, setLoading] = useState(false)
    const [readings, setReadings] = useState<ReadingType[] | null>(null)
    const { userId } = useAuth()

    useEffect(() => {

        const fetchData = async () => {
            if (!userId) return
            setLoading(true)

            const { data, error } = await supabase.from("readings").select("*").eq('user_id', userId).order("created_at", { ascending: false })
            if (error) {
                console.error("Error fetching readings:", error)
            } else {
                setReadings(data)
            }
            setTimeout(() => {
                setLoading(false)
            }, 2500)

        }
        fetchData()


        return () => {

        }
    }, [userId])

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
                                <FirstRow readings={readings} />
                                <section className='flex-1'>
                                    <SecondRow readings={readings} />
                                </section>
                            </section>

                        </section>
                    </section>

                </section>)
            }
        </section>






    )
}
