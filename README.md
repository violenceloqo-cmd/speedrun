# $SPEEDRUN — Wojak Chart Runner

A multiplayer auto-runner where a stickman wojak runs up a green candle chart toward **$1,000,000,000 market cap**. Jump over red candles, clear rug pulls, duck under FUD — and watch every other connected player racing the same chart live as semi-transparent ghosts.

## Run it

```bash
npm install
npm start
```

Open **http://localhost:3000** — open it in multiple tabs (or share your LAN address) to see multiplayer ghosts.

## How to play

| Input | Action |
| --- | --- |
| `SPACE` / `W` / `↑` / tap / click | Jump (press again mid-air to double jump) |

- Market cap grows with distance: start at **$50K**, finish at **$1B**.
- **First player to reach $1B wins 5 SOL.**
- **Checkpoints** at $1M, $10M, $100M, $500M — die and you respawn at the last flag.
- **Red candles**: jump over them.
- **Cacti**: desert cacti on the chart — jump over.
- **Whale dumps**: big and wide — clear them with a double jump.
- **Rug pulls**: gaps in the chart — jump across or fall.
- **FUD clouds** and **paper hands**: float at jump height — stay grounded to pass under.
- The speedrun timer never stops; the hook is beating your best time to $1B.

## Multiplayer

- The terrain is generated from a fixed seed, so everyone runs the exact same chart.
- Other players appear as colored ghost wojaks with name tags (no collision — pure race).
- Live leaderboard sorted by market cap, plus toasts when someone joins, gets rugged, or hits $1B.
- The game stays fully playable solo if the connection drops (auto-reconnects).

## Stack

- Client: single `public/index.html` — Canvas 2D + vanilla JS, WebAudio synth sounds, no client dependencies.
- Server: `server.js` — Node.js static file server + [`ws`](https://github.com/websockets/ws) WebSocket relay (no game logic, in-memory roster only).

Set a custom port with `PORT=8080 npm start`.
