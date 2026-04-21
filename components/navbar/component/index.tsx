'use client'

import { useState } from "react"
import { Modal, Upload } from 'antd';

import fileText from "@/assets/images/fileText.svg"
import camera from "@/assets/images/camera.svg"
import Image from "next/image";
import UploadReading from "./UploadReading";
type AddReadingProps = {
    isModalOpen: boolean
    setIsModalOpen: (isOpen: boolean) => void

}

export default function AddReading({ isModalOpen, setIsModalOpen }: AddReadingProps) {
    const [readingType, setReadingType] = useState<"manual" | "upload" | null>(null)

    const handleCancel = () => {
        setIsModalOpen(false)
        setReadingType(null)
    }
    return (
        <Modal
            title="Basic Modal"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={1000}
            mask={{ closable: true }}
        >
            <div className="text-center">Add Reading</div>

            {
                readingType === null && (
                    <section className="w-[70%] mx-auto flex justify-between items-center">
                        <button onClick={() => setReadingType('manual')} className="bg-white cursor-pointer rounded-xl flex flex-col items-center justify-center">
                            <Image src={fileText} alt=" Add New Reading Manually" />

                            <p>Add New Reading Manually</p>
                        </button>

                        <button onClick={() => setReadingType('upload')} className="bg-white cursor-pointer rounded-xl flex flex-col items-center justify-center">
                            <Image src={camera} alt=" Add New Reading Manually" />

                            <p>Upload Picture of reading</p>
                        </button>
                    </section>
                )
            }

            {/* {
                readingType === "manual" && <ManualReading />

            } */}

            {
                readingType === "upload" && <UploadReading />

            }



        </Modal>



    )
}
