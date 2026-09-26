const hour = 60 * 60 * 1000
const base = Date.UTC(2026, 8, 26, 4, 0, 0)

export const sampleTweets = [
  {
    id: 'sample-mio',
    handle: '@mio',
    text: 'Wrote the payroll thread like a desk tool, not a brand account. Eight short posts, one fact each. $iwork',
    address: '7nZq4u1bQeR9sT2kL8pYwH3cVdFm6aJxC5rUeNgK4sL2',
    createdAt: base - 3 * hour,
  },
  {
    id: 'sample-sora',
    handle: '@sora',
    text: 'The night-desk mark still reads at sixteen pixels. One warm accent, no mascot, no gradient. $iwork',
    address: '9pLk2sD8fH4qW7mC1vR6yT3bN5aXeUj8oZrYgBnK2cQ',
    createdAt: base - 6 * hour,
  },
  {
    id: 'sample-ada',
    handle: '@ada',
    text: 'Original take: $iwork pays a real post, not a raid. One wallet, one tweet, no copied line.',
    address: '2mQv8sL4pR7dH1cK9yT6bN3aXeUj5oZrYgBnCwF8kP',
    createdAt: base - 14 * hour,
  },
].map((tweet) => ({ ...tweet, review: 'paid', reward: null, txSignature: '', sentAt: null, sample: true, url: '' }))
