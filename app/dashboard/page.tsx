import React from 'react'
import FirstRow from './components/FirstRow'
import SecondRow from './components/SecondRow'

export default function Dashboard() {
    return (
        <section className=' flex flex-col h-full'>

            <section className='space-y-3'>
                <FirstRow />
                <section className='flex-1'>
                    <SecondRow />
                </section>
            </section>

        </section>
    )
}
