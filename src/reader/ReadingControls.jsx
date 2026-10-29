import { Contrast } from 'lucide-react'
import { useFontSize } from '../contexts/FontSizeContext'

const choices = [
  ['small', '기본'],
  ['medium', '보통'],
  ['large', '크게'],
  ['xlarge', '아주 크게'],
]

export function ReadingControls({ isHighContrast, toggleContrast }) {
  const { fontSizeLevel, setFontSizeLevel } = useFontSize()
  return (
    <section className="preferences" aria-labelledby="preferences-title">
      <h2 id="preferences-title">읽기 설정</h2>
      <div className="size-controls" role="group" aria-label="글자 크기">
        {choices.map(([value, label]) => (
          <button
            key={value}
            aria-pressed={fontSizeLevel === value}
            onClick={() => setFontSizeLevel(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <button className="contrast-button" aria-pressed={isHighContrast} onClick={toggleContrast}>
        <Contrast size={20} aria-hidden="true" />
        <span>고대비</span>
        <span className="contrast-value">{isHighContrast ? '켜짐' : '꺼짐'}</span>
      </button>
    </section>
  )
}
