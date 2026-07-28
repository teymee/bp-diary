'use client'

import { useEffect, useState } from 'react'
import { Switch } from 'antd'
import Image from 'next/image'

import OverviewCard from '@/components/UI/OverviewCard'
import reminder from '@/assets/images/reminder.svg'

export default function Tips() {
  const [permission, setPermission] = useState('default')
  const [isSupported, setIsSupported] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!('Notification' in window)) {
      setIsSupported(false)
      return
    }

    setPermission(Notification.permission)
  }, [])

  const handlePermissionChange = async (checked) => {
    setFeedback('')

    if (!checked) {
      setFeedback('You can turn notifications off in your browser settings.')
      return
    }

    if (!isSupported) {
      setFeedback('Notifications are not supported by this browser.')
      return
    }

    if (permission === 'denied') {
      setFeedback('Notifications are blocked. Allow them in your browser settings.')
      return
    }

    setIsRequesting(true)

    try {
      const nextPermission = await Notification.requestPermission()
      setPermission(nextPermission)
      setFeedback(
        nextPermission === 'granted'
          ? 'Notifications are enabled.'
          : 'Notification permission was not enabled.'
      )
    } catch {
      setFeedback('Unable to request notification permission. Please try again.')
    } finally {
      setIsRequesting(false)
    }
  }

  const statusMessage = !isSupported
    ? 'This browser does not support notifications.'
    : permission === 'granted'
      ? 'You will receive alerts for your enabled reminders.'
      : permission === 'denied'
        ? 'Notifications are blocked in your browser settings.'
        : 'Enable notifications so reminders can alert you on this device.'

  return (
    <OverviewCard image={reminder} title="Tips">
      <section className="space-y-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <Image src={reminder} alt="" width={24} height={24} aria-hidden />
            <div className="space-y-1">
              <label htmlFor="notification-permission" className="font-semibold text-gray-700 dark:text-foreground">
                Reminder notifications
              </label>
              <p className="text-sm text-gray-500 dark:text-white-200">
                {statusMessage}
              </p>
            </div>
          </div>

          <Switch
            id="notification-permission"
            checked={permission === 'granted'}
            disabled={!isSupported || isRequesting}
            loading={isRequesting}
            onChange={handlePermissionChange}
            aria-label="Enable reminder notifications"
          />
        </div>

        {feedback && (
          <p className="text-sm text-gray-500 dark:text-white-200" role="status" aria-live="polite">
            {feedback}
          </p>
        )}
      </section>
    </OverviewCard>
  )
}
