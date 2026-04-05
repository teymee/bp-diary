'use client'
import Image from 'next/image'

import heart from "@/assets/images/heart.svg"
import star from "@/assets/images/star.svg"
import blackHeart from "@/assets/images/black-heart.svg"
import OverviewCard from './OverviewCard'

export default function HeartComponent() {
    return (
        <section className='space-y-4 '>
            <div>
                <h3 className='font-semibold text-base'>Welcome <span className='text-primary-200 font-bold'>My Account</span></h3>
                <h1 className='font-bold text-[36px]'>Overview Of Your Health</h1>
            </div>

            <section className='relative'>
                <div className='heart-beat'>
                    <Image src={heart} alt="Light modeHeart" className='dark:hidden' />
                    <Image src={blackHeart} alt=" Dark mode Heart" className='hidden dark:block' />
                </div>

                <section className='absolute -bottom-20 left-0 w-52'>

                    <OverviewCard image={star} title="Your Heart Analysis">
                        <div className='h-20 text-white-200 text-sm'>
                            <p>mmhg</p>
                        </div>
                    </OverviewCard>
                </section>

                <section className='absolute -bottom-20 right-0 w-60'>
                    <section className='bg-white border border-white-300 space-y-2 text-sm font-medium px-2.5 py-3 rounded-2xl [ dark:border-black-300 dark:bg-black-200 ]'>
                        <div className='bg-white-100 dark:bg-black-100 py-2 px-4 rounded-xl'>
                            <p>Gender : Male</p>
                        </div>

                        <div className='bg-white-100 dark:bg-black-100 py-2 px-4 rounded-xl'>
                            <p>Age : 30</p>
                        </div>
                    </section>
                </section>

            </section>
        </section>
    )
}
