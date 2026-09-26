export const TWEET_PAY = 0.25

const TAG = /\$iwork\b/i

export function readStatus(url) {
  try {
    const parsed = new URL(String(url || '').trim())
    const host = parsed.hostname.replace(/^www\./, '')
    if (host !== 'x.com' && host !== 'twitter.com' && host !== 'mobile.twitter.com') return null
    const match = parsed.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status\/(\d+)/)
    if (!match) return null
    return {
      handle: `@${match[1]}`,
      id: match[2],
      url: `https://x.com/${match[1]}/status/${match[2]}`,
    }
  } catch {
    return null
  }
}

function wordsOf(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\$iwork\b/g, ' ')
    .replace(/[@#][\p{L}\p{N}_]+/gu, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1)
}

function similarity(left, right) {
  const a = new Set(left)
  const b = new Set(right)
  if (!a.size || !b.size) return 0
  let shared = 0
  for (const word of a) {
    if (b.has(word)) shared += 1
  }
  return shared / (a.size + b.size - shared)
}

function botReason(text, words) {
  if (/(.)\1{6,}/u.test(text.replace(/\s+/g, ''))) return 'bot-repeat'
  if (words.length < 6) return 'too-thin'
  const counts = new Map()
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1)
  const highest = Math.max(...counts.values())
  if (highest / words.length > 0.4) return 'bot-repeat'
  if (counts.size < 5) return 'bot-thin'
  return ''
}

export function reviewTweet(text, url, existing) {
  if (!TAG.test(text)) return { ok: false, reason: 'missing-tag' }
  const status = readStatus(url)
  if (!status) return { ok: false, reason: 'bad-link' }
  const words = wordsOf(text)
  const bot = botReason(text, words)
  if (bot) return { ok: false, reason: bot }
  const fingerprint = words.join(' ')
  for (const item of existing) {
    const prior = readStatus(item.url)
    if (prior && prior.id === status.id) return { ok: false, reason: 'duplicate' }
    const other = wordsOf(item.text)
    if (other.join(' ') === fingerprint) return { ok: false, reason: 'duplicate' }
    if (similarity(words, other) >= 0.72) return { ok: false, reason: 'not-original' }
  }
  return { ok: true, status }
}
