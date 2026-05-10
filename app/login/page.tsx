"use client"
import HeartComponent from '@/components/UI/Heart'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from "next/navigation"
import React, { useState } from 'react'

export default function Login() {
    const router = useRouter()

    const [showOTP, setShowOTP] = useState(false)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!showOTP) {
            setLoading(true)
            const email = e.target.email.value
            setEmail(email)

            const { data, error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    // set this to false if you do not want the user to be automatically signed up
                    shouldCreateUser: true,
                },
            })

            if (!error) {
                setShowOTP(true)
            }
            setLoading(false)
        } else {
            setLoading(true)
            const otp = e.target.otp.value
            const {
                data: { session },
                error,
            } = await supabase.auth.verifyOtp({
                email: email,
                token: otp,
                type: 'email',
            })

            if (session) {
                // localStorage.setItem("sb-access-token", JSON.stringify(session))
                router.push("/dashboard")
            }
            setLoading(false)
        }

    }
    return (

        <section className='flex items-center h-full w-full '>
            <section className='w-[90%] '>
                <HeartComponent />
            </section>
            <section className=' w-full flex justify-center h-full flex-col space-y-8'>

                <div className='text-[150px]'>Login</div>

                <form onSubmit={login}>

                    <div className='space-y-4 mb-10'>
                        {
                            !showOTP && (<>
                                <label htmlFor="email">Email </label>
                                <input name='email' type="email" id='email' className='block w-65 pl-4 mt-4 rounded-lg border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6' />
                            </>)
                        }
                        {
                            showOTP && (<div>
                                <p className='text-green-600 text-sm mt-2'>OTP sent to your email. Please check your inbox.</p>
                                <input type="number" name="otp" id="" className='block w-65 pl-4 mt-4 rounded-lg border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6' />
                            </div>)
                        }
                    </div>

                    <button type="submit" className='px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg'>{loading ? "Loading..." : "Login"}</button>
                </form>
            </section>
        </section >
    )
}
