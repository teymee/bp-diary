'use client'
import React, { useEffect, useState } from 'react'
import AddGoal from './components/AddGoal'
import GoalInfo from './components/GoalInfo'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import Loader from '@/components/UI/Loader'
import ShowGoal from './components/ShowGoal'

export default function BPGoal() {
    const [goal, setGoal] = useState(null)
    const [loading, setLoading] = useState(true)
    const { session, sessionLoader } = useAuth()
    const userId = session?.user?.id

    useEffect(() => {
        const fetchGoal = async () => {

            const { data, error } = await supabase.from('goals').select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1).maybeSingle()
            if (error) {
                console.error(error.message, error.details, error.hint)
                return
            } else {
                setGoal(data)
            }
            setLoading(false)
        }
        if (!sessionLoader && userId) {
            fetchGoal()
        } else if (!sessionLoader && !userId) {
            return alert('User not logged in')
        }


        return () => {
            setGoal(null)
        }
    }, [userId, sessionLoader])


    return (
        <section className="flex flex-1 flex-col">
            <div><h1 className='text-[36px] font-semibold'>BP Goals</h1></div>

            {loading && <Loader />}

            {
                !loading && (<section className='mt-4 flex items-start gap-x-4'>
                    <section className='w-[60%]'>
                        {
                            goal ? <ShowGoal goal={goal} /> : <AddGoal />
                        }
                    </section>

                    <section className='w-[40%]'>
                        <GoalInfo />
                    </section>
                </section>)
            }
        </section>
    )
}
