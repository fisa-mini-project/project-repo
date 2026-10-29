import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function SourceBar({ currentUrl }) {
  const [message, setMessage] = useState('')
  useEffect(() => setMessage(''), [currentUrl])
  let site = '페이지 확인 중'
  try {
    site = new URL(currentUrl).hostname || '브라우저 페이지'
  } catch {
    /* Tab query pending. */
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setMessage('주소를 복사했어요.')
    } catch {
      setMessage('복사하지 못했어요. 브라우저 주소창에서 복사해 주세요.')
    }
  }
  return (
    <>
      <div className="source">
        <div className="source-label">
          <span>현재 페이지</span>
          <strong title={currentUrl}>{site}</strong>
        </div>
        <button
          className="text-button"
          onClick={copy}
          disabled={!currentUrl}
          aria-label="현재 페이지 주소 복사"
        >
          {message.startsWith('주소') ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <Copy size={18} aria-hidden="true" />
          )}
          <span>주소 복사</span>
        </button>
      </div>
      {message && (
        <p className="copy-feedback" role="status">
          {message}
        </p>
      )}
    </>
  )
}
