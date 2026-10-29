import test from 'node:test'
import assert from 'node:assert/strict'
import { requestSummary } from './llmClient.js'

const result = { title: '중괄호 {예시}', summary: '쉬운 요약입니다.\n두 번째 문장입니다.' }
const grounded = { ...result, keyPoints: [{ text: '원문에 있는 내용', evidence: '원문' }], cautions: [] }

for (const provider of ['groq', 'ollama']) {
  test(`${provider}: sends configured credentials/model and returns complete JSON`, async () => {
    const env = {
      VITE_LLM_PROVIDER: provider,
      VITE_GROQ_API_KEY: 'groq-test', VITE_GROQ_MODEL: 'groq-model',
      VITE_OLLAMA_API_KEY: 'ollama-test', VITE_OLLAMA_MODEL: 'ollama-model',
    }
    const summary = await requestSummary('원문', env, async (url, options) => {
      assert.equal(url, provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://ollama.com/api/chat')
      assert.equal(options.headers.Authorization, `Bearer ${provider}-test`)
      const body = JSON.parse(options.body)
      assert.equal(body.model, `${provider}-model`)
      assert.ok(body.messages[1].content.includes('원문'))
      assert.equal(body.stream, false)
      const content = JSON.stringify(grounded)
      return Response.json(provider === 'groq' ? { choices: [{ message: { content } }] } : { message: { content } })
    })
    assert.equal(summary.title, result.title)
    assert.deepEqual(summary.keyPoints, grounded.keyPoints)
  })
}

test('missing key and unsupported provider never send a request', async () => {
  const noFetch = () => assert.fail('must not send request')
  await assert.rejects(requestSummary('text', {}, noFetch), /API 키/)
  await assert.rejects(requestSummary('text', { VITE_LLM_PROVIDER: 'unknown' }, noFetch), /제공자/)
})

test('rejects fabricated evidence and malformed structured sections', async () => {
  for (const bad of [
    { ...grounded, keyPoints: [{ text: '허구', evidence: '없는 문장' }] },
    { ...grounded, keyPoints: [] },
    { ...grounded, cautions: ['잘못된 형식'] },
  ]) {
    await assert.rejects(requestSummary('원문', { VITE_GROQ_API_KEY: 'test' }, async () =>
      Response.json({ choices: [{ message: { content: JSON.stringify(bad) } }] })))
  }
})

test('includes the end of a long article and reports capped coverage', async () => {
  for (const length of [15000, 70000]) {
    const source = '앞부분 '.repeat(length / 5) + '마지막 신청 조건'
    const output = await requestSummary(source, { VITE_GROQ_API_KEY: 'test' }, async (_, options) => {
      const body = JSON.parse(options.body)
      const input = JSON.parse(body.messages[1].content)
      assert.equal(input.truncated, source.length > 48000)
      if (source.length < 48000) assert.ok(input.text.endsWith('마지막 신청 조건'))
      assert.ok(input.text.length <= 48000)
      return Response.json({ choices: [{ message: { content: JSON.stringify({ ...grounded,
        keyPoints: [{ text: '앞부분', evidence: '앞부분' }] }) } }] })
    })
    assert.equal(output.coverage.truncated, source.length > 48000)
  }
})

test('HTTP failures expose status without echoing server payload or credentials', async () => {
  await assert.rejects(requestSummary('text', { VITE_GROQ_API_KEY: 'secret' }, async () => new Response('secret', { status: 401 })), /^Error: groq API 요청 실패 \(401\)$/)
})

test('invalid or missing summary fields are rejected', async () => {
  for (const content of ['not json', '{}', '{"title":"title","summary":42}']) {
    await assert.rejects(requestSummary('text', { VITE_GROQ_API_KEY: 'test' }, async () => Response.json({ choices: [{ message: { content } }] })))
  }
})

