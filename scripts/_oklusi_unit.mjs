// oklusi tiap unit tumpukan: render unit 0..i vs semua → piksel unit i yang tertutup unit sesudahnya (Chrome headless, transparan)
import { openBrowser } from '@remotion/renderer';
import fs from 'node:fs';
const [,, src, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const svg = fs.readFileSync(src, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '');
fs.writeFileSync(outDir + '/p.html', `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', '<svg width="800" height="800" ')}</body></html>`);
const b = await openBrowser('chrome', {});
const p = await b.newPage({ context: () => null, logLevel: 'info', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {} });
await p.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });
await p.goto({ url: 'file://' + outDir + '/p.html', timeout: 30000 });
const ev = (e) => p._client().send('Runtime.evaluate', { expression: e, returnByValue: true });
await ev(`window.U = []; (() => { const svg = document.querySelector('svg'); [...svg.children].filter(c => c.tagName === 'ellipse').forEach(e => e.style.display = 'none');
  const top = [...svg.children].find((c) => c.tagName === 'g'); [...top.children].forEach((st) => { if (st.tagName !== 'g') { st.style.display = 'none'; return; } [...st.children].forEach((u) => U.push(u)); }); })(); U.length`);
const shot = async (name) => { await p._client().send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } }); const { value } = await p._client().send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`${outDir}/${name}.png`, Buffer.from(value.data, 'base64')); };
const n = (await ev('U.length')).value.result.value;
for (let i = 0; i < n; i++) {
  await ev(`U.forEach((u, k) => u.style.display = k <= ${i} ? '' : 'none')`); await shot(`upto${i}`);
  await ev(`U.forEach((u, k) => u.style.display = k === ${i} ? '' : 'none')`); await shot(`solo${i}`);
}
await ev(`U.forEach((u) => u.style.display = '')`); await shot('semua');
await b.close({ silent: true }); console.log(n);
