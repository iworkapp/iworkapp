import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedGigs, seedPayouts, seedTweets } from '../data'
import { reviewTweet } from '../lib/tweetReview'

const STORAGE_KEY = 'iwork.board.v1'
const BoardContext = createContext(null)

const emptyStore = {
  gigs: [],
  replies: {},
  payouts: [],
  status: {},
  winners: {},
  hidden: {},
  tweets: [],
  review: {},
}

function readStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      gigs: Array.isArray(parsed.gigs) ? parsed.gigs : [],
      replies: parsed.replies && typeof parsed.replies === 'object' ? parsed.replies : {},
      payouts: Array.isArray(parsed.payouts) ? parsed.payouts : [],
      status: parsed.status && typeof parsed.status === 'object' ? parsed.status : {},
      winners: parsed.winners && typeof parsed.winners === 'object' ? parsed.winners : {},
      hidden: parsed.hidden && typeof parsed.hidden === 'object' ? parsed.hidden : {},
      tweets: Array.isArray(parsed.tweets) ? parsed.tweets : [],
      review: parsed.review && typeof parsed.review === 'object' ? parsed.review : {},
    }
  } catch {
    return emptyStore
  }
}

function decorate(gig, store) {
  const extraReplies = store.replies[gig.id] || []
  return {
    ...gig,
    status: store.status[gig.id] || gig.status,
    winnerId: store.winners[gig.id] || null,
    hidden: Boolean(store.hidden[gig.id]),
    replies: [...extraReplies, ...(gig.replies || [])],
  }
}

export function BoardProvider({ children }) {
  const [store, setStore] = useState(readStore)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }, [store])

  const value = useMemo(() => {
    const allGigs = [...store.gigs.map((gig) => decorate(gig, store)), ...seedGigs.map((gig) => decorate(gig, store))]
    const gigs = allGigs.filter((gig) => !gig.hidden)
    const allTweets = [...store.tweets, ...seedTweets].map((tweet) => ({
      ...tweet,
      review: store.review[tweet.id] || tweet.review || 'watch',
    }))
    const tweets = allTweets.filter((tweet) => tweet.review === 'paid')
    const payouts = [...store.payouts, ...seedPayouts]
    const hasLocal =
      store.gigs.length > 0 ||
      store.payouts.length > 0 ||
      store.tweets.length > 0 ||
      Object.keys(store.replies).length > 0 ||
      Object.keys(store.status).length > 0 ||
      Object.keys(store.hidden).length > 0 ||
      Object.keys(store.review).length > 0

    return {
      gigs,
      allGigs,
      payouts,
      tweets,
      allTweets,
      hasLocal,
      addGig(input) {
        const id = crypto.randomUUID()
        const gig = {
          id,
          title: input.title.trim(),
          brief: input.brief.trim(),
          category: input.category,
          bounty: Number(input.bounty),
          client: input.client,
          hoursLeft: 72,
          createdAt: Date.now(),
          status: 'open',
          replies: [],
          local: true,
        }
        setStore((current) => ({ ...current, gigs: [gig, ...current.gigs] }))
        return id
      },
      addReply(gigId, input) {
        const reply = {
          id: crypto.randomUUID(),
          handle: input.handle,
          note: input.note.trim(),
          address: input.address.trim(),
          ago: 'just now',
          local: true,
        }
        setStore((current) => ({
          ...current,
          replies: {
            ...current.replies,
            [gigId]: [reply, ...(current.replies[gigId] || [])],
          },
        }))
        return reply.id
      },
      acceptReply(gigId, replyId) {
        setStore((current) => {
          const gig = [...current.gigs, ...seedGigs].find((item) => item.id === gigId)
          if (!gig) return current
          if ((current.status[gigId] || gig.status) === 'paid') return current
          const reply = [...(current.replies[gigId] || []), ...(gig.replies || [])].find((item) => item.id === replyId)
          if (!reply) return current
          const payout = {
            id: crypto.randomUUID(),
            sol: gig.bounty,
            worker: reply.handle,
            client: gig.client,
            gig: gig.title,
            gigId: gig.id,
            ago: 'just now',
            address: reply.address,
            status: 'paid',
            local: true,
          }
          return {
            ...current,
            status: { ...current.status, [gigId]: 'paid' },
            winners: { ...current.winners, [gigId]: replyId },
            payouts: [payout, ...current.payouts],
          }
        })
      },
      toggleHidden(gigId) {
        setStore((current) => {
          const hidden = { ...current.hidden }
          if (hidden[gigId]) delete hidden[gigId]
          else hidden[gigId] = true
          return { ...current, hidden }
        })
      },
      removeGig(gigId) {
        setStore((current) => {
          if (!current.gigs.some((gig) => gig.id === gigId)) return current
          const replies = { ...current.replies }
          const status = { ...current.status }
          const winners = { ...current.winners }
          const hidden = { ...current.hidden }
          delete replies[gigId]
          delete status[gigId]
          delete winners[gigId]
          delete hidden[gigId]
          return {
            ...current,
            gigs: current.gigs.filter((gig) => gig.id !== gigId),
            replies,
            status,
            winners,
            hidden,
            payouts: current.payouts.filter((payout) => payout.gigId !== gigId),
          }
        })
      },
      removeReply(gigId, replyId) {
        setStore((current) => ({
          ...current,
          replies: {
            ...current.replies,
            [gigId]: (current.replies[gigId] || []).filter((reply) => reply.id !== replyId),
          },
        }))
      },
      claimTweet(input) {
        const review = reviewTweet(input.text, input.url, [...store.tweets, ...seedTweets])
        if (!review.ok) return review
        const tweet = {
          id: crypto.randomUUID(),
          handle: review.status.handle,
          text: input.text.trim(),
          url: review.status.url,
          address: input.address.trim(),
          ago: 'just now',
          createdAt: Date.now(),
          local: true,
          review: 'watch',
        }
        setStore((current) => ({
          ...current,
          tweets: [tweet, ...current.tweets],
          review: { ...current.review, [tweet.id]: 'watch' },
        }))
        return { ok: true, tweet }
      },
      setTweetReview(id, review) {
        if (review !== 'paid' && review !== 'watch' && review !== 'skip') return
        setStore((current) => {
          const local = current.tweets.find((tweet) => tweet.id === id)
          let payouts = current.payouts.filter((payout) => payout.tweetId !== id)
          if (review === 'paid' && local) {
            payouts = [
              {
                id: crypto.randomUUID(),
                worker: local.handle,
                client: '@iwork',
                gig: 'Tweet with $iwork',
                ago: 'just now',
                address: local.address,
                status: 'paid',
                local: true,
                tweetId: id,
              },
              ...payouts,
            ]
          }
          return {
            ...current,
            payouts,
            review: { ...current.review, [id]: review },
          }
        })
      },
      reset() {
        setStore(emptyStore)
      },
    }
  }, [store])

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export function useBoard() {
  const context = useContext(BoardContext)
  if (!context) throw new Error('useBoard must be used within BoardProvider')
  return context
}
