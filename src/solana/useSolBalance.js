import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useState } from 'react'

export function useSolBalance() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const address = publicKey?.toBase58() ?? ''
  const [snapshot, setSnapshot] = useState({ address: '', balance: null })

  useEffect(() => {
    if (!connected || !publicKey) return undefined

    let active = true
    const nextAddress = publicKey.toBase58()
    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (active) setSnapshot({ address: nextAddress, balance: lamports / LAMPORTS_PER_SOL })
      })
      .catch(() => {
        if (active) setSnapshot({ address: nextAddress, balance: null })
      })

    return () => {
      active = false
    }
  }, [connection, connected, publicKey])

  if (!connected || snapshot.address !== address) return null
  return snapshot.balance
}
