"use client";

import { getLocalStorageService } from "@/utils";
import { redirect } from "next/navigation";

export default function Home() {
 const user = getLocalStorageService("sb-access-token");
 if (!user) {
   redirect("/login");
 }else{
  redirect("/dashboard");
 }
}
