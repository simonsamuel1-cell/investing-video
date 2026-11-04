// node scripts/studio_putar.mjs <komposisi> <frame> [<frame>...] — ukur kelancaran PUTAR Studio (:3020) di Chrome headless (media dibisukan).
// Tiap titik: lompat ke frame (localStorage `remotion.time-all` + muat ulang), tekan spasi, catat jarak antar-rAF selama 4 dtk.
// rAF terlambat (> 20 ms) = Studio tak sempat menggambar frame itu → terlihat patah-patah. (Pane browser Claude tersembunyi dibatasi rAF.)
import { openBrowser } from '@remotion/renderer';
const [komp, ...titik] = process.argv.slice(2);
const UJI = JSON.parse(process.env.UJI || '{}'); // saklar diagnosa window.__uji
const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'angle' } });
const page = await browser.newPage({ context: () => null, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: () => {}, onLog: () => {} });
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
const url = `http://localhost:3020/${komp}`;
await page.goto({ url, timeout: 60000 });
await new Promise((r) => setTimeout(r, 8000));
const spasi = () => page.evaluate(() => { for (const type of ['keydown', 'keyup']) document.body.dispatchEvent(new KeyboardEvent(type, { key: ' ', code: 'Space', bubbles: true })); return 1; });
for (const fr of titik.map(Number)) {
  await page.evaluate((k, ff) => { localStorage.setItem('remotion.time-all', JSON.stringify({ [k]: ff })); return 1; }, komp, fr);
  await page.goto({ url, timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));
  await page.evaluate(() => { const m = () => document.querySelectorAll('audio,video').forEach((x) => { x.muted = true; x.volume = 0; }); m(); setInterval(m, 200); return 1; });
  await page.evaluate((u) => { window.__uji = u; return 1; }, UJI);
  await spasi();
  const hasil = await page.evaluate(() => new Promise((r) => {
    const jarak = []; let t0 = performance.now(); const awal = t0;
    const f = () => { const t = performance.now(); jarak.push(t - t0); t0 = t; if (t - awal < 4000) requestAnimationFrame(f); else r(jarak); };
    requestAnimationFrame(f);
  }));
  const j = (hasil.value ?? hasil).slice(5);
  const rata = j.reduce((a, b) => a + b, 0) / j.length;
  console.log(`f${fr}: ${(1000 / rata).toFixed(1)} fps · rAF > 20 ms: ${j.filter((x) => x > 20).length}/${j.length} · > 34 ms: ${j.filter((x) => x > 34).length} · maks ${Math.max(...j).toFixed(0)} ms`);
  if (process.env.DETAIL) { let acc = 0; const lama = []; (hasil.value ?? hasil).forEach((x) => { acc += x; if (x > 34) lama.push(`+${(acc / 1000).toFixed(2)}s≈f${Math.round(fr + (acc / 1000) * 60)}:${x.toFixed(0)}ms`); }); console.log('  lama: ' + lama.join(' ')); }
  await spasi();
}
await browser.close({ silent: true });
