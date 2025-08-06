import React from 'react'
import styled, { useTheme } from 'styled-components'
import { useFontSize, fontSizes } from '../contexts/FontSizeContext'
import { Type, Plus, Minus } from 'lucide-react'

const fontSizeLabels = {
  small: '작게',
  medium: '보통',
  large: '크게',
  xlarge: '매우 크게',
}

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 1rem;
  padding: 0.7rem;
  box-shadow: 0 2px 12px 0 rgba(100, 116, 139, 0.1);
  flex: none;
  font-size: 1rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
`

const Title = styled.h3`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  margin: 0;
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 2rem;
`

const RoundButton = styled.button`
  flex: 0.2;
  width: 2rem;
  height: 2rem;
  background: ${({ disabled, theme }) => (disabled ? theme.border : '#f3f4f6')};
  color: ${({ disabled, theme }) => (disabled ? '#a0aec0' : '#334155')};
  border: none;
  border-radius: 0.5rem;
  transition: background 0.15s;
  font-size: 0.9rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${({ disabled, theme }) => (disabled ? theme.border : '#e5e7eb')};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.focusOutline};
    outline-offset: 1px;
  }
`

const SizeDisplay = styled.div`
  flex: 0.7;
  height: 2rem;
  .badge {
    background: ${({ theme }) =>
      theme.mode === 'highContrast' ? '#333' : 'linear-gradient(90deg, #dbeafe 0%, #ede9fe 100%)'};
    width: 100%;
    display: block;
    text-align: center;
    border-radius: 0.38rem;
    height: 2rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
  }
`

const Indicators = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-top: 0.65rem;
  justify-content: center;
`

const Dot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${({ active, theme }) => (active ? theme.focusOutline : theme.border)};
  transition: background 0.15s;
`

export const FontSizeToggle = () => {
  const { fontSizeLevel, setFontSizeLevel } = useFontSize()
  const theme = useTheme()
  const currentIndex = fontSizes.indexOf(fontSizeLevel)
  const maxIndex = fontSizes.length - 1

  const increaseFontSize = () => {
    if (currentIndex < maxIndex) setFontSizeLevel(fontSizes[currentIndex + 1])
  }
  const decreaseFontSize = () => {
    if (currentIndex > 0) setFontSizeLevel(fontSizes[currentIndex - 1])
  }

  return (
    <Card>
      <Header>
        <Type size={20} color={theme.focusOutline} />
        <Title>글자 크기 조절</Title>
      </Header>
      <ButtonGroup>
        <RoundButton
          onClick={decreaseFontSize}
          disabled={currentIndex === 0}
          aria-label="글자 크기 줄이기"
        >
          <Minus size={18} />
        </RoundButton>
        <SizeDisplay>
          <span className="badge">{fontSizeLabels[fontSizeLevel]}</span>
        </SizeDisplay>
        <RoundButton
          onClick={increaseFontSize}
          disabled={currentIndex === maxIndex}
          aria-label="글자 크기 키우기"
        >
          <Plus size={18} />
        </RoundButton>
      </ButtonGroup>
      <Indicators>
        {fontSizes.map((size, idx) => (
          <Dot key={size} active={idx <= currentIndex} aria-hidden="true" />
        ))}
      </Indicators>
    </Card>
  )
}

export default FontSizeToggle
