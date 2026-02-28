"use client"

import { LoginForm } from "@/components/navigation/login-form"
import { Heart } from "lucide-react"

export default function ParentLoginPage() {
  return <LoginForm role="parent" icon={Heart} dashboardPath="/dashboard/parent" />
}
