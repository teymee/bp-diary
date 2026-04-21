import OverviewCard from '@/components/UI/OverviewCard'
import Image from 'next/image'
import Lock from "@/assets/images/Lock.svg"
import React from 'react'

export default function ExportTool() {
    return (
        <section>

            <OverviewCard >
                <section className='space-y-2 py-4'>
                    <div className='flex items-center gap-x-2'>
                        <Image src={Lock} alt="Information" width={25} height={25} />
                        <h3 className='font-semibold text-gray-700 dark:text-foreground'>Your Privacy Matters</h3>
                    </div>
                    <p className='text-sm pl-8 text-gray-500 dark:text-white-200'>All your blood pressure data is stored locally on your device. When you  export data, files are generated and downloaded directly to your  computer. No data is sent to external servers. Remember to keep exported files secure and only share them with trusted healthcare providers.</p>
                </section>


            </OverviewCard>
        </section>
    )
}
