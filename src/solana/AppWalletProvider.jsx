import { PrivyProvider, useLinkAccount, usePrivy } from '@privy-io/react-auth'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addressFromProvider, listInjectedWallets, providerFor, walletName } from './injectedWallets'
import { SolanaAccountContext, solanaAddressFromUser, xHandleFromUser } from './useSolanaAccount'

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'cmuhz2y8c00ba0blcsvics918'

const privyConfig = {
  appearance: {
    theme: '#100e0c',
    accentColor: '#f1642d',
    walletChainType: 'solana-only',
  },
  loginMethods: ['twitter'],
  embeddedWallets: {
    ethereum: { createOnLogin: 'off' },
    solana: { createOnLogin: 'off' },
  },
}

export function AppWalletProvider({ children }) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <PrivyAccountBridge>{children}</PrivyAccountBridge>
    </PrivyProvider>
  )
}

function PrivyAccountBridge({ children }) {
  const { authenticated, user, login, logout } = usePrivy()
  const { linkTwitter } = useLinkAccount()
  const [wallets, setWallets] = useState(() => listInjectedWallets())
  const [connectedAddress, setConnectedAddress] = useState('')
  const [connectedId, setConnectedId] = useState('')
  const [connectError, setConnectError] = useState('')
  const skipEagerConnect = useRef(false)
  const connectGeneration = useRef(0)

  const refreshWallets = useCallback(() => {
    setWallets(listInjectedWallets())
  }, [])

  useEffect(() => {
    refreshWallets()
    window.addEventListener('phantom#initialized', refreshWallets)
    window.addEventListener('focus', refreshWallets)
    return () => {
      window.removeEventListener('phantom#initialized', refreshWallets)
      window.removeEventListener('focus', refreshWallets)
    }
  }, [refreshWallets])

  useEffect(() => {
    const phantom = providerFor('phantom')
    if (!phantom || skipEagerConnect.current) return undefined
    const generation = connectGeneration.current
    phantom
      .connect({ onlyIfTrusted: true })
      .then(() => {
        if (generation !== connectGeneration.current) return
        const address = addressFromProvider(phantom)
        if (!address) return
        setConnectedId('phantom')
        setConnectedAddress(address)
      })
      .catch(() => {})
    return undefined
  }, [wallets])

  useEffect(() => {
    const provider = connectedId ? providerFor(connectedId) : null
    if (!provider?.on) return undefined
    const onAccount = (publicKey) => {
      if (!publicKey) {
        setConnectedAddress('')
        setConnectedId('')
        return
      }
      const address = typeof publicKey.toBase58 === 'function' ? publicKey.toBase58() : String(publicKey)
      setConnectedAddress(address)
    }
    const onDisconnect = () => {
      setConnectedAddress('')
      setConnectedId('')
    }
    provider.on('accountChanged', onAccount)
    provider.on('disconnect', onDisconnect)
    return () => {
      provider.off?.('accountChanged', onAccount)
      provider.off?.('disconnect', onDisconnect)
    }
  }, [connectedId])

  const connect = useCallback(async (id) => {
    const provider = providerFor(id)
    if (!provider) {
      const wallet = listInjectedWallets().find((item) => item.id === id)
      if (wallet?.installUrl) window.open(wallet.installUrl, '_blank', 'noopener,noreferrer')
      setConnectError(`${walletName(id)} is not installed in this browser.`)
      return false
    }
    setConnectError('')
    const generation = ++connectGeneration.current
    try {
      await provider.connect()
      const address = addressFromProvider(provider)
      if (generation !== connectGeneration.current) return false
      if (!address) {
        setConnectError(`${walletName(id)} did not return an address.`)
        return false
      }
      setConnectedId(id)
      setConnectedAddress(address)
      return true
    } catch (error) {
      if (generation !== connectGeneration.current) return false
      const rejected = error?.code === 4001 || /reject|declin|cancel/i.test(error?.message || '')
      setConnectError(rejected ? `${walletName(id)} connection was cancelled.` : `Could not connect ${walletName(id)}.`)
      return false
    }
  }, [])

  const address = connectedAddress || (authenticated ? solanaAddressFromUser(user) : '')
  const xHandle = authenticated ? xHandleFromUser(user) : ''

  const value = useMemo(
    () => ({
      configured: true,
      ready: true,
      authenticated: Boolean(address) || authenticated,
      address,
      xHandle,
      wallets,
      connectError,
      refreshWallets,
      isInstalled: (id) => Boolean(providerFor(id)),
      login() {},
      connect,
      logout: async () => {
        skipEagerConnect.current = true
        connectGeneration.current += 1
        const provider = connectedId ? providerFor(connectedId) : null
        if (provider?.disconnect) await provider.disconnect().catch(() => {})
        setConnectedAddress('')
        setConnectedId('')
        setConnectError('')
        if (authenticated) await logout()
      },
      linkX: () => {
        if (authenticated) linkTwitter()
        else login({ loginMethods: ['twitter'] })
      },
      linkWallet: () => {},
    }),
    [address, authenticated, xHandle, wallets, connectError, refreshWallets, connect, connectedId, login, logout, linkTwitter],
  )

  return <SolanaAccountContext.Provider value={value}>{children}</SolanaAccountContext.Provider>
}
