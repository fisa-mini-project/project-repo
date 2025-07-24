import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { fontSizeMap } from '../constants/fontSizes'
import { SummaryBox } from '../components/SummaryBox'
import { Modal } from '../components/Modal'
import { createPortal } from 'react-dom'
import { useCurrentTabUrl } from '../hooks/useCurrentTabUrl'
import { useGptSummary } from '../hooks/useGptSummary'
import { useFontSize } from '../contexts/FontSizeContext'
import FontSizeToggle from '../components/FontSizeToggle'
// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`
// 메인 컨테이너
const Container = styled.main`
  min-height: 100vh;
  background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
  padding: 1.5rem;
  margin: 0 auto;
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
`
// 헤더 카드
const HeaderCard = styled.div`
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }
`
const Title = styled.h1`
  color: #FFFFFF;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.025em;
`
const Subtitle = styled.p`
  color: #E0E7FF;
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.9;
`
// 액션 섹션
const ActionsCard = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border: 1px solid #E2E8F0;
`
const SectionTitle = styled.h2`
  color: #1E293B;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const Button = styled.button`
  background: ${(props) =>
    props.variant === 'primary'
      ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
      : 'linear-gradient(135deg, #10B981 0%, #059669 100%)'};
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  min-height: 56px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px
    ${(props) =>
      props.variant === 'primary' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
  position: relative;
  overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px
      ${(props) =>
        props.variant === 'primary' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'};
  }
  &:focus {
    outline: 3px solid ${(props) => (props.variant === 'primary' ? '#93C5FD' : '#6EE7B7')};
    outline-offset: 2px;
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    animation: ${pulse} 1.5s infinite;
  }
  .icon {
    font-size: 1.25rem;
  }
`
// URL 섹션
const UrlCard = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border: 1px solid #E2E8F0;
`
const UrlBox = styled.div`
  background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #CBD5E1;
  position: relative;
  overflow: hidden;
  &::before {
    content: ':링크:';
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    font-size: 1rem;
    opacity: 0.5;
  }
`
const UrlText = styled.p`
  word-break: break-all;
  font-size: 0.9rem;
  color: #475569;
  margin: 0;
  line-height: 1.6;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  padding-right: 2rem;
`
// 접근성 설정 섹션
const AccessibilityCard = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border: 1px solid #E2E8F0;
`
const FontSizeControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`
const FontSizeButton = styled.button`
  background: ${(props) => (props.active ? '#3B82F6' : '#F8FAFC')};
  color: ${(props) => (props.active ? '#FFFFFF' : '#475569')};
  border: 2px solid ${(props) => (props.active ? '#3B82F6' : '#E2E8F0')};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  &:hover {
    border-color: #3B82F6;
    background: ${(props) => (props.active ? '#2563EB' : '#F1F5F9')};
  }
  &:focus {
    outline: 3px solid #93C5FD;
    outline-offset: 2px;
  }
`
// 고대비 모드 토글
const HighContrastToggle = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: #1F2937;
  color: #FFFFFF;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  z-index: 1000;
  &:hover {
    transform: scale(1.1);
    background: #111827;
  }
  &:focus {
    outline: 3px solid #FBBF24;
    outline-offset: 2px;
  }
`
// 푸터
const Footer = styled.footer`
  text-align: center;
  padding: 1rem 0;
`
const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748B;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  &:hover {
    color: #3B82F6;
    background: #F1F5F9;
  }
  &:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
`
export const SidePanel = () => {
  const currentUrl = useCurrentTabUrl()
  const { summary, openModal, setOpenModal, fetchSummaryFromStorage, speakSummary } =
    useGptSummary()
  const { fontSizeLevel, setFontSizeLevel } = useFontSize()
  const [isLoading, setIsLoading] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const handleSummary = async () => {
    setIsLoading(true)
    try {
      await fetchSummaryFromStorage()
    } finally {
      setIsLoading(false)
    }
  }
  const fontSizeOptions = [
    { key: 'small', label: '작게' },
    { key: 'medium', label: '보통' },
    { key: 'large', label: '크게' },
    { key: 'xlarge', label: '매우 크게' },
  ]
  return (
    <Container
      style={{
        fontSize: fontSizeMap[fontSizeLevel],
        filter: highContrast ? 'contrast(150%) brightness(120%)' : 'none',
      }}
    >
      {/* 헤더 */}
      <HeaderCard>
        <Title>FISA Extension</Title>
        <Subtitle>웹 페이지 요약 및 음성 변환 도구</Subtitle>
      </HeaderCard>
      {/* 주요 기능 */}
      <ActionsCard>
        <SectionTitle>
          <span>:번쩍:</span>
          주요 기능
        </SectionTitle>
        <Actions>
          <Button variant="primary" onClick={handleSummary} disabled={isLoading}>
            <span className="icon">:메모:</span>
            요약 가져오기
          </Button>
          <Button variant="secondary" onClick={speakSummary}>
            <span className="icon">:확성기:</span>
            요약 읽기
          </Button>
        </Actions>
      </ActionsCard>
      {/* URL 섹션 */}
      <UrlCard>
        <SectionTitle>
          <span>:링크:</span>
          현재 URL
        </SectionTitle>
        <UrlBox>
          <UrlText>{currentUrl}</UrlText>
        </UrlBox>
      </UrlCard>
      {/* 접근성 설정 섹션 */}
      <AccessibilityCard>
        <SectionTitle>
          <span>:톱니바퀴:</span>
          글자 크기
        </SectionTitle>
        <FontSizeControls>
          {fontSizeOptions.map((option) => (
            <FontSizeButton
              key={option.key}
              active={fontSizeLevel === option.key}
              onClick={() => setFontSizeLevel(option.key)}
            >
              {option.label}
            </FontSizeButton>
          ))}
        </FontSizeControls>
        <HighContrastToggle onClick={() => setHighContrast(!highContrast)}>
          {highContrast ? 'HIGH CONTRAST ON' : 'HIGH CONTRAST OFF'}
        </HighContrastToggle>
      </AccessibilityCard>
      {/* 푸터 */}
      <Footer>
        <StyledLink href="https://github.com/yourusername/fisa-extension" target="_blank">
          <span className="icon">GitHub</span>
          소스 코드 보기
        </StyledLink>
      </Footer>
      {/* 모달 */}
      {openModal &&
        createPortal(
          <Modal
            onClose={() => setOpenModal(false)}
            title={summary?.title}
            summary={summary?.summary}
          ><FontSizeToggle/>
          </Modal>,
          document.body,
        )}
    </Container>
  )
}