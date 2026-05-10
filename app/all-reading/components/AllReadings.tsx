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
import ReadingRow from "./ReadingRow";



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
                                                return (
                                                    <ReadingRow key={reading.id} reading={reading} />

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
