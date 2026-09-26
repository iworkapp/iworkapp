import { Link } from 'react-router-dom'
import FlowDiagram from '../components/FlowDiagram.jsx'
import PageHeader from '../components/PageHeader.jsx'
import TreasuryCard from '../components/TreasuryCard.jsx'
import { useBoard } from '../context/useBoard'
import { formatSol } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

const stages = [
  {
    n: '01',
    title: 'Fees build up on Pump.fun',
    body: 'Every trade of the coin pays a small creator fee.',
  },
  {
    n: '02',
    title: 'The fees are claimed',
    body: 'Claimed creator fees move into the treasury wallet. Its balance is public and read live on this site.',
  },
  {
    n: '03',
    title: 'A dev sets the reward',
    body: 'A post marked worth paying gets its SOL amount on review. Watch and skip get nothing.',
  },
  {
    n: '04',
    title: 'The X user is paid',
    body: 'Payouts are recorded off-chain first, then sent from the treasury. A sent payout links to its transaction. Sends move fully on-chain once volume grows.',
  },
]

export default function CapitalFlow() {
  const { tweets, showingSamples } = useBoard()
  usePageTitle('Capital flow')
  const recent = tweets.slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <PageHeader
        kicker="Capital flow"
        title="Where the SOL comes from"
        lede="Creator fees from the coin fund the treasury. Posts marked worth paying are paid from it. The moving mark on the diagram is that path."
      />

      <div className="col-in mt-10">
        <FlowDiagram />
        <div className="mt-6">
          <TreasuryCard />
        </div>
      </div>

      <ol className="cols mt-10 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2">
        {stages.map((stage) => (
          <li key={stage.n} className="bg-ink px-5 py-6">
            <p className="font-serif text-3xl text-marigold">{stage.n}</p>
            <h2 className="mt-6 text-lg font-semibold">{stage.title}</h2>
            <p className="mt-2 text-sm leading-6 text-mute">{stage.body}</p>
          </li>
        ))}
      </ol>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">{showingSamples ? 'Samples' : 'Worth paying'}</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">Recent payouts</h2>
          </div>
          <Link to="/payouts" className="text-sm font-medium text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
            All payouts
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {recent.map((tweet) => (
            <li key={tweet.id} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="text-cream">
                  <span className="font-medium">{tweet.handle}</span>
                  <span className="text-mute"> · {tweet.txSignature ? 'Sent' : 'Recorded'}</span>
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-faint">{tweet.text}</p>
              </div>
              <p className="nums font-serif text-xl text-cream">{formatSol(tweet.reward) || 'On review'}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
