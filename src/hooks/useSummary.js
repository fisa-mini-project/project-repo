import { useCallback } from 'react'
import { useSummaryStore } from '../store/summaryStore'

export function useSummary(currentUrl) {
  const { summary, isLoading, openModal, setSummary, setIsLoading, setOpenModal } =
    useSummaryStore()

  // ✅ 요약 요청
  const requestSummary = useCallback(() => {
    if (!currentUrl) return
    setOpenModal(true)
    setIsLoading(true)

    chrome.runtime.sendMessage({ type: 'GET_SUMMARY' }, (response) => {
      if (chrome.runtime.lastError || response?.error) {
        console.error('[❌ 요약 요청 실패]', chrome.runtime.lastError?.message)
        setSummary({
          title: '요약 실패',
          summary: '이 페이지에서는 요약을 가져올 수 없습니다.',
        })
        setIsLoading(false)
        return
      }

      // ✅ 응답을 상태에 저장
      setSummary(response)
      setIsLoading(false)
    })
  }, [currentUrl, setOpenModal, setIsLoading, setSummary])

  // ✅ 요약 읽기 (TTS)
  const speakSummary = useCallback(() => {
    if (!summary?.summary) {
      alert('읽을 요약 내용이 없습니다.')
      return
    }
    // 기존 읽기 중이면 중단
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(summary.summary)
    utterance.lang = 'ko-KR'
    utterance.rate = 1
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }, [summary])

  return { summary, isLoading, openModal, setOpenModal, requestSummary, speakSummary }
}
