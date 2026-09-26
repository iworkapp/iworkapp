import { formatSol, shortenAddress } from '../lib/format'

export default function TweetCard({ tweet }) {
  return (
    <a
      href={tweet.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-[28px] border border-line bg-panel p-5 transition duration-200 hover:-translate-y-0.5 hover:border-marigold/45"
    >
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
        <span className="text-faint">{tweet.local ? 'This browser' : 'Sample'}</span>
        <span className="text-mint">Paid</span>
      </div>
      <p className="mt-4 text-lg font-medium text-cream">{tweet.handle}</p>
      <p className="mt-3 line-clamp-4 text-sm leading-6 text-mute">{tweet.text}</p>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="nums font-serif text-4xl leading-none text-marigold">{formatSol(tweet.sol)}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">SOL</p>
        </div>
        <div className="text-right text-sm">
          <p className="nums text-cream">{shortenAddress(tweet.address, 4)}</p>
          <p className="mt-1 text-faint">{tweet.ago}</p>
        </div>
      </div>
    </a>
  )
}
