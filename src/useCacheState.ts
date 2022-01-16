import { useEffect, useState } from "react"

const Storage = {
  get(key: string) {
    try {
      const value = localStorage.getItem(key)
      if (value != null) {
        return JSON.parse(value)
      }
    } catch {}
  },

  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  },
}

export function useCacheState<T>(key: string, defaultValue: T | (() => T)) {
  const [state, setState] = useState<T>(
    () =>
      Storage.get(key) ??
      (typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue)
  )
  useEffect(() => {
    Storage.set(key, state)
  }, [key, state])
  return [state, setState] as const
}
