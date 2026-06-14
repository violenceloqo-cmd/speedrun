const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.normalize(path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

// ---- WebSocket multiplayer relay ----
// The server holds no game logic: it keeps a roster of connected players
// and relays state/event messages to everyone else.

const wss = new WebSocketServer({ server });

// Only accept WebSocket connections from the deployed frontend (and any
// extra origins listed in ALLOWED_ORIGINS, comma-separated). An empty
// allowlist disables the check (useful for quick local testing).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  'https://worldcuprun.fun,https://www.worldcuprun.fun')
  .split(',').map((s) => s.trim()).filter(Boolean);

const COLORS = [
  '#4dd2ff', '#ff79c6', '#ffd166', '#a78bfa', '#ff8c42',
  '#2dd4bf', '#f472b6', '#a3e635', '#60a5fa', '#fb7185',
];

let nextId = 1;
const players = new Map(); // id -> { ws, name, color, state }

function send(ws, obj) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(obj));
}

function broadcast(obj, exceptId) {
  const raw = JSON.stringify(obj);
  for (const [pid, p] of players) {
    if (pid !== exceptId && p.ws.readyState === p.ws.OPEN) p.ws.send(raw);
  }
}

function rosterFor(exceptId) {
  const list = [];
  for (const [pid, p] of players) {
    if (pid === exceptId) continue;
    list.push({ id: pid, name: p.name, color: p.color, country: p.country, ...p.state });
  }
  return list;
}

wss.on('connection', (ws, req) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.includes(origin)) {
    ws.close(1008, 'origin not allowed');
    return;
  }

  let id = null;
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.t === 'join' && id === null) {
      id = nextId++;
      const name = String(msg.name || '').trim().slice(0, 16) || 'anon';
      const country = String(msg.country || '').trim().slice(0, 4);
      const color = COLORS[id % COLORS.length];
      players.set(id, {
        ws, name, color, country,
        state: { x: 0, y: 0, prog: 0, dead: false, won: false },
      });
      send(ws, { t: 'welcome', id, name, color, country, players: rosterFor(id) });
      broadcast({ t: 'join', id, name, color, country }, id);
      console.log(`[+] ${name} (${country || '—'}) joined (${players.size} online)`);
    } else if (msg.t === 'state' && id !== null) {
      const p = players.get(id);
      if (!p) return;
      p.state = {
        x: +msg.x || 0,
        y: +msg.y || 0,
        prog: +msg.prog || 0,
        dead: !!msg.dead,
        won: !!msg.won,
      };
      broadcast({ t: 'state', id, ...p.state }, id);
    } else if (msg.t === 'event' && id !== null) {
      const p = players.get(id);
      if (!p) return;
      const kind = String(msg.kind);
      if (kind === 'death' || kind === 'win' || kind === 'checkpoint') {
        broadcast({ t: 'event', kind, id, name: p.name, label: String(msg.label || '').slice(0, 24) }, id);
      }
    } else if (msg.t === 'chat' && id !== null) {
      const p = players.get(id);
      if (!p) return;
      const text = String(msg.text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      if (!text) return;
      // Relay to everyone (including sender) so message ordering is consistent.
      broadcast({ t: 'chat', id, name: p.name, color: p.color, text });
    }
  });

  ws.on('close', () => {
    if (id !== null && players.has(id)) {
      const name = players.get(id).name;
      players.delete(id);
      broadcast({ t: 'leave', id, name });
      console.log(`[-] ${name} left (${players.size} online)`);
    }
  });

  ws.on('error', () => {});
});

// Drop dead connections
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { ws.terminate(); continue; }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

server.listen(PORT, () => {
  console.log(`WORLD CUP RUN running -> http://localhost:${PORT}`);
});
