import { readingsSelectors, useReadingStore } from '@/store/readingsStore'
import dynamic from 'next/dynamic';
import OverviewCard from "@/components/UI/OverviewCard";


import bpAverage from "@/assets/images/BP-average.svg"
import { getLevelColor, getLevelImage, readingsCategories } from '@/utils';
const ReactChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DonutGraphTrend() {
    const readings = useReadingStore(readingsSelectors.readings)
    if (!readings) return

    const categoriesList = readings.map(reading => getLevelImage(reading.systolic, reading.diastolic, reading.pulse, 'text'))
    const chartArray = []
    for (let i = 0; i < readingsCategories?.length; i++) {
        const category = readingsCategories[i].label
        const value = readingsCategories[i].value
        const count = categoriesList.filter(cate => {
            return cate.toLowerCase() === category.toLowerCase()
        }).length

        chartArray.push({
            category, value, count
        })

    }

    const categoryColors = chartArray.map(item => getLevelColor(item.value) ?? '#A9B0BD')

    const chartOptions = {
        labels: chartArray.map(cate => cate.category),
        colors: categoryColors,
        legend: {
            show: false
        },
        dataLabels: {
            enabled: true,
            formatter: (value: number) => `${Math.round(value)}%`,
            style: {
                fontSize: '12px',
                fontWeight: 700,
                colors: ['#FFFFFF']
            }
        }
    }
    const series = chartArray.map(cate => cate.count)
    return (
        <section>
            <OverviewCard image={bpAverage} title="BP Status Overview">
                <section className='flex w-full flex-col items-center'>
                    <section className='w-full max-w-100'>
                        <ReactChart type="donut" series={series} options={chartOptions} width="100%" />
                    </section>

                    <section className='mt-3 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2'>
                        {chartArray.map((item, index) => (
                            <div
                                key={item.value}
                                className='flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-xs sm:text-sm dark:border-white/15 dark:bg-white/5'
                            >
                                <span
                                    className='h-2.5 w-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/20'
                                    style={{ backgroundColor: categoryColors[index] }}
                                />
                                <span className='text-foreground/90'>
                                    {item.category} ({item.count})
                                </span>
                            </div>
                        ))}
                    </section>
                </section>
            </OverviewCard>


        </section>
    )
}
