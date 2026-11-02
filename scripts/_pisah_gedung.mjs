// pecah SVG koleksi gedung (Building.ai → SVG) menjadi gedung terpisah berdasar kotak tiap elemen (Chrome headless)
import { openBrowser } from '@remotion/renderer';
import fs from 'node:fs';
const [,, src, out] = process.argv;
const svg = fs.readFileSync(src, 'utf8');
const html = `<html><body style="margin:0">${svg.replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '')}</body></html>`;
fs.writeFileSync(out + '.html', html);
const b = await openBrowser('chrome', {});
const p = await b.newPage({ context: () => null, logLevel: 'info', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {} });
await p.goto({ url: 'file://' + out + '.html', timeout: 30000 });
const expr = `(() => { const process_root = '${process.env.AKAR || '#OBJECTS'}';
  const root = document.querySelector(process_root);
  const leaves = [...root.querySelectorAll('path,rect,polygon,polyline,circle,ellipse,line')];
  return leaves.map((el, i) => { const bb = el.getBBox(); el.setAttribute('data-i', i);
    // kotak di ruang svg (abaikan transform grup — ekspor Illustrator tanpa transform grup)
    return { i, x: bb.x, y: bb.y, w: bb.width, h: bb.height, fill: el.getAttribute('fill'), html: el.outerHTML.replace(/ data-i="\\d+"/, '') }; });
})()`;
const { value: { result } } = await p._client().send('Runtime.evaluate', { expression: expr, returnByValue: true });
fs.writeFileSync(out, JSON.stringify(result.value));
await b.close({ silent: true });
console.log(out, result.value.length);
