import { Link } from 'react-router-dom'
import CoinAddress from '../components/CoinAddress.jsx'
import PayoutTape from '../components/PayoutTape.jsx'
import TreasuryCard from '../components/TreasuryCard.jsx'
import TweetCard from '../components/TweetCard.jsx'
import { useBoard } from '../context/useBoard'
import { formatSol, timeAgo } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

const steps = [
  {
    n: '01',
    title: 'Tweet with $iwork',
    body: 'Write an original post on X and include $iwork in it.',
  },
  {
    n: '02',
    title: 'Claim it here',
    body: 'Paste the link and the Solana wallet that should be paid. The desk checks it against X.',
  },
  {
    n: '03',
    title: 'A dev reviews it',
    body: 'Worth paying puts it on the board. Watch holds it. Skip leaves it off.',
  },
  {
    n: '04',
    title: 'The SOL is set',
    body: 'The dev sets the amount on review. It is paid from the treasury wallet.',
  },
]

export default function Home() {
  const { tweets, showingSamples, paidCount, solRecorded } = useBoard()
  usePageTitle('')
  const featured = tweets[0]
  const preview = tweets.slice(0, 3)

  return (
    <>
      <section className="cols mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-powder">Solana. Tweet to get paid</p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            Tweet the work.
            <span className="mt-2 block">
              Get <span className="italic text-marigold">paid</span> in SOL.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-mute">
            Tweet with $iwork. A dev marks the post worth paying when it is original, unique, and written by a real person.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tweet" className="btn-primary">
              Tweet to get paid
            </Link>
            <Link to="/board" className="btn-ghost">
              See the board
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Paid posts</dt>
              <dd className="nums mt-2 font-serif text-3xl">{paidCount}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">SOL set</dt>
              <dd className="nums mt-2 font-serif text-3xl">{solRecorded ? formatSol(solRecorded).replace(' SOL', '') : '0'}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Reward</dt>
              <dd className="mt-2 whitespace-nowrap font-serif text-3xl">On review</dd>
            </div>
          </dl>
          <TreasuryCard compact />
          <CoinAddress className="mt-3" />
        </div>

        {featured ? (
          <div className="relative">
            <article className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                <span>{showingSamples ? 'Sample post' : 'Latest on the desk'}</span>
                <span className="text-mint">Worth paying</span>
              </div>
              <div className="mt-5 rounded-2xl bg-cream px-5 py-5 text-ink">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                  <span>{featured.handle}</span>
                  <span>{timeAgo(featured.createdAt)}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/80">{featured.text}</p>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Reward</p>
                  <p className="nums mt-1 font-serif text-4xl text-cream">{formatSol(featured.reward) || 'On review'}</p>
                </div>
                {featured.url ? (
                  <a href={featured.url} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2">
                    Open post
                  </a>
                ) : null}
              </div>
            </article>
          </div>
        ) : null}
      </section>

      <PayoutTape tweets={tweets} />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="col-in flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">On the board</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">{showingSamples ? 'What a paid post looks like' : 'Posts worth paying'}</h2>
          </div>
          <Link to="/board" className="text-sm font-medium text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
            See every post
          </Link>
        </div>
        {showingSamples ? <p className="mt-3 text-sm text-faint">These are samples. Real posts replace them once the first one is marked worth paying.</p> : null}
        <div className="cols mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {preview.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="col-in">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">How a tweet becomes a payout</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl tracking-tight">From your post to SOL</h2>
        </div>
        <ol className="cols mt-8 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="bg-ink px-5 py-6">
              <p className="font-serif text-3xl text-marigold">{step.n}</p>
              <h3 className="mt-8 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
