/**
 * OctoCampus API Client
 * A typed HTTP client for the Express backend at http://localhost:4000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
const TOKEN_KEY = "oc_token"

// ─── Token helpers ───────────────────────────────────────────────
export function getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}

// ─── Core fetch wrapper ──────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(body.error || `HTTP ${res.status}`)
    }

    return res.json() as Promise<T>
}

// ─── Types ───────────────────────────────────────────────────────
export interface AuthUser {
    id: string
    email: string
    role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "CLUB"
}

export interface LoginResponse {
    token: string
    user: AuthUser
}

export interface Student {
    id: string
    externalId: string
    name: string
    department: string
    year: number
    hostel: boolean
    attendance: number
    cgpa: number
    photo: string
    user?: { email: string }
}

export interface Teacher {
    id: string
    externalId: string
    name: string
    department: string
    subject: string
    experience: number
    user?: { email: string }
}

export interface Announcement {
    id: string
    externalId: string
    title: string
    content: string
    author: string
    date: string
    priority: "low" | "medium" | "high"
}

export interface Event {
    id: string
    externalId: string
    title: string
    club: string
    date: string
    description: string
    status: "upcoming" | "past" | "ongoing"
    registrations: number
}

export interface Request {
    id: string
    externalId: string
    type: string
    fromName: string
    date: string
    reason: string
    status: "pending" | "approved" | "rejected"
}

export interface Fee {
    id: string
    externalId: string
    type: string
    amount: number
    dueDate: string
    status: "pending" | "paid"
}

export interface Mark {
    id: string
    subject: string
    internal1: number
    internal2: number
    assignment: number
    total: number
    grade: string
    studentId: string
}

export interface AttendanceRecord {
    id: string
    date: string
    subject: string
    status: "present" | "absent"
    studentId: string
}

export interface Club {
    id: string
    externalId: string
    name: string
    accent: string
    members: number
    description: string
}

export interface TimetableEntry {
    id: string
    role: string
    day: string
    slots: Array<{ subject: string; room: string }>
}

export interface Notification {
    id: string
    title: string
    message: string
    time: string
    read: boolean
}

// ─── Auth API ────────────────────────────────────────────────────
export const auth = {
    login: (email: string, password: string) =>
        apiFetch<LoginResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    me: () => apiFetch<AuthUser>("/api/auth/me"),
}

// ─── Students API ────────────────────────────────────────────────
export const studentsApi = {
    list: () => apiFetch<Student[]>("/api/students"),
    me: () => apiFetch<Student & { marks: Mark[]; attendanceRecords: AttendanceRecord[] }>("/api/students/me"),
    get: (id: string) => apiFetch<Student>(`/api/students/${id}`),
    update: (id: string, data: Partial<Student>) =>
        apiFetch<Student>(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
}

// ─── Teachers API ────────────────────────────────────────────────
export const teachersApi = {
    list: () => apiFetch<Teacher[]>("/api/teachers"),
    me: () => apiFetch<Teacher>("/api/teachers/me"),
    get: (id: string) => apiFetch<Teacher>(`/api/teachers/${id}`),
}

// ─── Announcements API ───────────────────────────────────────────
export const announcementsApi = {
    list: () => apiFetch<Announcement[]>("/api/announcements"),
    get: (id: string) => apiFetch<Announcement>(`/api/announcements/${id}`),
    create: (data: Omit<Announcement, "id" | "externalId">) =>
        apiFetch<Announcement>("/api/announcements", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/announcements/${id}`, { method: "DELETE" }),
}

// ─── Events API ──────────────────────────────────────────────────
export const eventsApi = {
    list: () => apiFetch<Event[]>("/api/events"),
    get: (id: string) => apiFetch<Event>(`/api/events/${id}`),
    create: (data: Omit<Event, "id" | "externalId">) =>
        apiFetch<Event>("/api/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Event>) =>
        apiFetch<Event>(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/events/${id}`, { method: "DELETE" }),
}

// ─── Requests API ────────────────────────────────────────────────
export const requestsApi = {
    list: () => apiFetch<Request[]>("/api/requests"),
    create: (data: { type: string; fromName: string; date: string; reason: string }) =>
        apiFetch<Request>("/api/requests", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: "approved" | "rejected" | "pending") =>
        apiFetch<Request>(`/api/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    delete: (id: string) => apiFetch<void>(`/api/requests/${id}`, { method: "DELETE" }),
}

// ─── Fees API ────────────────────────────────────────────────────
export const feesApi = {
    list: () => apiFetch<Fee[]>("/api/fees"),
    listAll: () => apiFetch<Fee[]>("/api/fees/all"),
    pay: (id: string) => apiFetch<Fee>(`/api/fees/${id}/pay`, { method: "PATCH" }),
}

// ─── Marks API ───────────────────────────────────────────────────
export const marksApi = {
    list: (studentId?: string) =>
        apiFetch<Mark[]>(`/api/marks${studentId ? `?studentId=${studentId}` : ""}`),
    update: (id: string, data: Partial<Mark>) =>
        apiFetch<Mark>(`/api/marks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
}

// ─── Attendance API ──────────────────────────────────────────────
export const attendanceApi = {
    list: (studentId?: string) =>
        apiFetch<AttendanceRecord[]>(`/api/attendance${studentId ? `?studentId=${studentId}` : ""}`),
    create: (data: { studentId: string; date: string; subject: string; status: "present" | "absent" }) =>
        apiFetch<AttendanceRecord>("/api/attendance", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, status: "present" | "absent") =>
        apiFetch<AttendanceRecord>(`/api/attendance/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }),
}

// ─── Clubs API ───────────────────────────────────────────────────
export const clubsApi = {
    list: () => apiFetch<Club[]>("/api/clubs"),
    get: (id: string) => apiFetch<Club>(`/api/clubs/${id}`),
    create: (data: Omit<Club, "id" | "externalId">) =>
        apiFetch<Club>("/api/clubs", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Club>) =>
        apiFetch<Club>(`/api/clubs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/clubs/${id}`, { method: "DELETE" }),
}

// ─── Timetable API ───────────────────────────────────────────────
export const timetableApi = {
    list: () => apiFetch<TimetableEntry[]>("/api/timetable"),
    listByRole: (role: string) => apiFetch<TimetableEntry[]>(`/api/timetable/${role}`),
}

// ─── Notifications API ───────────────────────────────────────────
export const notificationsApi = {
    list: () => apiFetch<Notification[]>("/api/notifications"),
    markRead: (id: string) => apiFetch<Notification>(`/api/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () => apiFetch<{ message: string }>("/api/notifications/read-all", { method: "PATCH" }),
}
