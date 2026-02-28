"use client"

import { LoginForm } from "@/components/navigation/login-form"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  return <LoginForm role="admin" icon={Shield} dashboardPath="/dashboard/admin" />
}
