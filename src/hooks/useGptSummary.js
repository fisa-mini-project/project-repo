import { useState, useEffect, useCallback } from 'react'

export const useGptSummary = () => {
  const [summary, setSummary] = useState(null)
  const [showSummary, setShowSummary] = useState(false)

  const fetchSummaryFromStorage = useCallback(() => {
    chrome.storage.local.get(['gptSummary'], (res) => {
      console.log('[📦 GPT 요약 데이터]', res.gptSummary)
      if (res.gptSummary && typeof res.gptSummary === 'object') {
        setSummary(res.gptSummary)
        setShowSummary(true)
      } else {
        setSummary({ title: '요약 없음', summary: '요약된 정보가 없습니다.' })
        setShowSummary(true)
      }
    })
  }, [])

  const speakSummary = () => {
    if (summary?.summary) {
      const utterance = new SpeechSynthesisUtterance(summary.summary)
      speechSynthesis.speak(utterance)
    } else {
      alert('요약된 내용이 없습니다.')
    }
  }

  return { summary, showSummary, fetchSummaryFromStorage, speakSummary }
}
