import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'

export default function NotFound() {
  usePageTitle('Not found')

  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">404</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">This page isn’t on the desk</h1>
      <Link to="/" className="btn-primary mt-8">
        Back home
      </Link>
    </div>
  )
}
