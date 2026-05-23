"use client"
import { supabase } from '@/lib/supabase/client'
import { useRouter } from "next/navigation"
import React, { useState } from 'react'

export default function Login() {
    const router = useRouter()

    const [showOTP, setShowOTP] = useState(false)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState("")
    const [isError, setIsError] = useState(false)

    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!showOTP) {
            setLoading(true)
            setFeedback("")
            setIsError(false)

            const formData = new FormData(e.currentTarget)
            const inputEmail = String(formData.get('email') ?? '').trim()

            if (!inputEmail) {
                setIsError(true)
                setFeedback('Enter a valid email to continue.')
                setLoading(false)
                return
            }

            setEmail(inputEmail)

            const { error } = await supabase.auth.signInWithOtp({
                email: inputEmail,
                options: {
                    // set this to false if you do not want the user to be automatically signed up
                    shouldCreateUser: true,
                },
            })

            if (!error) {
                setShowOTP(true)
                setFeedback('A one-time code has been sent to your email.')
                e.currentTarget?.reset()
            } else {
                setIsError(true)
                setFeedback(error.message)
            }
            setLoading(false)
        } else {
            setLoading(true)
            setFeedback("")
            setIsError(false)

            const formData = new FormData(e.currentTarget)
            const otp = String(formData.get('otp') ?? '').trim()

            if (!otp) {
                setIsError(true)
                setFeedback('Enter the OTP code from your email.')
                setLoading(false)
                return
            }

            const {
                data: { session },
                error,
            } = await supabase.auth.verifyOtp({
                email: email,
                token: otp,
                type: 'email',
            })

            if (session && !error) {
                // localStorage.setItem("sb-access-token", JSON.stringify(session))
                router.push("/dashboard")
            } else {
                setIsError(true)
                setFeedback(error?.message ?? 'Could not verify OTP. Please try again.')
            }
            setLoading(false)
        }

    }
    return (

        <section className='relative h-full min-h-0 w-full overflow-hidden rounded-3xl bg-linear-to-br from-[#f5fbff] via-[#f1f7ff] to-[#edf9f7] p-3 dark:from-black-200 dark:via-black-100 dark:to-black-300 md:p-6'>
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(93,235,215,0.25),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(12,84,134,0.15),transparent_35%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(93,235,215,0.12),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(12,84,134,0.2),transparent_35%)]' />

            <section className='relative mx-auto flex h-full min-h-0 w-full max-w-5xl items-center justify-center'>
                <section className='grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(7,65,115,0.18)] backdrop-blur-xl dark:border-black-300 dark:bg-black-100/95 lg:grid-cols-[1.1fr_1fr]'>
                    <section className='relative flex min-h-60 flex-col justify-between bg-primary-200 p-6 text-white md:p-8'>
                        <div className='pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20' />
                        <div className='pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full border border-white/20' />

                        <div className='space-y-3'>
                            <p className='inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-[0.14em] uppercase'>
                                BP Diary Secure Access
                            </p>
                            <h1 className='text-3xl font-extrabold leading-tight md:text-4xl'>
                                Smarter blood pressure tracking starts here.
                            </h1>
                            <p className='max-w-md text-sm text-white/85 md:text-base'>
                                Sign in with your email and verify a one-time code to continue.
                            </p>
                        </div>

                        <div className='mt-6 grid grid-cols-3 gap-2 text-center text-xs font-semibold md:text-sm'>
                            <div className='rounded-xl bg-white/15 px-2 py-2'>Secure</div>
                            <div className='rounded-xl bg-white/15 px-2 py-2'>Private</div>
                            <div className='rounded-xl bg-white/15 px-2 py-2'>Fast</div>
                        </div>
                    </section>

                    <section className='p-5 md:p-8'>
                        <div className='mb-5 flex items-center justify-between'>
                            <div>
                                <p className='text-xs font-bold tracking-[0.12em] text-white-200 uppercase dark:text-white-500'>
                                    Account login
                                </p>
                                <h2 className='mt-1 text-2xl font-bold text-primary-300 dark:text-white-100'>
                                    {showOTP ? 'Verify OTP' : 'Welcome back'}
                                </h2>
                            </div>
                            <span className='rounded-full border border-primary-200/25 bg-primary-200/10 px-3 py-1 text-xs font-bold tracking-[0.08em] text-primary-200 uppercase dark:border-sec-200/30 dark:bg-sec-200/10 dark:text-sec-200'>
                                {showOTP ? 'Step 2 of 2' : 'Step 1 of 2'}
                            </span>
                        </div>

                        <div className='mb-5 flex items-center gap-2'>
                            <span className='h-1.5 flex-1 rounded-full bg-primary-200/25 dark:bg-sec-200/20' />
                            <span className={`h-1.5 flex-1 rounded-full ${showOTP ? 'bg-primary-200 dark:bg-sec-200' : 'bg-white-400 dark:bg-black-400'}`} />
                        </div>

                        <form onSubmit={login} className='space-y-4'>
                            {!showOTP && (
                                <div>
                                    <label htmlFor='email' className='labelStyle'>
                                        Email address
                                    </label>
                                    <input
                                        name='email'
                                        type='email'
                                        id='email'
                                        required
                                        placeholder='you@example.com'
                                        className='inputStyle mt-2 border border-white-300 bg-white! placeholder:text-white-500 dark:border-black-300 dark:bg-black-400!'
                                    />
                                </div>
                            )}

                            {showOTP && (
                                <div>
                                    <label htmlFor='otp' className='labelStyle'>
                                        One-time password
                                    </label>
                                    <p className='mt-2 text-sm text-white-200 dark:text-white-500'>
                                        Enter the code sent to <span className='font-semibold text-primary-200 dark:text-sec-200'>{email}</span>
                                    </p>
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        name='otp'
                                        id='otp'
                                        required
                                        placeholder='Enter 6-digit code'
                                        className='inputStyle mt-2 border border-white-300 bg-white! tracking-[0.22em] placeholder:text-white-500 dark:border-black-300 dark:bg-black-400!'
                                    />
                                </div>
                            )}

                            {feedback && (
                                <p className={`rounded-xl border px-3 py-2 text-sm ${isError ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>
                                    {feedback}
                                </p>
                            )}

                            <button
                                type='submit'
                                className='w-full cursor-pointer rounded-xl bg-primary-200 px-4 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase transition hover:bg-sec-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sec-100 dark:hover:bg-primary-200'
                                disabled={loading}
                            >
                                {loading ? 'Please wait...' : showOTP ? 'Verify and continue' : 'Send login code'}
                            </button>
                        </form>
                    </section>
                </section>
            </section>
        </section>
    )
}
