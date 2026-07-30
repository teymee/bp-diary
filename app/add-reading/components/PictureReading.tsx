'use client'

import { extractBloodPressure } from '@/app/actions'
import CloudArrowUp from '@/assets/images/CloudArrowUp.svg'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react'

type ExtractedReading = {
  systolic: number
  diastolic: number
  pulse: number
}

type UploadStatus = 'ready' | 'processing' | 'complete' | 'error'

type UploadItem = {
  id: string
  file: File
  name: string
  src: string
  recordedAt: string
  note: string
  status: UploadStatus
  result: ExtractedReading | null
  error: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error(`Could not open ${file.name}`))
    reader.readAsDataURL(file)
  })

const localDateTimeNow = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

export default function PictureReading() {
  const router = useRouter()
  const { session, sessionLoader } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [batchError, setBatchError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedCount, setSavedCount] = useState(0)

  const selectedUpload = useMemo(
    () => uploads.find((upload) => upload.id === selectedId) ?? uploads[0] ?? null,
    [selectedId, uploads],
  )
  const completedUploads = uploads.filter((upload) => upload.status === 'complete' && upload.result)
  const canSave = uploads.length > 0 && completedUploads.length === uploads.length

  const selectFiles = async (files: File[]) => {
    setBatchError('')
    setSaveError('')
    setSavedCount(0)

    const remainingSlots = MAX_FILES - uploads.length
    if (remainingSlots <= 0) {
      setBatchError(`You can upload up to ${MAX_FILES} pictures at a time.`)
      return
    }

    const accepted: File[] = []
    const problems: string[] = []

    files.slice(0, remainingSlots).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        problems.push(`${file.name} is not a supported image.`)
      } else if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name} is larger than 5 MB.`)
      } else {
        accepted.push(file)
      }
    })

    if (files.length > remainingSlots) {
      problems.push(`Only the first ${remainingSlots} picture${remainingSlots === 1 ? '' : 's'} were added.`)
    }

    const newUploads = (
      await Promise.all(
        accepted.map(async (file): Promise<UploadItem | null> => {
          try {
            return {
              id: crypto.randomUUID(),
              file,
              name: file.name,
              src: await readFile(file),
              recordedAt: localDateTimeNow(),
              note: '',
              status: 'ready',
              result: null,
              error: '',
            }
          } catch {
            problems.push(`We could not open ${file.name}.`)
            return null
          }
        }),
      )
    ).filter((upload): upload is UploadItem => upload !== null)

    setUploads((current) => [...current, ...newUploads])
    setSelectedId((current) => current ?? newUploads[0]?.id ?? null)
    if (problems.length) setBatchError(problems.join(' '))
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await selectFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    await selectFiles(Array.from(event.dataTransfer.files ?? []))
  }

  const removeUpload = (id: string) => {
    const next = uploads.filter((upload) => upload.id !== id)
    setUploads(next)
    if (selectedId === id) setSelectedId(next[0]?.id ?? null)
    setSavedCount(0)
  }

  const updateResult = (id: string, field: keyof ExtractedReading, value: string) => {
    setUploads((current) =>
      current.map((upload) =>
        upload.id === id && upload.result
          ? { ...upload, result: { ...upload.result, [field]: Number(value) } }
          : upload,
      ),
    )
  }

  const updateDetails = (id: string, field: 'recordedAt' | 'note', value: string) => {
    setUploads((current) =>
      current.map((upload) => (upload.id === id ? { ...upload, [field]: value } : upload)),
    )
    setSavedCount(0)
  }

  const processPictures = async () => {
    if (!uploads.length) return

    setIsProcessing(true)
    setBatchError('')
    setSaveError('')
    setSavedCount(0)

    for (const upload of uploads) {
      setUploads((current) =>
        current.map((item) =>
          item.id === upload.id ? { ...item, status: 'processing', error: '', result: null } : item,
        ),
      )

      try {
        const formData = new FormData()
        formData.append('image', upload.file)
        const extracted = await extractBloodPressure(formData)

        if ('error' in extracted) {
          setUploads((current) =>
            current.map((item) =>
              item.id === upload.id
                ? { ...item, status: 'error', error: extracted.error, result: null }
                : item,
            ),
          )
          continue
        }

        const result = {
          systolic: Number(extracted.systolic),
          diastolic: Number(extracted.diastolic),
          pulse: Number(extracted.pulse),
        }

        if (!Object.values(result).every((value) => Number.isFinite(value) && value > 0)) {
          setUploads((current) =>
            current.map((item) =>
              item.id === upload.id
                ? {
                    ...item,
                    status: 'error',
                    error: 'We could not clearly read all three values.',
                    result: null,
                  }
                : item,
            ),
          )
          continue
        }

        setUploads((current) =>
          current.map((item) =>
            item.id === upload.id ? { ...item, status: 'complete', result, error: '' } : item,
          ),
        )
      } catch {
        setUploads((current) =>
          current.map((item) =>
            item.id === upload.id
              ? { ...item, status: 'error', error: 'Reading this picture failed. Try again.', result: null }
              : item,
          ),
        )
      }
    }

    setIsProcessing(false)
  }

  const updateStreak = async (recordedAt: Date, userId: string) => {
    const { data: streak } = await supabase
      .from('streaks')
      .select('id, current_streak, longest_streak, last_recorded_at')
      .eq('user_id', userId)
      .order('last_recorded_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle()

    if (!streak) {
      await supabase.from('streaks').insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_recorded_at: recordedAt.toISOString(),
      })
      return
    }

    const readingDay = new Date(recordedAt.getFullYear(), recordedAt.getMonth(), recordedAt.getDate())
    const lastDate = streak.last_recorded_at ? new Date(streak.last_recorded_at) : null
    const lastDay = lastDate
      ? new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
      : null
    const diffInDays = lastDay
      ? Math.round((readingDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    if (lastDay && diffInDays <= 0) return

    const currentStreak =
      diffInDays === 1 ? streak.current_streak + 1 : diffInDays > 1 ? 1 : streak.current_streak

    await supabase
      .from('streaks')
      .update({
        current_streak: currentStreak,
        longest_streak: Math.max(streak.longest_streak, currentStreak),
        last_recorded_at: recordedAt.toISOString(),
      })
      .eq('id', streak.id)
  }

  const saveReadings = async () => {
    setSaveError('')
    setSavedCount(0)

    if (sessionLoader) {
      setSaveError('Your session is still loading. Try again in a moment.')
      return
    }
    if (!session?.user) {
      setSaveError('You need to be logged in to save these readings.')
      return
    }
    if (!canSave) {
      setSaveError('Read every picture successfully before saving.')
      return
    }

    if (completedUploads.some((upload) => !upload.recordedAt)) {
      setSaveError('Choose a date and time for every reading.')
      return
    }

    const results = completedUploads.map((upload) => upload.result as ExtractedReading)
    if (
      results.some((reading) =>
        Object.values(reading).some((value) => !Number.isFinite(value) || value <= 0),
      )
    ) {
      setSaveError('Check that every extracted value is a valid positive number.')
      return
    }

    setIsSaving(true)
    const { error } = await supabase.from('readings').insert(
      completedUploads.map((upload) => ({
        user_id: session.user.id,
        systolic: upload.result!.systolic,
        diastolic: upload.result!.diastolic,
        pulse: upload.result!.pulse,
        recorded_at: new Date(upload.recordedAt).toISOString(),
        note: upload.note.trim() || null,
        source: 'image',
      })),
    )

    if (error) {
      setIsSaving(false)
      setSaveError(error.message)
      return
    }

    const distinctRecordedDays = Array.from(
      new Map(
        completedUploads
          .map((upload) => new Date(upload.recordedAt))
          .sort((a, b) => a.getTime() - b.getTime())
          .map((date) => [date.toDateString(), date]),
      ).values(),
    )
    for (const recordedAt of distinctRecordedDays) {
      await updateStreak(recordedAt, session.user.id)
    }
    setIsSaving(false)
    setSavedCount(results.length)
    router.refresh()
  }

  return (
    <section className='p-4 sm:p-6'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-5'>
          <p className='text-lg font-semibold text-gray-900 dark:text-white'>Upload your monitor pictures</p>
          <p className='mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400'>
            Add up to {MAX_FILES} clear pictures, then review the values before saving them together.
          </p>
        </div>

        <input
          ref={inputRef}
          type='file'
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className='sr-only'
          onChange={handleFileChange}
          aria-label='Choose blood pressure monitor pictures'
        />

        <div
          role='button'
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`group flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center outline-none transition ${
            uploads.length ? 'min-h-32 py-5' : 'min-h-72 flex-col py-10'
          } ${
            isDragging
              ? 'border-green-500 bg-green-50 ring-4 ring-green-100 dark:bg-green-950/20 dark:ring-green-900/40'
              : 'border-gray-300 bg-white hover:border-green-500 hover:bg-green-50/50 focus-visible:border-green-500 focus-visible:ring-4 focus-visible:ring-green-100 dark:border-gray-700 dark:bg-black-200 dark:hover:border-green-500 dark:hover:bg-green-950/20 dark:focus-visible:ring-green-900/40'
          }`}
        >
          <span className={`${uploads.length ? 'mr-4 size-14' : 'mb-5 size-20'} grid shrink-0 place-items-center rounded-full bg-green-100 transition-transform group-hover:-translate-y-1 dark:bg-green-950/60`}>
            <Image src={CloudArrowUp} alt='' width={uploads.length ? 32 : 48} height={uploads.length ? 32 : 48} className='dark:invert' />
          </span>
          <div className={uploads.length ? 'text-left' : ''}>
            <p className='text-base font-semibold text-gray-900 dark:text-white'>
              {uploads.length ? 'Add more pictures' : 'Drop your pictures here'}
            </p>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {uploads.length ? `${uploads.length} of ${MAX_FILES} selected` : 'or click to browse your device'}
            </p>
            {!uploads.length && (
              <>
                <span className='mt-5 inline-block rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-green-700'>
                  Choose pictures
                </span>
                <p className='mt-4 text-xs text-gray-400 dark:text-gray-500'>JPG, PNG, or WebP · 5 MB each</p>
              </>
            )}
          </div>
        </div>

        {batchError && (
          <div role='alert' className='mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200'>
            {batchError}
          </div>
        )}

        {uploads.length > 0 && (
          <>
            <div className='mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]'>
              <div className='overflow-hidden rounded-2xl bg-gray-950'>
                {selectedUpload && (
                  <div className='flex min-h-72 items-center justify-center p-3 sm:min-h-96 sm:p-5'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedUpload.src} alt={`Preview of ${selectedUpload.name}`} className='max-h-96 max-w-full rounded-lg object-contain' />
                  </div>
                )}
              </div>

              <div className='max-h-96 space-y-2 overflow-y-auto pr-1'>
                {uploads.map((upload, index) => (
                  <div
                    key={upload.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelectedId(upload.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedId(upload.id)
                      }
                    }}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2 text-left transition ${
                      selectedUpload?.id === upload.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-black-200'
                    }`}
                  >
                    <span className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={upload.src} alt='' className='size-full object-cover' />
                    </span>
                    <span className='min-w-0 flex-1'>
                      <span className='block truncate text-sm font-semibold text-gray-900 dark:text-white'>
                        {index + 1}. {upload.name}
                      </span>
                      <span className={`mt-0.5 block text-xs ${
                        upload.status === 'complete'
                          ? 'text-green-600'
                          : upload.status === 'error'
                            ? 'text-red-600'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {upload.status === 'ready' && 'Ready to read'}
                        {upload.status === 'processing' && 'Reading picture…'}
                        {upload.status === 'complete' && 'Values found'}
                        {upload.status === 'error' && 'Needs attention'}
                      </span>
                    </span>
                    <button
                      type='button'
                      aria-label={`Remove ${upload.name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        removeUpload(upload.id)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          event.stopPropagation()
                          removeUpload(upload.id)
                        }
                      }}
                      className='grid size-8 shrink-0 place-items-center rounded-lg text-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type='button'
              onClick={processPictures}
              disabled={isProcessing || isSaving}
              className='mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-wait disabled:bg-green-400'
            >
              {isProcessing && <span className='size-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />}
              {isProcessing
                ? `Reading ${uploads.filter((upload) => upload.status === 'complete').length + 1} of ${uploads.length}…`
                : `Read ${uploads.length} picture${uploads.length === 1 ? '' : 's'}`}
            </button>
          </>
        )}

        {uploads.some((upload) => upload.status === 'error') && (
          <div className='mt-4 space-y-2'>
            {uploads.filter((upload) => upload.status === 'error').map((upload) => (
              <div key={upload.id} role='alert' className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'>
                <span className='font-semibold'>{upload.name}:</span> {upload.error}
              </div>
            ))}
          </div>
        )}

        {completedUploads.length > 0 && (
          <section className='mt-6'>
            <div className='mb-3 flex items-end justify-between gap-4'>
              <div>
                <h3 className='font-semibold text-gray-900 dark:text-white'>Review each reading</h3>
                <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>Correct the values and add when each picture was taken.</p>
              </div>
              <span className='shrink-0 text-xs font-semibold text-green-600'>{completedUploads.length} of {uploads.length} ready</span>
            </div>
            <div className='space-y-3'>
              {completedUploads.map((upload, index) => (
                <div key={upload.id} className='rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-black-200'>
                  <p className='mb-3 truncate text-sm font-semibold text-gray-900 dark:text-white'>{index + 1}. {upload.name}</p>
                  <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                    {([
                      ['Systolic', 'systolic', 'mmHg'],
                      ['Diastolic', 'diastolic', 'mmHg'],
                      ['Pulse', 'pulse', 'bpm'],
                    ] as const).map(([label, field, unit]) => (
                      <label key={field} className='rounded-xl bg-gray-100 p-2 text-center dark:bg-black-400 sm:p-3'>
                        <span className='block text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs'>{label}</span>
                        <input
                          type='number'
                          min='1'
                          value={upload.result?.[field] ?? ''}
                          onChange={(event) => updateResult(upload.id, field, event.target.value)}
                          className='mt-1 w-full bg-transparent text-center text-lg font-bold text-gray-900 outline-none focus:text-green-700 dark:text-white dark:focus:text-green-400 sm:text-xl'
                        />
                        <span className='block text-[10px] text-gray-400'>{unit}</span>
                      </label>
                    ))}
                  </div>
                  <div className='mt-4 grid gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:grid-cols-2'>
                    <label className='block'>
                      <span className='labelStyle'>Date and time recorded</span>
                      <input
                        type='datetime-local'
                        value={upload.recordedAt}
                        max={localDateTimeNow()}
                        required
                        onChange={(event) => updateDetails(upload.id, 'recordedAt', event.target.value)}
                        className='inputStyle'
                      />
                    </label>
                    <label className='block'>
                      <span className='labelStyle'>Note</span>
                      <textarea
                        value={upload.note}
                        onChange={(event) => updateDetails(upload.id, 'note', event.target.value)}
                        rows={2}
                        placeholder='Add context for this reading (optional)'
                        className='inputStyle resize-y'
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {saveError && (
          <div role='alert' className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'>
            {saveError}
          </div>
        )}

        {savedCount > 0 && (
          <div role='status' className='mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-200'>
            {savedCount} reading{savedCount === 1 ? '' : 's'} saved with their individual dates, times, and notes.
          </div>
        )}

        <button
          type='button'
          onClick={saveReadings}
          disabled={!canSave || isSaving || isProcessing || sessionLoader || savedCount > 0}
          className='mt-4 w-full cursor-pointer rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400'
        >
          {savedCount > 0
            ? 'Readings saved'
            : isSaving
            ? 'Saving readings…'
            : canSave
              ? `Save ${uploads.length} reading${uploads.length === 1 ? '' : 's'}`
              : 'Read all pictures to continue'}
        </button>

        <div className='mt-5 flex items-start gap-2 rounded-xl bg-gray-100 px-4 py-3 text-xs leading-5 text-gray-600 dark:bg-gray-800/70 dark:text-gray-300'>
          <span aria-hidden='true' className='mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-gray-500 text-[10px] font-bold text-white'>i</span>
          Pictures are used only to read the numbers. Always review every extracted value before saving.
        </div>
      </div>
    </section>
  )
}
