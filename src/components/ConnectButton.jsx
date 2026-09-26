import { WalletReadyState } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useId, useState } from 'react'
import { formatBalance, shortenAddress } from '../lib/format'
import { CLUSTER_LABEL } from '../solana/cluster'
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
  const { wallets, wallet, select, connect, disconnect, connected, connecting, publicKey } = useWallet()
  const balance = useSolBalance()
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const titleId = useId()
  const address = publicKey?.toBase58() ?? ''
  const balanceLabel = formatBalance(balance)

  if (connected && (pending || open)) {
    if (pending) setPending(null)
    if (open) setOpen(false)
  }

  useEffect(() => {
    if (!pending || !wallet || connected) return undefined
    if (wallet.adapter.name !== pending) return undefined

    let active = true
    connect()
      .then(() => {
        if (!active) return
        setPending(null)
        setOpen(false)
      })
      .catch((err) => {
        if (!active) return
        setPending(null)
        setError(err?.message || 'Connection cancelled')
      })

    return () => {
      active = false
    }
  }, [pending, wallet, connected, connect])

  useEffect(() => {
    if (!open && !accountOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setAccountOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, accountOpen])

  const choose = (entry) => {
    if (entry.readyState === WalletReadyState.NotDetected && entry.adapter.url) {
      window.open(entry.adapter.url, '_blank', 'noopener,noreferrer')
      return
    }
    setError('')
    setPending(entry.adapter.name)
    select(entry.adapter.name)
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  const popoverClass = 'absolute bottom-0 left-full z-50 ml-3 w-64 rounded-2xl border border-line bg-panel p-3 shadow-2xl'

  if (connected && address) {
    return (
      <div className={`relative ${compact ? 'flex justify-center' : ''}`}>
        <button
          type="button"
          className={compact ? 'grid h-11 w-11 place-items-center rounded-2xl border border-line text-cream transition hover:border-cream/30' : 'btn-ghost w-full justify-start px-3 py-2'}
          aria-expanded={accountOpen}
          aria-label={compact ? `Wallet ${shortenAddress(address)}` : undefined}
          title={compact ? shortenAddress(address) : undefined}
          onClick={() => setAccountOpen((value) => !value)}
        >
          <WalletIcon />
          {compact ? null : (
            <span className="min-w-0 truncate">
              {balanceLabel != null ? <span className="nums text-marigold">{balanceLabel} SOL</span> : null}
              <span className={balanceLabel != null ? 'ml-2' : ''}>{shortenAddress(address)}</span>
            </span>
          )}
        </button>
        {accountOpen ? (
          <div className={popoverClass}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{CLUSTER_LABEL}</p>
            <p className="nums mt-2 text-sm text-cream">{shortenAddress(address, 6)}</p>
            <p className="mt-1 text-sm text-mute">{balanceLabel != null ? `${balanceLabel} SOL` : 'Balance unavailable'}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn-ghost flex-1 px-3 py-2" onClick={copyAddress}>
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                className="btn-primary flex-1 px-3 py-2"
                onClick={() => {
                  disconnect().catch(() => {})
                  setAccountOpen(false)
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <div className={compact ? 'flex justify-center' : ''}>
      <button
        type="button"
        className={compact ? 'grid h-11 w-11 place-items-center rounded-2xl border border-line text-cream transition hover:border-cream/30' : 'btn-ghost w-full justify-start px-3 py-2'}
        aria-label={connecting || pending ? 'Connecting wallet' : 'Connect wallet'}
        title={compact ? 'Connect wallet' : undefined}
        onClick={() => {
          setError('')
          setOpen(true)
        }}
      >
        <WalletIcon />
        {compact ? null : <span>{connecting || pending ? 'Connecting…' : 'Connect wallet'}</span>}
      </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button
            type="button"
            aria-label="Close wallet list"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-md rounded-[28px] border border-line bg-panel p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Solana {CLUSTER_LABEL}</p>
                <h2 id={titleId} className="mt-2 font-serif text-3xl tracking-tight">
                  Connect a wallet
                </h2>
              </div>
              <button type="button" className="btn-ghost px-3 py-2" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-mute">
              iwork reads your balance. A post marked worth paying is saved in this browser until the payout is on-chain.
            </p>
            <ul className="mt-5 space-y-2">
              {wallets.map((entry) => {
                const detected = entry.readyState === WalletReadyState.Installed || entry.readyState === WalletReadyState.Loadable
                return (
                  <li key={entry.adapter.name}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-3 text-left transition hover:border-marigold/50"
                      onClick={() => choose(entry)}
                    >
                      <img src={entry.adapter.icon} alt="" className="h-8 w-8 rounded-lg" />
                      <span className="flex-1 font-medium">{entry.adapter.name}</span>
                      <span className="text-xs uppercase tracking-[0.14em] text-faint">{detected ? 'Detected' : 'Install'}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {error ? <p className="mt-4 text-sm text-marigold">{error}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
