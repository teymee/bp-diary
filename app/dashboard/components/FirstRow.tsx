import OverviewCard from '@/components/UI/OverviewCard'
import React from 'react'
import latestReading from "@/assets/images/latest-reading.svg"
import bpAverage from "@/assets/images/BP-average.svg"
import normalTag from "@/assets/images/normal-tag.svg"
import empty from "@/assets/images/empty.svg"
import Image from 'next/image'
import heartPulse from "@/assets/images/heart-pulse.svg"
import { formatDate, getLevelImage, getPulseLevelColor, ReadingType } from '@/utils'
import type { ApexOptions } from 'apexcharts'

import dynamic from 'next/dynamic'
import { read } from 'fs'
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })



export default function FirstRow({ readings }: { readings: ReadingType[] }) {
    const latestData = readings[0]
    const { systolic, diastolic, pulse, recorded_at } = latestData || {}

    const averagePulse = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.pulse, 0) / readings.length) : null
    const averageSystolic = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length) : null
    const averageDiastolic = readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length) : null
    const pulseLevel = averagePulse !== null ? getPulseLevelColor(averagePulse) : null
    const pulseChartSeries = readings.map(r => r.pulse)
    const pulseChartCategories: string[] = readings.map(r => formatDate(r.recorded_at, "MMM Do, hh:mma") ?? '')

    const pulseSeries = [{
        name: "Pulse",
        data: pulseChartSeries
    }]

    const pulseOptions: ApexOptions = {
        chart: {
            type: 'area',
            sparkline: {
                enabled: true
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },

        dataLabels: {
            enabled: false
        },
        colors: [pulseLevel?.textColor ?? '#00CE9C'],
        labels: pulseChartCategories,
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        yaxis: {
            show: false
        },
        xaxis: {
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        grid: {
            show: false
        },
        tooltip: {
            theme: 'dark',
            enabled: true
        }


    }

    const BPseries = [{
        name: "Systolic",
        data: readings.map(r => r.systolic)
    }, {
        name: "Diastolic",
        data: readings.map(r => r.diastolic)
    }
    ]

    const BPoptions: ApexOptions = {
        chart: {
            type: 'area',
            sparkline: {
                enabled: true
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },

        dataLabels: {
            enabled: false
        },
        colors: ['#8C5B92', '#4F8FB5'],
        labels: pulseChartCategories,
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        yaxis: {
            show: false
        },
        xaxis: {
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        grid: {
            show: false
        },
        tooltip: {
            theme: 'dark',
            enabled: true
        }


    }
    return (
        <section className='grid grid-cols-3 items-stretch gap-x-4'>

            <section className='h-full'>
                <OverviewCard image={latestReading} title="Latest Readings">
                    <section className=' text-white-200 text-sm'>
                        {
                            latestData && (
                                <section className='space-y-3 pt-4'>
                                    <section className='space-y-2'>
                                        <div className='bg-white-400 py-3 rounded-lg px-3 '>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-3xl text-black font-semibold'>{latestData.systolic} </p>
                                                <span className='text-white-200 font-medium! text-base'>/ {latestData.diastolic} mmhg</span>
                                            </div>
                                        </div>

                                        <div className='bg-white-400 py-3 rounded-lg px-3 '>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-3xl text-black font-semibold'>{latestData.pulse} </p>
                                                <span className='text-white-200 font-medium! text-base'>bpm</span>
                                            </div>
                                        </div>

                                    </section>

                                    <section className='space-y-2'>
                                        <Image src={getLevelImage(systolic, diastolic, pulse)} alt="Blood pressure level" />

                                        <div className='flex justify-between items-center text-[11px]'>
                                            <p>Last Updated</p>
                                            <p>{formatDate(recorded_at, "MMM Do, YYYY, hh:mma")}</p>
                                        </div>
                                    </section>
                                </section>
                            )
                        }
                    </section>
                </OverviewCard>
            </section>

            <section className='h-full'>
                <OverviewCard image={bpAverage} title="Blood Pressure Average" noPadding={true}>
                    <section className=' text-sm h-full'>
                        {
                            !averageDiastolic && (
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
                            averageDiastolic && averageSystolic && (
                                <section className='space-y-4 pt-4'>
                                    <section className='space-y-4 pl-3'>
                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-3xl font-semibold'>{averageSystolic} </p>
                                            <span className='text-white-200 font-medium! text-base'>/ {averageDiastolic} mmhg</span>
                                        </div>

                                        <Image src={getLevelImage(averageSystolic, averageDiastolic, averagePulse ?? 0)} alt="Blood pressure level" className='' />
                                    </section>

                                    <section>
                                        <ReactApexChart options={BPoptions} series={BPseries} type="area" height={120} width="100%" />
                                    </section>
                                </section>
                            )
                        }

                    </section>
                </OverviewCard>
            </section>

            <section className='h-full'>
                <OverviewCard image={heartPulse} title="Heart Pulse Average" noPadding={true}>
                    <section className='text-white-200 text-sm h-full'>
                        {
                            !averagePulse && (
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
                            averagePulse && (
                                <section className=' flex  pt-4 justify-betweeen  flex-col h-full gap-y-4'>
                                    <section className='pl-4 space-y-4'>
                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-3xl font-semibold' style={{ color: pulseLevel?.textColor }}>{averagePulse} </p>
                                            <span className='text-white-200 font-medium! text-base'>bpm</span>
                                        </div>

                                        <div className='flex items-center gap-x-2'>
                                            <p className='text-sm px-2 rounded' style={{ color: pulseLevel?.textColor, backgroundColor: pulseLevel?.bgColor }}> {pulseLevel?.text}</p>
                                        </div>
                                    </section>
                                    <section>
                                        <ReactApexChart options={pulseOptions} series={pulseSeries} type="area" height={120} width="100%" />
                                    </section>
                                </section>
                            )
                        }
                    </section>
                </OverviewCard>
            </section>
        </section>
    )
}
