export function formatBalance(value) {
  if (value == null || !Number.isFinite(value)) return null
  return value.toLocaleString('en-US', { maximumFractionDigits: 3 })
}

export function formatSol(value) {
  if (value == null || !Number.isFinite(Number(value))) return ''
  return `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 })} SOL`
}

export function shortenAddress(value, size = 4) {
  if (!value) return ''
  if (value.length <= size * 2 + 1) return value
  return `${value.slice(0, size)}…${value.slice(-size)}`
}

export function timeAgo(timestamp, now = Date.now()) {
  if (!timestamp) return ''
  const minutes = Math.max(0, Math.round((now - timestamp) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function agoText(timestamp) {
  const label = timeAgo(timestamp)
  if (!label || label === 'just now') return label
  return /\d[mhd]$/.test(label) ? `${label} ago` : `on ${label}`
}

export function tweetUrl(text) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export function solscanTx(signature) {
  return `https://solscan.io/tx/${signature}`
}
