'use client'
import React, { useEffect } from 'react'
import AddGoal from './components/AddGoal'
import GoalInfo from './components/GoalInfo'
import Loader from '@/components/UI/Loader'
import ShowGoal from './components/ShowGoal'
import { goalSelector, useGoalStore } from '@/store/goalStore'

export default function BPGoal() {
    // 🚨 Goal store
    const fetchGoal = useGoalStore((s) => s.getGoal)
    const loading = useGoalStore(goalSelector.loading)
    const goal = useGoalStore(goalSelector.goal)


    useEffect(() => {
        fetchGoal()
    }, [fetchGoal])


    return (
        <section className="flex flex-1 flex-col">
            <div><h1 className='text-3xl font-semibold sm:text-4xl'>BP Goal</h1></div>

            {loading && <Loader />}

            {
                !loading && (<section className='mt-4 flex items-start  gap-4 [ lg:flex-row flex-col ]'>
                    <section className='lg:w-[60%] w-full'>
                        {
                            goal ? <ShowGoal /> : <AddGoal />
                        }
                    </section>

                    <section className='lg:w-[40%]'>
                        <GoalInfo />
                    </section>
                </section>)
            }
        </section>
    )
}
