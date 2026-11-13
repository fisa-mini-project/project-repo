import { requestLLMSummary } from './requestLLMSummary.js';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_SUMMARY') {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
          console.error('[background] 탭 없음');
          sendResponse({ error: '탭 없음' });
          return;
        }
        const crawl = () => chrome.tabs.sendMessage(tab.id, { type: 'CRAWL_PAGE_TEXT' });
        let page;
        try {
          page = await crawl();
        } catch {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['lib/readability.js', 'assets/contentScript.js'],
          });
          page = await crawl();
        }
        if (!page?.text?.trim()) throw new Error('SUMMARY_NO_TEXT');

        const summaryResult = await requestLLMSummary(page.text, { language: msg.language });
        sendResponse(summaryResult);

        // Storage and notifications should not turn a successful summary into an error.
        void chrome.storage.local.set({ lastSummary: summaryResult }).catch(() => {});
        void chrome.notifications.create({
          type: 'basic',
          iconUrl: 'img/logo-48.png',
          title: msg.language === 'en' ? 'Summary ready' : '요약 완료',
          message: msg.language === 'en' ? 'Your page summary is ready.' : '페이지 요약이 완료되었습니다!',
        }).catch(() => {});
      } catch (err) {
        console.error('[background] 요약 오류:', err.name);
        sendResponse({ error: err.message || '알 수 없는 오류' });
      }
    })();

    return true; // 비동기 sendResponse 허용
  }
});
