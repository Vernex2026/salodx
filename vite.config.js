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
        if (req.method !== 'POST') return next()
        if (!apiKey) {
          res.statusCode = 503
          return res.end('API key not configured')
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body)
            if (!Array.isArray(messages) || messages.length === 0) {
              res.statusCode = 400
              return res.end('messages required')
            }
            const client = createAnthropic({ apiKey })
            const result = streamText({
              model: client('claude-haiku-4-5-20251001'),
              system: SYSTEM_PROMPT,
              messages,
              maxOutputTokens: 600,
              temperature: 0.3,
            })
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            for await (const chunk of result.textStream) res.write(chunk)
            res.end()
          } catch (err) {
            console.error('[dev-api/chat] upstream error:', err)
            if (!res.headersSent) {
              res.statusCode = 502
              res.end('upstream error')
            } else {
              res.end()
            }
          }
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
