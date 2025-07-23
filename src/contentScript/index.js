console.info('contentScript is running')
// src/contentScript/index.js
// 간단한 텍스트 추출 (나중에 web-content-extractor로 개선 가능)
const mainText = document.body.innerText.slice(0, 3000)

chrome.runtime.sendMessage({
  type: 'SUMMARY_REQUEST',
  text: mainText,
})
