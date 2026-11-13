export async function requestSummary(text, env, fetchImpl = fetch, { language } = {}) {
  const baseUrl = env.VITE_SUMMARY_SERVER_URL?.trim() || 'http://localhost:3001'
  const summaryUrl = new URL('/api/summary', baseUrl)

  // Wake hosted instances before sending the page or spending an LLM request.
  if (summaryUrl.protocol === 'https:') {
    const healthUrl = new URL('/health', baseUrl)
    let ready = false
    for (let attempt = 0; attempt < 2 && !ready; attempt++) {
      try {
        const health = await fetchImpl(healthUrl, { cache: 'no-store', signal: AbortSignal.timeout(15000) })
        ready = health.ok && health.headers.get('content-type')?.includes('application/json')
          && (await health.json()).ok === true
      } catch {
        // A sleeping instance may miss the first probe.
      }
      if (!ready && attempt === 0) await new Promise(resolve => setTimeout(resolve, 1000))
    }
    if (!ready) throw new Error('SUMMARY_SERVER_UNAVAILABLE')
  }

  const response = await fetchImpl(summaryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(28000),
    body: JSON.stringify({ text, language }),
  })
  if (!response.ok) throw new Error('SUMMARY_HTTP_' + response.status)
  return response.json()
}
