import React from 'react'
import AddGoal from './components/AddGoal'
import GoalInfo from './components/GoalInfo'

export default function BPGoal() {
    return (
        <section>
            <div><h1 className='text-[36px] font-semibold'>BP Goals</h1></div>


            <section className='mt-4 flex items-start gap-x-4'>
                <section className='w-[60%]'>
                    <AddGoal />
                </section>

                <section className='w-[40%]'>
                    <GoalInfo />
                </section>
            </section>
        </section>
    )
}
