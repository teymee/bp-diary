import OverviewCard from '@/components/UI/OverviewCard'
import crosshair from "@/assets/images/crosshair.svg"
import { getLevelColor } from '@/utils'

export default function GoalInfo() {

    const tips = [
        {
            title: "Normal",
            color: getLevelColor("normal"),
            description: "Less than 120/80 mmHg - Ideal range for most adults"
        },
        {
            title: "Elevated",
            color: getLevelColor("elevated"),
            description: "120-129 systolic and less than 80 diastolic - At risk"
        },
        {
            title: "Hypertension Stage 1",
            color: getLevelColor("hbp1"),
            description: "130-139 systolic or 80-89 diastolic - At risk"
        },
        {
            title: "Hypertension Stage 2",
            color: getLevelColor("hbp2"),
            description: "140/90 mmHg or higher - High risk"
        },
    ]


    const bestPractices = [

        {

            description: "Work with your healthcare provider to set appropriate targets"
        },
        {
            description: "Aim for gradual improvements rather than dramatic changes"
        },
        {
            description: "Consider your age, overall health, and medical history"
        },
        {
            description: "Track progress over weeks and months, not days"
        },
        {
            description: "Celebrate small victories along the way"
        }
    ]
    return (
        <section className='space-y-4'>

            <OverviewCard image={crosshair} title="Understanding BP Goals">
                <ul className='list-disc pl-5 space-y-4 py-4'>
                    {
                        tips.map((tip, index) => (
                            <li key={index} className='text-sm'>
                                <h3 className='font-semibold text-gray-700 dark:text-foreground' style={{ color: tip.color }}>{tip.title}</h3>
                                <p className='text-sm text-gray-500 dark:text-white-200'>{tip.description}</p>
                            </li>
                        ))
                    }
                </ul>

            </OverviewCard>
            <OverviewCard image={crosshair} title="Setting Realistic Goals">
                <ul className='list-disc pl-5 space-y-4 py-2'>
                    {
                        bestPractices.map((practice, index) => (
                            <li key={index} className='text-sm'>
                                <p className='text-sm text-gray-500 dark:text-white-200'>{practice.description}</p>
                            </li>
                        ))
                    }
                </ul>
            </OverviewCard>


        </section>
    )

}
