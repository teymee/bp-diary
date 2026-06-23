'use client'
import OverviewCard from "@/components/UI/OverviewCard";
import Image from "next/image";


import empty from "@/assets/images/empty.svg"
import bpAverage from "@/assets/images/BP-average.svg"

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { readingsSelectors, useReadingStore } from "@/store/readingsStore";

const ReactChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AverageGraphTrend() {

    const reverseReadings = useReadingStore(readingsSelectors.readings)
    if (!reverseReadings) return
    const readings = reverseReadings.reverse()

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

    const timestampLabels = sortedReadings.map((reading) => {
        const sourceDate = reading.recorded_at || reading.created_at
        return new Date(sourceDate).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    })

    const chartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: '100%',
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
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        markers: {
            size: 4,
            hover: { size: 6 },
        },
        xaxis: {
            categories,
            labels: {
                hideOverlappingLabels: true,
                trim: true,
                rotate: 0,
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
            x: {
                formatter: (_value: string, opts?: { dataPointIndex?: number }) => {
                    const index = opts?.dataPointIndex ?? -1
                    return index >= 0 ? `Taken: ${timestampLabels[index]}` : ''
                },
            },
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
                breakpoint: 1024,
                options: {
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: '11px',
                            },
                        },
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    markers: {
                        size: 3,
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                    },
                    annotations: {
                        xaxis: [],
                        yaxis: [],
                    },
                    xaxis: {
                        labels: {
                            rotate: -45,
                            trim: true,
                            style: {
                                fontSize: '10px',
                            },
                        },
                    },
                    yaxis: {
                        labels: {
                            formatter: (value: number) => `${Math.round(value)}`,
                            style: {
                                fontSize: '10px',
                            },
                        },
                    },
                },
            },
            {
                breakpoint: 480,
                options: {
                    markers: {
                        size: 2,
                    },
                    stroke: {
                        width: 2,
                    },
                    grid: {
                        padding: {
                            top: 4,
                            right: 4,
                            left: -4,
                            bottom: 0,
                        },
                    },
                },
            },
        ],
    }

    return (
        <section className='flex h-full flex-col'>
            <OverviewCard image={bpAverage} title="BP Insights">

                <section className='text-white-200 text-sm h-full'>
                    {
                        readings?.length === 0
                        && (
                            <section className='flex flex-col items-center justify-center gap-y-3 h-full'>
                                <Image src={empty} alt="No data available" className='h-auto w-24 sm:w-auto' />
                                <div className='text-center'>
                                    <h2 className='text-lg font-medium'>No readings recorded</h2>
                                    <p>Recorded readings will appear here</p>
                                </div>
                            </section>
                        )
                    }


                    {
                        readings && readings.length > 0 && (
                            <section className="flex h-full min-h-72 w-full flex-col items-stretch justify-center py-2 sm:py-4">
                                <section className="h-full w-full flex-1">
                                    <ReactChart options={chartOptions} series={series} type="area" height="100%" width="100%" />
                                </section>
                            </section>
                        )
                    }
                </section>


            </OverviewCard>


        </section>
    )
}
