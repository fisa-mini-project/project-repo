import { requestLLMSummary } from './requestLLMSummary.js'
import { requestGptSummary } from './requestGptSummary.js'

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'SUMMARY_REQUEST') {
    const result = await requestLLMSummary(message.text)

    console.log('[🧠 LLM 요약 결과]', result)

    chrome.storage.local.set({ gptSummary: result }, () => {
      console.log('[✅ 저장 완료: chrome.storage.local.gptSummary]')
    })
  }
})
