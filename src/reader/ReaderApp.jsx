import React from 'react'
import { FontSizeProvider } from '../contexts/FontSizeContext'
import { usePreference } from '../hooks/usePreference'
import { ReaderScreen } from './ReaderScreen'
import './reader.css'

export function ReaderApp() {
  const [isHighContrast, setIsHighContrast] = usePreference('easy-reader-contrast', false, [
    true,
    false,
  ])
  return (
    <FontSizeProvider>
      <ReaderScreen
        isHighContrast={isHighContrast}
        toggleContrast={() => setIsHighContrast((value) => !value)}
      />
    </FontSizeProvider>
  )
}
