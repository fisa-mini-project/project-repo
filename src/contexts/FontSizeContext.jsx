import { createContext, useContext, useState } from 'react'

export const FontSizeContext = createContext()

export const FontSizeProvider = ({ children }) => {
  const [fontSizeLevel, setFontSizeLevel] = useState('medium')

  return (
    <FontSizeContext.Provider value={{ fontSizeLevel, setFontSizeLevel }}>
      {children}
    </FontSizeContext.Provider>
  )
}

// 쉽게 사용하도록 커스텀 훅 제공
export const useFontSize = () => useContext(FontSizeContext)
