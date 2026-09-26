import { PublicKey } from '@solana/web3.js'

export function isSolanaAddress(value) {
  try {
    const key = new PublicKey(value.trim())
    return Boolean(key)
  } catch {
    return false
  }
}
