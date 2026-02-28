"use client"

import { LoginForm } from "@/components/navigation/login-form"
import { BookOpen } from "lucide-react"

export default function TeacherLoginPage() {
  return <LoginForm role="teacher" icon={BookOpen} dashboardPath="/dashboard/teacher" />
}
