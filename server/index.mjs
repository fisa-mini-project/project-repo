import { readingLanguages } from './languages.mjs'
import { createServer } from 'node:http'
import { requestSummary } from './llmClient.mjs'

const maxBodyBytes = 1024 * 1024
const port = Number(process.env.PORT || 3001)
let active = 0

const server = createServer(async (req, res) => {
  function reply(status, body) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(body))
  }

  if (req.method === 'GET' && req.url === '/health') return reply(200, { ok: true })
  if (req.method !== 'POST' || !['/api/summary', '/api/translation'].includes(req.url)) return reply(404, { error: 'not_found' })
  if (active >= 4) return reply(429, { error: 'busy' })

  active++
  try {
    const chunks = []
    let size = 0
    for await (const chunk of req.iterator({ destroyOnReturn: false })) {
      size += chunk.length
      if (size > maxBodyBytes) {
        res.setHeader('Connection', 'close')
        return reply(413, { error: 'body_too_large' })
      }
      chunks.push(chunk)
    }

    let input
    try {
      input = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      return reply(400, { error: 'invalid_json' })
    }
    if (typeof input?.text !== 'string' || !input.text.trim()) {
      return reply(400, { error: 'text_required' })
    }

    const language = input.language === undefined ? 'ko' : input.language
    if (typeof language !== 'string' || !Object.hasOwn(readingLanguages, language)) {
      return reply(400, { error: 'unsupported_language' })
    }
    reply(200, await requestSummary(input.text, process.env, fetch, {
      language,
      translate: req.url === '/api/translation',
    }))
  } catch (error) {
    console.error('Summary request failed:', error.name)
    if (!res.destroyed) reply(error.name === 'TimeoutError' ? 504 : 502, { error: 'summary_failed' })
  } finally {
    active--
  }
})

server.listen(port, process.env.BIND_HOST || 'localhost', () => {
  console.log('Summary server listening on port', port)
})
