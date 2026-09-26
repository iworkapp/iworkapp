import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import TreasuryCard from '../components/TreasuryCard.jsx'
import { useBoard } from '../context/useBoard'
import { closeAdmin, fetchAdminTweets, openAdmin, readAdminKey, updateAdminTweet } from '../lib/api'
import { agoText, formatSol, shortenAddress, solscanTx } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

const gateErrors = {
  denied: 'That key does not open this desk.',
  'admin-off': 'No admin key is set on the server yet. Add ADMIN_KEY to the server environment.',
  'rate-limited': 'Too many attempts. Wait a few minutes and try again.',
  offline: 'The desk could not be reached.',
}

const saveErrors = {
  'bad-reward': 'Enter a SOL amount above 0.',
  'bad-signature': 'That is not a Solana transaction signature.',
  'send-needs-reward': 'Mark it worth paying and set the SOL before adding a transaction.',
  'send-needs-address': 'This post has no wallet yet. The author has to claim it first.',
  'already-sent': 'This payout was already sent, so it stays worth paying.',
  denied: 'Your admin session ended. Lock and open the desk again.',
  offline: 'The desk could not be reached.',
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => Boolean(readAdminKey()))
  usePageTitle('Admin')

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />
  return (
    <Desk
      onLock={() => {
        closeAdmin()
        setUnlocked(false)
      }}
    />
  )
}

function Gate({ onUnlock }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setChecking(true)
    const result = await openAdmin(key.trim())
    setChecking(false)
    if (result.ok) {
      setError('')
      onUnlock()
      return
    }
    setError(gateErrors[result.reason] || 'The desk did not open. Try again.')
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <PageHeader kicker="Admin" title="Desk key" lede="The key is checked by the server. Only people with it can review posts and set rewards." />
      <form className="col-in mt-10 rounded-[28px] border border-line bg-panel p-6" onSubmit={onSubmit}>
        <label className="block">
          <span className="label">Admin key</span>
          <input className="field" type="password" name="admin-key" autoComplete="current-password" value={key} onChange={(event) => setKey(event.target.value)} />
        </label>
        {error ? (
          <p className="mt-3 text-sm text-marigold" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn-primary mt-5" disabled={checking || !key.trim()}>
          {checking ? 'Checking…' : 'Open the desk'}
        </button>
      </form>
    </div>
  )
}

const queues = [
  { id: 'watch', label: 'Watch' },
  { id: 'paid', label: 'Worth paying' },
  { id: 'skip', label: 'Skip' },
  { id: 'all', label: 'All' },
]

const choices = [
  { id: 'paid', label: 'Worth paying' },
  { id: 'watch', label: 'Watch' },
  { id: 'skip', label: 'Skip' },
]

function Desk({ onLock }) {
  const { refresh } = useBoard()
  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState({ x: false, lastPoll: null })
  const [state, setState] = useState('loading')
  const [queue, setQueue] = useState('watch')

  const load = useCallback(async () => {
    const result = await fetchAdminTweets()
    if (result.reason === 'denied') return onLock()
    if (!result.ok) return setState('error')
    setPosts(result.tweets)
    setMeta({ x: result.x, lastPoll: result.lastPoll })
    setState('ready')
  }, [onLock])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const [kept, setKept] = useState([])

  const onSaved = (tweet) => {
    setPosts((current) => current.map((item) => (item.id === tweet.id ? tweet : item)))
    setKept((current) => (current.includes(tweet.id) ? current : [...current, tweet.id]))
    refresh()
  }

  const openQueue = (id) => {
    setKept([])
    setQueue(id)
  }

  const sorted = [...posts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  const visible = queue === 'all' ? sorted : sorted.filter((tweet) => tweet.review === queue || kept.includes(tweet.id))
  const count = (review) => posts.filter((tweet) => tweet.review === review).length

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader
        kicker="Admin"
        title="Desk controls"
        lede="Choose which posts are worth paying, which stay on watch, and which get skipped. Set the SOL on review, then add the transaction once it is sent from the treasury."
        action={
          <button type="button" className="btn-ghost" onClick={onLock}>
            Lock
          </button>
        }
      />

      <div className="col-in mt-10">
        <TreasuryCard />
      </div>

      <p className="col-in mt-4 text-sm text-faint">
        {meta.x
          ? `X search is on. New $iwork posts join the watch queue${meta.lastPoll ? `, last checked ${agoText(meta.lastPoll)}` : ''}.`
          : 'X search is off. Add X_BEARER_TOKEN to the server to pull $iwork posts in automatically.'}
      </p>

      <dl className="col-in mt-6 grid grid-cols-3 gap-4 border-y border-line py-6">
        <Stat label="Worth paying" value={count('paid')} />
        <Stat label="Watch" value={count('watch')} />
        <Stat label="Skip" value={count('skip')} />
      </dl>

      <div className="col-in mt-6 flex flex-wrap items-center gap-2">
        {queues.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === queue ? 'btn-primary px-4 py-2' : 'btn-ghost px-4 py-2'}
            onClick={() => openQueue(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto text-sm text-mute hover:text-cream"
          onClick={() => {
            setKept([])
            load()
          }}
        >
          Refresh
        </button>
      </div>

      {state === 'loading' ? <p className="mt-8 text-center text-mute">Loading the queue…</p> : null}
      {state === 'error' ? <p className="mt-8 text-center text-marigold">The queue could not be loaded. Try Refresh.</p> : null}
      {state === 'ready' && visible.length ? (
        <ul key={queue} className="cols mt-4 divide-y divide-line border-b border-line">
          {visible.map((tweet) => (
            <Row key={tweet.id} tweet={tweet} onSaved={onSaved} />
          ))}
        </ul>
      ) : null}
      {state === 'ready' && !visible.length ? (
        <p className="mt-8 rounded-[28px] border border-dashed border-line px-6 py-12 text-center text-mute">No posts in this queue.</p>
      ) : null}
    </div>
  )
}

function Row({ tweet, onSaved }) {
  const [reward, setReward] = useState(tweet.reward == null ? '' : String(tweet.reward))
  const [signature, setSignature] = useState(tweet.txSignature || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async (patch) => {
    setSaving(true)
    const result = await updateAdminTweet(tweet.id, patch)
    setSaving(false)
    if (!result.ok) {
      setError(saveErrors[result.reason] || 'That change did not save.')
      return
    }
    setError('')
    setReward(result.tweet.reward == null ? '' : String(result.tweet.reward))
    setSignature(result.tweet.txSignature || '')
    onSaved(result.tweet)
  }

  const dirty = reward !== (tweet.reward == null ? '' : String(tweet.reward)) || signature !== (tweet.txSignature || '')

  return (
    <li className="py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-cream">
            {tweet.url ? (
              <a href={tweet.url} target="_blank" rel="noreferrer" className="hover:text-marigold">
                {tweet.handle}
              </a>
            ) : (
              tweet.handle
            )}
            <span className="text-faint">
              {' '}
              · {agoText(tweet.createdAt)} · {tweet.source === 'x' ? 'found on X' : 'claimed'} · {tweet.verified ? 'checked on X' : 'text unchecked'}
            </span>
          </p>
          <p className="mt-2 text-sm leading-6 text-mute">{tweet.text}</p>
          <p className="nums mt-2 text-sm text-faint">{tweet.address ? `Pays ${shortenAddress(tweet.address, 6)}` : 'No wallet yet. The author has to claim this post.'}</p>
        </div>
        <span className="nums shrink-0 font-serif text-xl text-cream">{formatSol(tweet.reward) || 'On review'}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={saving}
            className={tweet.review === choice.id ? 'btn-primary px-3 py-1.5 text-xs' : 'btn-ghost px-3 py-1.5 text-xs'}
            onClick={() => tweet.review !== choice.id && save({ review: choice.id })}
          >
            {choice.label}
          </button>
        ))}
      </div>

      {tweet.review === 'paid' ? (
        <form
          className="mt-4 grid gap-3 sm:grid-cols-[9rem_1fr_auto] sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            save({ reward: reward.trim() === '' ? null : reward.trim(), txSignature: signature.trim() })
          }}
        >
          <label className="block">
            <span className="label">SOL</span>
            <input className="field nums" inputMode="decimal" placeholder="0.25" value={reward} onChange={(event) => setReward(event.target.value)} />
          </label>
          <label className="block">
            <span className="label">Transaction, once sent</span>
            <input className="field nums" spellCheck={false} placeholder="Signature from the treasury send" value={signature} onChange={(event) => setSignature(event.target.value)} />
          </label>
          <button type="submit" className="btn-primary" disabled={saving || !dirty}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      ) : null}

      {tweet.txSignature ? (
        <a href={solscanTx(tweet.txSignature)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-marigold hover:text-marigold-2">
          Sent {agoText(tweet.sentAt)}. View on Solscan
        </a>
      ) : null}
      {error ? (
        <p className="mt-2 text-sm text-marigold" role="alert">
          {error}
        </p>
      ) : null}
    </li>
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
