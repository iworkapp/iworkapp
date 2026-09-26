export default function PayoutTape({ payouts }) {
  if (!payouts.length) return null
  const items = [...payouts, ...payouts]

  return (
    <div className="col-in border-y border-line/80 bg-black/20">
      <div className="overflow-hidden">
        <div className="tape flex w-max items-center gap-8 py-3 pr-8">
          {items.map((payout, index) => (
            <span key={`${payout.id}-${index}`} className="flex items-center gap-3 text-sm text-mute">
              <span className="text-cream">{payout.worker}</span>
              <span className="font-medium text-marigold">on review</span>
              <span className="inline-block max-w-56 truncate align-bottom">{payout.gig}</span>
              <span className="text-mint">paid</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
