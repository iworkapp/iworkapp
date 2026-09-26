import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useBoard } from '../context/BoardContext.jsx'
import { shortenAddress } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'yours', label: 'This browser' },
  { id: 'sample', label: 'Sample' },
]

export default function Payouts() {
  const { payouts } = useBoard()
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  usePageTitle('Payouts')

  const visible = payouts.filter((payout) => {
    if (filter === 'yours') return Boolean(payout.local)
    if (filter === 'sample') return !payout.local
    return true
  })

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader
        kicker="Payouts"
        title="Who got paid"
        lede="These are the posts an admin marked worth paying. The SOL amount is set when a dev reviews the post."
      />

      <div className="col-in mt-8 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === filter ? 'btn-primary px-4 py-2' : 'btn-ghost px-4 py-2'}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length ? (
        <ul key={filter} className="cols mt-6 divide-y divide-line border-y border-line">
          {visible.map((payout) => {
            const open = openId === payout.id
            return (
              <li key={payout.id}>
                <button
                  type="button"
                  className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : payout.id)}
                >
                  <span>
                    <span className="block text-cream">
                      <span className="font-medium">{payout.worker}</span>
                      <span className="text-mute"> on {payout.gig}</span>
                    </span>
                    <span className="mt-1 block text-sm text-faint">
                      from {payout.client}, {payout.ago}
                      {payout.local ? ', this browser' : ', sample'}
                    </span>
                  </span>
                  <span className="shrink-0 font-serif text-2xl text-cream">On review</span>
                </button>
                {open ? (
                  <div className="mb-4 rounded-2xl border border-line bg-panel px-4 py-4 text-sm leading-6 text-mute">
                    <p>
                      Paid to <span className="nums text-cream">{shortenAddress(payout.address, 6)}</span>
                    </p>
                    <p className="mt-2">
                      {payout.local
                        ? 'Recorded on this desk. It is not a mainnet transaction yet.'
                        : 'Sample activity, so you can see the shape of a finished job.'}
                    </p>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-16 rounded-[28px] border border-dashed border-line px-6 py-16 text-center text-mute">
          No payouts in this view. A post marked worth paying lands here.
        </p>
      )}
    </div>
  )
}
