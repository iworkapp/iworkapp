import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import TreasuryCard from '../components/TreasuryCard.jsx'
import { useBoard } from '../context/useBoard'
import { formatSol, shortenAddress, solscanTx, timeAgo } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

export default function Payouts() {
  const { tweets, showingSamples, status } = useBoard()
  const [openId, setOpenId] = useState(null)
  usePageTitle('Payouts')

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader
        kicker="Payouts"
        title="Who gets paid"
        lede="Every post a dev marked worth paying, the wallet it pays, and the SOL set on review. Payouts are recorded off-chain first. A sent payout links to its Solana transaction."
      />

      <div className="col-in mt-8">
        <TreasuryCard />
      </div>

      {showingSamples ? <p className="col-in mt-8 text-sm text-faint">No real payouts yet. These rows are samples.</p> : null}

      {status === 'loading' ? (
        <p className="mt-16 text-center text-mute">Loading payouts…</p>
      ) : (
        <ul className="cols mt-6 divide-y divide-line border-y border-line">
          {tweets.map((tweet) => {
            const open = openId === tweet.id
            const reward = formatSol(tweet.reward)
            return (
              <li key={tweet.id}>
                <button
                  type="button"
                  className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : tweet.id)}
                >
                  <span>
                    <span className="block text-cream">
                      <span className="font-medium">{tweet.handle}</span>
                      <span className="text-mute"> · {tweet.txSignature ? 'Sent' : 'Recorded'}</span>
                    </span>
                    <span className="mt-1 block text-sm text-faint">
                      {timeAgo(tweet.createdAt)}
                      {tweet.sample ? ', sample' : ''}
                    </span>
                  </span>
                  <span className="nums shrink-0 font-serif text-2xl text-cream">{reward || 'On review'}</span>
                </button>
                {open ? (
                  <div className="mb-4 rounded-2xl border border-line bg-panel px-4 py-4 text-sm leading-6 text-mute">
                    <p>
                      Pays <span className="nums text-cream">{shortenAddress(tweet.address, 6)}</span>
                    </p>
                    <p className="mt-2 line-clamp-3">{tweet.text}</p>
                    <p className="mt-2">
                      {tweet.sample ? (
                        'Sample row, so the page has a shape before the first real payout.'
                      ) : tweet.txSignature ? (
                        <a href={solscanTx(tweet.txSignature)} target="_blank" rel="noreferrer" className="text-marigold hover:text-marigold-2">
                          View the transaction on Solscan
                        </a>
                      ) : (
                        'Recorded off-chain. The SOL is sent from the treasury wallet.'
                      )}
                    </p>
                    {tweet.url ? (
                      <a href={tweet.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
                        Open the post
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
