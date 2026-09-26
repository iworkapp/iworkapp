import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { ENDPOINT } from './cluster'

const connection = new Connection(ENDPOINT, 'confirmed')

export function useSolBalance(address) {
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

    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (active) setSnapshot({ address, balance: lamports / LAMPORTS_PER_SOL })
      })
      .catch(() => {
        if (active) setSnapshot({ address, balance: null })
      })

    return () => {
      active = false
    }
  }, [address])

  if (!address || snapshot.address !== address) return null
  return snapshot.balance
}
