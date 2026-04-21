import React from 'react'
import FirstRow from './components/FirstRow'
import SecondRow from './components/SecondRow'
import { createClient } from '@/lib/supabase/server'
import HeartComponent from '@/components/UI/Heart'

export default async function Dashboard() {
    const supabase = await createClient()
    const { data: instruments } = await supabase.from("instruments").select()

    // console.log(instruments)
    return (

        <section className=' flex flex-1 items-stretch gap-x-16 '>
            <section className="w-[35%] h-full">
                <HeartComponent />
            </section>

            <section className="w-[65%] flex flex-col">
                <section className=' flex flex-col h-full'>

                    <section className='space-y-3'>
                        <FirstRow />
                        <section className='flex-1'>
                            <SecondRow />
                        </section>
                    </section>

                </section>
            </section>

        </section>



    )
}
