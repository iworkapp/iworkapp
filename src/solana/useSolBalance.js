import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { ENDPOINT } from './cluster'

const connection = new Connection(ENDPOINT, 'confirmed')

export function useSolBalance(address, refreshMs = 60_000) {
  const [snapshot, setSnapshot] = useState({ address: '', balance: null })

  useEffect(() => {
    if (!address) return undefined

    let active = true
    let publicKey
    try {
      publicKey = new PublicKey(address)
    } catch {
      return undefined
    }

    const read = () =>
      connection
        .getBalance(publicKey)
        .then((lamports) => {
          if (active) setSnapshot({ address, balance: lamports / LAMPORTS_PER_SOL })
        })
        .catch(() => {
          if (active) setSnapshot((current) => (current.address === address ? current : { address, balance: null }))
        })

    read()
    const timer = window.setInterval(read, refreshMs)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [address, refreshMs])

  if (!address) return null
  if (snapshot.address !== address) return undefined
  return snapshot.balance
}
