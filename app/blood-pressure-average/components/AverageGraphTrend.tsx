'use client'
import OverviewCard from "@/components/UI/OverviewCard";
import Image from "next/image";


import empty from "@/assets/images/empty.svg"
import bpAverage from "@/assets/images/BP-average.svg"

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { ReadingType } from '@/utils/types'
import { useAuth } from '@/providers/AuthProvider'
import Loader from '@/components/UI/Loader'
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AverageGraphTrend({ readings }: { readings: ReadingType[] | null }) {
    // const { userId } = useAuth()

    // useEffect(() => {

    //     const fetchData = async () => {
    //         if (!userId) {
    //             setReadings([])
    //             setLoading(false)
    //             return
    //         }

    //         setLoading(true)

    //         const { data, error } = await supabase.from("readings").select("*").eq('user_id', userId).order("created_at", { ascending: false })
    //         if (error) {
    //             console.error("Error fetching readings:", error)
    //             setReadings([])
    //         } else {
    //             setReadings(data)
    //         }

    //         setLoading(false)

    //     }
    //     fetchData()


    //     return () => {
    //         setReadings(null)
    //     }
    // }, [userId])

    const sortedReadings = [...(readings ?? [])].reverse()

    const series = [
        {
            name: "Systolic",
            data: sortedReadings.map((reading) => reading.systolic),
        },
        {
            name: "Diastolic",
            data: sortedReadings.map((reading) => reading.diastolic),
        },
    ]

    const categories = sortedReadings.map((reading) => {
        const sourceDate = reading.recorded_at || reading.created_at
        return new Date(sourceDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    })

    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: true, speed: 450 },
            fontFamily: 'var(--font-nunito)',
        },
        annotations: {
            yaxis: [
                {
                    y: 120,
                    borderColor: '#FE5C5C',
                    label: {
                        text: 'High Systolic Threshold',
                        style: {
                            color: '#fff',
                            background: '#FE5C5C',
                        },
                    },
                },
                {
                    y: 80,
                    borderColor: '#00CE9C',
                    label: {
                        text: 'Normal Diastolic Threshold',
                        style: {
                            color: '#fff',
                            background: '#00CE9C',
                        },
                    },
                },
            ],
            xaxis: [
                {
                    x: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    borderColor: '#775DD0',
                    label: {
                        text: 'Today',
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                    },
                },
            ],
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        markers: {
            size: 4,
            hover: { size: 6 },
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    colors: '#A9B0BD',
                    fontSize: '12px',
                },
            },
            axisBorder: {
                show: true,
                color: '#3B4350',
            },
            axisTicks: { show: false },
        },
        yaxis: {
            min: 40,
            max: 200,
            tickAmount: 8,
            axisBorder: {
                show: true,
                color: '#3B4350',
            },
            title: {
                text: 'mmHg',
                style: {
                    color: '#A9B0BD',
                    fontSize: '12px',
                    fontWeight: 600,
                },
            },
            labels: {
                formatter: (value: number) => `${Math.round(value)}`,
                style: {
                    colors: '#A9B0BD',
                    fontSize: '12px',
                },
            },
        },
        colors: ['#8C5B92', '#4F8FB5'],
        dataLabels: { enabled: false },
        legend: {
            show: true,
            labels: { colors: '#D3D7DE' },
            position: 'top',
            horizontalAlign: 'left',
        },
        tooltip: {
            theme: 'dark',
            shared: true,
            y: {
                formatter: (value: number) => `${value} mmHg`,
            },
        },
        grid: {
            borderColor: '#2A303A',
            strokeDashArray: 5,
            padding: {
                top: 8,
                right: 12,
                left: 0,
                bottom: 0,
            },
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 280,
                    },
                    markers: {
                        size: 3,
                    },
                    yaxis: {
                        labels: {
                            formatter: (value: number) => `${Math.round(value)}`,
                        },
                    },
                },
            },
        ],
    }

    return (
        <section className='flex h-full flex-col'>
            <OverviewCard image={bpAverage} title="Blood Pressure Average">

                <section className='text-white-200 text-sm h-full'>
                    {
                        readings?.length === 0
                        && (
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
                        readings && readings.length > 0 && (
                            <section className="h-full w-full flex flex-col items-center justify-center py-4">
                                <section className="h-[90%] w-full">
                                    <ReactChart options={chartOptions} series={series} type="line" height="100%" width="100%" />
                                </section>
                            </section>
                        )
                    }
                </section>


            </OverviewCard>


        </section>
    )
}
