import { Link } from 'react-router-dom'
import PayoutTape from '../components/PayoutTape.jsx'
import TweetCard from '../components/TweetCard.jsx'
import { useBoard } from '../context/BoardContext.jsx'
import { formatSol } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

const steps = [
  {
    n: '01',
    title: 'Tweet with $iwork',
    body: 'The post is the claim. It needs the tag, a real sentence, and a link to that status.',
  },
  {
    n: '02',
    title: 'Desk checks the post',
    body: 'A bot pattern, a copy, or a duplicate never enters the queue.',
  },
  {
    n: '03',
    title: 'Admin reviews it',
    body: 'Worth paying puts it on the board. Watch holds it. Skip leaves it off.',
  },
  {
    n: '04',
    title: 'The SOL is recorded',
    body: 'A post marked worth paying shows up here with the wallet that should be paid.',
  },
]

export default function Home() {
  const { tweets, payouts } = useBoard()
  usePageTitle('')
  const featured = [...tweets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
  const preview = [...tweets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 3)
  const paid = tweets.reduce((sum, tweet) => sum + Number(tweet.sol), 0)

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
            Tweet with $iwork. An admin marks the post worth paying when it is original, unique, and not a bot.
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
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Posts</dt>
              <dd className="nums mt-2 font-serif text-3xl">{tweets.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Paid</dt>
              <dd className="nums mt-2 font-serif text-3xl">{formatSol(paid)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Receipts</dt>
              <dd className="nums mt-2 font-serif text-3xl">{payouts.length}</dd>
            </div>
          </dl>
        </div>

        {featured ? (
          <div className="relative">
            <div
              className="absolute -top-3 right-6 z-10 grid h-16 w-16 rotate-12 place-items-center rounded-full border border-dashed border-marigold text-[10px] font-semibold uppercase tracking-[0.14em] text-marigold"
              aria-hidden="true"
            >
              Paid
            </div>
            <article className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                <span>Tonight’s desk</span>
                <span className="text-mint">Paid post</span>
              </div>
              <div className="mt-5 rounded-2xl bg-cream px-5 py-5 text-ink">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                  <span>{featured.handle}</span>
                  <span>{featured.ago}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/80">{featured.text}</p>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Paid</p>
                  <p className="nums mt-1 font-serif text-4xl text-marigold">
                    {formatSol(featured.sol)} <span className="text-2xl text-cream">SOL</span>
                  </p>
                </div>
                <a href={featured.url} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2">
                  Open post
                </a>
              </div>
            </article>
          </div>
        ) : null}
      </section>

      <PayoutTape payouts={payouts} />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="col-in flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">On the board</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">Posts that got paid</h2>
          </div>
          <Link to="/board" className="text-sm font-medium text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
            See every post
          </Link>
        </div>
        <div className="cols mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {preview.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="col-in">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">How a tweet becomes a payout</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl tracking-tight">The post is the contract surface</h2>
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

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="col-in flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">Sample desk</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">A paid post reads like this</h2>
          </div>
          <Link to="/payouts" className="text-sm font-medium text-cream underline decoration-line underline-offset-4 hover:decoration-marigold">
            Full desk
          </Link>
        </div>
        <ul className="cols mt-8 divide-y divide-line border-y border-line">
          {payouts.slice(0, 5).map((payout) => (
            <li key={payout.id} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
              <div>
                <p className="text-cream">
                  <span className="font-medium">{payout.worker}</span>
                  <span className="text-mute"> on {payout.gig}</span>
                </p>
                <p className="mt-1 text-sm text-faint">
                  from {payout.client}, {payout.ago}
                  {payout.local ? ', this browser' : ''}
                </p>
              </div>
              <p className="nums font-serif text-2xl text-marigold">{formatSol(payout.sol)} SOL</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
