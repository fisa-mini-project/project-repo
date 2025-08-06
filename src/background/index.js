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
        console.log('[background] 활성 탭 ID:', tab.id);

        // content script 동적 주입 시도
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [ 'lib/readability.js', 'assets/contentScript.js'], // 실제 빌드 산출물 경로 확인 필요
          });
          console.log('[background] content script 주입 성공');
        } catch (injErr) {
          console.error('[background] content script 주입 실패:', injErr);
          // 주입 실패는 크리티컬, 여기서 바로 종료하지 않고 시도 계속 가능 여부 판단
        }

        // 페이지 본문 텍스트 요청
await new Promise(res => setTimeout(res, 150));

const pageText = await new Promise((resolve, reject) => {
  chrome.tabs.sendMessage(tab.id, { type: 'CRAWL_PAGE_TEXT' }, (res) => {
    if (chrome.runtime.lastError) {
      reject(new Error('content script 미주입'));
    } else if (!res?.text) {
      reject(new Error('본문 추출 실패'));
    } else {
      resolve(res.text);
    }
  });
});
        // 요약 요청
        const summaryResult = await requestLLMSummary(pageText);
        console.log('[background] 요약 결과 수신:', summaryResult);

        // 캐시 저장
        await chrome.storage.local.set({ lastSummary: summaryResult });
        console.log('[background] 캐시 저장 완료');

        // 알림 발송
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'img/logo-48.png',
          title: '요약 완료',
          message: '페이지 요약이 완료되었습니다!',
        });

        sendResponse(summaryResult);
      } catch (err) {
        console.error('[background] 요약 오류 발생:', err);
        sendResponse({ error: err.message || '알 수 없는 오류' });
      }
    })();

    return true; // 비동기 sendResponse 허용
  }
});
