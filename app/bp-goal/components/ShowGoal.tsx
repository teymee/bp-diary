'use client'

import Image from 'next/image'

import target from "@/assets/images/target.svg"
import RadioButton from "@/assets/images/RadioButton.svg"
import OverviewCard from '@/components/UI/OverviewCard'
import { formatDate } from '@/utils'
import { GoalType } from '@/utils/types'


type ShowGoalProp = {
    goal: GoalType
}
export default function ShowGoal({ goal }: ShowGoalProp) {
    const headerTopContent = (
        <section className='flex items-center justify-between gap-x-3 pt-2'>
            <div className='flex-2 flex items-center gap-x-3 text-base text-gray-700 font-medium'>
                <Image src={target} alt="Latest Readings" width={50} height={50} />
                <div className='dark:text-foreground'>Latest Readings</div>
            </div>

            <div className='topContent text-xs font-medium text-gray-500 dark:text-white-200 underline underline-offset-2'>
                Edit goal
            </div>
        </section>
    )
    return (
        <section>
            <OverviewCard
                topContent={headerTopContent}>
                <section className='p-4 m-4 rounded-lg bg-white-400 dark:bg-gray-700'>

                    <div className='flex items-center gap-x-2 text-black-500 dark:text-white-200 mb-4'>
                        <Image src={RadioButton} alt="target" width={20} height={20} />
                        <p>{goal.goal_name}</p>
                    </div>

                    <section className='space-y-4'>
                        <div className='flex gap-x-2 items-center font-semibold bg-white-100 text-black rounded-lg pl-4 py-1'>
                            <h1 className='text-2xl sm:text-3xl'>{goal.systolic} / {goal.diastolic}</h1> <span className='text-base'>mmhg</span>
                        </div>
                        <div className='flex gap-x-2 items-center font-semibold bg-white-100 text-black rounded-lg pl-4 py-1'>
                            <h1 className='text-2xl sm:text-3xl'>{goal.pulse} </h1> <span className='text-base'>bpm</span>
                        </div>
                        <p>Due date by:  {formatDate(goal.end_date)}</p>
                    </section>



                </section>
            </OverviewCard>

        </section>
    )
}
