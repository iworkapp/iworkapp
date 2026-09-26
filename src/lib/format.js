export function formatBalance(value) {
  if (value == null || !Number.isFinite(value)) return null
  return value.toLocaleString('en-US', { maximumFractionDigits: 3 })
}

export function shortenAddress(value, size = 4) {
  if (!value) return ''
  if (value.length <= size * 2 + 1) return value
  return `${value.slice(0, size)}…${value.slice(-size)}`
}

export function normalizeHandle(value) {
  const trimmed = value.trim().replace(/\s+/g, '')
  if (!trimmed) return ''
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}

export function tweetUrl(text) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
}
