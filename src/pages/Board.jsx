import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import TweetCard from '../components/TweetCard.jsx'
import { useBoard } from '../context/BoardContext.jsx'
import { usePageTitle } from '../lib/usePageTitle'

const sources = [
  { id: 'all', label: 'All' },
  { id: 'yours', label: 'This browser' },
  { id: 'sample', label: 'Sample' },
]

export default function Board() {
  const { tweets } = useBoard()
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('all')
  usePageTitle('Board')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return tweets
      .filter((tweet) => {
        const sourceOk = source === 'all' || (source === 'yours' ? tweet.local : !tweet.local)
        const haystack = `${tweet.handle} ${tweet.text}`.toLowerCase()
        return sourceOk && (!needle || haystack.includes(needle))
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [tweets, query, source])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <PageHeader
        kicker="Board"
        title="Paid posts"
        lede="Every card is a tweet with $iwork that the desk already paid. Original, unique, and not a bot."
      />

      <div className="col-in mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="block w-full max-w-md">
          <span className="sr-only">Search posts</span>
          <input
            className="field"
            value={query}
            placeholder="Search handle or post"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Link to="/tweet" className="btn-primary px-4 py-2">
          Tweet to get paid
        </Link>
      </div>

      <div className="col-in mt-5 flex flex-wrap gap-2">
        {sources.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === source ? 'btn-primary px-4 py-2' : 'btn-ghost px-4 py-2'}
            onClick={() => setSource(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div key={`${source}-${query}`} className="cols mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      ) : (
        <p className="mt-16 rounded-[28px] border border-dashed border-line px-6 py-16 text-center text-mute">
          Nothing on the board matches that. Try another filter, or post with $iwork.
        </p>
      )}
    </div>
  )
}
