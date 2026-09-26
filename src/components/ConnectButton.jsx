import { useEffect, useState } from 'react'
import { formatBalance, shortenAddress } from '../lib/format'
import { CLUSTER_LABEL } from '../solana/cluster'
import { useSolanaAccount } from '../solana/useSolanaAccount'
import { useSolBalance } from '../solana/useSolBalance'

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v1.2H6.5A2.5 2.5 0 0 0 4 8.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8.5V16a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-2.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.2 13.2h3.8V16H16a1.4 1.4 0 0 1 0-2.8Z" />
    </svg>
  )
}

export default function ConnectButton({ compact = false }) {
  const account = useSolanaAccount()
  const balance = useSolBalance(account.address)
  const [accountOpen, setAccountOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [connectingId, setConnectingId] = useState('')
  const [copied, setCopied] = useState(false)
  const balanceLabel = formatBalance(balance)
  const label = account.address ? shortenAddress(account.address) : account.xHandle || 'Account'

  useEffect(() => {
    if (!accountOpen && !pickerOpen) return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setAccountOpen(false)
      setPickerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [accountOpen, pickerOpen])

  const openPicker = () => {
    account.refreshWallets()
    setAccountOpen(false)
    setPickerOpen(true)
  }

  const connectPhantom = async () => {
    account.refreshWallets()
    if (!account.isInstalled('phantom')) {
      openPicker()
      return
    }
    setConnectingId('phantom')
    await account.connect('phantom')
    setConnectingId('')
  }

  const chooseWallet = async (id) => {
    setConnectingId(id)
    const connected = await account.connect(id)
    setConnectingId('')
    if (connected) setPickerOpen(false)
  }

  const copyAddress = async () => {
    if (!account.address) return
    try {
      await navigator.clipboard.writeText(account.address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  const buttonClass = compact
    ? 'grid h-11 w-11 place-items-center rounded-2xl border border-line text-cream transition hover:border-cream/30'
    : 'btn-ghost w-full justify-start px-3 py-2'
  const popoverClass = 'absolute bottom-0 left-full z-50 ml-3 w-72 rounded-2xl border border-line bg-panel p-3 shadow-2xl'
  const picker = pickerOpen ? (
    <WalletPicker
      wallets={account.wallets}
      connectingId={connectingId}
      error={account.connectError}
      onChoose={chooseWallet}
      onClose={() => setPickerOpen(false)}
    />
  ) : null

  if (account.address || account.xHandle) {
    return (
      <>
      <div className={`relative ${compact ? 'flex justify-center' : ''}`}>
        <button
          type="button"
          className={buttonClass}
          aria-expanded={accountOpen}
          aria-label={compact ? `Wallet ${label}` : undefined}
          title={compact ? label : undefined}
          onClick={() => setAccountOpen((value) => !value)}
        >
          <WalletIcon />
          {compact ? null : (
            <span className="min-w-0 truncate">
              {account.address && balanceLabel != null ? <span className="nums text-marigold">{balanceLabel} SOL</span> : null}
              <span className={account.address && balanceLabel != null ? 'ml-2' : ''}>{label}</span>
            </span>
          )}
        </button>
        {accountOpen ? (
          <div className={popoverClass}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{CLUSTER_LABEL}</p>
            {account.address ? (
              <>
                <p className="nums mt-2 text-sm text-cream">{shortenAddress(account.address, 6)}</p>
                <p className="mt-1 text-sm text-mute">{balanceLabel != null ? `${balanceLabel} SOL` : 'Balance unavailable'}</p>
              </>
            ) : (
              <button type="button" className="btn-ghost mt-3 w-full px-3 py-2" onClick={openPicker}>
                Connect Solana wallet
              </button>
            )}
            {account.xHandle ? (
              <p className="mt-3 text-sm text-cream">{account.xHandle}</p>
            ) : (
              <button type="button" className="btn-ghost mt-3 w-full px-3 py-2" onClick={() => account.linkX()}>
                Link X
              </button>
            )}
            <div className="mt-3 flex gap-2">
              {account.address ? (
                <button type="button" className="btn-ghost flex-1 px-3 py-2" onClick={copyAddress}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              ) : null}
              <button
                type="button"
                className="btn-primary flex-1 px-3 py-2"
                onClick={() => {
                  account.logout()
                  setAccountOpen(false)
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {picker}
      </>
    )
  }

  return (
    <>
      <div className={compact ? 'flex justify-center' : ''}>
        <button
          type="button"
          className={buttonClass}
          aria-label="Connect wallet"
          title={compact ? 'Connect wallet' : undefined}
          disabled={connectingId === 'phantom'}
          onClick={connectPhantom}
        >
          <WalletIcon />
          {compact ? null : <span>{connectingId === 'phantom' ? 'Waiting for Phantom…' : 'Connect wallet'}</span>}
        </button>
        {account.connectError && !pickerOpen ? <p className="mt-2 px-1 text-xs text-marigold">{account.connectError}</p> : null}
      </div>
      {picker}
    </>
  )
}

function WalletPicker({ wallets, connectingId, error, onChoose, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/70 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-picker-title"
        className="w-full max-w-sm rounded-3xl border border-line bg-panel p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p id="wallet-picker-title" className="font-serif text-2xl text-cream">
          Select your wallet
        </p>
        <p className="mt-1 text-sm text-mute">Connect a Solana wallet. Phantom opens in the extension.</p>
        <div className="mt-4 grid gap-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              className="flex items-center justify-between rounded-2xl border border-line bg-ink/40 px-4 py-3 text-left text-sm font-semibold text-cream transition hover:border-marigold"
              disabled={Boolean(connectingId)}
              onClick={() => onChoose(wallet.id)}
            >
              <span>{wallet.name}</span>
              <span className="text-xs font-medium text-faint">
                {connectingId === wallet.id ? 'Waiting…' : wallet.installed ? 'Installed' : 'Install'}
              </span>
            </button>
          ))}
        </div>
        {error ? <p className="mt-3 text-sm text-marigold">{error}</p> : null}
      </div>
    </div>
  )
}
