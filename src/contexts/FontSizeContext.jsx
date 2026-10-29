import React, { createContext, useContext } from 'react'
import { usePreference } from '../hooks/usePreference'

export const fontSizes = ['small', 'medium', 'large', 'xlarge']

export const fontSizeMap = {
  small: '1rem',
  medium: '1.125rem',
  large: '1.5rem',
  xlarge: '2rem',
}

const FontSizeContext = createContext()

export const FontSizeProvider = ({ children }) => {
  const [fontSizeLevel, setFontSizeLevel] = usePreference(
    'easy-reader-font-size',
    'medium',
    fontSizes,
  )

  return (
    <FontSizeContext.Provider value={{ fontSizeLevel, setFontSizeLevel }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export const useFontSize = () => {
  const context = useContext(FontSizeContext)
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}
