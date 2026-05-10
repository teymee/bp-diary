'use client'

import OverviewCard from "@/components/UI/OverviewCard";
import Image from "next/image";


import empty from "@/assets/images/empty.svg"
import recentReading from "@/assets/images/recent-reading.svg"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import Loader from "@/components/UI/Loader";
import { formatDate, getLevelImage } from "@/utils";
import { ReadingType } from "@/utils/types";



export default function AllReadings() {

    const [loading, setLoading] = useState(false)
    const [readings, setReadings] = useState<ReadingType[] | null>(null)
    const { userId } = useAuth()

    useEffect(() => {
        const fetchReading = async () => {
            setLoading(true)
            if (!userId) return

            const { data, error } = await supabase.from('readings').select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error.message, error.details, error.hint)
                return
            } else {
                setReadings(data)
                console.log("Fetched readings:", data)
            }
            setLoading(false)

        }


        fetchReading()

        return () => {
            setReadings(null)
        }
    }, [userId])

    return (

        <section className='flex h-full flex-col'>
            <OverviewCard image={recentReading} title="Recent Readings">

                {
                    loading && <Loader />
                }

                {
                    !loading && readings && (
                        <section className="py-4 ">
                            {
                                readings.length > 0 && (
                                    <section className="space-y-4">
                                        {
                                            readings?.map((reading) => {
                                                const { diastolic, id, note, pulse, recorded_at, source, systolic, user_id } = reading
                                                return (
                                                    <section key={id} className="flex border border-white-400 dark:border-black-400 py-2 px-4 rounded-lg justify-between items-center text-white-200">
                                                        <div className="space-y-2">
                                                            <p className="font-semibold text-sm ">{formatDate(recorded_at, "MMM Do, YYYY, hh:mma")}</p>
                                                            <section className="flex text-black dark:text-white-100 gap-x-4 items-center">
                                                                <h1 className="text-2xl font-bold  flex items-center gap-x-1 ">{systolic} / {diastolic} <span className="text-white-200 text-sm">mmhg</span></h1>
                                                                <p className="text-2xl font-bold  flex items-center gap-x-1 " >{pulse} <span className="text-white-200 text-sm">bpm</span></p>
                                                            </section>

                                                            {note && <p className="text-sm mt-1 border-l-3 py-1 pl-2">{note}</p>}
                                                        </div>

                                                        <div className="text-right space-y-1">
                                                            <Image src={getLevelImage(systolic, diastolic, pulse)} alt="BP Level" />
                                                            <p className="capitalize ">{source}</p>
                                                        </div>
                                                    </section>
                                                )
                                            })
                                        }
                                    </section>
                                )
                            }

                            {
                                readings?.length === 0 && (

                                    <section className='text-white-200 text-sm h-full'>

                                        <section className='flex flex-col items-center justify-center gap-y-3 h-full'>
                                            <Image src={empty} alt="No data available" />
                                            <div className='text-center'>
                                                <h2 className='text-lg font-medium'>No readings recorded</h2>
                                                <p>Recorded readings will appear here</p>
                                            </div>
                                        </section>

                                    </section>
                                )
                            }
                        </section>
                    )
                }



            </OverviewCard>


        </section>
    )
}
