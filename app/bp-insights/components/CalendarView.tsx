'use client'
import React, { useState, useMemo } from 'react'
import { readingsSelectors, useReadingStore } from '@/store/readingsStore'
import { ReadingType } from '@/utils/types'
import { getLevelColor, getLevelImage, readingsCategories } from '@/utils'
import OverviewCard from '@/components/UI/OverviewCard'
import { Sidebar } from 'primereact/sidebar'
import { useCalendarStore } from '@/store/calendarStore'

type DayGridType = {
    date: Date
    isCurrentMonth: boolean
    readings: ReadingType[]
}

const pad2 = (value: number) => String(value).padStart(2, '0')

const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = pad2(date.getMonth() + 1)
    const day = pad2(date.getDate())
    return `${year}-${month}-${day}`
}

const parseLocalDateKey = (key: string) => {
    const [year, month, day] = key.split('-').map(Number)
    return new Date(year, month - 1, day)
}

const getReadingCategoryMeta = (reading: ReadingType) => {
    const categoryLabel = getLevelImage(reading.systolic, reading.diastolic, reading.pulse, 'text')
    const categoryEntry = readingsCategories.find((item) => item.label === categoryLabel)
    const categoryKey = categoryEntry?.value
    const categoryColor = categoryKey ? getLevelColor(categoryKey) : undefined

    return {
        categoryLabel: categoryLabel ?? 'Unknown',
        categoryColor: categoryColor ?? '#A9B0BD',
    }
}

const getCompactCategoryLabel = (label: string) => {
    if (label === 'High Blood Pressure (Stage 1)') return 'HBP-1'
    if (label === 'High Blood Pressure (Stage 2)') return 'HBP-2'
    if (label === 'Elevated') return 'ELEV'
    if (label === 'Normal') return 'NORM'
    return 'UNK'
}

export default function CalendarView() {
    const readings = useReadingStore(readingsSelectors.readings)
    const selectedDate = useCalendarStore((state) => state.selectedDate)
    const resetDateFilter = useCalendarStore((state) => state.resetDate)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const hasActiveRangeFilter = Boolean(selectedDate?.from && selectedDate?.to)

    // Group readings by day (using recorded_at as the canonical time)
    const readingsByDay = useMemo(() => {
        if (!readings) return new Map<string, ReadingType[]>()

        const map = new Map<string, ReadingType[]>()
        readings.forEach((reading) => {
            const recordedDate = new Date(reading.recorded_at)
            const key = getLocalDateKey(recordedDate)
            if (!map.has(key)) {
                map.set(key, [])
            }
            map.get(key)!.push(reading)
        })

        // Sort readings within each day by time
        map.forEach((dayReadings) => {
            dayReadings.sort((a, b) => {
                const timeA = new Date(a.recorded_at).getTime()
                const timeB = new Date(b.recorded_at).getTime()
                return timeA - timeB
            })
        })

        return map
    }, [readings])

    // Generate calendar grid for the month
    const calendarDays = useMemo(() => {
        const activeDate = selectedDate?.from ? new Date(selectedDate.from) : currentDate
        const year = activeDate.getFullYear()
        const month = activeDate.getMonth()

        // First day of the month and last day
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        // Determine starting position (0 = Sunday, 6 = Saturday)
        const startDayOfWeek = firstDay.getDay()

        // Collect days from previous month to fill the grid
        const daysArray: DayGridType[] = []

        // Add leading days from previous month
        if (startDayOfWeek > 0) {
            const prevLastDay = new Date(year, month, 0).getDate()
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const date = new Date(year, month - 1, prevLastDay - i)
                daysArray.push({
                    date,
                    isCurrentMonth: false,
                    readings: readingsByDay.get(getLocalDateKey(date)) || [],
                })
            }
        }

        // Add days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day)
            const key = getLocalDateKey(date)
            daysArray.push({
                date,
                isCurrentMonth: true,
                readings: readingsByDay.get(key) || [],
            })
        }

        // Add trailing days from next month to complete the grid
        const remainingDays = 42 - daysArray.length // 6 rows × 7 days
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i)
            daysArray.push({
                date,
                isCurrentMonth: false,
                readings: readingsByDay.get(getLocalDateKey(date)) || [],
            })
        }

        return daysArray
    }, [selectedDate, currentDate, readingsByDay])

    const goToPreviousMonth = () => {
        const activeDate = selectedDate?.from ? new Date(selectedDate.from) : currentDate
        const nextMonth = new Date(activeDate.getFullYear(), activeDate.getMonth() - 1)

        if (selectedDate?.from || selectedDate?.to) {
            resetDateFilter()
        }

        setCurrentDate(nextMonth)
    }

    const goToNextMonth = () => {
        const activeDate = selectedDate?.from ? new Date(selectedDate.from) : currentDate
        const nextMonth = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1)

        if (selectedDate?.from || selectedDate?.to) {
            resetDateFilter()
        }

        setCurrentDate(nextMonth)
    }

    const monthName = (selectedDate?.from ? new Date(selectedDate.from) : currentDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const legendItems = useMemo(() => {
        return readingsCategories.map((item) => ({
            label: item.label,
            color: getLevelColor(item.value) ?? '#A9B0BD',
        }))
    }, [])

    const selectedDayReadings = useMemo(() => {
        if (!selectedDayKey) return []
        return readingsByDay.get(selectedDayKey) ?? []
    }, [selectedDayKey, readingsByDay])

    const selectedDayDate = useMemo(() => {
        if (!selectedDayKey) return null
        return parseLocalDateKey(selectedDayKey)
    }, [selectedDayKey])

    const handleDaySelect = (dayKey: string) => {
        setSelectedDayKey(dayKey)
        setIsDetailsOpen(true)
    }

    const isDateWithinSelectedRange = (date: Date) => {
        if (!selectedDate?.from || !selectedDate?.to) return true

        const fromDate = new Date(
            selectedDate.from.getFullYear(),
            selectedDate.from.getMonth(),
            selectedDate.from.getDate(),
        )
        const toDate = new Date(
            selectedDate.to.getFullYear(),
            selectedDate.to.getMonth(),
            selectedDate.to.getDate(),
        )
        const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        return targetDate >= fromDate && targetDate <= toDate
    }

    const selectedDayTitle = selectedDayDate
        ? selectedDayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null

    const renderReadingDetails = (reading: ReadingType) => {
        const time = new Date(reading.recorded_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })?.toLowerCase()
        const { categoryLabel, categoryColor } = getReadingCategoryMeta(reading)

        return (
            <div key={`details-${reading.id}`} className='rounded border border-blue-200 bg-blue-50 px-2 py-1.5 text-blue-900 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-100'>
                <div className='font-semibold'>{time}</div>
                <div>{reading.systolic}/{reading.diastolic} mmHg • {reading.pulse} bpm</div>
                <div className='mt-0.5 flex items-center gap-1'>
                    <span className='h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/20' style={{ backgroundColor: categoryColor }} />
                    <span className='truncate'>{categoryLabel}</span>
                </div>
                {reading.note && <div className='mt-0.5 truncate opacity-85'>{reading.note}</div>}
                <div className='mt-0.5 capitalize opacity-80'>{reading.source}</div>
            </div>
        )
    }

    return (
        <section className='w-full flex-1'>
            <OverviewCard noPadding>
                <div className='flex flex-col h-full'>
                    {/* Header with month and navigation */}
                    <div className='flex items-center justify-between border-b border-white-300 px-3 py-4 dark:border-white/15 sm:px-6'>
                        <h2 className='text-lg font-semibold sm:text-2xl'>{monthName}</h2>
                        <div className='flex gap-2'>
                            <button
                                onClick={goToPreviousMonth}
                                className='rounded-lg bg-white-100 p-2 text-sm transition-colors hover:bg-white-200 dark:bg-black-100 dark:hover:bg-black-200 sm:text-base'
                                aria-label='Previous month'
                            >
                                ←
                            </button>
                            <button
                                onClick={goToNextMonth}
                                className='rounded-lg bg-white-100 p-2 text-sm transition-colors hover:bg-white-200 dark:bg-black-100 dark:hover:bg-black-200 sm:text-base'
                                aria-label='Next month'
                            >
                                →
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white-300 bg-white-100 px-3 py-2 dark:border-white/15 dark:bg-black-100 sm:px-6'>
                        <span className='text-[10px] font-semibold uppercase tracking-wide text-white-300 dark:text-black-400 sm:text-xs'>Legend</span>
                        {legendItems.map((item) => (
                            <div key={item.label} className='flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-2 py-1 text-[10px] dark:border-white/15 dark:bg-white/5 sm:text-xs'>
                                <span className='h-2 w-2 rounded-full border border-black/10 dark:border-white/20' style={{ backgroundColor: item.color }} />
                                <span className='text-foreground/85'>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid + details panel */}
                    <div className='flex flex-1 flex-col overflow-hidden'>
                        <div className='flex-1 overflow-x-auto'>
                            <div className='min-w-190'>
                                <div className='grid grid-cols-7 gap-1 border-b border-white-300 bg-white-100 px-3 py-3 dark:border-white/15 dark:bg-black-100 sm:px-6'>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                                        <div key={dayName} className='text-center text-[10px] font-semibold text-foreground/70 sm:text-sm'>
                                            {dayName}
                                        </div>
                                    ))}
                                </div>

                                <div className='grid flex-1 grid-cols-7 gap-1 px-3 py-3 sm:px-6'>
                                    {calendarDays.map((day, idx) => {
                                        const dayKey = getLocalDateKey(day.date)
                                        const isSelected = selectedDayKey === dayKey
                                        const isInFilteredRange = isDateWithinSelectedRange(day.date)
                                        const canSelectDay = !hasActiveRangeFilter || isInFilteredRange

                                        return (
                                            <button
                                                key={idx}
                                                type='button'
                                                onClick={() => canSelectDay && handleDaySelect(dayKey)}
                                                disabled={!canSelectDay}
                                                className={`flex min-h-20 flex-col gap-1 rounded-lg border p-2 text-left transition-colors sm:min-h-24 ${day.isCurrentMonth
                                                        ? 'bg-white border-white-300 hover:bg-white-50 dark:bg-black-200 dark:border-white/20 dark:hover:bg-black-100'
                                                        : 'bg-white-50 border-white-200 hover:bg-white-100 dark:bg-black-300 dark:border-white/12 dark:hover:bg-black-200'
                                                    } ${isSelected ? 'ring-2 ring-black/15 dark:ring-white/30' : ''} ${!canSelectDay ? 'cursor-not-allowed opacity-45' : ''}`}
                                            >
                                                <div className='flex items-center justify-between gap-2'>
                                                    <div className={`text-xs font-semibold ${day.isCurrentMonth ? 'text-foreground' : 'text-foreground/45'}`}>
                                                        {day.date.getDate()}
                                                    </div>

                                                    {day.readings.length > 0 && (
                                                        <div className='rounded-full bg-white-100 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/60 dark:bg-black-100'>
                                                            {day.readings.length}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='flex-1'>
                                                    <div className='space-y-1'>
                                                        {day.readings.map((reading) => {
                                                            const compactTime = new Date(reading.recorded_at).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })?.toLowerCase()
                                                            const { categoryLabel, categoryColor } = getReadingCategoryMeta(reading)
                                                            const compactCategory = getCompactCategoryLabel(categoryLabel)

                                                            return (
                                                                <div
                                                                    key={reading.id}
                                                                    className='rounded border border-blue-200 bg-blue-50 px-1.5 py-1 font-mono text-[10px] text-blue-900 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-100 sm:text-xs'
                                                                    title={`${compactTime} • ${categoryLabel}`}
                                                                >
                                                                    <div className='flex items-center gap-1.5 leading-tight'>
                                                                        <span className='truncate'>{compactTime}</span>
                                                                        <span className='h-3 w-3 rounded-full border border-black/10 dark:border-white/20' style={{ backgroundColor: categoryColor }} />
                                                                        <span className='text-[9px] font-semibold sm:text-[10px]'>
                                                                            {compactCategory}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </OverviewCard>

            <Sidebar
                visible={isDetailsOpen}
                onHide={() => setIsDetailsOpen(false)}
                position='right'
                className='w-full lg:w-175 border-l border-white-300 dark:border-white/15 [&_.p-sidebar-header]:border-b [&_.p-sidebar-header]:border-white-300 dark:[&_.p-sidebar-header]:border-white/15'
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                showCloseIcon
                dismissable
                blockScroll
                appendTo='self'
            >
                <div className='flex h-full flex-col'>
                    <div className='mb-3 border-b border-white-300 pb-2 dark:border-white/15'>
                        <h3 className='text-base font-semibold'>
                            {selectedDayTitle ?? 'Day details'}
                        </h3>
                        <p className='text-xs text-foreground/65'>
                            {selectedDayReadings.length} reading{selectedDayReadings.length === 1 ? '' : 's'}
                        </p>
                    </div>

                    <div className='space-y-2 overflow-y-auto pr-1'>
                        {selectedDayReadings.length === 0 && (
                            <div className='text-sm text-foreground/60'>No readings recorded for this day.</div>
                        )}

                        {selectedDayReadings.map((reading) => renderReadingDetails(reading))}
                    </div>
                </div>
            </Sidebar>
        </section>
    )
}
