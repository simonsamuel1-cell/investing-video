// node scripts/studio_fps.mjs <frame> [<frame>...] — ukur fps playback Studio (:3017, InvestmentInstruments) di Chrome headless (media dibisukan)
// (untuk pemutaran penuh + sinkron suara pakai scripts/studio_qa.mjs)
// (pane Studio yang tersembunyi dibatasi rAF 2–3/dtk, jadi tak bisa dipakai mengukur).
// Tiap titik: lompat ke frame (localStorage + muat ulang), putar 5 dtk, baca window.__pb.
import { openBrowser } from '@remotion/renderer';
const argv = process.argv.slice(2);
// --dbga noFx,noBg : saklar diagnosa window.__DBGA (lihat Video.tsx)
const di = argv.indexOf('--dbga'); const dbga = di >= 0 ? argv.splice(di, 2)[1].split(',') : [];
const frames = argv.map(Number);
const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'angle' } });
const LOGS = [];
const page = await browser.newPage({ context: () => null, logLevel: 'info', indent: false, pageIndex: 0,
  onBrowserLog: (l) => { if (/error|warn/i.test(l.type) || /buffer|stall|error/i.test(l.text)) LOGS.push(`[${l.type}] ${l.text.slice(0, 200)}`); }, onLog: () => {} });
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await page.goto({ url: 'http://localhost:3017/' + (process.env.COMP || 'InvestmentInstruments'), timeout: 60000 });
await new Promise((r) => setTimeout(r, 8000));
const raf = await page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else r(n); }; requestAnimationFrame(f); }));
console.log('rAF/s', raf.value ?? raf);
// halaman Remotion tak punya page.keyboard -> kirim KeyboardEvent lewat evaluate
const key = (k, shift = false, n = 1) => page.evaluate((kk, sh, nn) => {
  for (let i = 0; i < nn; i++) {
    for (const type of ['keydown', 'keyup']) document.body.dispatchEvent(new KeyboardEvent(type, { key: kk, code: kk === ' ' ? 'Space' : kk, shiftKey: sh, bubbles: true }));
  }
  return 1;
}, k, shift, n);
// lompat frame: Studio membaca frame awal dari localStorage `remotion.time-all` ({cp06: frame}) saat
// dimuat -> tulis lalu muat ulang (mengetik di tombol nomor frame tak ter-commit di headless)
for (const target of frames) {
  await page.evaluate((ff, c) => { localStorage.setItem('remotion.time-all', JSON.stringify({ [c]: ff })); return 1; }, target, process.env.COMP || 'InvestmentInstruments');
  await page.goto({ url: 'http://localhost:3017/' + (process.env.COMP || 'InvestmentInstruments'), timeout: 60000 });
  await new Promise((r) => setTimeout(r, 6000));
  await new Promise((r) => setTimeout(r, 2500));
  // BISUKAN semua media (tes di browser pernah memutar VO -> Simon mendengar suara dobel, lihat catatan V04)
  await page.evaluate(() => {
    const mute = () => document.querySelectorAll('audio,video').forEach((m) => { m.muted = true; m.volume = 0; });
    mute(); new MutationObserver(mute).observe(document.body, { childList: true, subtree: true }); setInterval(mute, 200); return 1;
  });
  await page.evaluate((ks) => {
    for (const k of ks) { if (!window.__DBGA) break; const [a, b] = k.split('='); window.__DBGA[a] = b === undefined ? true : isNaN(+b) ? b : +b; }
    window.__pb = []; window.__prof = []; window.__errs = []; window.__lt = [];
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([e.startTime, e.duration]); }).observe({ entryTypes: ['longtask'] }); } catch (e) {}
    const fmt = (a) => (a instanceof Error ? `${a.name}: ${a.message}` : typeof a === 'object' ? (() => { try { return JSON.stringify(a).slice(0, 200); } catch { return String(a); } })() : String(a));
    if (!HTMLImageElement.prototype.__dec) {
      const od = HTMLImageElement.prototype.decode; HTMLImageElement.prototype.__dec = true;
      HTMLImageElement.prototype.decode = function () { const src = this.currentSrc || this.src; return od.call(this).catch((e) => { window.__errs.push(`decode-fail ${String(src).slice(-80)} complete=${this.complete} nw=${this.naturalWidth}`); throw e; }); };
    }
    for (const m of ['warn', 'error']) { const o = console[m].bind(console); console[m] = (...a) => { window.__errs.push(`${m}: ${a.map(fmt).join(' ').slice(0, 300)}`); o(...a); }; }
    return 1;
  }, dbga);
  await key(' ');
  await new Promise((r) => setTimeout(r, Number(process.env.PLAYMS || 5000)));
  await key(' ');
  const res = await page.evaluate(() => {
    const pb = window.__pb || []; const p = (window.__prof || []).slice().sort((a, b) => a - b);
    const t = pb.map((x) => x[1]); const dur = (t[t.length - 1] - t[0]) / 1000; let skip = 0; let maxGap = 0;
    for (let i = 1; i < pb.length; i++) { const g = pb[i][0] - pb[i - 1][0]; if (g > 1) skip += g - 1; maxGap = Math.max(maxGap, pb[i][1] - pb[i - 1][1]); }
    const gaps = []; for (let i = 1; i < pb.length; i++) { const g = pb[i][1] - pb[i - 1][1]; if (g > 40) gaps.push(`${pb[i - 1][0]}->${pb[i][0]}:${g.toFixed(0)}ms`); }
    const lt = (window.__lt || []).map(([t, d]) => { let fr = null; for (const x of pb) { if (x[1] <= t) fr = x[0]; } return `f${fr}:${d.toFixed(0)}ms`; });
    return JSON.stringify({ longtasks: lt, from: pb[0] && pb[0][0], to: pb.length && pb[pb.length - 1][0], frames: pb.length, fps: +(pb.length / dur).toFixed(1), skipped: skip, maxGapMs: +maxGap.toFixed(0), reactMedMs: +(p[Math.floor(p.length / 2)] || 0).toFixed(1), reactMaxMs: +(p[p.length - 1] || 0).toFixed(1), gaps });
  });
  console.log(target, res.value ?? res);
  const errs = await page.evaluate(() => JSON.stringify([...new Set(window.__errs || [])].slice(0, 6)));
  if ((errs.value ?? errs) !== '[]') console.log('  errs:', errs.value ?? errs);
  if (LOGS.length) { console.log('  log:', [...new Set(LOGS)].slice(0, 8).join('\n  log: ')); LOGS.length = 0; }
}
await browser.close({ silent: true });
