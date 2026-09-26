import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import TreasuryCard from '../components/TreasuryCard.jsx'
import { useBoard } from '../context/BoardContext.jsx'
import { adminKeyConfigured, lockAdmin, readAdminSession, unlockAdmin } from '../lib/admin'
import { shortenAddress } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

export default function Admin() {
  const [unlocked, setUnlocked] = useState(readAdminSession)
  usePageTitle('Admin')

  if (!unlocked) {
    return <Gate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <Desk
      onLock={() => {
        lockAdmin()
        setUnlocked(false)
      }}
    />
  )
}

function Gate({ onUnlock }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const configured = adminKeyConfigured()

  const onSubmit = (event) => {
    event.preventDefault()
    const result = unlockAdmin(key)
    if (result === 'ok') {
      setError('')
      onUnlock()
      return
    }
    setError(result === 'missing' ? 'No admin key is set for this desk yet.' : 'That key does not open this desk.')
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <PageHeader
        kicker="Admin"
        title="Desk key"
        lede="This panel stays closed until the admin key is entered in this browser."
      />
      <form className="col-in mt-10 rounded-[28px] border border-line bg-panel p-6" onSubmit={onSubmit}>
        <label className="block">
          <span className="label">Admin key</span>
          <input
            className="field"
            type="password"
            name="admin-key"
            autoComplete="off"
            value={key}
            disabled={!configured}
            onChange={(event) => setKey(event.target.value)}
          />
        </label>
        {error ? <p className="mt-3 text-sm text-marigold">{error}</p> : null}
        <button type="submit" className="btn-primary mt-5" disabled={!configured || !key.trim()}>
          Open the desk
        </button>
      </form>
    </div>
  )
}

const choices = [
  { id: 'paid', label: 'Worth paying' },
  { id: 'watch', label: 'Watch' },
  { id: 'skip', label: 'Skip' },
]

const reviewLabel = {
  paid: 'Paid',
  watch: 'Watch',
  skip: 'Skip',
}

function Desk({ onLock }) {
  const { allTweets, hasLocal, reset, setTweetReview } = useBoard()
  const [queue, setQueue] = useState('watch')
  const posts = [...allTweets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  const visiblePosts = queue === 'all' ? posts : posts.filter((tweet) => tweet.review === queue)

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader
        kicker="Admin"
        title="Desk controls"
        lede="Choose which posts are worth paying, which stay on watch, and which get skipped. Paid posts are the ones on the public board."
        action={
          <button type="button" className="btn-ghost" onClick={onLock}>
            Lock
          </button>
        }
      />

      <div className="col-in mt-10">
        <TreasuryCard />
      </div>

      <dl className="col-in mt-6 grid grid-cols-3 gap-4 border-y border-line py-6">
        <Stat label="Worth paying" value={posts.filter((tweet) => tweet.review === 'paid').length} />
        <Stat label="Watch" value={posts.filter((tweet) => tweet.review === 'watch').length} />
        <Stat label="Skip" value={posts.filter((tweet) => tweet.review === 'skip').length} />
      </dl>

      <div className="col-in mt-6 flex flex-wrap gap-2">
        {[
          { id: 'watch', label: 'Watch' },
          { id: 'paid', label: 'Paid' },
          { id: 'skip', label: 'Skip' },
          { id: 'all', label: 'All' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === queue ? 'btn-primary px-4 py-2' : 'btn-ghost px-4 py-2'}
            onClick={() => setQueue(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visiblePosts.length ? (
        <ul key={queue} className="cols mt-4 divide-y divide-line border-b border-line">
          {visiblePosts.map((tweet) => (
            <li key={tweet.id} className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-cream">
                    {tweet.handle}
                    <span className="text-faint"> {reviewLabel[tweet.review]}</span>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-mute">{tweet.text}</p>
                  <p className="mt-2 text-sm text-faint">
                    {shortenAddress(tweet.address, 4)}
                    {tweet.local ? ', this browser' : ', sample'}
                  </p>
                </div>
                <span className="shrink-0 font-serif text-xl text-cream">On review</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className={tweet.review === choice.id ? 'btn-primary px-3 py-1.5 text-xs' : 'btn-ghost px-3 py-1.5 text-xs'}
                    onClick={() => setTweetReview(tweet.id, choice.id)}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-[28px] border border-dashed border-line px-6 py-12 text-center text-mute">
          No posts in this queue.
        </p>
      )}

      {hasLocal ? (
        <button
          type="button"
          className="mt-8 text-sm text-marigold hover:text-marigold-2"
          onClick={() => {
            if (window.confirm('Clear posts, review choices, and payouts saved in this browser?')) reset()
          }}
        >
          Clear this browser
        </button>
      ) : null}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{label}</dt>
      <dd className="nums mt-2 font-serif text-3xl">{value}</dd>
    </div>
  )
}
