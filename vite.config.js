import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { SYSTEM_PROMPT } from './api/_system-prompt.js'

function devApiPlugin(apiKey) {
  return {
    name: 'vernex-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          return res.end(
            JSON.stringify({
              ok: Boolean(apiKey),
              model: 'claude-haiku-4-5-20251001',
              hasKey: Boolean(apiKey),
            })
          )
        }
        if (req.method !== 'POST') return next()
        if (!apiKey) {
          res.statusCode = 503
          return res.end('API key not configured')
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          let messages
          try {
            messages = JSON.parse(body).messages
          } catch {
            res.statusCode = 400
            return res.end('invalid JSON')
          }
          if (!Array.isArray(messages) || messages.length === 0) {
            res.statusCode = 400
            return res.end('messages required')
          }
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          const client = createAnthropic({ apiKey })
          const result = streamText({
            model: client('claude-haiku-4-5-20251001'),
            system: SYSTEM_PROMPT,
            messages,
            maxOutputTokens: 600,
            temperature: 0.3,
            onError({ error }) {
              console.error('[dev-api/chat] stream error:', error)
            },
          })
          try {
            for await (const chunk of result.textStream) res.write(chunk)
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            res.write(`\n\n[upstream-error] ${msg}`)
          }
          res.end()
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), devApiPlugin(env.ANTHROPIC_API_KEY)],
  }
})
