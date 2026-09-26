import { Link } from 'react-router-dom'
import FlowDiagram from '../components/FlowDiagram.jsx'
import PageHeader from '../components/PageHeader.jsx'
import TreasuryCard from '../components/TreasuryCard.jsx'
import { useBoard } from '../context/BoardContext.jsx'
import { usePageTitle } from '../lib/usePageTitle'

const stages = [
  {
    n: '01',
    title: 'The tweet arrives',
    body: 'A public post with $iwork is the claim. The link, the line, and the wallet come in together.',
  },
  {
    n: '02',
    title: 'The desk checks it',
    body: 'A bot pattern, a copy, or a duplicate never enters the queue. Failed checks leave no post.',
  },
  {
    n: '03',
    title: 'A dev reviews it',
    body: 'Worth paying puts it on the board. Watch holds it. Skip leaves it off. The SOL amount is chosen here.',
  },
  {
    n: '04',
    title: 'The record stays local',
    body: 'A post marked worth paying is written into this browser with the wallet that should be paid. No mainnet send happens yet.',
  },
]

const reviewLabel = {
  paid: 'Worth paying',
  watch: 'Watch',
  skip: 'Skip',
}

export default function CapitalFlow() {
  const { allTweets } = useBoard()
  usePageTitle('Capital flow')
  const recent = [...allTweets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <PageHeader
        kicker="Capital flow"
        title="How a post moves"
        lede="A tweet enters the desk, a dev reviews it, and the reward is set then. The moving mark on the diagram is that path."
      />

      <div className="col-in mt-10">
        <FlowDiagram />
        <p className="mt-3 text-sm text-faint">Pump.fun, then the fee is claimed, then it is sent to the X user.</p>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">On the desk</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">Recent posts</h2>
          </div>
          <Link to="/board" className="text-sm font-medium text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
            Open the board
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {recent.map((tweet) => (
            <li key={tweet.id} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="text-cream">
                  <span className="font-medium">{tweet.handle}</span>
                  <span className="text-mute"> · {reviewLabel[tweet.review] || 'Watch'}</span>
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-faint">{tweet.text}</p>
              </div>
              <p className="font-serif text-xl text-cream">On review</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
