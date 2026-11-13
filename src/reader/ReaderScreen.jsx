import { interfaceText } from './interfaceText'
import { TranslationSection } from './TranslationSection'
import { BookOpen, FileText, LoaderCircle } from 'lucide-react'
import { useFontSize, fontSizeMap } from '../contexts/FontSizeContext'
import { useCurrentTabUrl } from '../hooks/useCurrentTabUrl'
import { useReader } from '../hooks/useReader'
import { SourceBar } from './SourceBar'
import { SummarySection } from './SummarySection'
import { ReadingControls } from './ReadingControls'

export function ReaderScreen({ isHighContrast, toggleContrast, language, toggleLanguage }) {
  const currentUrl = useCurrentTabUrl()
  const { fontSizeLevel } = useFontSize()
  const t = text => interfaceText(language, text)
  const reader = useReader(currentUrl, language)
  const { isLoading, error, summary, canSummarize, requestSummary } = reader
  return (
    <main
      className="reader"
      lang={language}
      data-contrast={isHighContrast ? 'high' : 'normal'}
      data-font-size={fontSizeLevel}
      style={{ fontSize: fontSizeMap[fontSizeLevel] }}
    >
      <header className="brand">
        <BookOpen size={22} aria-hidden="true" />
        <h1>Easy Reader</h1>
        <button type="button" className="text-button" onClick={toggleLanguage}
          aria-label={language === 'ko' ? '영어로 전환' : 'Switch to Korean'}>
          <span lang={language === 'ko' ? 'en' : 'ko'}>{language === 'ko' ? 'English' : '한국어'}</span>
        </button>
      </header>
      <SourceBar currentUrl={currentUrl} t={t} />
      <section className="start" aria-labelledby="start-title">
        <h2 id="start-title" className="sr-only">
          {t('페이지 요약')}
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
              ? t('요약 중')
              : error
                ? t('다시 시도하기')
                : summary
                  ? t('다시 요약하기')
                  : t('이 페이지 요약하기')}
          </span>
        </button>
        {currentUrl && !canSummarize && (
          <p className="page-help">
            {t('이 화면은 요약할 수 없어요. 뉴스나 블로그 같은 웹페이지를 열어 주세요.')}
          </p>
        )}
      </section>
      <SummarySection reader={reader} t={t} />
      {canSummarize && <TranslationSection key={JSON.stringify([currentUrl, language])} language={language} t={t} />}
      <ReadingControls isHighContrast={isHighContrast} toggleContrast={toggleContrast} t={t} />
      <footer className="reader-footer">
        {t('AI 요약은 틀릴 수 있어요. 중요한 내용은 원문도 확인해 주세요.')}
      </footer>
    </main>
  )
}
