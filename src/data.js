const hour = 60 * 60 * 1000
const base = Date.UTC(2026, 8, 26, 4, 0, 0)

export const seedGigs = []

export const seedTweets = [
  {
    id: 'tweet-mio',
    handle: '@mio',
    text: 'Wrote the payroll thread like a desk tool, not a brand account. Eight short posts, one fact each. $iwork',
    url: 'https://x.com/mio/status/1842000000000000001',
    address: '7nZq4u1bQeR9sT2kL8pYwH3cVdFm6aJxC5rUeNgK4sL2',
    ago: '3h',
    createdAt: base - 3 * hour,
    review: 'paid',
  },
  {
    id: 'tweet-sora',
    handle: '@sora',
    text: 'The night-desk mark still reads at sixteen pixels. One warm accent, no mascot, no gradient. $iwork',
    url: 'https://x.com/sora/status/1842000000000000002',
    address: '9pLk2sD8fH4qW7mC1vR6yT3bN5aXeUj8oZrYgBnK2cQ',
    ago: '6h',
    createdAt: base - 6 * hour,
    review: 'paid',
  },
  {
    id: 'tweet-lark',
    handle: '@lark',
    text: 'Waiting on the desk. Original line, own wallet, public post. $iwork',
    url: 'https://x.com/lark/status/1842000000000000003',
    address: '4cR8mN2pQdL7vH1sK6yT9bXwE3aUfCj5oZrYgBnM8qP',
    ago: '9h',
    createdAt: base - 9 * hour,
    review: 'watch',
  },
  {
    id: 'tweet-ada',
    handle: '@ada',
    text: 'Original take: $iwork pays a real post, not a raid. One wallet, one tweet, no copied line.',
    url: 'https://x.com/ada/status/1842000000000000004',
    address: '2mQv8sL4pR7dH1cK9yT6bN3aXeUj5oZrYgBnCwF8kP',
    ago: '14h',
    createdAt: base - 14 * hour,
    review: 'paid',
  },
  {
    id: 'tweet-nola',
    handle: '@nola',
    text: 'Left the receipt on the timeline. The wallet and the post are both in the open. $iwork',
    url: 'https://x.com/nola/status/1842000000000000005',
    address: '6tYb3nM8pQ2dL7vH1sK4yR9cXwE5aUfCj8oZrBgN1mS',
    ago: '1d',
    createdAt: base - 26 * hour,
    review: 'watch',
  },
  {
    id: 'tweet-jun',
    handle: '@junpark',
    text: 'Same line as yesterday, counted again, still under 280. $iwork',
    url: 'https://x.com/junpark/status/1842000000000000006',
    address: '8kHp2sD5fL9qW4mC7vR1yT6bN3aXeUj2oZrYgBnQ9c',
    ago: '2d',
    createdAt: base - 40 * hour,
    review: 'skip',
  },
]

export const seedPayouts = seedTweets
  .filter((tweet) => tweet.review === 'paid')
  .map((tweet) => ({
    id: `pay-${tweet.id}`,
    worker: tweet.handle,
    client: '@iwork',
    gig: 'Tweet with $iwork',
    ago: tweet.ago,
    address: tweet.address,
    status: 'paid',
    tweetId: tweet.id,
  }))
