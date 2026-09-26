import { PrivyProvider, useLinkAccount, usePrivy } from '@privy-io/react-auth'
import { toSolanaWalletConnectors, useWallets } from '@privy-io/react-auth/solana'
import { useMemo } from 'react'
import { SolanaAccountContext, solanaAddressFromUser, xHandleFromUser } from './useSolanaAccount'

const solanaConnectors = toSolanaWalletConnectors()

const privyConfig = {
  appearance: {
    theme: '#100e0c',
    accentColor: '#f1642d',
    walletChainType: 'solana-only',
    walletList: ['phantom', 'solflare', 'backpack', 'jupiter', 'detected_solana_wallets'],
    showWalletLoginFirst: true,
  },
  loginMethods: ['wallet', 'twitter'],
  externalWallets: {
    solana: { connectors: solanaConnectors },
  },
  embeddedWallets: {
    ethereum: { createOnLogin: 'off' },
    solana: { createOnLogin: 'off' },
  },
}

export function AppWalletProvider({ children }) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID

  if (!appId) return children

  return (
    <PrivyProvider appId={appId} config={privyConfig}>
      <PrivyAccountBridge>{children}</PrivyAccountBridge>
    </PrivyProvider>
  )
}

function PrivyAccountBridge({ children }) {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const { linkTwitter, linkWallet } = useLinkAccount()
  const connectedAddress = wallets[0]?.address || ''
  const address = authenticated ? connectedAddress || solanaAddressFromUser(user) : ''
  const xHandle = authenticated ? xHandleFromUser(user) : ''

  const value = useMemo(
    () => ({
      configured: true,
      ready,
      authenticated,
      address,
      xHandle,
      login,
      logout: () => logout(),
      linkX: () => linkTwitter(),
      linkWallet: () => linkWallet(),
    }),
    [ready, authenticated, address, xHandle, login, logout, linkTwitter, linkWallet],
  )

  return <SolanaAccountContext.Provider value={value}>{children}</SolanaAccountContext.Provider>
}
