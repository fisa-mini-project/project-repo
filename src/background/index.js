import { requestGptSummary } from './gpt.js'

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'SUMMARY_REQUEST') {
    const result = await requestGptSummary(message.text)

    console.log('[GPT 요약 결과]', result)

    chrome.storage.local.set({ gptSummary: result }, () => {
      console.log('[✅ 저장 완료: chrome.storage.local.gptSummary]')
    })
  }
})
