import { useEffect, useState } from 'react'
import { Check, Volume2, Square } from 'lucide-react'

function SummaryItems({ title, items }) {
  if (!items?.length) return null
  return <section className="summary-section">
    <h4>{title}</h4>
    <ul>{items.map((item, index) => <li key={index}>
      <p>{item.text}</p>
      <details className="evidence">
        <summary>원문 근거 보기</summary>
        <blockquote>{item.evidence}</blockquote>
      </details>
    </li>)}</ul>
  </section>
}

function SummarySkeleton() {
  return (
    <div className="summary-skeleton" aria-hidden="true">
      <span className="skeleton-line skeleton-title" />
      <span className="skeleton-line" />
      <span className="skeleton-line" />
      <span className="skeleton-line skeleton-short" />
      <span className="skeleton-line" />
      <span className="skeleton-line skeleton-medium" />
    </div>
  )
}

export function SummarySection({ reader }) {
  const {
    summary,
    isLoading,
    error,
    canSpeak,
    isSpeaking,
    speechError,
    speakSummary,
    stopSpeaking,
  } = reader
  const [isSlow, setIsSlow] = useState(false)
  useEffect(() => {
    setIsSlow(false)
    if (!isLoading) return
    const timer = setTimeout(() => setIsSlow(true), 12000)
    return () => clearTimeout(timer)
  }, [isLoading])
  const status = isLoading
    ? isSlow
      ? '평소보다 조금 더 걸리고 있어요. 잠시만 기다려 주세요.'
      : '페이지 내용을 요약하고 있어요.'
    : error
      ? ''
      : isSpeaking
        ? '요약을 소리로 읽고 있어요.'
        : summary
          ? '요약이 준비됐어요.'
          : '요약하기를 누르면 핵심 내용이 표시됩니다.'
  return (
    <section className="result" aria-labelledby="result-title">
      <div className="section-heading">
        <h2 id="result-title">요약</h2>
        {summary && (
          <span className="complete">
            <Check size={16} aria-hidden="true" />
            완료
          </span>
        )}
        {isLoading && (
          <span className="loading-label" aria-hidden="true">
            정리 중
          </span>
        )}
      </div>
      {/* Keep the live announcement outside the busy content subtree. */}
      <p className="reader-status" role="status" aria-atomic="true">
        {status}
      </p>
      <div className="result-body" aria-busy={isLoading}>
        {isLoading ? (
          <SummarySkeleton />
        ) : error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : summary ? (
          <article className="summary-text">
            <h3>{summary.title}</h3>
            {summary.coverage?.truncated && <p className="coverage-note">글이 길어 앞 48,000자만 요약했어요. 뒷부분의 조건은 원문에서 확인해 주세요.</p>}
            {summary.keyPoints?.length > 0 && <h4 className="overview-heading">한눈에 보기</h4>}
            <p>{summary.summary}</p>
            <SummaryItems title="핵심 내용" items={summary.keyPoints} />
            <SummaryItems title="주의할 조건" items={summary.cautions} />
          </article>
        ) : null}
      </div>
      <button
        className="listen-button"
        disabled={!summary || isLoading || !canSpeak}
        onClick={isSpeaking ? stopSpeaking : speakSummary}
      >
        {isSpeaking ? (
          <Square size={20} aria-hidden="true" />
        ) : (
          <Volume2 size={22} aria-hidden="true" />
        )}
        {isSpeaking ? '읽기 중지' : '소리로 듣기'}
      </button>
      {!canSpeak && <p className="page-help">이 브라우저에서는 소리로 듣기를 지원하지 않아요.</p>}
      {speechError && (
        <p className="error-message" role="alert">
          {speechError}
        </p>
      )}
    </section>
  )
}
