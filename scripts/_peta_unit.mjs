import { openBrowser } from '@remotion/renderer';
import fs from 'node:fs';
const [,, src, outPng, outJson] = process.argv;
const svg = fs.readFileSync(src, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '');
fs.writeFileSync(outPng + '.html', `<html><body style="margin:0;background:#fff">${svg.replace('<svg ', '<svg width="1600" height="1600" ')}</body></html>`);
const b = await openBrowser('chrome', {});
const p = await b.newPage({ context: () => null, logLevel: 'info', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {} });
await p.setViewport({ width: 1600, height: 1600, deviceScaleFactor: 1 });
await p.goto({ url: 'file://' + outPng + '.html', timeout: 30000 });
const expr = `(() => {
  const svg = document.querySelector('svg'); const top = [...svg.children].find((c) => c.tagName === 'g');
  const out = []; const NS = 'http://www.w3.org/2000/svg';
  [...top.children].forEach((st, si) => {
    const units = st.tagName === 'g' ? [...st.children] : [st];
    units.forEach((u, ui) => { const bb = u.getBBox(); out.push({ si, ui, tag: u.tagName, filter: u.getAttribute('filter'), x: bb.x, y: bb.y, w: bb.width, h: bb.height });
      const t = document.createElementNS(NS, 'text'); t.setAttribute('x', bb.x + bb.width / 2); t.setAttribute('y', bb.y + 14); t.setAttribute('font-size', '13'); t.setAttribute('fill', 'red'); t.setAttribute('font-weight', 'bold'); t.textContent = si + '.' + ui; svg.appendChild(t); });
  });
  return out; })()`;
const { value: { result } } = await p._client().send('Runtime.evaluate', { expression: expr, returnByValue: true });
fs.writeFileSync(outJson, JSON.stringify(result.value, null, 1));
const { value } = await p._client().send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(outPng, Buffer.from(value.data, 'base64'));
await b.close({ silent: true }); console.log(result.value.length);
