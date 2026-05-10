"use client";

import { useAuth } from "@/providers/AuthProvider";
import { redirect } from "next/navigation";

export default function Home() {
    const { sessionLoader, session } = useAuth()
    if (!sessionLoader && session) {
        redirect("/dashboard")
    } else if (!sessionLoader && !session) {
        redirect("/login")
    }

}
