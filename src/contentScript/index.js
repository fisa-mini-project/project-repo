 //import Readability from '@mozilla/readability'
const { Readability } = window.Readability || globalThis.Readability

function extractMainText() {
  console.log('[content script] 실행 시작');

  try {
    const docClone = document.cloneNode(true)
    const article = new Readability(docClone).parse()
    return article?.textContent?.slice(0, 5000) || document.body.innerText.slice(0, 5000)
  } catch {
    return document.body.innerText.slice(0, 5000)
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'CRAWL_PAGE_TEXT') {
        const text = document.body.innerText.slice(0, 3000)

    sendResponse({ text: extractMainText() })
    
  }
})
// console.log('[content script] log 실행!');
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.type === 'CRAWL_PAGE_TEXT') {
//     sendResponse({ text: '테스트 통신 성공' });
//   }
// });

