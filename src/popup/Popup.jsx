import { useState, useEffect } from 'react'

export const Popup = () => {
  const [summary, setSummary] = useState({ title: '', summary: '요약을 불러오는 중...' })

  useEffect(() => {
    chrome.storage.local.get(['gptSummary'], (res) => {
      console.log('[📦 popup에서 받은 요약]', res.gptSummary)
      if (res.gptSummary && typeof res.gptSummary === 'object') {
        setSummary(res.gptSummary)
      } else {
        setSummary({ title: '요약 없음', summary: '요약된 정보가 없습니다.' })
      }
    })
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{summary.title}</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{summary.summary}</p>
    </div>
  )
}

export default Popup
