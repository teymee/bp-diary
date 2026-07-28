'use client'
import Reminder from './components/Reminder'
import Tips from './components/Tips'

export default function page() {
    return (
        <section className="flex flex-1 flex-col space-y-10">

            <div><h1 className='text-3xl font-semibold sm:text-4xl'>Reminders</h1></div>

            <section className="flex lg:flex-row flex-col  gap-x-4 min-h-screen py-2">
                <section className="lg:w-[70%] w-full">
                    <Reminder />
                </section>
                <section className="lg:w-[30%] w-full">
                    <Tips />
                </section>
            </section>

        </section>

    )
}
