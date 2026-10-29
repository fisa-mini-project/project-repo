import { useEffect, useState } from 'react'

export function usePreference(key, fallback, allowedValues) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      return allowedValues.includes(saved) ? saved : fallback
    } catch {
      return fallback
    }
  })
  useEffect(() => {
    const syncPreference = (event) => {
      if (event.key !== key) return
      try {
        const saved = JSON.parse(event.newValue)
        setValue(allowedValues.includes(saved) ? saved : fallback)
      } catch {
        /* Ignore malformed external values. */
      }
    }
    window.addEventListener('storage', syncPreference)
    return () => window.removeEventListener('storage', syncPreference)
  }, [key, fallback, allowedValues])
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* Keep usable when storage is unavailable. */
    }
  }, [key, value])
  return [value, setValue]
}
