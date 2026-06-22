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
import { readingsSelectors, useReadingStore } from "@/store/readingsStore";
import { useCalendarStore } from "@/store/calendarStore";



export default function AllReadings() {


    const loading = useReadingStore(readingsSelectors.loading)
    const fetchReading = useReadingStore(s => s.getReadings)
    const selectedDate = useCalendarStore((state) => state.selectedDate)
    
    useEffect(() => {
        fetchReading()
    }, [fetchReading])

    useEffect(() => {
        if (selectedDate === undefined) {
            fetchReading('all')
        } else if (selectedDate?.from && selectedDate?.to) {
            fetchReading(selectedDate)
        }

    }, [selectedDate, fetchReading])

    const reverseReadings = useReadingStore(readingsSelectors.readings)
    if (!reverseReadings) return
    const readings = reverseReadings.reverse()



    return (

        <section className='flex h-full flex-col'>
            <OverviewCard image={recentReading} title="Recent Readings">

                {
                    loading && <Loader />
                }

                {
                    !loading && readings && (
                        <section className="py-4  overflow-y-scroll lg:h-125 h-100">
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
