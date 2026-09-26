const WALLETS = [
  {
    id: 'phantom',
    name: 'Phantom',
    installUrl: 'https://phantom.app/download',
    getProvider() {
      const provider = window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null)
      return provider?.isPhantom ? provider : null
    },
  },
  {
    id: 'solflare',
    name: 'Solflare',
    installUrl: 'https://solflare.com/download',
    getProvider() {
      const provider = window.solflare
      return provider?.isSolflare ? provider : null
    },
  },
  {
    id: 'backpack',
    name: 'Backpack',
    installUrl: 'https://backpack.app/download',
    getProvider() {
      const provider = window.backpack
      return provider?.isBackpack ? provider : null
    },
  },
]

export function listInjectedWallets() {
  return WALLETS.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    installUrl: wallet.installUrl,
    installed: Boolean(wallet.getProvider()),
  }))
}

export function providerFor(id) {
  return WALLETS.find((wallet) => wallet.id === id)?.getProvider() ?? null
}

export function addressFromProvider(provider) {
  const key = provider?.publicKey
  if (!key) return ''
  if (typeof key.toBase58 === 'function') return key.toBase58()
  if (typeof key.toString === 'function') return key.toString()
  return ''
}

export function walletName(id) {
  return WALLETS.find((wallet) => wallet.id === id)?.name || 'Wallet'
}
