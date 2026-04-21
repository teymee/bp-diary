import React, { useRef, useState } from 'react'

import CloudArrowUp from "@/assets/images/CloudArrowUp.svg"
import Image from 'next/image'
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { extractBloodPressure } from '@/app/actions'
import { getCroppedFile } from '@/utils'
export default function UploadReading() {
  const [loading, setLoading] = useState(false)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();


  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 60,
    height: 40,
    x: 20,
    y: 30
  })


  const imgRef = useRef<HTMLImageElement | null>(null)





  const inputRef = useRef<HTMLInputElement | null>(null)

  const triggerUpload = () => {
    inputRef.current?.click()

  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)

  }


  const handleExtract = async () => {
    if (!imgRef.current || !completedCrop) return;
    setLoading(true);

    try {
      // 1. Generate the cropped File
      const croppedFile = await getCroppedFile(
        imgRef.current,
        completedCrop,
        "cropped-bp-monitor.jpg"
      );

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("image", croppedFile);

      // 3. Call your Server Action (from app/actions.ts)
      const result = await extractBloodPressure(formData);

      console.log("Extracted Data:", result);
    } catch (err) {
      console.error("Extraction failed", err);
    } finally {
      setLoading(false);
    }
  };






  return (
    <section className='space-y-4'>
      <div className='text-center'>UploadReading</div>
      {/* onChange={handleFileChange} */}
      <input type="file" name="upoad" ref={inputRef} className='hidden' onChange={handleFileUpload} />
      {!imageSrc && <section onClick={triggerUpload} className='border-4 border-gray-300 border-dashed rounded-lg p-4 text-center cursor-pointer'>
        <div>

          <Image src={CloudArrowUp} alt="Upload" width={50} height={50} className='mx-auto mb-2' />
          <div>
            <h2>Click to upload or drag and drop</h2>
            <p>PNG, JPG or PDF (MAX, 5MB)</p>
          </div>
        </div>
      </section>}

      {
        imageSrc && (
          <>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
              <img ref={imgRef} src={imageSrc} alt="target" />
            </ReactCrop>

            <button onClick={handleExtract}>
              {loading ? "Processing..." : "Extract"}
            </button>
          </>)
      }


    </section>
  )
}
