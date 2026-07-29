"use client"
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
    useEffect(() => {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/service-worker.js")
        } else {
            throw new Error("Service workers are not supported.");

        }


    }, [])

    return null
}
