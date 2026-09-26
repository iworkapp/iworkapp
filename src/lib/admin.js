const SESSION_KEY = 'iwork.admin.session'

export function adminKeyConfigured() {
  return Boolean(import.meta.env.VITE_ADMIN_KEY)
}

export function readAdminSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function unlockAdmin(input) {
  const expected = import.meta.env.VITE_ADMIN_KEY
  if (!expected) return 'missing'
  if (input.trim() !== expected) return 'denied'
  sessionStorage.setItem(SESSION_KEY, '1')
  return 'ok'
}

export function lockAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}
