import { BookOpen, FileText, LoaderCircle } from 'lucide-react'
import { useFontSize, fontSizeMap } from '../contexts/FontSizeContext'
import { useCurrentTabUrl } from '../hooks/useCurrentTabUrl'
import { useReader } from '../hooks/useReader'
import { SourceBar } from './SourceBar'
import { SummarySection } from './SummarySection'
import { ReadingControls } from './ReadingControls'

export function ReaderScreen({ isHighContrast, toggleContrast }) {
  const currentUrl = useCurrentTabUrl()
  const { fontSizeLevel } = useFontSize()
  const reader = useReader(currentUrl)
  const { isLoading, error, summary, canSummarize, requestSummary } = reader
  return (
    <main
      className="reader"
      data-contrast={isHighContrast ? 'high' : 'normal'}
      data-font-size={fontSizeLevel}
      style={{ fontSize: fontSizeMap[fontSizeLevel] }}
    >
      <header className="brand">
        <BookOpen size={22} aria-hidden="true" />
        <h1>Easy Reader</h1>
      </header>
      <SourceBar currentUrl={currentUrl} />
      <section className="start" aria-labelledby="start-title">
        <h2 id="start-title" className="sr-only">
          페이지 요약
        </h2>
        <button
          className="primary-button"
          disabled={!canSummarize || isLoading}
          onClick={requestSummary}
        >
          {isLoading ? (
            <LoaderCircle className="loading-icon" size={21} aria-hidden="true" />
          ) : (
            <FileText size={21} aria-hidden="true" />
          )}
          <span>
            {isLoading
              ? '요약 중'
              : error
                ? '다시 시도하기'
                : summary
                  ? '다시 요약하기'
                  : '이 페이지 요약하기'}
          </span>
        </button>
        {currentUrl && !canSummarize && (
          <p className="page-help">
            이 화면은 요약할 수 없어요. 뉴스나 블로그 같은 웹페이지를 열어 주세요.
          </p>
        )}
      </section>
      <SummarySection reader={reader} />
      <ReadingControls isHighContrast={isHighContrast} toggleContrast={toggleContrast} />
      <footer className="reader-footer">
        AI 요약은 틀릴 수 있어요. 중요한 내용은 원문도 확인해 주세요.
      </footer>
    </main>
  )
}
