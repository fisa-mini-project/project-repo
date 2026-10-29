import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

// Use an isolated profile; never connect to the user's browsing session.
const extension = path.resolve('build')
const context = await chromium.launchPersistentContext('', {
  channel: 'msedge',
  headless: false,
  viewport: null,
  args: [
    `--disable-extensions-except=${extension}`,
    `--load-extension=${extension}`,
    '--window-position=-3000,-3000',
  ],
})
try {
  const sw = context.serviceWorkers()[0] || (await context.waitForEvent('serviceworker'))
  const tab = context.pages()[0]
  await tab.route('https://reader.test/article', (route) =>
    route.fulfill({
      contentType: 'text/html; charset=utf-8',
      body: '<html lang="ko"><title>도서관 안내</title><body><h1>도서관 이용 안내</h1><p>도서관은 화요일부터 일요일까지 열어요. 월요일은 쉬어요.</p></body></html>',
    }),
  )
  await tab.goto('https://reader.test/article')
  const extracted = await sw.evaluate(async () => {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true })
    await chrome.scripting.executeScript({ target: { tabId: active.id }, files: ['lib/readability.js', 'assets/contentScript.js'] })
    return chrome.tabs.sendMessage(active.id, { type: 'CRAWL_PAGE_TEXT' })
  })
  assert.ok(extracted.text.includes('월요일은 쉬어요'), `Native content extraction failed: ${JSON.stringify(extracted)}`)
  console.log('Native content script: article extracted successfully')
  const cdp = await context.browser().newBrowserCDPSession()
  const attach = async (file) => {
    let target
    for (let i = 0; i < 50; i++) {
      target = (await cdp.send('Target.getTargets')).targetInfos.find((t) =>
        t.url.endsWith('/' + file),
      )
      if (target) break
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    assert.ok(target, `Native host did not open ${file}`)
    const { sessionId } = await cdp.send('Target.attachToTarget', {
      targetId: target.targetId,
      flatten: false,
    })
    let id = 0
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const requestId = ++id
        const timeout = setTimeout(() => {
          cdp.off('Target.receivedMessageFromTarget', listener)
          reject(new Error(`CDP timeout: ${method}`))
        }, 10000)
        const listener = (event) => {
          if (event.sessionId !== sessionId) return
          const message = JSON.parse(event.message)
          if (message.id !== requestId) return
          clearTimeout(timeout)
          cdp.off('Target.receivedMessageFromTarget', listener)
          message.error ? reject(message.error) : resolve(message.result)
        }
        cdp.on('Target.receivedMessageFromTarget', listener)
        cdp
          .send('Target.sendMessageToTarget', {
            sessionId,
            message: JSON.stringify({ id: requestId, method, params }),
          })
          .catch(reject)
      })
    const evaluate = async (expression) => {
      const result = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
        userGesture: true,
      })
      assert.ok(!result.exceptionDetails, 'Native page evaluation failed')
      return result.result.value
    }
    for (let i = 0; i < 50; i++) {
      if (await evaluate("!!document.querySelector('.contrast-button')")) break
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    assert.ok(
      await evaluate("!!document.querySelector('.contrast-button')"),
      `${file} did not render reader controls`,
    )
    return { send, evaluate }
  }
  await sw.evaluate(() => chrome.action.openPopup())
  const popup = await attach('popup.html')
  const popupWidth = await popup.evaluate('innerWidth')
  assert.ok(popupWidth >= 400 && popupWidth <= 450, `Native popup collapsed: ${popupWidth}px`)
  assert.ok(
    await popup.evaluate('document.documentElement.scrollWidth <= innerWidth'),
    'Popup horizontal overflow',
  )
  await mkdir('test-results', { recursive: true })
  await writeFile(
    'test-results/native-popup.png',
    Buffer.from((await popup.send('Page.captureScreenshot')).data, 'base64'),
  )
  console.log(`Native toolbar popup: ${popupWidth}px, no horizontal overflow`)
  const windowId = await sw.evaluate(async () => (await chrome.windows.getCurrent()).id)
  await popup.evaluate(`chrome.sidePanel.open({windowId:${windowId}})`)
  const panel = await attach('sidepanel.html')
  assert.equal(await panel.evaluate("document.querySelector('h1').textContent"), 'Easy Reader')
  assert.ok(
    await panel.evaluate(
      "!!document.querySelector('.reader') && !document.querySelector('[role=dialog]')",
    ),
    'Side panel must use shared inline reader',
  )
  assert.ok(
    await panel.evaluate('document.documentElement.scrollWidth <= innerWidth'),
    'Side panel horizontal overflow',
  )
  const panelWidth = await panel.evaluate('innerWidth')
  await writeFile(
    'test-results/native-sidepanel.png',
    Buffer.from((await panel.send('Page.captureScreenshot')).data, 'base64'),
  )
  console.log(`Native side panel: ${panelWidth}px, shared reader loaded, no horizontal overflow`)
} finally {
  await context.close()
}
