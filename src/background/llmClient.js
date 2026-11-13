export async function requestSummary(text, env, fetchImpl = fetch) {
  const baseUrl = env.VITE_SUMMARY_SERVER_URL?.trim() || 'http://localhost:3001'
  const response = await fetchImpl(new URL('/api/summary', baseUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(28000),
    body: JSON.stringify({ text }),
  })
  if (!response.ok) {
    throw new Error('요약 서버에서 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }
  return response.json()
}
