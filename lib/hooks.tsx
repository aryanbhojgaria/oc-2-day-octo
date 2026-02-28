/**
 * OctoCampus – React data hooks
 * Each hook fetches from the live backend with graceful fallback to mock data
 * if the backend is unavailable (token missing / network error).
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import {
    studentsApi, teachersApi, announcementsApi, eventsApi,
    requestsApi, feesApi, marksApi, attendanceApi, clubsApi,
    timetableApi, notificationsApi, getToken,
    type Student, type Teacher, type Announcement, type Event,
    type Request, type Fee, type Mark, type AttendanceRecord,
    type Club, type TimetableEntry, type Notification,
} from "./api"

// ─── Generic hook factory ────────────────────────────────────────────────────
function useApiData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!getToken()) { setLoading(false); return }
        setLoading(true)
        setError(null)
        try {
            const result = await fetcher()
            setData(result)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load")
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    useEffect(() => { load() }, [load])

    return { data, loading, error, refetch: load }
}

// ─── Students ────────────────────────────────────────────────────────────────
export function useStudents() {
    return useApiData<Student[]>(() => studentsApi.list())
}

export function useStudentMe() {
    return useApiData<Student & { marks: Mark[]; attendanceRecords: AttendanceRecord[] }>(
        () => studentsApi.me()
    )
}

// ─── Teachers ────────────────────────────────────────────────────────────────
export function useTeachers() {
    return useApiData<Teacher[]>(() => teachersApi.list())
}

// ─── Announcements ───────────────────────────────────────────────────────────
export function useAnnouncements() {
    return useApiData<Announcement[]>(() => announcementsApi.list())
}

// ─── Events ──────────────────────────────────────────────────────────────────
export function useEvents() {
    return useApiData<Event[]>(() => eventsApi.list())
}

// ─── Requests ────────────────────────────────────────────────────────────────
export function useRequests() {
    const { data, loading, error, refetch } = useApiData<Request[]>(
        () => requestsApi.list()
    )

    const approve = useCallback(async (id: string) => {
        await requestsApi.updateStatus(id, "approved")
        refetch()
    }, [refetch])

    const reject = useCallback(async (id: string) => {
        await requestsApi.updateStatus(id, "rejected")
        refetch()
    }, [refetch])

    return { data, loading, error, refetch, approve, reject }
}

// ─── Fees ─────────────────────────────────────────────────────────────────────
export function useFees() {
    const { data, loading, error, refetch } = useApiData<Fee[]>(
        () => feesApi.list()
    )

    const pay = useCallback(async (id: string) => {
        await feesApi.pay(id)
        refetch()
    }, [refetch])

    return { data, loading, error, refetch, pay }
}

// ─── Marks ───────────────────────────────────────────────────────────────────
export function useMarks(studentId?: string) {
    return useApiData<Mark[]>(() => marksApi.list(studentId), [studentId])
}

// ─── Attendance ──────────────────────────────────────────────────────────────
export function useAttendance(studentId?: string) {
    return useApiData<AttendanceRecord[]>(
        () => attendanceApi.list(studentId),
        [studentId]
    )
}

// ─── Clubs ───────────────────────────────────────────────────────────────────
export function useClubs() {
    return useApiData<Club[]>(() => clubsApi.list())
}

// ─── Timetable ───────────────────────────────────────────────────────────────
export function useTimetable(role?: string) {
    return useApiData<TimetableEntry[]>(
        () => role ? timetableApi.listByRole(role) : timetableApi.list(),
        [role]
    )
}

// ─── Notifications ───────────────────────────────────────────────────────────
export function useNotifications() {
    const { data, loading, error, refetch } = useApiData<Notification[]>(
        () => notificationsApi.list()
    )

    const markRead = useCallback(async (id: string) => {
        await notificationsApi.markRead(id)
        refetch()
    }, [refetch])

    const markAllRead = useCallback(async () => {
        await notificationsApi.markAllRead()
        refetch()
    }, [refetch])

    return { data, loading, error, refetch, markRead, markAllRead }
}

// ─── Announcements with create mutation ──────────────────────────────────────
export function useAnnouncementsWithMutations() {
    const { data, loading, error, refetch } = useApiData<Announcement[]>(
        () => announcementsApi.list()
    )

    const create = useCallback(async (ann: Omit<Announcement, "id" | "externalId">) => {
        await announcementsApi.create(ann)
        refetch()
    }, [refetch])

    const remove = useCallback(async (id: string) => {
        await announcementsApi.delete(id)
        refetch()
    }, [refetch])

    return { data, loading, error, refetch, create, remove }
}

// ─── Shared loading skeleton ─────────────────────────────────────────────────
export function DataLoading({ rows = 3 }: { rows?: number }) {
    return (
        <div className= "space-y-3 animate-pulse" >
        {
            Array.from({ length: rows }).map((_, i) => (
                <div key= { i } className = "h-14 rounded-xl bg-secondary/60" />
      ))
        }
        </div>
  )
}

export function DataError({ message }: { message: string }) {
    return (
        <div className= "rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500" >
      ⚠️ { message } — showing cached data if available.
    </div>
    )
}
