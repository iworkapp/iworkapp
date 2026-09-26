import { formatBalance, shortenAddress } from '../lib/format'
import { TREASURY_ADDRESS } from '../solana/treasury'
import { useSolBalance } from '../solana/useSolBalance'

export default function TreasuryCard({ compact = false }) {
  const balance = useSolBalance(TREASURY_ADDRESS)
  const label = formatBalance(balance)
  const amount = balance === undefined ? 'Reading…' : label == null ? 'Unavailable' : `${label} SOL`
  const explorer = `https://solscan.io/account/${TREASURY_ADDRESS}`

  if (compact) {
    return (
      <p className="mt-4 text-sm text-mute">
        Treasury <span className="nums text-cream">{amount}</span>
        <a href={explorer} target="_blank" rel="noreferrer" className="nums text-faint hover:text-cream">
          {' '}
          · {shortenAddress(TREASURY_ADDRESS, 4)}
        </a>
      </p>
    )
  }

  return (
    <article className="rounded-[28px] border border-line bg-panel px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-marigold">Treasury</p>
          <p className="nums mt-3 font-serif text-4xl tracking-tight text-cream">{amount}</p>
        </div>
        <a href={explorer} target="_blank" rel="noreferrer" className="nums text-sm text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
          {shortenAddress(TREASURY_ADDRESS, 6)}
        </a>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-6 text-mute">
        Treasury wallet on Solana mainnet. Posts marked worth paying are paid from this balance, which is read live here.
      </p>
    </article>
  )
}
