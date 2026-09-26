import { useCallback, useEffect, useMemo, useState } from 'react'
import { sampleTweets } from '../data'
import { fetchBoard, submitClaim } from '../lib/api'
import { BoardContext } from './useBoard'

export function BoardProvider({ children }) {
  const [live, setLive] = useState([])
  const [status, setStatus] = useState('loading')

  const refresh = useCallback(async () => {
    const result = await fetchBoard()
    if (result.ok) {
      setLive(result.tweets)
      setStatus('ready')
    } else {
      setStatus((current) => (current === 'ready' ? current : 'error'))
    }
  }, [])

  useEffect(() => {
    let active = true
    const load = () => active && refresh()
    const first = window.setTimeout(load, 0)
    const timer = window.setInterval(load, 60_000)
    return () => {
      active = false
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [refresh])

  const value = useMemo(() => {
    const real = [...live].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    const showingSamples = status !== 'loading' && real.length === 0
    const tweets = showingSamples ? sampleTweets : real
    return {
      status,
      tweets,
      showingSamples,
      paidCount: real.length,
      solRecorded: real.reduce((sum, tweet) => sum + (Number(tweet.reward) || 0), 0),
      refresh,
      async claimTweet(input) {
        const result = await submitClaim(input)
        if (result.ok) refresh()
        return result
      },
    }
  }, [live, status, refresh])

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}
