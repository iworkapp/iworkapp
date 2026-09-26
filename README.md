# iwork

Tweet to get paid. Post with `$iwork` on X, a dev reviews it and sets the SOL, and the payout comes from the treasury wallet on Solana.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev:api   # API on :8787
npm run dev       # site on :5173, /api is proxied to the API
```

## Production

```bash
npm run build
npm start         # serves dist and /api on $PORT
```

Environment on the server:

| Name | Purpose |
| --- | --- |
| `VITE_PRIVY_APP_ID` | Privy app for Link X. Needed at build time. |
| `ADMIN_KEY` | Opens `/admin`. Checked by the server only. |
| `X_BEARER_TOKEN` | Reads posts from X to check claims and find new `$iwork` posts. |
| `X_POLL_MINUTES` | How often X is searched. Minimum 5, default 15. |
| `DATA_DIR` | Where `board.json` lives. Point it at a persistent volume. |

## How it works

- `/tweet`: the author sends the X link and a Solana address. The server reads the post from X, runs the desk checks, and adds it to the watch queue.
- The server also searches X for new `$iwork` posts. Those wait on watch until the author claims them with a wallet.
- `/admin`: mark posts worth paying, watch, or skip. Set the SOL on review. After sending from the treasury, paste the transaction signature so the payout links to Solscan.
- `/board` and `/payouts` show only posts marked worth paying.
