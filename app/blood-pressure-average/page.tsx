
'use client'
import AverageRange from './components/AverageRange'
import AverageGraphTrend from './components/AverageGraphTrend'



import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { ReadingType } from '@/utils/types'
import { useAuth } from '@/providers/AuthProvider'
import Loader from '@/components/UI/Loader'
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

export default function BloodPressureAverage() {
    const [loading, setLoading] = useState(true)
    const [readings, setReadings] = useState<ReadingType[] | null>(null)
    const { userId } = useAuth()

    useEffect(() => {

        const fetchData = async () => {
            if (!userId) {
                setReadings([])
                setLoading(false)
                return
            }

            setLoading(true)

            const { data, error } = await supabase.from("readings").select("*").eq('user_id', userId).order("created_at", { ascending: false })
            if (error) {
                console.error("Error fetching readings:", error)
                setReadings([])
            } else {
                setReadings(data)
            }

            setLoading(false)

        }
        fetchData()


        return () => {
            setReadings(null)
        }
    }, [userId])


    return (
        <section className='flex flex-1  flex-col '>

            <div><h1 className='text-[36px] font-semibold'>Blood Pressure Average</h1></div>

            {
                loading && <Loader />
            }

            {
                !loading && (
                    <section className='mt-4 flex flex-1  items-stretch gap-x-4'>
                        <section className='w-[70%] h-full '>
                            <AverageGraphTrend readings={readings} />
                        </section>

                        <section className='w-[30%] h-full '>
                            <AverageRange readings={readings} />
                        </section>

                    </section>
                )
            }

        </section>
    )

}
