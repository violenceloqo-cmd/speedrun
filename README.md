# BULLRUN — Charging-Bull Runner

A multiplayer auto-runner themed around a crypto bull market. Rep your country, charge the chart as a galloping bull, dodge bears, whales, dumps and FUD — and race every other connected player live to a **$100B market cap**.

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

- On the title screen, enter a name and **rep your country** from the 16 options.
- Progress is your charge up the chart: **Launch → $1B → $10B → $50B → $90B → $100B**.
- **First player to hit $100B wins 5 SOL.**
- **Milestone flags** at $1B, $10B, $50B and $90B — get rekt and you respawn at the last flag.
- **Bears**: hurdle over them.
- **Dumps**: low to the ground — jump over.
- **Whales**: big and wide — clear them with a double jump.
- **Rug pulls**: gaps in the chart — jump across or you get liquidated.
- **FUD** and **rugs**: float at jump height — stay grounded to pass under.
- The run timer never stops; the hook is beating your best time to $100B.

## Multiplayer

- The chart is generated from a fixed seed, so everyone runs the exact same course.
- Other players appear as semi-transparent bulls with a colored aura and name + flag tags (no collision — pure race).
- Live leaderboard sorted by progress with flags, plus toasts when someone joins, gets rekt, or hits $100B.
- The game stays fully playable solo if the connection drops (auto-reconnects).

## Countries

Brazil, Argentina, France, England, Spain, Germany, Portugal, Netherlands, USA, Mexico, Canada, Japan, Belgium, Croatia, Morocco, Uruguay.

## Stack

- Client: single `public/index.html` — Canvas 2D + vanilla JS, WebAudio synth sounds, no client dependencies.
- Server: `server.js` — Node.js static file server + [`ws`](https://github.com/websockets/ws) WebSocket relay (no game logic, in-memory roster only).

Set a custom port with `PORT=8080 npm start`.
