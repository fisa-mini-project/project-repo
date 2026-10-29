import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('build')
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}
http
  .createServer(async (req, res) => {
    const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname)
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403).end()
      return
    }
    try {
      const body = await readFile(file)
      res
        .writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
        .end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  .listen(4173, '127.0.0.1')
