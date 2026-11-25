// keyframes-refresh.cjs — after a VO revision, move an episode's literal keyframes to the words again.
//   NODE_PATH=node_modules node scripts/vi/keyframes-refresh.cjs src/episodes/<ep> [--write]
// data/keyframes.json holds, per object with literal keyframes (Keyed, or an Interactive.Div), the frames written last time and the words they came from. Only an input range that is
// still exactly those frames is moved; one Simon edited by hand is left alone and listed. A scene's number is its order in SCENES.
const ts = require("typescript"), fs = require("fs");
const EP = process.argv[2].replace(/\/$/, "") + "/", write = process.argv.includes("--write");
const SCENES = JSON.parse(fs.readFileSync(EP + "data/keyframes-scenes.json", "utf8"));
const WORDS = JSON.parse(fs.readFileSync(EP + "data/words.json", "utf8")).words, norm = (s) => s.toLowerCase().replace(/[^0-9a-z]/g, "");
const w = (scene, phrase, nth = 0, edge = "f0") => { const ws = WORDS.filter((x) => x.scene === scene), q = phrase.split(/\s+/).map(norm).filter(Boolean), h = []; for (let i = 0; i + q.length <= ws.length; i++) if (q.every((t, k) => norm(ws[i + k].w) === t)) h.push(i); if (h[nth] === undefined) throw new Error(`"${phrase}" not in SC${scene}`); return edge === "f0" ? ws[h[nth]].f0 : ws[h[nth] + q.length - 1].f1; };
const sp = (n) => { const ws = WORDS.filter((x) => x.scene === n); return { first: Math.min(...ws.map((x) => x.f0)), last: Math.max(...ws.map((x) => x.f1)) }; };
const block = (n) => (n === 1 ? 0 : Math.floor((sp(n - 1).last + sp(n).first) / 2) + 15);
const m = { fps: 60, reveal: 24, fade: 20, pop: 20, move: 40, sec: (s) => Math.round(s * 60) };
const M = JSON.parse(fs.readFileSync(EP + "data/keyframes.json", "utf8"));
let moved = 0, same = 0; const hand = [], lost = [];
for (const f of new Set(M.map((x) => x.file))) {
  const F = `${EP}scenes/${f}.tsx`; let src = fs.readFileSync(F, "utf8"); const sf = ts.createSourceFile(F, src, 99, true, ts.ScriptKind.TSX), objs = {}, ed = [];
  const v = (n) => { if ((ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && ["Keyed", "Interactive.Div"].includes(n.tagName.getText())) { const nm = (n.attributes.properties.find((p) => p.name?.getText() === "name")?.initializer?.getText() ?? "").replace(/"/g, ""); const rs = []; const g = (x) => { if (ts.isCallExpression(x) && x.expression.getText() === "interpolate" && x.arguments[0].getText() === "frame" && ts.isArrayLiteralExpression(x.arguments[1])) rs.push(x.arguments[1]); ts.forEachChild(x, g); }; g(n.attributes); if (rs.length || n.tagName.getText() === "Keyed") (objs[nm] ??= []).push(rs); } ts.forEachChild(n, v); }; v(sf);
  const seen = {}, n = SCENES[f], W = (p, k, e) => w(n, p, k, e) - block(n), val = (s) => Function("W", "m", `return (${s})`)(W, m);
  for (const x of M.filter((y) => y.file === f)) {
    const k = (seen[x.name] = (seen[x.name] ?? -1) + 1), rs = objs[x.name]?.[k]; if (!rs) { lost.push(`${f}: ${x.name}`); continue; }
    let fr; try { fr = x.expr ? (() => { const e = x.expr.map(val); return e.length === 4 ? [e[0], e[0] + e[1], e[2], e[2] + e[3]] : [e[0], e[0] + e[1]]; })() : x.out ? [val(x.at), val(x.at) + x.reveal, val(x.out), val(x.out) + x.fade] : [val(x.at), val(x.at) + x.reveal]; } catch (e) { lost.push(`${f}: ${x.name} — ${e.message}`); continue; }
    if (fr.some((t, i) => i && t <= fr[i - 1])) { lost.push(`${f}: ${x.name} — exit before entrance ends`); continue; }
    let edited = false;
    for (const r of rs) { const now = r.elements.map((e) => +e.getText().replace(/\s/g, "")); if (now.join() !== x.frames.join()) { edited = true; continue; } if (fr.join() !== now.join()) ed.push([r.getStart(), r.end, `[${fr.join(", ")}]`]); }
    if (edited) hand.push(`${f}: ${x.name}`);
    if (fr.join() === x.frames.join()) same++; else { moved++; if (write) x.frames = fr; }
  }
  if (write && ed.length) { ed.sort((a, b) => b[0] - a[0]); for (const [a, b, t] of ed) src = src.slice(0, a) + t + src.slice(b); fs.writeFileSync(F, src); }
}
if (write) fs.writeFileSync(EP + "data/keyframes.json", JSON.stringify(M, null, 1) + "\n");
console.log({ same, moved, editedByHand: hand, needsALook: lost, written: write });
