import { formatSol } from '../lib/format'

export default function PayoutTape({ tweets }) {
  if (!tweets.length) return null
  const items = [...tweets, ...tweets, ...tweets, ...tweets].slice(0, Math.max(8, tweets.length * 2))
  const loop = [...items, ...items]

  return (
    <div className="col-in border-y border-line/80 bg-black/20" aria-hidden="true">
      <div className="overflow-hidden">
        <div className="tape flex w-max items-center gap-8 py-3 pr-8">
          {loop.map((tweet, index) => (
            <span key={`${tweet.id}-${index}`} className="flex items-center gap-3 text-sm text-mute">
              <span className="text-cream">{tweet.handle}</span>
              <span className="nums font-medium text-marigold">{formatSol(tweet.reward) || 'reward on review'}</span>
              <span className="text-mint">{tweet.txSignature ? 'sent' : 'worth paying'}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
