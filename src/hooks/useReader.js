import { useCallback, useEffect, useRef, useState } from 'react'

export function useReader(currentUrl) {
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechError, setSpeechError] = useState('')
  const requestVersion = useRef(0)
  const pending = useRef(false)
  const timer = useRef(null)
  const speechVersion = useRef(0)
  const canSummarize = /^https?:\/\//.test(currentUrl)
  const canSpeak = typeof window.speechSynthesis !== 'undefined'

  const stopSpeaking = useCallback(() => {
    speechVersion.current += 1
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  useEffect(() => {
    setSummary(null)
    setError('')
    setSpeechError('')
    setIsLoading(false)
    pending.current = false
    stopSpeaking()
    return () => {
      requestVersion.current += 1
      clearTimeout(timer.current)
      speechVersion.current += 1
      window.speechSynthesis?.cancel()
    }
  }, [currentUrl, stopSpeaking])

  const requestSummary = useCallback(() => {
    if (!canSummarize || pending.current) return
    stopSpeaking()
    setSpeechError('')
    setSummary(null)
    setError('')
    setIsLoading(true)
    pending.current = true
    const version = ++requestVersion.current
    const fail = (message) => {
      if (version !== requestVersion.current) return
      clearTimeout(timer.current)
      pending.current = false
      setIsLoading(false)
      setError(message)
    }
    timer.current = setTimeout(() => {
      fail('응답이 늦어지고 있어요. 잠시 후 다시 시도해 주세요.')
      requestVersion.current += 1
    }, 65000)
    try {
      chrome.runtime.sendMessage({ type: 'GET_SUMMARY' }, (response) => {
        const lastError = chrome.runtime.lastError
        if (version !== requestVersion.current) return
        if (lastError || response?.error || !response?.summary || !response?.title) {
          const message = response?.error || ''
          fail(
            message.includes('429')
              ? '요청이 많아 잠시 쉬고 있어요. 잠시 후 다시 시도해 주세요.'
              : message.includes('원문 근거')
                ? '원문과 맞는지 확인하지 못했어요. 다시 요약해 주세요.'
              : /401|403/.test(message)
                ? '요약 서비스에 연결할 수 없어요. API 키 설정을 확인해 주세요.'
                : '요약을 가져오지 못했어요. 웹페이지를 새로고침하고 다시 시도해 주세요.',
          )
          return
        }
        clearTimeout(timer.current)
        pending.current = false
        setSummary(response)
        setIsLoading(false)
      })
    } catch {
      fail('확장 프로그램 연결이 끊겼어요. 웹페이지를 새로고침하고 다시 시도해 주세요.')
    }
  }, [canSummarize, stopSpeaking])

  const speakSummary = useCallback(() => {
    if (!summary?.summary || !canSpeak) return
    stopSpeaking()
    setSpeechError('')
    const version = speechVersion.current
    const spokenText = [
      summary.title,
      summary.coverage?.truncated ? '긴 글의 앞부분만 요약한 결과예요.' : '',
      summary.summary,
      ...(summary.keyPoints || []).map(item => item.text),
      summary.cautions?.length ? '주의할 조건입니다.' : '',
      ...(summary.cautions || []).map(item => item.text),
    ].filter(Boolean).join('\n')
    const utterance = new SpeechSynthesisUtterance(spokenText)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.9
    utterance.onend = () => {
      if (version === speechVersion.current) setIsSpeaking(false)
    }
    utterance.onerror = (event) => {
      if (version !== speechVersion.current) return
      setIsSpeaking(false)
      if (!['interrupted', 'canceled'].includes(event.error)) {
        setSpeechError('소리를 재생하지 못했어요. 기기의 음성 설정을 확인하고 다시 눌러 주세요.')
      }
    }
    setIsSpeaking(true)
    try {
      window.speechSynthesis.speak(utterance)
    } catch {
      setIsSpeaking(false)
      setSpeechError('소리를 재생하지 못했어요. 기기의 음성 설정을 확인해 주세요.')
    }
  }, [summary, canSpeak, stopSpeaking])

  return {
    summary,
    isLoading,
    error,
    requestSummary,
    canSummarize,
    canSpeak,
    isSpeaking,
    speechError,
    speakSummary,
    stopSpeaking,
  }
}
