import styled, { keyframes } from 'styled-components'
import { createPortal } from 'react-dom'
import { useFontSize } from '../contexts/FontSizeContext'
import { useSummary } from '../hooks/useSummary'
import { fontSizeMap } from '../constants/fontSizes'
import { Modal } from '../components/Modal'
import { useCurrentTabUrl } from '../hooks/useCurrentTabUrl'
import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import FontSizeToggle from '../components/FontSizeToggle'

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`

const Container = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 1.5rem;
  margin: 0 auto;
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
  * {
    font-size: inherit;
    color: ${({ theme }) => theme.text};
  }
`
const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  font-size: inherit;
`
const HeaderCard = styled(Card)`
  background: ${({ theme }) => theme.buttonPrimary};
  text-align: center;
  padding: 2rem 1.5rem;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }
`
const Title = styled.h1`
  color: ${({ theme }) => theme.buttonText};
  font-weight: 800;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.1rem;
`
const Subtitle = styled.p`
  color: ${({ theme }) => theme.buttonText};
  opacity: 0.9;
  font-size: 1.1rem;
  font-weight: 600;
`
const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`
const CopyButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  padding: 0;
  color: ${({ theme }) => theme.text};
  transition: color 0.2s;
  &:hover {
    color: ${({ theme }) => theme.primary || '#61dafb'};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary || '#61dafb'};
    outline-offset: 2px;
  }
`
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const Button = styled.button`
  background: ${({ theme, variant }) =>
    variant === 'primary' ? theme.buttonPrimary : theme.buttonSecondary};
  color: ${({ theme }) => theme.buttonText};
  border: 2px solid ${({ active, theme }) => (active ? theme.buttonPrimary : theme.border)};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  min-height: 56px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-2px);
  }
  &:focus {
    outline: 3px solid ${({ theme }) => theme.focusOutline};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    animation: ${pulse} 1.5s infinite;
  }
`
const UrlContainer = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'highContrast'
      ? theme.card
      : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)'};
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.border};
  padding: 1.5rem;
  margin-top: 1rem;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) =>
      theme.mode === 'highContrast'
        ? theme.card
        : 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)'};
    border-radius: 0.75rem 0.75rem 0 0;
  }
`
const UrlText = styled.p`
  color: ${({ theme }) => theme.text};
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.95rem;
  font-weight: 500;
  word-break: break-all;
  line-height: 1.6;
  margin: 0;
  background: ${({ theme }) => (theme.mode === 'highContrast' ? theme.card : '#FFFFFF')};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`
const FontSizeControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`
const FontSizeButton = styled.button`
  background: ${({ active, theme }) => (active ? theme.buttonPrimary : theme.background)};
  color: ${({ active, theme }) => (active ? theme.buttonText : theme.text)};
  border: 2px solid ${({ active, theme }) => (active ? theme.focusOutline : theme.border)};
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    border-color: ${({ theme }) => theme.focusOutline};
  }
  &:focus {
    outline: 3px solid ${({ theme }) => theme.focusOutline};
    outline-offset: 2px;
  }
  ${({ active, theme }) =>
    active &&
    `
    box-shadow: 0 0 0 3px ${theme.focusOutline};
  `}
`
const HighContrastToggle = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 32px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  z-index: 1000;
  &:hover {
    transform: scale(1.1);
  }
  &:focus {
    outline: 3px solid ${({ theme }) => theme.focusOutline};
    outline-offset: 2px;
  }
`
const Footer = styled.footer`
  text-align: center;
  padding: 1rem 0;
`
const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.focusOutline};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.default};
    outline-offset: 2px;
  }
`

export const SidePanel = () => {
  const currentUrl = useCurrentTabUrl()
  const { fontSizeLevel, setFontSizeLevel } = useFontSize()
  const [copied, setCopied] = useState(false)

  // ✅ useSummary에서 TTS까지 함께 사용
  const { summary, isLoading, openModal, setOpenModal, requestSummary, speakSummary } =
    useSummary(currentUrl)

  return (
    <Container style={{ fontSize: fontSizeMap[fontSizeLevel] }}>
      <HeaderCard>
        <Title>Easy Reader</Title>
        <Subtitle>웹 페이지 요약 및 음성 변환 도구</Subtitle>
      </HeaderCard>

      <Card>
        <SectionTitle>🔍 주요 기능</SectionTitle>
        <Actions>
          <Button variant="primary" onClick={requestSummary} disabled={isLoading}>
            {isLoading ? <Spinner /> : '📝 페이지 요약하기'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOpenModal(true)}
            disabled={!summary?.summary}
          >
            📄 페이지 요약 보기
          </Button>
          <Button variant="secondary" onClick={speakSummary} disabled={!summary?.summary}>
            📢 요약 읽기
          </Button>
        </Actions>
      </Card>

      {/* URL 복사 */}
      <Card>
        <SectionTitle>
          <CopyButton
            onClick={() => {
              navigator.clipboard.writeText(currentUrl).then(() => {
                setCopied(true)
                alert('✅ 복사되었습니다 ✅')
                setTimeout(() => setCopied(false), 2000)
              })
            }}
          >
            {copied ? '✅' : '🔗'}
          </CopyButton>
          현재 URL
        </SectionTitle>
        <UrlContainer>
          <UrlText>{currentUrl}</UrlText>
        </UrlContainer>
      </Card>

      {/* 글자 크기 */}
      <Card>
        <SectionTitle>⚙️ 글자 크기</SectionTitle>
        <FontSizeControls>
          {['small', 'medium', 'large', 'xlarge'].map((option) => (
            <FontSizeButton
              key={option}
              active={fontSizeLevel === option}
              onClick={() => setFontSizeLevel(option)}
            >
              {option === 'small'
                ? '작게'
                : option === 'medium'
                  ? '보통'
                  : option === 'large'
                    ? '크게'
                    : '매우 크게'}
            </FontSizeButton>
          ))}
        </FontSizeControls>
      </Card>

      <footer style={{ textAlign: 'center', padding: '1rem 0' }}>
        <a
          href="https://github.com/fisa-mini-project/project-repo"
          target="_blank"
          rel="noreferrer"
        >
          GitHub 소스 코드 보기
        </a>
      </footer>

      {openModal &&
        createPortal(
          <Modal
            onClose={() => setOpenModal(false)}
            title={summary?.title || (isLoading ? '요약 중...' : '요약 결과')}
            summary={isLoading ? <Spinner /> : summary?.summary || '내용이 없습니다.'}
          >
            <FontSizeToggle />
          </Modal>,
          document.body,
        )}
    </Container>
  )
}
