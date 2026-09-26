const ADMIN_KEY = 'iwork.admin.key'

async function request(path, { method = 'GET', body, admin = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (admin) headers['x-admin-key'] = readAdminKey()
  let response
  try {
    response = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    return { ok: false, reason: 'offline' }
  }
  const data = await response.json().catch(() => null)
  if (!data) return { ok: false, reason: response.ok ? 'server-error' : `http-${response.status}` }
  return data
}

export const fetchBoard = () => request('/api/board')
export const submitClaim = (input) => request('/api/claims', { method: 'POST', body: input })

export function readAdminKey() {
  try {
    return sessionStorage.getItem(ADMIN_KEY) || ''
  } catch {
    return ''
  }
}

export async function openAdmin(key) {
  try {
    sessionStorage.setItem(ADMIN_KEY, key)
  } catch {
    return { ok: false, reason: 'storage' }
  }
  const result = await request('/api/admin/session', { method: 'POST', admin: true })
  if (!result.ok) closeAdmin()
  return result
}

export function closeAdmin() {
  try {
    sessionStorage.removeItem(ADMIN_KEY)
  } catch {
    // Storage can be blocked in private browsing.
  }
}

export const fetchAdminTweets = () => request('/api/admin/tweets', { admin: true })
export const updateAdminTweet = (id, patch) => request(`/api/admin/tweets/${id}`, { method: 'PATCH', body: patch, admin: true })
