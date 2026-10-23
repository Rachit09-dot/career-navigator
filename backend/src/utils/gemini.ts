/**
 * gemini.ts — Direct HTTPS wrapper for Gemini API
 * Bypasses the @google/generative-ai SDK which has fetch issues on Node 24.
 * Uses Node's built-in https module instead.
 */

import https from 'https'

const API_BASE = 'generativelanguage.googleapis.com'
const DEFAULT_MODEL = 'gemini-3.5-flash-lite'

function getKey(): string {
  const key = (process.env.GEMINI_API_KEY || '').trim()
  if (!key) throw new Error('GEMINI_API_KEY is not configured in .env')
  return key
}

function httpsPost(path: string, body: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body)
    const req = https.request({
      hostname: API_BASE,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) {
            reject(new Error(`Gemini API error ${parsed.error.code}: ${parsed.error.message}`))
          } else {
            resolve(parsed)
          }
        } catch {
          reject(new Error(`Failed to parse Gemini response: ${data.slice(0, 200)}`))
        }
      })
    })
    req.on('error', reject)
    req.setTimeout(30000, () => { req.destroy(new Error('Gemini request timed out after 30s')) })
    req.write(payload)
    req.end()
  })
}

/**
 * Generate text from a prompt string.
 * Returns the text content of the first candidate.
 */
export async function geminiGenerate(prompt: string, model = DEFAULT_MODEL): Promise<string> {
  const key = getKey()
  const path = `/v1beta/models/${model}:generateContent?key=${key}`
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  }
  const res = await httpsPost(path, body)
  const text = res?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

/**
 * Generate text and parse JSON from the response.
 * Tries to extract a JSON array or object from the text.
 * Returns null if parsing fails.
 */
export async function geminiJSON<T = any>(prompt: string, model = DEFAULT_MODEL): Promise<T | null> {
  const text = await geminiGenerate(prompt, model)
  // Try array first, then object
  const arrayMatch = text.match(/\[[\s\S]*\]/)
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[0]) as T } catch { /* try object */ }
  }
  const objMatch = text.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) as T } catch { /* fall through */ }
  }
  return null
}

/**
 * Chat with history support.
 */
export async function geminiChat(
  history: Array<{ role: 'user' | 'model'; text: string }>,
  newMessage: string,
  systemInstruction?: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const key = getKey()
  const path = `/v1beta/models/${model}:generateContent?key=${key}`

  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    { role: 'user', parts: [{ text: newMessage }] },
  ]

  const body: any = {
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  }

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  const res = await httpsPost(path, body)
  const text = res?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty chat response from Gemini')
  return text
}
