"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("BP Diary service worker registration failed:", error)
    })
  }, [])

  return null
}
