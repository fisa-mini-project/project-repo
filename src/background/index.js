import { requestLLMSummary } from './requestLLMSummary.js'

// ✅ 설치 또는 업데이트 시 기존 탭에도 content-script 주입
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (!tab.id || !tab.url?.startsWith('http')) continue
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ['src/contentscript/index.js'],
        })
        .catch((err) => console.warn('Content script 주입 실패:', err))
    }
  })
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_SUMMARY') {
    ;(async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!tab?.id) {
          sendResponse({ error: '탭 없음' })
          return
        }

        chrome.tabs.sendMessage(tab.id, { type: 'CRAWL_PAGE_TEXT' }, async (res) => {
          if (!res?.text) {
            sendResponse({ error: '본문 추출 실패' })
            return
          }

          try {
            const summaryResult = await requestLLMSummary(res.text)

            await chrome.storage.local.set({ lastSummary: summaryResult })

            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'img/logo-48.png',
              title: '요약 완료',
              message: '페이지 요약이 완료되었습니다!',
            })

            sendResponse(summaryResult)
          } catch (err) {
            console.error('[❌ 요약 요청 오류]', err)
            sendResponse({ error: '요약 생성 중 오류가 발생했습니다.' })
          }
        })
      } catch (err) {
        sendResponse({ error: '탭 조회 중 오류' })
      }
    })()

    return true
  }
})
