"use client"

import { LoginForm } from "@/components/navigation/login-form"
import { GraduationCap } from "lucide-react"

export default function StudentLoginPage() {
  return <LoginForm role="student" icon={GraduationCap} dashboardPath="/dashboard/student" />
}
