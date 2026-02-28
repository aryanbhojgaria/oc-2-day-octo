"use client"

import { LoginForm } from "@/components/navigation/login-form"
import { Palette } from "lucide-react"

export default function ClubLoginPage() {
  return <LoginForm role="club" icon={Palette} dashboardPath="/dashboard/club" />
}
