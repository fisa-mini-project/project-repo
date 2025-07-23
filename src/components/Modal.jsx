// import styled from 'styled-components'
// import { useFontSize } from '../contexts/FontSizeContext'
// import { fontSizeMap } from '../constants/fontSizes'

// // const Box = styled.div`
// //   background-color: #f9f9f9;
// //   position: fixed;
// //   padding: 1rem;
// //   border-radius: 10px;
// //   margin-top: 1.5rem;
// //   text-align: left;
// //   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
// //   max-width: 90%;
// //   margin-inline: auto;
// //   white-space: pre-wrap;
// // `
// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   background: rgba(0, 0, 0, 0.4);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 9999;
//   backdrop-filter: blur(8px);
// `

// // 중앙 박스 (기존 Box 디자인 응용)
// const Box = styled.div`
//   position: fixed;
//   background-color: #f9f9f9;
//   padding: 1rem;
//   border-radius: 10px;
//   text-align: left;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   max-width: 90%;
//   margin-inline: auto;
//   white-space: pre-wrap;
//   z-index: 9999;
// `
// const Title = styled.h4`
//   font-size: 0.9em;
//   color: #007acc;
//   margin-bottom: 0.5rem;
// `
// const Body = styled.p`
//   font-size: 0.65em;
//   line-height: 1.6;
// `

// export const Modal = ({ children, title, summary, onClose }) => {
//   const { fontSizeLevel } = useFontSize()
//   return (
//     <>
//       <Overlay onClick={onClose}>
//         <Box onClick={(e) => e.stopPropagation()} style={{ fontSize: fontSizeMap[fontSizeLevel] }}>
//           <Title>{title}</Title>
//           <Body>{summary}</Body>
//           {children}
//         </Box>
//       </Overlay>
//     </>
//   )
// }

"use client"

import React, { useEffect } from "react"
import styled from "styled-components"
import { useFontSize, fontSizeMap } from "../contexts/FontSizeContext"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`

const Container = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: 42rem;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  position: relative;
`

const Header = styled.div`
  background: linear-gradient(to right, #2563eb, #9333ea);
  color: white;
  padding: 1.5rem;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 9999px;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
`

const Content = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
`

const Summary = styled.div`
  background: linear-gradient(to right, #eff6ff, #f5f3ff);
  border-left: 4px solid #3b82f6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
  white-space: pre-wrap;
  line-height: 1.6;
`

export const Modal = ({ children, title, summary, onClose }) => {
  const { fontSizeLevel } = useFontSize()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <Container onClick={(e) => e.stopPropagation()} style={{ fontSize: fontSizeMap[fontSizeLevel] }}>
        <Header>
          <Title id="modal-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="모달 닫기">×</CloseButton>
        </Header>
        <Content>
          <Summary>{summary}</Summary>
          {children}
        </Content>
      </Container>
    </Overlay>
  )
}
