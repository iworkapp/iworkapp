const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const INDEX = new Map([...ALPHABET].map((char, index) => [char, index]))

export function decodedLength(value) {
  if (typeof value !== 'string' || !value) return -1
  let bytes = [0]
  for (const char of value) {
    const digit = INDEX.get(char)
    if (digit === undefined) return -1
    let carry = digit
    for (let i = 0; i < bytes.length; i += 1) {
      carry += bytes[i] * 58
      bytes[i] = carry & 0xff
      carry >>= 8
    }
    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }
  let zeros = 0
  while (value[zeros] === '1') zeros += 1
  while (bytes.length > 1 && bytes[bytes.length - 1] === 0) bytes = bytes.slice(0, -1)
  const body = bytes.length === 1 && bytes[0] === 0 ? 0 : bytes.length
  return zeros + body
}

export function isSolanaAddress(value) {
  return decodedLength(String(value || '').trim()) === 32
}

export function isSolanaSignature(value) {
  return decodedLength(String(value || '').trim()) === 64
}
