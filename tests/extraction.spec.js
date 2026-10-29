import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('extracts late article conditions and preserves tables without duplicate listeners', async ({ page }) => {
  await page.goto('/popup.html')
  await page.setContent(`<nav>메뉴 광고</nav><main><h1>지원 안내</h1>${'<p>이 사업은 주민의 도서관 이용을 돕기 위한 지원 사업입니다.</p>'.repeat(220)}<table><tr><th>금액</th><td>30,000원</td></tr></table><footer>마감일은 11월 30일입니다.</footer><aside>예산 소진 시 조기 마감</aside></main>`)
  await page.evaluate(() => {
    window.__listeners = []
    window.chrome = { runtime: { onMessage: { addListener: fn => window.__listeners.push(fn) } } }
  })
  await page.addScriptTag({ content: await readFile('public/lib/readability.js', 'utf8') })
  const content = await readFile('src/contentScript/index.js', 'utf8')
  await page.addScriptTag({ content })
  await page.addScriptTag({ content })
  const result = await page.evaluate(() => {
    let response
    window.__listeners[0]({ type: 'CRAWL_PAGE_TEXT' }, {}, value => { response = value })
    return { ...response, listeners: window.__listeners.length }
  })
  expect(result.text).toContain('마감일은 11월 30일')
  expect(result.text).toContain('30,000원')
  expect(result.text).toContain('예산 소진 시 조기 마감')
  expect(result.text).not.toContain('메뉴 광고')
  expect(result.listeners).toBe(1)
})
