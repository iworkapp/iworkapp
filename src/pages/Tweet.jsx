import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useBoard } from '../context/BoardContext.jsx'
import { formatSol, shortenAddress, tweetUrl } from '../lib/format'
import { TWEET_PAY } from '../lib/tweetReview'
import { usePageTitle } from '../lib/usePageTitle'
import { isSolanaAddress } from '../solana/address'
import { useSolanaAccount } from '../solana/useSolanaAccount'

const reasons = {
  'missing-tag': 'Include $iwork in the tweet.',
  'bad-link': 'Paste the link to that post on X.',
  'too-thin': 'Write a real post. A tag by itself does not get paid.',
  'bot-repeat': 'Repeated words or characters read as a bot. Write an original line.',
  'bot-thin': 'Too few distinct words. Write something of your own.',
  duplicate: 'This tweet is already on the desk.',
  'not-original': 'This is too close to a tweet that was already paid.',
}

const rules = [
  { title: 'Not a bot', body: 'Repeated words, stretched characters, and a tag with nothing else are refused.' },
  { title: 'Original', body: 'The line has to be yours. A rewrite of a tweet already paid does not pass.' },
  { title: 'Unique', body: 'Each post is paid once. The same link or the same text cannot be claimed again.' },
]

export default function Tweet() {
  const { tweets, claimTweet } = useBoard()
  const { address: walletAddress } = useSolanaAccount()
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [paid, setPaid] = useState(null)
  usePageTitle('Tweet to get paid')

  const onSubmit = (event) => {
    event.preventDefault()
    if (!isSolanaAddress(address)) {
      setPaid(null)
      setError('Add the Solana address that should receive the SOL.')
      return
    }
    const result = claimTweet({ text, url, address })
    if (!result.ok) {
      setPaid(null)
      setError(reasons[result.reason] || 'This tweet does not qualify.')
      return
    }
    setError('')
    setPaid(result.tweet)
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
          lede="Paste a tweet with $iwork. It has to be original, unique, and not a bot. An admin then marks it worth paying, leaves it on watch, or skips it."
        />
        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="label">Link to the post</span>
            <input
              className="field"
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
              onChange={(event) => setText(event.target.value)}
              placeholder="Your own line, with $iwork in it."
            />
          </label>
          <label className="block">
            <span className="label">Solana address</span>
            <input
              className="field"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Wallet that should be paid"
            />
          </label>
          {walletAddress ? (
            <button type="button" className="text-sm text-marigold" onClick={() => setAddress(walletAddress)}>
              Use connected wallet
            </button>
          ) : null}
          {error ? <p className="text-sm text-marigold">{error}</p> : null}
          {paid ? (
            <p className="text-sm text-mint">
              {paid.handle} is on watch. An admin chooses worth paying, watch, or skip.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              Submit for review
            </button>
            <a className="btn-ghost" href={tweetUrl('$iwork ')} target="_blank" rel="noreferrer">
              Open X
            </a>
          </div>
        </form>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-[28px] border border-line bg-panel p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">This post pays</p>
          <p className="nums mt-2 font-serif text-5xl text-marigold">{formatSol(TWEET_PAY)}</p>
          <p className="text-sm text-faint">SOL when an admin marks it worth paying</p>
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">Already paid</p>
          <ul className="mt-4 divide-y divide-line">
            {tweets.map((tweet) => (
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
