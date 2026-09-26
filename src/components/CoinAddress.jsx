import { useState } from 'react'
import { shortenAddress } from '../lib/format'
import { COIN_ADDRESS } from '../solana/coin'

export default function CoinAddress({ className = '' }) {
  const [copied, setCopied] = useState(false)
  if (!COIN_ADDRESS) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COIN_ADDRESS)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">CA</span>
      <button
        type="button"
        onClick={copy}
        title={COIN_ADDRESS}
        className="nums rounded-full border border-line px-3 py-1.5 text-cream hover:border-marigold"
        aria-label={`Copy contract address ${COIN_ADDRESS}`}
      >
        <span className="sm:hidden">{shortenAddress(COIN_ADDRESS, 6)}</span>
        <span className="hidden sm:inline">{COIN_ADDRESS}</span>
      </button>
      <span className="text-mint" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
      <a href={`https://pump.fun/coin/${COIN_ADDRESS}`} target="_blank" rel="noreferrer" className="text-mute underline decoration-line underline-offset-4 hover:text-cream hover:decoration-marigold">
        Pump.fun
      </a>
    </div>
  )
}
