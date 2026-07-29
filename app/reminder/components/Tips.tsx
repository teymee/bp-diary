"use client";

import { useEffect, useState } from "react";
import { Switch } from "antd";
import Image from "next/image";

import OverviewCard from "@/components/UI/OverviewCard";
import reminder from "@/assets/images/reminder.svg";
import { getUserId } from "@/utils";
import { disablePushNotification, enablePushNotification } from "@/lib/service-worker-utils";

export default function Tips() {
  const [permission, setPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [statusMessage, setStatusMessage] = useState("")

  const handlePermissionChange = async () => {
    const userId = await getUserId()

    if (permission) {

      if (userId) {
        try {
          const response = await enablePushNotification(userId)
          if (response) setPermission(true)
        } catch (error) {
          console.log(error)
          // setStatusMessage(error)

        }
      }
    } else {
      disablePushNotification()
    }
  };

  useEffect(() => {
    const checkNotification = async () => {

      const registration = await navigator.serviceWorker.ready;

      const subscription =
        await registration.pushManager.getSubscription();
      if (subscription) {
        setPermission(true)
      } else {
        setPermission(false)
      }

    }

    checkNotification()


  }, [])





  return (
    <OverviewCard image={reminder} title="Tips">
      <section className="space-y-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <Image src={reminder} alt="" width={24} height={24} aria-hidden />
            <div className="space-y-1">
              <label
                htmlFor="notification-permission"
                className="font-semibold text-gray-700 dark:text-foreground"
              >
                Reminder notifications
              </label>
              <p className="text-sm text-gray-500 dark:text-white-200">
                {statusMessage}
              </p>
            </div>
          </div>

          <Switch
            id="notification-permission"
            checked={permission}
            disabled={!isSupported || isRequesting}
            loading={isRequesting}
            onChange={handlePermissionChange}
            aria-label="Enable reminder notifications"
          />
        </div>

        {feedback && (
          <p
            className="text-sm text-gray-500 dark:text-white-200"
            role="status"
            aria-live="polite"
          >
            {feedback}
          </p>
        )}
      </section>
    </OverviewCard>
  );
}
