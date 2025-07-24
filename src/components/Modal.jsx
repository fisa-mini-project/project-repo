import React, { useEffect } from "react"
import styled from "styled-components"
import { useFontSize, fontSizeMap } from "../contexts/FontSizeContext"
import { X, FileText } from "lucide-react"

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.60);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`

const Container = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 40px rgba(0,0,0,0.22);
  width: 100%;
  max-width: 42rem;         /* 672px */
  max-height: 80vh;         /* 화면 기준 최대 높이 */
  overflow: hidden;
  font-size: inherit;
  transition: all 0.18s cubic-bezier(.4,.4,.2,1);
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  color: #fff;
  padding: 1.5rem 2rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  box-sizing: border-box;
  width: 100%;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  padding: 0.45rem;
  background: transparent;
  border: none;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-size: 1.3rem;
  transition: background 0.18s;
  &:hover {
    background: rgba(255,255,255,0.17);
  }
`

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  padding-right: 2.5rem;
`

const Content = styled.div`
  padding: 2rem;
  overflow-y: auto;
  max-height: 65vh;

`
  // background: transparent;
  // box-sizing: border-box;
  // display: flex;
  // flex-direction: column;
  const SummaryContainer = styled.div`
  background: linear-gradient(90deg, #eff6ff 0%, #f3e8ff 100%);
  border-left: 4px solid #2563eb;
  border-radius: 0.75rem; /* 0.5rem에서 0.75rem으로 증가 */
  padding: 2rem; /* 1rem에서 2rem으로 증가 */
  margin-bottom: 2rem; /* 1.5rem에서 2rem으로 증가 */
  min-height: 8rem; /* 최소 높이 추가 */
   display: flex; /* flexbox 추가 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
`

const SummaryText = styled.p`
  color: #1e293b;
  line-height: 1.8; /* 1.6에서 1.8로 증가 */
  white-space: pre-wrap;
  margin: 0;
  text-align:center;
  width:100%;
  font-size: ${(props) => props.fontSize};
`
// const Summary = styled.div`
// flex:1;
//   background: linear-gradient(90deg, #eff6ff 0%, #f5f3ff 100%);
//   border-left: 4px solid #3b82f6;
//   border-radius: 0.7rem;
//   padding: 1rem;
//   margin-bottom: 1.7rem;
//   color: #1f2937;
//   white-space: pre-wrap;
//   line-height: 1.58;
// `

export const Modal = ({ children, title, summary, onClose }) => {
  const { fontSizeLevel } = useFontSize()

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <Container
        onClick={e => e.stopPropagation()}
        style={{ fontSize: fontSizeMap[fontSizeLevel] }}
      >
        <Header>
          <FileText size={24} style={{ marginRight: "0.7rem" }} />
          <Title id="modal-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="모달 닫기">
            <X size={20} />
          </CloseButton>
        </Header>
        <Content>
          {/* <Summary>{summary}</Summary> */}
          <SummaryContainer>
            <SummaryText fontSize={fontSizeMap[fontSizeLevel]}>{summary}</SummaryText>
          </SummaryContainer>
          {children}
        </Content>
      </Container>
    </Overlay>
  )
}
