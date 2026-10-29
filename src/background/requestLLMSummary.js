import { requestSummary } from './llmClient.js'

export async function requestLLMSummary(text) {
  try {
    return await requestSummary(text, import.meta.env)
  } catch (error) {
    console.error('[요약 실패]', error.name)
    throw new Error(error.name === 'TimeoutError'
      ? '요약 요청 시간이 초과되었습니다. 다시 시도해 주세요.'
      : error.message)
  }
}
