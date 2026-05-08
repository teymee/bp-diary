'use client'
import OverviewCard from '@/components/UI/OverviewCard'
import target from "@/assets/images/target.svg"
import { Toast } from 'primereact/toast'
import { useRef, useState } from 'react'
import { readingValidation, showToast } from '@/utils'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'

export default function AddGoal() {
  const { session} = useAuth()
  const [loading, setLoading] = useState(false)

  const toast = useRef<Toast>(null)
  const handleAddGoal = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const goalName = formData.get('goalName')
    const systolic = Number(formData.get('systolic'))
    const diastolic = Number(formData.get('diastolic'))
    const pulse = Number(formData.get('pulse'))
    const endDate = formData.get('endDate')
    const note = formData.get('note')

    const validations = [
      {
        isInvalid: !goalName,
        summary: 'Missing goal name',
        detail: 'Enter a name for this goal.',
      },
      {
        isInvalid: !endDate,
        summary: 'Missing end date',
        detail: 'Select an end date for this goal.',
      },
    ]

    for (const validation of validations) {
      if (!validation.isInvalid) {
        continue
      }

      showToast(toast, 'error', validation.summary, validation.detail)
      return
    }


    readingValidation({ toast, session: session?.user?.id ?? null, sys: systolic, dia: diastolic, pulse })
    setLoading(true)
    const data = {
      user_id: session?.user?.id,
      goal_name: goalName,
      systolic,
      diastolic,
      pulse,
      end_date: endDate,
      note
    }
    const { error } = await supabase
      .from('goals')
      .insert(data)

    if (error) {
      showToast(
        toast,
        'error',
        'Error setting goal',
        error.message
      )
      setLoading(false)
      return
    }

    showToast(
      toast,
      'success',
      'Goal set',
      'Your goal has been saved.'
    )
    form.reset()

  }


  return (
    <section>
      <Toast ref={toast} position='top-right' />
      <OverviewCard
        image={target}
        title="Set Your Goal"
      >
        <section className='p-4'>
          <form onSubmit={handleAddGoal} className='space-y-4'>
            <div>
              <label htmlFor="goalName" className='labelStyle'>Goal name</label>
              <input type="text"
                name="goalName"
                id="goalName"
                className='inputStyle'
                placeholder='Enter your goal name' />
            </div>
            <section className='flex items-center gap-x-4 justify-between'>

              <div className='space-y-3 w-1/2'>
                <label htmlFor="systolic" className='labelStyle'>Target Systolic </label>
                <input type="number"
                  name="systolic"
                  id="systolic"
                  className='inputStyle'
                  placeholder='120' />
              </div>

              <div className='space-y-3 w-1/2'>
                <label htmlFor="diastolic" className='labelStyle'>Target Diastolic </label>
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

            <div>
              <label htmlFor="endDate" className='labelStyle'>End Date</label>
              <input type="date"
                name="endDate"
                id="endDate"
                className='inputStyle'
                placeholder='Select end date' />
            </div>

            <div>
              <label htmlFor="note" className='labelStyle'>Note</label>
              <textarea name="note" id="note" className='inputStyle' placeholder='Add any notes about this reading (optional)' rows={4}></textarea>
            </div>


            {/* 🚨 Actions  */}

            <section className='flex gap-x-4 items-center'>
              <button type="submit" className='px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300'>{loading ? 'Loading...' : 'Set Goal'}</button>
              <button type="reset" className='px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg  transition-colors duration-300'>Clear</button>
            </section>


          </form>
        </section>
      </OverviewCard>
    </section>
  )
}
