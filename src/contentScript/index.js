import Readability from '@mozilla/readability'

function extractMainText() {
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
    sendResponse({ text: extractMainText() })
  }
})
