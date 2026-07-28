'use client'
import OverviewCard from '@/components/UI/OverviewCard'
import latestReading from "@/assets/images/latest-reading.svg"

import { Dropdown } from 'primereact/dropdown';

import { MultiSelect } from 'primereact/multiselect';
import { Switch } from 'antd';

import { useEffect, useState } from 'react';
import { reminderSelectors, useReminderStore } from '@/store/reminderStore';
import EmptyState from '@/app/dashboard/components/EmptyState';

import { formatTime } from '@/utils';
import trash from "@/assets/images/Trash.svg"
import Image from 'next/image';
import Loader from '@/components/UI/Loader';
import moment from 'moment';

const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export default function Reminder() {

    const reminders = useReminderStore(reminderSelectors.reminders)
    const loading = useReminderStore(reminderSelectors.loading)
    const fetchReminders = useReminderStore(reminderSelectors.getReminders)
    const createReminder = useReminderStore(reminderSelectors.createReminder)


    const types = [
        {
            name: 'Once',
            value: 'once'
        },
        {
            name: 'Daily',
            value: 'daily'
        },
        {
            name: 'Weekly',
            value: 'weekly'
        },
    ]

    const days = [
        {
            name: 'Monday',
            value: 'monday'
        },
        {
            name: 'Tuesday',
            value: 'tuesday'
        }, {
            name: 'Wednesday',
            value: 'wednesday'
        }, {
            name: 'Thursday',
            value: 'thursday'
        }, {
            name: 'Friday',
            value: 'friday'
        }, {
            name: 'Saturday',
            value: 'saturday'
        }, {
            name: 'Sunday',
            value: 'sunday'
        }
    ]

    const [reminderType, setReminderType] = useState<"once" | "daily" | "weekly">('once')
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startToday, setStartToday] = useState<boolean>(true);
    const [enabled, setEnabled] = useState<boolean>(true);
    const [formData, setFormData] = useState({
        title: "",
        time: "",
        start_date: "",
        end_date: '',

    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const params = {
            ...formData,
            start_date: startToday ? getTodayDate() : formData.start_date,
            end_date: formData.end_date === '' ? null : formData.end_date,
            repeat_type: reminderType,
            repeat_days: selectedDays,
            is_enabled: enabled
        }

        createReminder(params)

    }

    useEffect(() => {

        fetchReminders()

    }, [fetchReminders])

    return (
        <OverviewCard image={latestReading} title="Reminder">
            <section className='flex justify-between py-4'>
                <section className="border-r-2 w-[40%] py-4">
                    <form onSubmit={handleSubmit} className='space-y-4 w-11/12'>
                        <section className="space-y-2">
                            <label htmlFor="title" className='labelStyle'>Title</label>
                            <input type="text"
                                name="title"
                                id="title"
                                className='inputStyle'
                                placeholder='Enter reminder title'
                                onChange={handleChange} />
                        </section>
                        <section className="space-y-2">
                            <label htmlFor="reminderType" className='labelStyle'>Reminder type:</label>
                            <Dropdown value={reminderType} onChange={(e) => setReminderType(e.value)}
                                options={types} optionLabel='name' placeholder="Select reminder type" className='w-full' />
                        </section>
                        <section className="space-y-2">
                            <label htmlFor="time" className='labelStyle'>Select Time</label>
                            <input type="time"
                                name="time"
                                id="time"
                                className='inputStyle'
                                placeholder='Select time' onChange={handleChange} />    </section>

                        <section className='flex justify-between border-y py-3 border-gray-300 dark:border-gray-700'>
                            <label htmlFor="startToday" className='labelStyle'>Start today?</label>
                            <Switch id="startToday" checked={startToday} onChange={(checked) => setStartToday(checked)} />
                        </section>

                        {!startToday && (
                            <section className="space-y-2">
                                <label htmlFor="start_date" className='labelStyle'>Start Date</label>
                                <input type="date"
                                    name="start_date"
                                    id="start_date"
                                    className='inputStyle'
                                    placeholder='Select start date' onChange={handleChange} />
                            </section>
                        )}

                        <section>
                            {
                                reminderType === 'daily' || reminderType === 'weekly' && (<div className="space-y-2">

                                    <div>
                                        <label htmlFor="end_date" className='labelStyle'>End Date</label>
                                        <input type="date"
                                            name="end_date"
                                            id="end_date"
                                            className='inputStyle'
                                            placeholder='Select end date' onChange={handleChange} />
                                    </div>
                                </div>)
                            }

                            {
                                reminderType === 'weekly' && (<div className="space-y-2">
                                    <label htmlFor="days" className='labelStyle'>Select Days:</label>
                                    <MultiSelect value={selectedDays} onChange={(e) => setSelectedDays(e.value)}
                                        options={days} optionLabel='name' placeholder="Select days" className='w-full' />

                                </div>)
                            }
                        </section>

                        <section className="space-y-2">
                            <section className='flex justify-between border-y py-3 border-gray-300 dark:border-gray-700'>
                                <label htmlFor="enabled" className='labelStyle'>Enable:</label>
                                <Switch id="enabled" checked={enabled} onChange={(checked) => setEnabled(checked)} />
                            </section>
                        </section>

                        {/* 🚨 Actions  */}

                        <section className='flex gap-x-4 items-center'>
                            <button type="submit" disabled={loading.create} className='px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-green-300'>
                                {loading.create ? 'Saving...' : 'Save Reminder'}
                            </button>
                            <button type="reset" className='px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg  transition-colors duration-300'>Clear</button>
                        </section>
                    </form>
                </section>


                <section className='w-[60%] p-4'>

                    {
                        loading.fetch && <Loader />
                    }

                    {
                        !loading.fetch && (
                            <section>

                                {
                                    reminders && reminders?.length > 0 ? (
                                        <section className="space-y-3">
                                            {
                                                reminders.map((reminder) => {
                                                    const { id, time, repeat_type, title, repeat_days, start_date
                                                    } = reminder ?? {}
                                                    return (
                                                        <section key={id} className='border rounded-lg p-4 flex justify-between items-center border-white-400'>
                                                            <div className="space-y-2">
                                                                <div className='flex items-center gap-x-2'>                                         <h2 className='text-[20px] font-bold'>{formatTime(time)}</h2>

                                                                    <p className='px-2 py-1 bg-white-600 rounded capitalize'>{repeat_type
                                                                    }</p>
                                                                    {repeat_type == 'once' &&
                                                                        <p className='px-2 py-1 text-sm bg-white-600 rounded capitalize'>{moment(start_date).format('D ddd, MM')
                                                                        }</p>
                                                                    }
                                                                </div>

                                                                <p className='text-white-200 text-base'>{title}</p>

                                                                {
                                                                    repeat_type == 'weekly' && (
                                                                        <div className='flex gap-2 items-center flex-wrap'>
                                                                            {
                                                                                repeat_days?.map((day: string) => (
                                                                                    <p className='px-2 py-1 text-sm capitalize bg-white-400 rounded' key={day}>{day.slice(0, 3)}</p>
                                                                                ))
                                                                            } </div>
                                                                    )
                                                                }
                                                            </div>

                                                            <div>
                                                                <button className="cursor-pointer ">                   <Image src={trash} alt="delete reminder" width={20} /></button>
                                                            </div>
                                                        </section>
                                                    )
                                                })
                                            }
                                        </section>
                                    ) : (
                                        <section>
                                            <EmptyState
                                                title="No reminder created"
                                                description="Reminders will appear here"
                                            />
                                        </section>
                                    )

                                }
                            </section>)
                    }


                </section>


            </section>
        </OverviewCard>

    )
}
