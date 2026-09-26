# iwork

Tweet to get paid. A Solana board where a public post is the brief and SOL is the payout.

```bash
npm install
npm run dev
```

Connect a Solana wallet through Privy, and link an X account from the same login. Set `VITE_PRIVY_APP_ID` in `.env` and restart the dev server. The wallet reads a mainnet balance. Tweet claims, review choices, and payouts are saved in this browser.

Tweet with `$iwork` at `/tweet`. A post that passes the desk check waits on watch. An admin marks it worth paying, keeps it on watch, or skips it. Worth paying is what shows on the public board.

The admin desk is at `/admin`. Copy `.env.example` to `.env`, set `VITE_ADMIN_KEY`, and restart the dev server. The key is checked in the browser, so it keeps the panel closed for other people using this machine. It is not a wallet password.
