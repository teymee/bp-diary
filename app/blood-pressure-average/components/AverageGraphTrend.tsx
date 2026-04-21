import OverviewCard from "@/components/UI/OverviewCard";
import Image from "next/image";


import empty from "@/assets/images/empty.svg"
import bpAverage from "@/assets/images/BP-average.svg"


export default function AverageGraphTrend() {
    const latestData = null
    return (
        <section className='flex h-full flex-col'>
            <OverviewCard image={bpAverage} title="Blood Pressure Average">
                <section className='text-white-200 text-sm h-full'>
                    {
                        !latestData
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
                </section>
            </OverviewCard>

         
        </section>
    )
}
