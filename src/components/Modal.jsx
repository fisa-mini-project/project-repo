import styled from 'styled-components'
import { useFontSize } from '../contexts/FontSizeContext'
import { fontSizeMap } from '../constants/fontSizes'

// const Box = styled.div`
//   background-color: #f9f9f9;
//   position: fixed;
//   padding: 1rem;
//   border-radius: 10px;
//   margin-top: 1.5rem;
//   text-align: left;
//   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   max-width: 90%;
//   margin-inline: auto;
//   white-space: pre-wrap;
// `
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
`

// 중앙 박스 (기존 Box 디자인 응용)
const Box = styled.div`
  position: fixed;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  text-align: left;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  margin-inline: auto;
  white-space: pre-wrap;
  z-index: 9999;
`
const Title = styled.h4`
  font-size: 0.9em;
  color: #007acc;
  margin-bottom: 0.5rem;
`
const Body = styled.p`
  font-size: 0.65em;
  line-height: 1.6;
`

export const Modal = ({ children, title, summary, onClose }) => {
  const { fontSizeLevel } = useFontSize()
  return (
    <>
      <Overlay onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()} style={{ fontSize: fontSizeMap[fontSizeLevel] }}>
          <Title>{title}</Title>
          <Body>{summary}</Body>
          {children}
        </Box>
      </Overlay>
    </>
  )
}
