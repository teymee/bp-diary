"use client"
import OverviewCard from '@/components/UI/OverviewCard'
import Image from 'next/image'
import Lock from "@/assets/images/Lock.svg"
import share from "@/assets/images/share.svg"
import MicrosoftExcelLogo from "@/assets/images/MicrosoftExcelLogo.svg"
import FileCode from "@/assets/images/FileCode.svg"
import { exportToCsv, exportToJson, getLevelImage } from '@/utils'
import { readingsSelectors, useReadingStore } from '@/store/readingsStore'
import moment from 'moment'
import { useCalendarStore } from '@/store/calendarStore'


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReadingType } from '@/utils/types'


export default function ExportTool() {
    const exportTool = [
        {
            icon: MicrosoftExcelLogo,
            title: "Export as CSV",
            desc: "Best for spreadsheet apps like Excel or Google Sheets. Easy to sort and filter.",
            type: "csv"
        },

        {
            icon: MicrosoftExcelLogo,
            title: "Export as PDF",
            desc: "Best for sharing or printing. Maintains formatting and layout.",
            type: "pdf"
        },

        {
            icon: FileCode,
            title: "Export as JSON",
            desc: "Structured data format. Ideal for developers or importing to other apps.",
            type: "json"
        },

    ]
    const selectedDate = useCalendarStore((state) => state.selectedDate)

    const reverseReadings = useReadingStore(readingsSelectors.readings)
    if (!reverseReadings) return
    const readings = reverseReadings.reverse()


    const handleExport = (type: string) => {
        const data = readings.map((reading) => ({
            Date: moment(reading.created_at).format("DD MMM YYYY"),
            Time: moment(reading.created_at).format("hh:mm A"),
            Systolic: reading.systolic,
            Diastolic: reading.diastolic,
            Pulse: reading.pulse,
            Result: getLevelImage(reading.systolic, reading.diastolic, reading.pulse, 'text'),
            Notes: reading.note || "N/A",
        }))


        const jsonData = readings.map((r) => ({
            // id: r.id,
            date: r.created_at,
            systolic: r.systolic,
            diastolic: r.diastolic,
            pulse: r.pulse,
            notes: r.note,
        }))
        if (type === "csv") {
            exportToCsv(data, `blood_pressure_data_(${selectedDate ? `${moment(selectedDate.from).format("DD MMM,YYYY")}-${moment(selectedDate.to).format("DD MMM,YYYY")}` : "all"}).csv`)
        }

        if (type === 'pdf') {
            generatePdf(readings)
        }

        if (type === 'json') {

            exportToJson(jsonData, `blood_pressure_data_(${selectedDate ? `${moment(selectedDate.from).format("DD MMM,YYYY")}-${moment(selectedDate.to).format("DD MMM,YYYY")}` : "all"}).json`)
        }
    }

    const generatePdf = (readings: ReadingType[]) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Blood Pressure Report (${selectedDate ? `${moment(selectedDate.from).format("DD MMM,YYYY")}-${moment(selectedDate.to).format("DD MMM,YYYY")}` : "All Readings"})`, 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [["Date", "Time", "BP", "Pulse", "Result", "Notes"]],
            body: readings.map((reading) => [
                moment(reading.created_at).format("DD MMM YYYY"),
                moment(reading.created_at).format("hh:mm A"),
                `${reading.systolic}/${reading.diastolic}`,
                reading.pulse,
                getLevelImage(reading.systolic, reading.diastolic, reading.pulse, 'text'),
                reading.note || "N/A"
            ]),
        });

        doc.save(`blood_pressure_data_(${selectedDate ? `${moment(selectedDate.from).format("DD MMM,YYYY")}-${moment(selectedDate.to).format("DD MMM,YYYY")}` : "all"}).pdf`);
    };

    return (
        <section className='space-y-3 md:space-y-4'>

            <OverviewCard image={share} title="Export Data">

                <section className='space-y-3 px-1 py-3 sm:px-2 sm:py-4'>
                    <p className='text-sm text-gray-600 dark:text-white-200 sm:text-base'>Choose a format to export your blood pressure data:</p>

                    <section>
                        {
                            exportTool.map((tool) => (
                                <section
                                    key={tool.type}
                                    className='flex cursor-pointer flex-col items-start gap-3 rounded-lg px-3 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 sm:flex-row sm:items-center'
                                    onClick={() => handleExport(tool.type)}>
                                    <Image src={tool.icon} alt={`${tool.title} icon`} width={40} height={40} className='h-8 w-8 sm:h-10 sm:w-10' />
                                    <div className='space-y-1'>
                                        <h3 className='text-sm font-semibold text-gray-700 dark:text-foreground sm:text-base'>{tool.title}</h3>
                                        <p className='text-sm text-gray-500 dark:text-white-200'>{tool.desc}</p>
                                    </div>
                                </section>
                            ))
                        }
                    </section>
                </section>

            </OverviewCard>

            <OverviewCard >
                <section className='space-y-2 py-3 sm:py-4'>
                    <div className='flex items-center gap-x-2'>
                        <Image src={Lock} alt="Information" width={25} height={25} />
                        <h3 className='text-sm font-semibold text-gray-700 dark:text-foreground sm:text-base'>Your Privacy Matters</h3>
                    </div>
                    <p className='pl-0 text-xs leading-6 text-gray-500 dark:text-white-200 sm:pl-8 sm:text-sm'>All your blood pressure data is stored locally on your device. When you export data, files are generated and downloaded directly to your computer. No data is sent to external servers. Remember to keep exported files secure and only share them with trusted healthcare providers.</p>
                </section>


            </OverviewCard>
        </section>
    )
}
