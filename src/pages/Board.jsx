import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import TweetCard from '../components/TweetCard.jsx'
import { useBoard } from '../context/useBoard'
import { usePageTitle } from '../lib/usePageTitle'

export default function Board() {
  const { tweets, showingSamples, status } = useBoard()
  const [query, setQuery] = useState('')
  usePageTitle('Board')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return tweets
    return tweets.filter((tweet) => `${tweet.handle} ${tweet.text}`.toLowerCase().includes(needle))
  }, [tweets, query])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <PageHeader
        kicker="Board"
        title="Posts worth paying"
        lede="Every card is a tweet with $iwork that a dev marked worth paying. Original, unique, and written by a real person."
      />

      <div className="col-in mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="block w-full max-w-md">
          <span className="sr-only">Search posts</span>
          <input className="field" value={query} placeholder="Search handle or post" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <Link to="/tweet" className="btn-primary px-4 py-2">
          Tweet to get paid
        </Link>
      </div>

      {status === 'error' ? <p className="mt-5 text-sm text-marigold">The desk could not be reached. Showing samples for now.</p> : null}
      {showingSamples && status !== 'error' ? (
        <p className="mt-5 text-sm text-faint">No post has been marked worth paying yet. These samples show the shape of a card.</p>
      ) : null}

      {status === 'loading' ? (
        <p className="mt-16 text-center text-mute">Loading the board…</p>
      ) : visible.length ? (
        <div key={query} className="cols mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      ) : (
        <p className="mt-16 rounded-[28px] border border-dashed border-line px-6 py-16 text-center text-mute">
          Nothing on the board matches that search.
        </p>
      )}
    </div>
  )
}
