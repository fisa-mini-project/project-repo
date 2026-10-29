import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const event = () => {
      const listeners = new Set()
      return {
        addListener: (fn) => listeners.add(fn),
        removeListener: (fn) => listeners.delete(fn),
        emit: (...args) => listeners.forEach((fn) => fn(...args)),
      }
    }
    window.__testUrl = 'https://example.com/news?article=1'
    window.chrome = {
      tabs: {
        query: (_query, callback) => callback([{ id: 1, url: window.__testUrl }]),
        onActivated: event(),
        onUpdated: event(),
      },
      runtime: {
        sendMessage: (_message, callback) => {
          window.__summaryReply = callback
        },
      },
    }
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        cancel() {
          window.__cancelled = true
        },
        speak(utterance) {
          window.__utterance = utterance
          utterance.onstart?.()
        },
      },
    })
  })
  await page.goto(`/${testInfo.project.name}.html`)
})

test('copy keeps URL query parameters and gives inline feedback', async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text) => {
          window.__copied = text
        },
      },
    })
  })
  await page.getByRole('button', { name: /주소 복사/ }).click()
  expect(await page.evaluate(() => window.__copied)).toBe('https://example.com/news?article=1')
  await expect(page.getByText('주소를 복사했어요.', { exact: true })).toBeVisible()
})

test('navigation rejects stale summaries and explains unsupported pages', async ({ page }) => {
  await page.getByRole('button', { name: '이 페이지 요약하기', exact: true }).click()
  await page.evaluate(() => {
    window.__testUrl = 'chrome://extensions/'
    chrome.tabs.onUpdated.emit(1, { url: window.__testUrl }, { active: true })
  })
  await expect(page.getByText(/이 화면은 요약할 수 없어요/)).toBeVisible()
  await page.evaluate(() => window.__summaryReply({ title: '이전 페이지', summary: '오래된 결과' }))
  await expect(page.getByRole('heading', { name: '이전 페이지' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '이 페이지 요약하기', exact: true })).toBeDisabled()
})

test('speech failure is announced and restores the listen control', async ({ page }) => {
  await completeSummary(page)
  await page.getByRole('button', { name: '소리로 듣기', exact: true }).click()
  await page.evaluate(() => window.__utterance.onerror({ error: 'voice-unavailable' }))
  await expect(page.getByRole('alert')).toContainText('음성 설정')
  await expect(page.getByRole('button', { name: '소리로 듣기', exact: true })).toBeEnabled()
})

async function completeSummary(page) {
  await page.getByRole('button', { name: '이 페이지 요약하기', exact: true }).click()
  await page.evaluate(() =>
    window.__summaryReply({
      title: '도서관 이용 안내',
      summary: '도서관은 화요일부터 일요일까지 열어요.\n월요일은 쉬어요.',
    }),
  )
}

test('loading skeleton is temporary, reduced-motion aware, and slow requests explain the wait', async ({
  page,
}, testInfo) => {
  await page.clock.install()
  await page.getByRole('button', { name: '이 페이지 요약하기', exact: true }).click()
  await expect(page.locator('.summary-skeleton')).toBeVisible()
  await expect(page.locator('.summary-skeleton')).toHaveAttribute('aria-hidden', 'true')
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-loading.png`,
    fullPage: true,
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(
    await page
      .locator('.skeleton-line')
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none')
  await page.clock.fastForward(12000)
  await expect(page.getByRole('status')).toContainText('조금 더 걸리고 있어요')
  await page.clock.fastForward(54000)
  await expect(page.getByRole('alert')).toContainText('잠시 후')
  await expect(page.locator('.summary-skeleton')).toHaveCount(0)
  await page.getByRole('button', { name: '다시 시도하기', exact: true }).click()
  await page.evaluate(() => window.__summaryReply({ title: '완료', summary: '준비된 요약입니다.' }))
  await expect(page.locator('.summary-skeleton')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '완료', exact: true })).toBeVisible()
})

test('inline summary, loading announcement, speech start and stop', async ({ page }) => {
  await page.getByRole('button', { name: '이 페이지 요약하기', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('요약하고 있어요')
  await expect(page.getByRole('button', { name: '요약 중' })).toBeDisabled()
  await page.evaluate(() =>
    window.__summaryReply({
      title: '도서관 이용 안내',
      summary: '도서관은 화요일부터 일요일까지 열어요.\n월요일은 쉬어요.',
    }),
  )
  await expect(page.getByRole('heading', { name: '도서관 이용 안내' })).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: '소리로 듣기', exact: true }).click()
  await expect(page.getByRole('button', { name: '읽기 중지', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '읽기 중지', exact: true }).click()
  await expect(page.getByRole('button', { name: '소리로 듣기', exact: true })).toBeVisible()
  expect(await page.evaluate(() => window.__cancelled)).toBe(true)
})

test('structured summary exposes evidence, cautions, coverage and speaks all sections', async ({ page }) => {
  await page.getByRole('button', { name: '이 페이지 요약하기', exact: true }).click()
  await page.evaluate(() => window.__summaryReply({
    title: '신청 안내', summary: '이용료 지원을 신청할 수 있어요.',
    keyPoints: [{ text: '지원금은 30,000원이에요.', evidence: '지원금: 30,000원' }],
    cautions: [{ text: '11월 30일까지 신청해야 해요.', evidence: '신청 마감: 11월 30일' }],
    coverage: { truncated: true },
  }))
  await expect(page.getByRole('heading', { name: '핵심 내용', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '주의할 조건', exact: true })).toBeVisible()
  await expect(page.getByText(/글이 길어/)).toBeVisible()
  await page.getByText('원문 근거 보기', { exact: true }).first().click()
  await expect(page.getByText('지원금: 30,000원', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '소리로 듣기', exact: true }).click()
  expect(await page.evaluate(() => window.__utterance.text)).toContain('11월 30일까지')
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([])
})

test('error is announced and can be retried without becoming speakable content', async ({
  page,
}) => {
  await page.getByRole('button', { name: '이 페이지 요약하기', exact: true }).click()
  await page.evaluate(() => window.__summaryReply({ error: 'groq API 요청 실패 (429)' }))
  await expect(page.getByRole('alert')).toContainText('잠시 후')
  await expect(page.getByRole('button', { name: '소리로 듣기', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '다시 시도하기', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('요약하고 있어요')
})

test('reading preferences persist and controls expose selection', async ({ page }) => {
  await page.getByRole('button', { name: '크게', exact: true }).click()
  await page.getByRole('button', { name: /고대비/ }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: '크게', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByRole('button', { name: /고대비/ })).toHaveAttribute('aria-pressed', 'true')
})

test('preferences update in the other open extension surface', async ({
  page,
  context,
}, testInfo) => {
  const peer = await context.newPage()
  await peer.addInitScript(() => {
    const event = { addListener() {}, removeListener() {} }
    window.chrome = {
      tabs: {
        query: (_, callback) => callback([{ url: 'https://example.com/' }]),
        onActivated: event,
        onUpdated: event,
      },
    }
  })
  await peer.goto(testInfo.project.name === 'popup' ? '/sidepanel.html' : '/popup.html')
  await expect(peer.getByRole('button', { name: '크게', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '크게', exact: true }).click()
  await page.getByRole('button', { name: /고대비/ }).click()
  await expect(peer.getByRole('button', { name: '크게', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(peer.getByRole('button', { name: /고대비/ })).toHaveAttribute('aria-pressed', 'true')
})

test('WCAG checks, keyboard focus, target sizes and narrow/large-text layout', async ({
  page,
}, testInfo) => {
  await expect(page.getByRole('button', { name: /주소 복사/ })).toBeEnabled()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: /주소 복사/ })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '이 페이지 요약하기', exact: true })).toBeFocused()
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-initial.png`,
    fullPage: true,
  })
  await completeSummary(page)
  for (const highContrast of [false, true]) {
    if (highContrast) await page.getByRole('button', { name: /고대비/ }).click()
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([])
    await page.screenshot({
      path: `test-results/${testInfo.project.name}-${highContrast ? 'contrast' : 'summary'}.png`,
      fullPage: true,
    })
  }
  await page.getByRole('button', { name: '아주 크게', exact: true }).click()
  if (testInfo.project.name === 'sidepanel') await page.setViewportSize({ width: 320, height: 600 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const targets = await page.getByRole('button').evaluateAll((nodes) =>
    nodes.map((node) => ({
      w: node.getBoundingClientRect().width,
      h: node.getBoundingClientRect().height,
    })),
  )
  expect(targets.every(({ w, h }) => w >= 44 && h >= 44)).toBe(true)
  await page.screenshot({ path: `test-results/${testInfo.project.name}-large.png`, fullPage: true })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(
    await page
      .getByRole('button', { name: /고대비/ })
      .evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('0s')
  await page.getByRole('button', { name: '보통', exact: true }).click()
  await page.evaluate(() => (document.documentElement.style.fontSize = '32px'))
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
