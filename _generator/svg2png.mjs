import { spawn } from 'node:child_process'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const [SVG, OUT] = process.argv.slice(2);
const PORT = 9300 + Math.floor(Math.random() * 400); const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-'));
const ch = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); setTimeout(() => process.exit(2), 45000);
let v; for (let i = 0; i < 100 && !v; i++) { try { v = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await sleep(150); } }
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('file://' + path.resolve(SVG))}`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let s = 0; const P = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && P.has(d.id)) { P.get(d.id)(d); P.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const id = ++s; P.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await sleep(1800);
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080, scale: 1 } });
fs.writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));
ws.close(); ch.kill('SIGKILL'); fs.rmSync(prof, { recursive: true, force: true }); process.exit(0);
