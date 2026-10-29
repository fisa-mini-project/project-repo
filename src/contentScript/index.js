// An isolated-world guard makes repeated on-demand injection safe.
;(() => {
  if (globalThis.__easyReaderContentInstalled) return
  globalThis.__easyReaderContentInstalled = true

  function extractMainText() {
    const clone = document.cloneNode(true)
    clone.querySelectorAll('script, style, noscript, nav, [hidden], [aria-hidden="true"], [role="navigation"]').forEach(node => node.remove())
    let root = clone.querySelector('main, [role="main"], article') || clone.body
    try {
      const Reader = globalThis.Readability
      // Explicit main/article boundaries preserve local deadline footers and caution asides.
      if (root === clone.body && typeof Reader === 'function') {
        const article = new Reader(clone.cloneNode(true)).parse()
        if (article?.content) {
          root = new DOMParser().parseFromString(article.content, 'text/html').body
        }
      }
    } catch {
      // Semantic main content is still usable when Readability cannot parse a page.
    }
    root.querySelectorAll('p, h1, h2, h3, h4, li, tr, section, div, aside, footer, br').forEach(node => node.append('\n'))
    root.querySelectorAll('td, th').forEach(node => node.append(' | '))
    const text = (root.textContent || '').replace(/[\t ]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim()
    return text
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'CRAWL_PAGE_TEXT') sendResponse({ text: extractMainText() })
  })
})()
