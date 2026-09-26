import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useBoard } from '../context/useBoard'
import { shortenAddress, tweetUrl } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'
import { isSolanaAddress } from '../solana/address'
import { useSolanaAccount } from '../solana/useSolanaAccount'

const reasons = {
  'missing-tag': 'Include $iwork in the tweet.',
  'bad-link': 'Paste the link to that post on X. It looks like x.com/you/status/123…',
  'bad-address': 'Add the Solana address that should receive the SOL.',
  'not-found': 'X could not find that post. Check that it is public and the link is right.',
  'too-thin': 'Write a real post. A tag by itself does not get paid.',
  'bot-repeat': 'Repeated words or characters read as a bot. Write an original line.',
  'bot-thin': 'Too few distinct words. Write something of your own.',
  duplicate: 'This post is already claimed on the desk.',
  'not-original': 'This is too close to a post that is already on the desk.',
  'rate-limited': 'Too many claims from this connection. Try again in an hour.',
  offline: 'The desk could not be reached. Check your connection and try again.',
}

const rules = [
  { title: 'Written by a person', body: 'Repeated words, stretched characters, and a tag with nothing else are refused.' },
  { title: 'Original', body: 'The line has to be yours. A rewrite of a post already on the desk does not pass.' },
  { title: 'Unique', body: 'Each post is paid once. The same link or the same text cannot be claimed again.' },
]

export default function Tweet() {
  const { tweets, showingSamples, claimTweet } = useBoard()
  const { address: walletAddress } = useSolanaAccount()
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [claimed, setClaimed] = useState(null)
  const [sending, setSending] = useState(false)
  usePageTitle('Tweet to get paid')

  const onSubmit = async (event) => {
    event.preventDefault()
    if (sending) return
    setClaimed(null)
    if (!isSolanaAddress(address)) {
      setError(reasons['bad-address'])
      return
    }
    setSending(true)
    const result = await claimTweet({ text, url, address: address.trim() })
    setSending(false)
    if (!result.ok) {
      setError(reasons[result.reason] || 'This post could not be claimed. Try again in a moment.')
      return
    }
    setError('')
    setClaimed(result.tweet)
    setUrl('')
    setText('')
  }

  return (
    <div className="cols mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <PageHeader
          animate={false}
          kicker="Tweet to get paid"
          title="Post with $iwork"
          lede="Post on X with $iwork, then claim it here. It has to be original, unique, and written by you. A dev then marks it worth paying, leaves it on watch, or skips it."
        />
        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          <label className="block">
            <span className="label">Link to the post</span>
            <input
              className="field"
              type="url"
              inputMode="url"
              autoComplete="off"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://x.com/you/status/…"
            />
          </label>
          <label className="block">
            <span className="label">Tweet</span>
            <textarea
              className="field min-h-32 resize-y"
              value={text}
              maxLength={2000}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste the text of your post, with $iwork in it."
            />
            <span className="mt-2 block text-xs text-faint">The desk reads the post from X when it can, so the text on X is what counts.</span>
          </label>
          <label className="block">
            <span className="label">Solana address</span>
            <input
              className="field nums"
              autoComplete="off"
              spellCheck={false}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Wallet that should be paid"
            />
          </label>
          {walletAddress && walletAddress !== address ? (
            <button type="button" className="text-sm text-marigold hover:text-marigold-2" onClick={() => setAddress(walletAddress)}>
              Use connected wallet ({shortenAddress(walletAddress, 4)})
            </button>
          ) : null}
          {error ? (
            <p className="text-sm text-marigold" role="alert">
              {error}
            </p>
          ) : null}
          {claimed ? (
            <p className="text-sm text-mint" role="status">
              {claimed.handle} is on the desk. A dev will mark it worth paying, keep it on watch, or skip it.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'Checking the post…' : 'Submit for review'}
            </button>
            <a className="btn-ghost" href={tweetUrl('$iwork ')} target="_blank" rel="noreferrer">
              Write it on X
            </a>
          </div>
        </form>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-[28px] border border-line bg-panel p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Reward</p>
          <p className="mt-2 font-serif text-4xl text-cream">Set on review</p>
          <p className="mt-2 text-sm text-faint">A dev sets the SOL when the post is marked worth paying.</p>
          <ul className="mt-6 space-y-4">
            {rules.map((rule) => (
              <li key={rule.title}>
                <p className="text-sm font-semibold text-cream">{rule.title}</p>
                <p className="mt-1 text-sm leading-6 text-mute">{rule.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[28px] border border-line bg-panel-2 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{showingSamples ? 'Sample posts' : 'Worth paying'}</p>
          <ul className="mt-4 divide-y divide-line">
            {tweets.slice(0, 5).map((tweet) => (
              <li key={tweet.id} className="py-3">
                <p className="text-sm text-cream">
                  <span className="font-medium">{tweet.handle}</span>
                  <span className="text-faint"> to {shortenAddress(tweet.address, 4)}</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-mute">{tweet.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
