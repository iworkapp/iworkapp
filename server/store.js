import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const empty = () => ({ version: 1, tweets: [], meta: { xSinceId: '' } })

export async function openStore(dataDir) {
  const file = path.join(dataDir, 'board.json')
  await mkdir(dataDir, { recursive: true })
  let state = empty()
  try {
    const parsed = JSON.parse(await readFile(file, 'utf8'))
    state = {
      version: 1,
      tweets: Array.isArray(parsed.tweets) ? parsed.tweets : [],
      meta: { ...empty().meta, ...(parsed.meta || {}) },
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  let queue = Promise.resolve()
  const persist = () => {
    const snapshot = JSON.stringify(state, null, 2)
    queue = queue.then(async () => {
      const temp = `${file}.${process.pid}.tmp`
      await writeFile(temp, snapshot)
      await rename(temp, file)
    })
    return queue
  }

  return {
    file,
    tweets: () => state.tweets,
    meta: () => state.meta,
    find: (id) => state.tweets.find((tweet) => tweet.id === id),
    findByStatus: (statusId) => state.tweets.find((tweet) => tweet.statusId === statusId),
    async add(input) {
      const tweet = { id: randomUUID(), createdAt: Date.now(), review: 'watch', reward: null, txSignature: '', sentAt: null, ...input }
      state.tweets.unshift(tweet)
      await persist()
      return tweet
    },
    async update(id, patch) {
      const tweet = state.tweets.find((item) => item.id === id)
      if (!tweet) return null
      Object.assign(tweet, patch, { updatedAt: Date.now() })
      await persist()
      return tweet
    },
    async setMeta(patch) {
      Object.assign(state.meta, patch)
      await persist()
    },
  }
}
