import OverviewCard from '@/components/UI/OverviewCard'
import key from "@/assets/images/key.svg"
import SealCheck from "@/assets/images/SealCheck.svg"
import info from "@/assets/images/Info.svg"
import Image from 'next/image'

export default function ReadingTips() {

    const tips = [
        {
            title: "Two Readings Daily",
            description: "It is often recommended to take readings once in the morning (before eating or taking medication) and once in the evening."
        },
        {
            title: "The Double Check",
            description: "Many clinicians suggest taking two readings at each sitting, about 1–2 minutes apart, and recording the average."
        },
        {
            title: "Contextual Notes",
            description: "These are vital for explaining 'outlier' numbers. Briefly note factors such as stress levels or recent exercise, caffeine or alcohol consumption, missed medications, and symptoms like headaches or dizziness."
        }
    ]

    const bestPractices = [
        {
            title: "Rest First",
            description: "Sit quietly for 5 minutes before taking a reading."
        },
        {
            title: "Positioning",
            description: "Sit with your back supported, feet flat on the floor (legs uncrossed), and your arm supported at heart level."
        },
        {
            title: "Consistency",
            description: "Use the same arm every time, as readings can vary between the left and right."
        }
    ]
    return (
        <section className='space-y-4'>

            <OverviewCard image={key} title="Key Elements to Include">
                <ul className='list-disc pl-5 space-y-4 py-4'>
                    {
                        tips.map((tip, index) => (
                            <li key={index} className='text-sm'>
                                <h3 className='font-semibold text-gray-700 dark:text-foreground'>{tip.title}</h3>
                                <p className='text-sm text-gray-500 dark:text-white-200'>{tip.description}</p>
                            </li>
                        ))
                    }
                </ul>

            </OverviewCard>
            <OverviewCard image={SealCheck} title="Best Practices">
                <ul className='list-disc pl-5 space-y-4 py-4'>
                    {
                        bestPractices.map((practice, index) => (
                            <li key={index} className='text-sm'>
                                <h3 className='font-semibold text-gray-700 dark:text-foreground'>{practice.title}</h3>
                                <p className='text-sm text-gray-500 dark:text-white-200'>{practice.description}</p>
                            </li>
                        ))
                    }
                </ul>
            </OverviewCard>

            <OverviewCard >
                <section className='space-y-2 py-4'>
                    <div className='flex items-center gap-x-2'>
                        <Image src={info} alt="Information" width={25} height={25} />
                        <h3 className='font-semibold text-gray-700 dark:text-foreground'>Important Note:</h3>
                    </div>
                    <p className='text-sm pl-8 text-gray-500 dark:text-white-200'>If you ever record a reading where the top number is 180 or higher, or the bottom number is 120 or higher, wait five minutes and test again. If it remains that high, seek medical attention immediately.</p>
                </section>


            </OverviewCard>
        </section>
    )
}
