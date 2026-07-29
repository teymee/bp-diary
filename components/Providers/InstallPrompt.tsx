"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import logo from "@/assets/images/logo.svg"

const DISMISSED_AT_KEY = "bp-diary-install-prompt-dismissed-at"
const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

function isInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as NavigatorWithStandalone).standalone)
  )
}

function wasRecentlyDismissed() {
  const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY))

  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_FOR_MS
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    const iOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

    setIsIOS(iOSDevice)

    if (!isInstalled() && iOSDevice && !wasRecentlyDismissed()) {
      setIsVisible(true)
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()

      if (isInstalled() || wasRecentlyDismissed()) return

      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      localStorage.removeItem(DISMISSED_AT_KEY)
      setDeferredPrompt(null)
      setIsVisible(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()))
    setIsVisible(false)
  }

  const install = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)

    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setIsVisible(false)
    } finally {
      setIsInstalling(false)
    }
  }

  if (!isVisible) return null

  return (
    <aside
      aria-labelledby="install-bp-diary-title"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-5 text-gray-950 shadow-[0_24px_70px_rgba(7,65,115,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-black-100/95 dark:text-white"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 dark:bg-white/10 dark:text-white-200 dark:hover:bg-white/15 dark:hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef7ff] shadow-inner dark:bg-white">
          <Image src={logo} alt="" width={27} height={34} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-200 dark:text-primary-100">
            Your health, one tap away
          </p>
          <h2
            id="install-bp-diary-title"
            className="mt-1 text-xl font-extrabold tracking-tight"
          >
            Install BP Diary
          </h2>
          <p className="mt-1.5 text-sm leading-5 text-gray-600 dark:text-white-200">
            Log readings faster and open your dashboard right from your home
            screen.
          </p>
        </div>
      </div>

      {isIOS && !deferredPrompt ? (
        <div className="mt-4 rounded-2xl bg-[#eef7ff] px-4 py-3 text-sm leading-5 text-[#074173] dark:bg-white/10 dark:text-white">
          Tap{" "}
          <span className="inline-flex items-center gap-1 font-bold">
            Share
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12 16V3m0 0L8 7m4-4 4 4" />
              <path d="M5 10v10h14V10" />
            </svg>
          </span>
          , then choose <strong>Add to Home Screen</strong>.
        </div>
      ) : (
        <button
          type="button"
          onClick={install}
          disabled={isInstalling}
          className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary-200 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-sec-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 dark:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-100/90"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
            <path d="M5 19h14" />
          </svg>
          {isInstalling ? "Opening install…" : "Install app"}
        </button>
      )}
    </aside>
  )
}
