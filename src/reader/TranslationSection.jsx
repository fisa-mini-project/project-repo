import { useEffect, useRef, useState } from 'react'
import { readingLanguages } from './languages'

export function TranslationSection({ language, t }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const version = useRef(0)

  useEffect(() => () => { version.current += 1 }, [])

  async function translate() {
    const request = ++version.current
    setLoading(true)
    setError(false)
    setResult(null)
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_TRANSLATION', language })
      if (!response?.translation) throw new Error('Missing translation')
      if (request === version.current) setResult(response)
    } catch {
      if (request === version.current) setError(true)
    } finally {
      if (request === version.current) setLoading(false)
    }
  }

  return (
    <section aria-label={t('본문 번역')} className="start">
      <button type="button" className="primary-button" disabled={loading} onClick={translate}>
        {loading ? t('번역 중') : t('본문 번역하기')}
      </button>
      <div aria-live="polite">
        {error && <p>{t('번역을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.')}</p>}
        {result?.coverage?.truncated && <p>{t('긴 글의 앞부분 2,000자만 번역했어요.')}</p>}
        {result && (
          <p lang={readingLanguages[language].locale} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {result.translation}
          </p>
        )}
      </div>
    </section>
  )
}
