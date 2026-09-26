const API = 'https://api.x.com/2'
const TWEET_FIELDS = 'created_at,author_id,note_tweet'

async function call(bearer, pathname, params) {
  const url = `${API}${pathname}?${new URLSearchParams(params)}`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}`, 'User-Agent': 'iwork-desk' },
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) {
    const error = new Error(`X API ${response.status}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

function textOf(tweet) {
  return tweet?.note_tweet?.text || tweet?.text || ''
}

export async function lookupTweet(bearer, statusId) {
  const body = await call(bearer, `/tweets/${statusId}`, {
    'tweet.fields': TWEET_FIELDS,
    expansions: 'author_id',
    'user.fields': 'username',
  })
  if (!body.data) return null
  const author = body.includes?.users?.find((user) => user.id === body.data.author_id)
  return {
    id: body.data.id,
    text: textOf(body.data),
    username: author?.username || '',
    createdAt: body.data.created_at ? Date.parse(body.data.created_at) : null,
  }
}

export async function searchTag(bearer, sinceId) {
  const params = {
    query: '$iwork -is:retweet',
    max_results: '100',
    'tweet.fields': TWEET_FIELDS,
    expansions: 'author_id',
    'user.fields': 'username',
  }
  if (sinceId) params.since_id = sinceId
  const body = await call(bearer, '/tweets/search/recent', params)
  const users = new Map((body.includes?.users || []).map((user) => [user.id, user.username]))
  return {
    newestId: body.meta?.newest_id || '',
    tweets: (body.data || []).map((tweet) => ({
      id: tweet.id,
      text: textOf(tweet),
      username: users.get(tweet.author_id) || '',
      createdAt: tweet.created_at ? Date.parse(tweet.created_at) : null,
    })),
  }
}
