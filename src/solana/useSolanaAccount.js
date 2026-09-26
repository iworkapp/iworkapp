import { createContext, useContext } from 'react'

export const SolanaAccountContext = createContext({
  configured: false,
  ready: true,
  authenticated: false,
  address: '',
  xHandle: '',
  wallets: [],
  connectError: '',
  refreshWallets() {},
  isInstalled() {
    return false
  },
  login() {},
  connect() {},
  logout() {},
  linkX() {},
  linkWallet() {},
})

export function useSolanaAccount() {
  return useContext(SolanaAccountContext)
}

export function solanaAddressFromUser(user) {
  const linked = user?.linkedAccounts?.find((account) => account.type === 'wallet' && account.chainType === 'solana')
  if (linked?.address) return linked.address
  if (user?.wallet?.chainType === 'solana' && user.wallet.address) return user.wallet.address
  return ''
}

export function xHandleFromUser(user) {
  const username = user?.twitter?.username?.trim()
  if (!username) return ''
  return username.startsWith('@') ? username : `@${username}`
}
