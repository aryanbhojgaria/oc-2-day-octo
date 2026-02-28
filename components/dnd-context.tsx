"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface DNDContextType {
    dndEnabled: boolean
    toggleDND: () => void
}

const DNDContext = createContext<DNDContextType>({ dndEnabled: false, toggleDND: () => { } })

export function useDND() {
    return useContext(DNDContext)
}

export function DNDProvider({ children }: { children: ReactNode }) {
    const [dndEnabled, setDndEnabled] = useState(false)
    const toggleDND = useCallback(() => setDndEnabled((prev) => !prev), [])
    return <DNDContext.Provider value={{ dndEnabled, toggleDND }}>{children}</DNDContext.Provider>
}
