import { Link } from 'react-router-dom'
import { useBoard } from '../context/BoardContext.jsx'

export default function Footer() {
  const { hasLocal, reset } = useBoard()

  return (
    <footer className="mt-auto border-t border-line">
      <div className="cols mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl tracking-tight">iwork</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-mute">
            Tweet with $iwork. Get paid in SOL. A public board for posts, not a token launcher.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Desk</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/board" className="text-mute hover:text-cream">
              Board
            </Link>
            <Link to="/payouts" className="text-mute hover:text-cream">
              Payouts
            </Link>
            <Link to="/tweet" className="text-mute hover:text-cream">
              Tweet to get paid
            </Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Chain</p>
          <p className="mt-3 leading-6 text-mute">
            Wallet connect reads a Solana mainnet balance. Posts, review choices, and payouts stay in this browser.
          </p>
          {hasLocal ? (
            <button type="button" className="mt-3 text-marigold hover:text-marigold-2" onClick={reset}>
              Clear this browser
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
