"use client"
import OverviewCard from '@/components/UI/OverviewCard'
import Image from 'next/image'
import Lock from "@/assets/images/Lock.svg"
import share from "@/assets/images/share.svg"
import MicrosoftExcelLogo from "@/assets/images/MicrosoftExcelLogo.svg"
import FileCode from "@/assets/images/FileCode.svg"

export default function ExportTool() {
    const exportTool = [
        {
            icon: MicrosoftExcelLogo,
            title: "Export as CSV",
            desc: "Best for spreadsheet apps like Excel or Google Sheets. Easy to sort and filter.",
            type: "csv"
        },
        {
            icon: FileCode,
            title: "Export as JSON",
            desc: "Structured data format. Ideal for developers or importing to other apps.",
            type: "json"
        },
        {
            icon: MicrosoftExcelLogo,
            title: "Export as PDF",
            desc: "Best for sharing or printing. Maintains formatting and layout.",
            type: "pdf"
        },

    ]

    const handleExport = (type: string) => {
        console.log(`Exporting data as ${type}`)
    }

    return (
        <section className='space-y-4'>

            <OverviewCard image={share} title="Export Data">

                <section className='space-y-2 py-4 px-2'>
                    <p>Choose a format to export your blood pressure data:</p>

                    <section>
                        {
                            exportTool.map((tool) => (
                                <section key={tool.type} className='flex items-center gap-x-2 py-3 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer'
                                    onClick={() => handleExport(tool.type)}>
                                    <Image src={tool.icon} alt={`${tool.title} icon`} width={40} height={40} />
                                    <div className='space-y-1'>
                                        <h3 className='font-semibold text-gray-700 dark:text-foreground'>{tool.title}</h3>
                                        <p className='text-sm text-gray-500 dark:text-white-200'>{tool.desc}</p>
                                    </div>
                                </section>
                            ))
                        }
                    </section>
                </section>

            </OverviewCard>

            <OverviewCard >
                <section className='space-y-2 py-4'>
                    <div className='flex items-center gap-x-2'>
                        <Image src={Lock} alt="Information" width={25} height={25} />
                        <h3 className='font-semibold text-gray-700 dark:text-foreground'>Your Privacy Matters</h3>
                    </div>
                    <p className='text-sm pl-8 text-gray-500 dark:text-white-200'>All your blood pressure data is stored locally on your device. When you  export data, files are generated and downloaded directly to your  computer. No data is sent to external servers. Remember to keep exported files secure and only share them with trusted healthcare providers.</p>
                </section>


            </OverviewCard>
        </section>
    )
}
