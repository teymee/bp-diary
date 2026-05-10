'use client'

import Image from "next/image";
import { formatDate, getLevelImage } from "@/utils"
import { ReadingType } from "@/utils/types"


export default function ReadingRow({ reading }: { reading: ReadingType }) {
    const { diastolic, id, note, pulse, recorded_at, source, systolic, user_id } = reading

    return (
        <section  className="flex border border-white-400 dark:border-black-400 py-2 px-4 rounded-lg justify-between items-center text-white-200">
            <div className="space-y-2">
                <p className="font-semibold text-sm ">{formatDate(recorded_at, "MMM Do, YYYY, hh:mma")}</p>
                <section className="flex text-black dark:text-white-100 gap-x-4 items-center">
                    <h1 className="text-2xl font-bold  flex items-center gap-x-1 ">{systolic} / {diastolic} <span className="text-white-200 text-sm">mmhg</span></h1>
                    <p className="text-2xl font-bold  flex items-center gap-x-1 " >{pulse} <span className="text-white-200 text-sm">bpm</span></p>
                </section>

                {note && <p className="text-sm mt-1 border-l-3 py-1 pl-2">{note}</p>}
            </div>

            <div className="text-right space-y-1">
                <Image src={getLevelImage(systolic, diastolic, pulse)} alt="BP Level" />
                <p className="capitalize ">{source}</p>
            </div>
        </section>
    )
}
