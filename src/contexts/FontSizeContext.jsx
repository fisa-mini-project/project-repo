import React, { createContext, useContext, useState } from 'react'

export const fontSizes = ['small', 'medium', 'large', 'xlarge']

export const fontSizeMap = {
  small: '0.875rem',
  medium: '1rem',
  large: '1.25rem',
  xlarge: '1.5rem',
}

const FontSizeContext = createContext()

export const FontSizeProvider = ({ children }) => {
  const [fontSizeLevel, setFontSizeLevel] = useState('medium')

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
