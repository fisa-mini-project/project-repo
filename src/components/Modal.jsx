import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useFontSize, fontSizeMap } from '../contexts/FontSizeContext'
import { X, FileText } from 'lucide-react'
import Spinner from './Spinner'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`

const Container = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 1.5rem;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.22);
  width: 100%;
  max-width: 42rem;
  max-height: 80vh;
  overflow: hidden;
  font-size: inherit;
  transition: all 0.18s cubic-bezier(0.4, 0.4, 0.2, 1);
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'highContrast'
      ? theme.buttonPrimary
      : 'linear-gradient(90deg, #2563eb 0%, #9333ea 100%)'};
  color: ${({ theme }) => theme.buttonText};
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
  color: ${({ theme }) => theme.buttonText};
  cursor: pointer;
  font-size: 1.3rem;
  transition: background 0.18s;
  &:hover {
    background: rgba(255, 255, 255, 0.17);
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

const SummaryContainer = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'highContrast' ? '#222' : 'linear-gradient(90deg, #eff6ff 0%, #f3e8ff 100%)'};
  border-left: 4px solid
    ${({ theme }) => (theme.mode === 'highContrast' ? theme.focusOutline : '#2563eb')};
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const SummaryText = styled.p`
  color: ${({ theme }) => theme.text};
  line-height: 1.8;
  white-space: pre-wrap;
  margin: 0;
  text-align: center;
  width: 100%;
  font-size: ${(props) => props.fontSize};
`

export const Modal = ({ children, title, summary, onClose }) => {
  const { fontSizeLevel } = useFontSize()
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)

    // 포커스 자동 이동
    modalRef.current?.focus()

    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const renderSummaryContent = () => {
    if (summary === undefined || summary === null || summary === '') {
      return (
        <SummaryText fontSize={fontSizeMap[fontSizeLevel]}>요약된 내용이 없습니다.</SummaryText>
      )
    }
    if (summary === 'loading') {
      return <Spinner />
    }
    if (typeof summary === 'string') {
      return <SummaryText fontSize={fontSizeMap[fontSizeLevel]}>{summary}</SummaryText>
    }
    return summary
  }

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <Container
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{ fontSize: fontSizeMap[fontSizeLevel] }}
      >
        <Header>
          <FileText size={24} style={{ marginRight: '0.7rem' }} />
          <Title id="modal-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="모달 닫기">
            <X size={20} />
          </CloseButton>
        </Header>
        <Content>
          <SummaryContainer>{renderSummaryContent()}</SummaryContainer>
          {children}
        </Content>
      </Container>
    </Overlay>
  )
}
