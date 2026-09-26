import { createHash, timingSafeEqual } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readStatus, reviewText } from '../src/lib/tweetReview.js'
import { isSolanaAddress, isSolanaSignature } from './base58.js'
import { openStore } from './store.js'
import { lookupTweet, searchTag } from './x.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const dataDir = path.resolve(process.env.DATA_DIR || path.join(root, 'data'))
const port = Number(process.env.PORT || 8787)
const adminKey = process.env.ADMIN_KEY || ''
const bearer = process.env.X_BEARER_TOKEN || ''
const pollMinutes = Math.max(5, Number(process.env.X_POLL_MINUTES || 15))

const store = await openStore(dataDir)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS, ...headers })
  res.end(JSON.stringify(body))
}

function clientIp(req) {
  return String(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
    .split(',')[0]
    .trim()
}

const buckets = new Map()
function limited(key, max, windowMs) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return false
  }
  bucket.count += 1
  return bucket.count > max
}
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) if (bucket.reset < now) buckets.delete(key)
}, 60_000).unref()

async function readJson(req) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > 16_384) throw Object.assign(new Error('too large'), { status: 413 })
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    throw Object.assign(new Error('bad json'), { status: 400 })
  }
}

function digest(value) {
  return createHash('sha256').update(String(value)).digest()
}

function isAdmin(req) {
  if (!adminKey) return false
  const given = req.headers['x-admin-key']
  if (typeof given !== 'string' || !given) return false
  return timingSafeEqual(digest(given), digest(adminKey))
}

function publicTweet(tweet) {
  return {
    id: tweet.id,
    handle: tweet.handle,
    text: tweet.text,
    url: tweet.url,
    address: tweet.address,
    createdAt: tweet.postedAt || tweet.createdAt,
    review: tweet.review,
    reward: tweet.reward,
    txSignature: tweet.txSignature,
    sentAt: tweet.sentAt,
  }
}

function adminTweet(tweet) {
  return { ...publicTweet(tweet), source: tweet.source, verified: Boolean(tweet.verified), claimedAt: tweet.claimedAt || null }
}

async function verifyOnX(statusId) {
  if (!bearer) return { state: 'skipped' }
  try {
    const found = await lookupTweet(bearer, statusId)
    return found ? { state: 'found', tweet: found } : { state: 'missing' }
  } catch (error) {
    console.warn('X lookup failed', error.status || error.message)
    return { state: 'error' }
  }
}

async function handleClaim(req, res) {
  if (limited(`claim:${clientIp(req)}`, 12, 60 * 60 * 1000)) return send(res, 429, { ok: false, reason: 'rate-limited' })
  const body = await readJson(req)
  const url = String(body.url || '').slice(0, 400)
  const address = String(body.address || '').trim()
  let text = String(body.text || '').trim().slice(0, 2000)

  if (!isSolanaAddress(address)) return send(res, 400, { ok: false, reason: 'bad-address' })
  const status = readStatus(url)
  if (!status) return send(res, 400, { ok: false, reason: 'bad-link' })

  const known = store.findByStatus(status.id)
  if (known) {
    if (known.address) return send(res, 409, { ok: false, reason: 'duplicate' })
    const claimed = await store.update(known.id, { address, claimedAt: Date.now() })
    return send(res, 200, { ok: true, tweet: publicTweet(claimed) })
  }

  const check = await verifyOnX(status.id)
  if (check.state === 'missing') return send(res, 400, { ok: false, reason: 'not-found' })
  let handle = status.handle
  let postedAt = null
  if (check.state === 'found') {
    text = check.tweet.text
    handle = check.tweet.username ? `@${check.tweet.username}` : handle
    postedAt = check.tweet.createdAt
  }
  if (!handle) return send(res, 400, { ok: false, reason: 'bad-link' })

  const review = reviewText(text, status, store.tweets())
  if (!review.ok) return send(res, 400, review)

  const tweet = await store.add({
    statusId: status.id,
    handle,
    text,
    url: `https://x.com/${handle.slice(1)}/status/${status.id}`,
    address,
    postedAt,
    source: 'form',
    verified: check.state === 'found',
    claimedAt: Date.now(),
  })
  return send(res, 201, { ok: true, tweet: publicTweet(tweet) })
}

async function handleAdminUpdate(req, res, id) {
  const tweet = store.find(id)
  if (!tweet) return send(res, 404, { ok: false, reason: 'not-found' })
  const body = await readJson(req)
  const patch = {}

  if (body.review !== undefined) {
    if (!['paid', 'watch', 'skip'].includes(body.review)) return send(res, 400, { ok: false, reason: 'bad-review' })
    if (tweet.txSignature && body.review !== 'paid') return send(res, 409, { ok: false, reason: 'already-sent' })
    patch.review = body.review
    if (body.review !== 'paid') patch.reward = null
  }

  if (body.reward !== undefined) {
    if (body.reward === null || body.reward === '') patch.reward = null
    else {
      const reward = Number(body.reward)
      if (!Number.isFinite(reward) || reward <= 0 || reward > 1000) return send(res, 400, { ok: false, reason: 'bad-reward' })
      patch.reward = Math.round(reward * 1e9) / 1e9
    }
  }

  if (body.txSignature !== undefined) {
    const signature = String(body.txSignature || '').trim()
    if (signature && !isSolanaSignature(signature)) return send(res, 400, { ok: false, reason: 'bad-signature' })
    patch.txSignature = signature
    patch.sentAt = signature ? tweet.sentAt || Date.now() : null
  }

  const next = { ...tweet, ...patch }
  if (next.txSignature && !next.address) return send(res, 400, { ok: false, reason: 'send-needs-address' })
  if (next.txSignature && (next.review !== 'paid' || next.reward == null)) return send(res, 400, { ok: false, reason: 'send-needs-reward' })

  const updated = await store.update(id, patch)
  return send(res, 200, { ok: true, tweet: adminTweet(updated) })
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/health' && req.method === 'GET') {
    return send(res, 200, { ok: true, admin: Boolean(adminKey), x: Boolean(bearer) })
  }

  if (pathname === '/api/board' && req.method === 'GET') {
    const tweets = store
      .tweets()
      .filter((tweet) => tweet.review === 'paid')
      .map(publicTweet)
    return send(res, 200, { ok: true, tweets })
  }

  if (pathname === '/api/claims' && req.method === 'POST') return handleClaim(req, res)

  if (pathname.startsWith('/api/admin/')) {
    if (!adminKey) return send(res, 503, { ok: false, reason: 'admin-off' })
    if (limited(`admin:${clientIp(req)}`, 300, 15 * 60 * 1000)) return send(res, 429, { ok: false, reason: 'rate-limited' })
    if (!isAdmin(req)) return send(res, 401, { ok: false, reason: 'denied' })

    if (pathname === '/api/admin/session' && req.method === 'POST') return send(res, 200, { ok: true })
    if (pathname === '/api/admin/tweets' && req.method === 'GET') {
      return send(res, 200, { ok: true, tweets: store.tweets().map(adminTweet), x: Boolean(bearer), lastPoll: store.meta().xLastPoll || null })
    }
    const match = pathname.match(/^\/api\/admin\/tweets\/([\w-]{1,64})$/)
    if (match && req.method === 'PATCH') return handleAdminUpdate(req, res, match[1])
  }

  return send(res, 404, { ok: false, reason: 'not-found' })
}

async function serveStatic(req, res, pathname) {
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    decoded = '/'
  }
  const target = path.normalize(path.join(distDir, decoded))
  const inside = target === distDir || target.startsWith(distDir + path.sep)
  let file = inside ? target : ''
  let info = file ? await stat(file).catch(() => null) : null

  if (!info || info.isDirectory()) {
    if (path.extname(decoded) || decoded.startsWith('/assets/')) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS })
      return res.end('Not found')
    }
    file = path.join(distDir, 'index.html')
    info = await stat(file).catch(() => null)
    if (!info) {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('Build the site first with npm run build.')
    }
  }

  const immutable = decoded.startsWith('/assets/')
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    ...SECURITY_HEADERS,
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url || '/', 'http://localhost')
  try {
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname)
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { ok: false, reason: 'method' })
    return await serveStatic(req, res, pathname)
  } catch (error) {
    if (!res.headersSent) send(res, error.status || 500, { ok: false, reason: error.status ? 'bad-request' : 'server-error' })
    if (!error.status) console.error(error)
  }
})

async function pollX() {
  if (!bearer) return
  try {
    const { newestId, tweets } = await searchTag(bearer, store.meta().xSinceId)
    let added = 0
    for (const found of tweets.reverse()) {
      if (!found.username || store.findByStatus(found.id)) continue
      const status = { id: found.id, handle: `@${found.username}`, url: `https://x.com/${found.username}/status/${found.id}` }
      if (!reviewText(found.text, status, store.tweets()).ok) continue
      await store.add({
        statusId: found.id,
        handle: status.handle,
        text: found.text,
        url: status.url,
        address: '',
        postedAt: found.createdAt,
        source: 'x',
        verified: true,
      })
      added += 1
    }
    await store.setMeta({ xSinceId: newestId || store.meta().xSinceId, xLastPoll: Date.now() })
    if (added) console.log(`X poll added ${added} post(s)`)
  } catch (error) {
    console.warn('X poll failed', error.status || error.message)
  }
}

server.listen(port, () => {
  console.log(`iwork desk on :${port}, data in ${store.file}, admin ${adminKey ? 'on' : 'off'}, X ${bearer ? 'on' : 'off'}`)
  pollX()
  setInterval(pollX, pollMinutes * 60 * 1000).unref()
})
