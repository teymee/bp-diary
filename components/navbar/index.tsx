"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import logo from "@/assets/images/logo.svg"
import avatar from "@/assets/images/avatar.svg"
import add from "@/assets/images/add.svg"
import { use, useEffect, useState } from "react"
import AddReading from "./component"

import plus from "@/assets/images/Plus.svg"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { link } from "fs"

export default function Navbar() {
  const pathName = usePathname()
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const routes = [
    {
      name: "BP Averages",
      link: "/blood-pressure-average"
    },
       {
      name: "BP Goals",
      link: "/blood-pressure-goals"
    },
    {
      name: "All Readings",
      link: "/all-reading"
    }

  ]

  return (
    <nav className="bg-white sticky  top-0 [ dark:bg-black-100 ] p-4 ">

      <section className="wrapper flex justify-between items-center ">

        {/* 🚨 Logo  */}
        <Link href="/" className="flex items-center gap-x-3 text-base text-gray-700 font-medium [ dark:text-foreground ]">
          <div className="flex items-center gap-x-2">
            <Image src={logo} alt="Logo" width={23} height={23} />
            <h1 className="font-bold">BP-DIARY</h1>
          </div>
        </Link>
        {/*  */}


        {/* 🚨 NavLinks  */}

        <section className="flex gap-x-4 items-center">

          {
            routes.map((route) => (
              <Link key={route.link} href={route.link} className={`text-sm font-medium ${pathName === route.link ? "text-primary-100 " : "text-gray-500 dark:text-white-200"}`}>
                {route.name}
              </Link>
            ))
          }



        </section>

        {/*  */}


        {/* 🚨 Actions  */}

        <section className="flex gap-x-4 items-center text-sm">
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

          <Link href="/add-reading" >

            <div className="bg-primary-200 cursor-pointer px-3 flex items-center gap-x-2 rounded-full text-primary-100 py-1.5">

              <Image src={plus} alt="Avatar" width={25} height={25} className="rounded-full" />
              <p>Add Reading</p>
            </div>
          </Link>

          {/* <div onClick={() => setIsModalOpen(!isModalOpen)} className="bg-primary-200 cursor-pointer px-3 flex items-center gap-x-2 rounded-full text-primary-100 py-1.5">
            <p>Add Reading</p>
            <Image src={add} alt="Avatar" width={25} height={25} className="rounded-full" /> 
            </div> */}
        </section>

        {/*  */}
      </section>


      <AddReading isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </nav>
  )
}
