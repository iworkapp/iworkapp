import { formatSol, shortenAddress, timeAgo } from '../lib/format'

export default function TweetCard({ tweet }) {
  const reward = formatSol(tweet.reward)
  const body = (
    <>
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
        <span className="text-faint">{tweet.sample ? 'Sample' : 'Worth paying'}</span>
        <span className="text-mint">{tweet.txSignature ? 'Sent' : 'Recorded'}</span>
      </div>
      <p className="mt-4 text-lg font-medium text-cream">{tweet.handle}</p>
      <p className="mt-3 line-clamp-4 text-sm leading-6 text-mute">{tweet.text}</p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <div>
          <p className="nums font-serif text-3xl leading-none text-cream">{reward || 'On review'}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Reward</p>
        </div>
        <div className="text-right text-sm">
          <p className="nums text-cream">{shortenAddress(tweet.address, 4)}</p>
          <p className="mt-1 text-faint">{timeAgo(tweet.createdAt)}</p>
        </div>
      </div>
    </>
  )
  const className = 'group flex h-full flex-col rounded-[28px] border border-line bg-panel p-5'

  if (!tweet.url) return <article className={className}>{body}</article>
  return (
    <a
      href={tweet.url}
      target="_blank"
      rel="noreferrer"
      className={`${className} transition duration-200 hover:-translate-y-0.5 hover:border-marigold/45`}
    >
      {body}
    </a>
  )
}
