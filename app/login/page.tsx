"use client"
import { createClient } from '@supabase/supabase-js'
import { useRouter } from "next/navigation"
import React, { useState } from 'react'

export default function Login() {
    const router = useRouter()
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)

    const [showOTP, setShowOTP] = useState(false)
    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()


        const email = e.target.email.value

        if (!showOTP) {

            const { data, error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    // set this to false if you do not want the user to be automatically signed up
                    shouldCreateUser: true,
                },
            })

            console.log(data, error)

            if (!error) {
                setShowOTP(true)
            }
        } else {
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
                localStorage.setItem("sb-access-token", JSON.stringify(session))
                router.push("/dashboard")
            }
        }

    }
    return (
        <section className='flex items-center justify-center h-full w-full flex-col space-y-8'>
            <div className='text-5xl'>Login</div>

            <form onSubmit={login}>

                <div className=''>
                    <label htmlFor="email">Email </label>
                    <input name='email' type="email" id='email' className='block w-full rounded-lg border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6' />

                    {
                        showOTP && (<div>
                            <p className='text-green-600 text-sm mt-2'>OTP sent to your email. Please check your inbox.</p>
                            <input type="number" name="otp" id="" className='border' />
                        </div>)
                    }
                </div>

                <button type="submit" className='px-4 py-2 bg-indigo-600 text-white rounded-lg'>Login</button>
            </form>
        </section>
    )
}
