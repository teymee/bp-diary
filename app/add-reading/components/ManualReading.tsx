'use client'
import OverviewCard from '@/components/UI/OverviewCard'
import fileText from "@/assets/images/green-fileText.svg"
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast'
import { useRef, useState } from 'react'
import { Switch } from 'antd'

export default function ManualReading() {
  const router = useRouter()
  const { session, sessionLoader } = useAuth()
  const toast = useRef<Toast>(null)
  const headerTopContent = (
    <section className='flex items-center justify-between gap-x-3 pt-2'>
      <div className='flex-2 flex items-center gap-x-3 text-base text-gray-700 font-medium'>
        <Image src={fileText} alt="Latest Readings" width={50} height={50} />
        <div className='dark:text-foreground'>Latest Readings</div>
      </div>

      <div className='topContent text-xs font-medium text-gray-500 dark:text-white-200 underline underline-offset-2'>
        Upload picture instead
      </div>
    </section>
  )


  const [recordedToday, setRecordedToday] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3500,
    })
  }

  const handleAddReading = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (sessionLoader) {
      showToast('error', 'Session loading', 'Checking your session. Try again in a moment.')
      return
    }

    if (!session?.user) {
      showToast('error', 'Login required', 'You need to be logged in to save a reading.')
      return
    }
    const form = e.currentTarget

    const formData = new FormData(form)
    const systolic = Number(formData.get('systolic'))
    const diastolic = Number(formData.get('diastolic'))
    const pulseValue = formData.get('pulse')?.toString().trim() ?? ''
    const pulse = pulseValue ? Number(pulseValue) : null
    const recordedAtValue = recordedToday
      ? new Date().toISOString()
      : formData.get('datetime')?.toString().trim() ?? ''
    const note = formData.get('note')

    if (!Number.isFinite(systolic) || systolic <= 0 || !Number.isFinite(diastolic) || diastolic <= 0) {
      showToast('error', 'Invalid reading', 'Enter valid systolic and diastolic values.')
      return
    }

    if (pulse === null || !Number.isFinite(pulse) || pulse <= 0) {
      showToast('error', 'Invalid pulse', 'Enter a valid pulse value.')
      return
    }

    if (!recordedAtValue) {
      showToast('error', 'Missing time', 'Select when this reading was recorded.')
      return
    }

    const recordedAt = new Date(recordedAtValue)

    if (Number.isNaN(recordedAt.getTime())) {
      showToast('error', 'Invalid time', 'Enter a valid date and time.')
      return
    }

    setIsSubmitting(true)

    const data = {
      user_id: session.user.id,
      systolic,
      diastolic,
      pulse,
      recorded_at: recordedAt.toISOString(),
      note,
    }

    // 🚨 Streak logic 
    const { data: streakData, error: streakError } = await supabase.from('streaks').select('current_streak, longest_streak, last_recorded_at').eq('user_id', session.user.id).maybeSingle()

    if (streakError) {
      setIsSubmitting(false)
      showToast('error', 'Streak error', 'Failed to update streak. Reading will still be saved.')
      console.error('Streak fetch error:', streakError)
    } else {
      const today = new Date()
      if (streakData === null) {
        // No streak record, create one
        const { error: createError } = await supabase.from('streaks').insert({ user_id: session.user.id, current_streak: 1, longest_streak: 1, last_recorded_at: today.toISOString() })
        if (createError) {
          setIsSubmitting(false)
          showToast('error', 'Streak error', 'Failed to create streak. Reading will still be saved.')
          console.error('Streak create error:', createError)
        }
      }
      else {
        // Update existing streak
        const lastRecordedAt = new Date(streakData.last_recorded_at)
        const lastRecordISO = lastRecordedAt.toISOString().split('T')[0]
        const todayISO = today.toISOString().split('T')[0]
        if (lastRecordISO !== todayISO) {

          const diffInDays = Math.floor((today.getTime() - lastRecordedAt.getTime()) / (1000 * 60 * 60 * 24))
          let currentStreak = streakData.current_streak
          let longestStreak = streakData.longest_streak

          if (diffInDays === 1) {
            currentStreak += 1
            if (currentStreak > longestStreak) {
              longestStreak = currentStreak
            }
          } else if (diffInDays > 1) {
            currentStreak = 1
          }
          const { error: updateError } = await supabase.from('streaks').update({ current_streak: currentStreak, longest_streak: longestStreak, last_recorded_at: today.toISOString() }).eq('user_id', session.user.id)
          if (updateError) {
            setIsSubmitting(false)
            showToast('error', 'Streak error', 'Failed to update streak. Reading will still be saved.')
            console.error('Streak update error:', updateError)
          }
        }



      }
    }

    const { error } = await supabase.from('readings').insert(data)

    setIsSubmitting(false)

    if (error) {
      showToast('error', 'Save failed', error.message)
      return
    }

    form.reset()
    setRecordedToday(true)
    showToast('success', 'Reading saved', 'Your blood pressure reading has been recorded.')
    router.refresh()
  }

  return (
    <section>
      <Toast ref={toast} position='top-right' />
      <OverviewCard
        image={fileText}
        title="Latest Readings"
        topContent={headerTopContent}
      >
        <section className='p-4'>
          <form onSubmit={handleAddReading} className='space-y-4'>
            <section className='flex items-center  lg:justify-between  gap-4 [ lg:flex-row flex-col ]'>
              <div className='space-y-3 lg:w-1/2 w-full'>
                <label htmlFor="systolic" className='labelStyle'>Systolic (Top mmHg)</label>
                <input type="number"
                  name="systolic"
                  id="systolic"
                  className='inputStyle'
                  placeholder='120' />
              </div>

              <div className='space-y-3 lg:w-1/2 w-full'>
                <label htmlFor="diastolic" className='labelStyle'>Diastolic (Bottom mmHg)</label>
                <input type="number"
                  name="diastolic"
                  id="diastolic"
                  className='inputStyle'
                  placeholder='80' />
              </div>
            </section>
            <div>
              <label htmlFor="pulse" className='labelStyle'>Pulse</label>
              <input type="number"
                name="pulse"
                id="pulse"
                className='inputStyle'
                placeholder='70' />
            </div>


            {/* 🚨 Recorded today flag  */}

            <div className='flex justify-between border-y py-3 border-gray-300 dark:border-gray-700'>
              <label htmlFor="recordedToday" className='labelStyle'>Recorded Today?</label>
              <Switch
                id="recordedToday" checked={recordedToday} onChange={(checked) => setRecordedToday(checked)} />
            </div>
            {/*  */}

            {!recordedToday && (<div>
              <label htmlFor="datetime" className='labelStyle'>Date/Time</label>
              <input type="datetime-local"
                name="datetime"
                id="datetime"
                className='inputStyle'
                placeholder='Select date and time' />
            </div>)}

            <div>
              <label htmlFor="note" className='labelStyle'>Note</label>
              <textarea name="note" id="note" className='inputStyle' placeholder='Add any notes about this reading (optional)' rows={4}></textarea>
            </div>


            {/* 🚨 Actions  */}

            <section className='flex gap-x-4 items-center'>
              <button type="submit" disabled={isSubmitting || sessionLoader} className='px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-green-300'>
                {isSubmitting ? 'Saving...' : 'Save Reading'}
              </button>
              <button type="reset" className='px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg  transition-colors duration-300'>Clear</button>
            </section>


          </form>
        </section>
      </OverviewCard>
    </section>
  )
}
