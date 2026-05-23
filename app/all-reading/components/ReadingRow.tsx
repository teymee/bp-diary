'use client'

import Image from "next/image";
import { formatDate, getLevelImage } from "@/utils"
import { ReadingType } from "@/utils/types"


export default function ReadingRow({ reading }: { reading: ReadingType }) {
    const { diastolic, note, pulse, recorded_at, source, systolic } = reading

    return (
        <section className="flex flex-col gap-3 rounded-lg border border-white-400 px-4 py-3 text-white-200 dark:border-black-400 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-2">
                <p className="text-sm font-semibold">{formatDate(recorded_at, "MMM Do, YYYY, hh:mma")}</p>
                <section className="flex flex-wrap items-center gap-3 text-black dark:text-white-100 sm:gap-4">
                    <h1 className="flex items-center gap-x-1 text-xl font-bold sm:text-2xl">{systolic} / {diastolic} <span className="text-sm text-white-200">mmhg</span></h1>
                    <p className="flex items-center gap-x-1 text-xl font-bold sm:text-2xl">{pulse} <span className="text-sm text-white-200">bpm</span></p>
                </section>

                {note && <p className="mt-1 border-l-3 py-1 pl-2 text-sm wrap-break-word">{note}</p>}
            </div>

            <div className="space-y-1 self-start text-left sm:self-center sm:text-right">
                <Image src={getLevelImage(systolic, diastolic, pulse)} alt="BP Level" className="h-auto " />
                <p className="capitalize ">{source}</p>
            </div>
        </section>
    )
}
