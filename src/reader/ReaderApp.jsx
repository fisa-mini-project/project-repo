import React from 'react'
import { FontSizeProvider } from '../contexts/FontSizeContext'
import { usePreference } from '../hooks/usePreference'
import { ReaderScreen } from './ReaderScreen'
import './reader.css'

const interfaceLanguages = ['ko', 'en']

export function ReaderApp() {
  const [isHighContrast, setIsHighContrast] = usePreference('easy-reader-contrast', false, [
    true,
    false,
  ])
  const [language, setLanguage] = usePreference('easy-reader-language', 'ko', interfaceLanguages)
  React.useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  return (
    <FontSizeProvider>
      <ReaderScreen
        language={language}
        toggleLanguage={() => setLanguage(value => value === 'ko' ? 'en' : 'ko')}
        isHighContrast={isHighContrast}
        toggleContrast={() => setIsHighContrast((value) => !value)}
      />
    </FontSizeProvider>
  )
}
