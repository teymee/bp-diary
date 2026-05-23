"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import logo from "@/assets/images/logo.svg"
import avatar from "@/assets/images/avatar.svg"
import { useEffect, useState } from "react"
import AddReading from "./component"

import plus from "@/assets/images/Plus.svg"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/providers/AuthProvider"

export default function Navbar() {
  const router = useRouter()
  const pathName = usePathname()
  const { session } = useAuth()
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    setIsMobileMenuOpen(false)
    router.push('/login')
    setIsLoggingOut(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const routes = [
    {
      name: "BP Averages",
      link: "/blood-pressure-average"
    },
       {
      name: "BP Goal",
      link: "/bp-goal"
    },
    {
      name: "All Readings",
      link: "/all-reading"
    }

  ]

  return (
    <nav className="sticky top-0 z-50 bg-white p-3 dark:bg-black-100 md:p-4">

      <section className="wrapper flex flex-wrap items-center justify-between gap-y-3">

        {/* 🚨 Logo  */}
        <Link href="/" className="flex items-center gap-x-3 text-base text-gray-700 font-medium [ dark:text-foreground ]">
          <div className="flex items-center gap-x-2">
            <Image src={logo} alt="Logo" width={23} height={23} />
            <h1 className="font-bold">BP-DIARY</h1>
          </div>
        </Link>
        {/*  */}


        {/* 🚨 NavLinks  */}

        <section className="hidden items-center gap-x-4 md:flex">

          {
            routes.map((route) => (
              <Link key={route.link} href={route.link} className={`text-sm font-semibold ${pathName === route.link ? "text-green-500 dark:text-primary-100 " : "text-gray-500 dark:text-white-200"}`}>
                {route.name}
              </Link>
            ))
          }



        </section>

        {/*  */}


        {/* 🚨 Actions  */}

        <section className="hidden items-center gap-x-4 text-sm md:flex">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle theme"
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDark ? "bg-indigo-600" : "bg-gray-300"
              }`}
          >
            {/* Sun icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute left-1 h-4 w-4 text-yellow-300 transition-opacity duration-300"
              style={{ opacity: isDark ? 0 : 1 }}
              aria-hidden="true"
            >
              <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
            </svg>

            {/* Moon icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute right-1 h-4 w-4 text-white transition-opacity duration-300"
              style={{ opacity: isDark ? 1 : 0 }}
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
            </svg>

            {/* Knob */}
            <span
              className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out ${isDark ? "translate-x-8" : "translate-x-1"
                }`}
            >
              <span className="text-[11px] leading-none select-none">
                {isDark ? "🌙" : "☀️"}
              </span>
            </span>
          </button>


          <div className="flex gap-x-2 items-center text-sm font-medium rounded-full px-3 py-1 bg-white-100 [ dark:bg-black ] ">
            <p>My Account</p>
            <Image src={avatar} alt="Avatar" width={30} height={30} className="rounded-full" />
          </div>

          <Link href="/add-reading">

            <div className="bg-primary-200 cursor-pointer px-3 flex items-center gap-x-2 rounded-full text-primary-100 py-1.5">

              <Image src={plus} alt="Avatar" width={25} height={25} className="rounded-full" />
              <p>Add Reading</p>
            </div>
          </Link>

          {session && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          )}

          {/* <div onClick={() => setIsModalOpen(!isModalOpen)} className="bg-primary-200 cursor-pointer px-3 flex items-center gap-x-2 rounded-full text-primary-100 py-1.5">
            <p>Add Reading</p>
            <Image src={add} alt="Avatar" width={25} height={25} className="rounded-full" /> 
            </div> */}
        </section>

        <section className="flex items-center gap-x-2 md:hidden">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle theme"
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDark ? "bg-indigo-600" : "bg-gray-300"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute left-1 h-4 w-4 text-yellow-300 transition-opacity duration-300"
              style={{ opacity: isDark ? 0 : 1 }}
              aria-hidden="true"
            >
              <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute right-1 h-4 w-4 text-white transition-opacity duration-300"
              style={{ opacity: isDark ? 1 : 0 }}
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
            </svg>

            <span
              className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out ${isDark ? "translate-x-8" : "translate-x-1"
                }`}
            >
              <span className="text-[11px] leading-none select-none">
                {isDark ? "🌙" : "☀️"}
              </span>
            </span>
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white-300 text-primary-200 dark:border-black-300 dark:text-white-100"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </section>

        {/*  */}
      </section>

      {isMobileMenuOpen && (
        <section className="wrapper mt-2 space-y-4 rounded-xl border border-white-300 bg-white p-3 dark:border-black-300 dark:bg-black-200 md:hidden">
          <section className="grid gap-2">
            {routes.map((route) => (
              <Link
                key={route.link}
                href={route.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${pathName === route.link ? "bg-primary-200/10 text-primary-200 dark:bg-primary-100/10 dark:text-primary-100" : "text-gray-500 dark:text-white-200"}`}
              >
                {route.name}
              </Link>
            ))}
          </section>

          <div className="flex items-center gap-x-2 rounded-full bg-white-100 px-3 py-1 text-sm font-medium dark:bg-black">
            <p>My Account</p>
            <Image src={avatar} alt="Avatar" width={30} height={30} className="rounded-full" />
          </div>

          <section className="flex flex-col gap-2">
            <Link
              href="/add-reading"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-primary-200 px-3 flex items-center justify-center gap-x-2 rounded-full text-primary-100 py-2"
            >
              <Image src={plus} alt="Add Reading" width={20} height={20} className="rounded-full" />
              <p>Add Reading</p>
            </Link>

            {session && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer rounded-full border border-red-200 px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </section>
        </section>
      )}


      <AddReading isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </nav>
  )
}
