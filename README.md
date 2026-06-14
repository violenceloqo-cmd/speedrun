# WORLD CUP RUN — Footballer Stickman Runner

A multiplayer auto-runner themed around the 2026 World Cup. Pick your nation, run as a stickman footballer in that country's kit (jersey, shorts, socks, boots), dodge defenders and the keeper, stay onside — and race every other connected player live to **lift the World Cup Trophy**.

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

- On the title screen, enter a name and **pick your nation** from the 16 contenders.
- Progress is your run along the pitch: **Group Stage → Round of 16 → Quarter-Final → Semi-Final → Final**.
- **First player to lift the Trophy wins 5 SOL.**
- **Stage flags** at Round of 16, Quarter-Final, Semi-Final and Final — get stopped and you respawn at the last flag.
- **Defenders**: hurdle over them.
- **Sliding tackles**: low to the ground — jump over.
- **Diving keeper**: big and wide — clear it with a double jump.
- **Touchlines**: gaps in the pitch — jump across or the ball goes out of play.
- **Offside flags** and **red cards**: float at jump height — stay grounded to pass under.
- The run timer never stops; the hook is beating your best time to the Trophy.

## Multiplayer

- The pitch is generated from a fixed seed, so everyone runs the exact same course.
- Other players appear as semi-transparent footballers in their nation's kit with name + flag tags (no collision — pure race).
- Live leaderboard sorted by progress with flags, plus toasts when someone joins, is stopped, or lifts the Trophy.
- The game stays fully playable solo if the connection drops (auto-reconnects).

## Nations

Brazil, Argentina, France, England, Spain, Germany, Portugal, Netherlands, USA, Mexico, Canada, Japan, Belgium, Croatia, Morocco, Uruguay.

## Stack

- Client: single `public/index.html` — Canvas 2D + vanilla JS, WebAudio synth sounds, no client dependencies.
- Server: `server.js` — Node.js static file server + [`ws`](https://github.com/websockets/ws) WebSocket relay (no game logic, in-memory roster only).

Set a custom port with `PORT=8080 npm start`.
