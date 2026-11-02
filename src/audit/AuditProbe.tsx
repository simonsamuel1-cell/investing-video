import React, { useEffect, useMemo } from "react";
import { continueRender, delayRender, getInputProps, useCurrentFrame } from "remotion";

/**
 * PROBE AUDIT TABRAKAN — hanya hidup saat render dijalankan dengan
 * `inputProps: { audit: true }` (scripts/audit-tabrakan.mjs). Di Studio dan di
 * render biasa `AUDIT` = false: `AuditLayer` jadi fragment kosong dan probe
 * tidak dipasang, jadi DOM render final TIDAK berubah satu simpul pun.
 *
 * Tiap frame, probe mengukur kotak layar setiap teks, permukaan (kartu/panel/
 * pil), bentuk SVG, garis, dan candle (ditandai `data-audit="candle"` di
 * CandleBody), lalu mencetaknya sebagai satu baris `AUDIT{json}` ke konsol.
 * Penilaian tabrakannya dikerjakan di Node, bukan di sini.
 */
export const AUDIT = Boolean((getInputProps() as { audit?: boolean }).audit);

export const AuditLayer: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) =>
  AUDIT ? (
    <div data-layer={name} style={{ position: "absolute", inset: 0 }}>
      {children}
    </div>
  ) : (
    <>{children}</>
  );

type Item = { k: string; l: string; t?: string; b: number[]; o: number; a?: number; id: string; z: number; fs?: number; iz?: string; lh?: number;
  /** warna: teks (c), latar kotak (bg), isi SVG (fl), garis SVG (st) — rgba() mentah */
  c?: string; bg?: string; fl?: string; st?: string; fw?: number; bgc?: string; bgi?: string;
  /** skala CSS kumulatif (transform leluhur) — 1 = mendarat; pop yang sedang
   *  tumbuh / overshoot memberi nilai ≠ 1 walau opasitasnya sudah 1 */
  sk?: number;
  /** tebal garis DI LAYAR (px), sudah dikali skala transformasi */
  sw?: number;
  /** berkas gambar (<img> / <image> SVG) — pindai hilang-dom: gambar yang berganti seketika */
  src?: string;
  /** lingkaran potong terkecil dari leluhur (kotak bulat overflow:hidden — masker) [cx, cy, r] — pindai hilang-dom menghitung luas terlihat */
  cc?: number[];
  /** bagian kotak yang tersisa sesudah dipotong leluhur (< 0,98 saja) — elemen yang sedang keluar tepi layar/jendela */
  kp?: number };

const alphaOf = (c: string | null) => {
  if (!c || c === "none" || c === "transparent") return 0;
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return c.startsWith("url(") ? 0.5 : 1;
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return p.length > 3 ? p[3] : 1;
};

const collect = (root: Element): Item[] => {
  const cs = new Map<Element, CSSStyleDeclaration>();
  const style = (e: Element) => {
    let s = cs.get(e);
    if (!s) { s = getComputedStyle(e); cs.set(e, s); }
    return s;
  };
  const opa = new Map<Element, number>();
  const eff = (e: Element | null): number => {
    if (!e || e === root) return 1;
    const hit = opa.get(e);
    if (hit !== undefined) return hit;
    const s = style(e);
    let o = parseFloat(s.opacity);
    if (isNaN(o)) o = 1;
    if (s.visibility === "hidden" || s.display === "none") o = 0;
    const v = o * eff(e.parentElement);
    opa.set(e, v);
    return v;
  };
  // kotak potong dari leluhur (overflow ≠ visible, clip-path inset, clipPath SVG)
  let lingkar: number[] | undefined;
  const clipOf = (e: Element): number[] => {
    let c = [-1e5, -1e5, 1e5, 1e5];
    lingkar = undefined;
    // mulai dari elemen ITU SENDIRI: clip-path miliknya memotong dirinya (salinan
    // teks putih sorotan dipotong `inset()` di dirinya); overflow hanya dari leluhur
    for (let a: Element | null = e; a && a !== root; a = a.parentElement) {
      const s = style(a);
      let r: number[] | null = null;
      if (a !== e && a instanceof HTMLElement && (s.overflow !== "visible" || s.overflowX !== "visible" || s.overflowY !== "visible")) {
        const q = a.getBoundingClientRect(); r = [q.left, q.top, q.right, q.bottom];
        // kotak bulat (radius ≥ 40 % sisi, nyaris persegi) = lingkaran potong masker
        const rad = s.borderTopLeftRadius, ow = a.offsetWidth, oh = a.offsetHeight;
        const rv = rad.endsWith("%") ? (parseFloat(rad) / 100) * ow : parseFloat(rad);
        if (ow > 0 && Math.abs(ow - oh) <= 0.05 * ow && rv >= 0.4 * ow) {
          const cand = [(q.left + q.right) / 2, (q.top + q.bottom) / 2, q.width / 2];
          if (!lingkar || cand[2] < lingkar[2]) lingkar = cand;
        }
      }
      const cp = s.clipPath;
      if (cp && cp.startsWith("inset(")) {
        const q = a.getBoundingClientRect();
        const n = cp.slice(6, -1).split(/\s+/).map((x) => parseFloat(x));
        const [t, rr, bb, l] = [n[0], n[1] ?? n[0], n[2] ?? n[0], n[3] ?? n[1] ?? n[0]];
        const pct = cp.includes("%");
        const W = q.width, H = q.height;
        r = [q.left + (pct ? (l / 100) * W : l), q.top + (pct ? (t / 100) * H : t), q.right - (pct ? (rr / 100) * W : rr), q.bottom - (pct ? (bb / 100) * H : bb)];
      }
      const ref = a === e ? null : a.getAttribute("clip-path");
      if (ref && ref.startsWith("url(#")) {
        const cpEl = document.getElementById(ref.slice(5, -1));
        const child = cpEl?.firstElementChild as SVGGraphicsElement | null;
        if (child && child.getBBox) {
          const bb = child.getBBox(); r = [bb.x, bb.y, bb.x + bb.width, bb.y + bb.height];
        }
      }
      if (r) c = [Math.max(c[0], r[0]), Math.max(c[1], r[1]), Math.min(c[2], r[2]), Math.min(c[3], r[3])];
    }
    return c;
  };
  const cut = (b: number[], c: number[]) => [Math.max(b[0], c[0]), Math.max(b[1], c[1]), Math.min(b[2], c[2]), Math.min(b[3], c[3])];
  const ok = (b: number[]) => b[2] - b[0] >= 1 && b[3] - b[1] >= 1;
  const rnd = (b: number[]) => b.map((v) => Math.round(v));
  const layerOf = (e: Element) => (e.closest("[data-layer]") as HTMLElement | null)?.dataset.layer ?? "?";
  const idOf = (e: Element) => {
    const parts: string[] = [];
    // 14 tingkat (dulu 7): judul & subjudul berbeda baru di tingkat ke-8 → id kata bertabrakan (pindai hilang-dom 15 Okt)
    for (let a: Element | null = e; a && a !== root && parts.length < 14; a = a.parentElement) {
      const p = a.parentElement;
      const i = p ? Array.prototype.indexOf.call(p.children, a) : 0;
      parts.push(a.tagName.toLowerCase() + i);
    }
    return parts.reverse().join(">");
  };

  // skala CSS kumulatif: kotak layar ÷ lebar tata letak pada wadah HTML terdekat
  // (untuk SVG: <svg> terluar — skala viewBox bukan transform, tidak dihitung)
  const skalaMap = new Map<Element, number>();
  const skalaCss = (e: Element): number => {
    let a: Element | null = e;
    while (a && !(a instanceof HTMLElement) && !(a instanceof SVGSVGElement && !(a.parentElement instanceof SVGElement))) a = a.parentElement;
    if (!a) return 1;
    const hit = skalaMap.get(a);
    if (hit !== undefined) return hit;
    const lw = a instanceof HTMLElement ? a.offsetWidth : (a as SVGSVGElement).clientWidth;
    const rw = a.getBoundingClientRect().width;
    const v = lw > 0 && rw > 0 ? Math.round((rw / lw) * 1000) / 1000 : 1;
    skalaMap.set(a, v);
    return v;
  };
  const out: Item[] = [];
  let ekstra: Partial<Item> = {};
  const push = (k: string, e: Element, raw: number[], t?: string, a?: number, fs?: number, lh?: number) => {
    // ambil & kosongkan warna titipan SEKARANG — dulu baru dikosongkan sesudah
    // push berhasil, jadi elemen yang batal (transparan/terpotong) mewariskan
    // warnanya ke elemen berikutnya (logo tercatat berwarna hijau candle)
    const titip = ekstra;
    ekstra = {};
    const o = eff(e);
    if (o < 0.05) return;
    const b = cut(raw, clipOf(e));
    if (!ok(b)) return;
    const cc = lingkar ? lingkar.map((v) => Math.round(v)) : undefined;
    const luasMentah = Math.max(1e-6, (raw[2] - raw[0]) * (raw[3] - raw[1]));
    const kpv = Math.round((((b[2] - b[0]) * (b[3] - b[1])) / luasMentah) * 100) / 100;
    // z = urutan dokumen = urutan cat (kurang lebih; tidak ada z-index di build ini)
    // SEMUA izin di rantai leluhur (mis. takik kartu DI DALAM lapisan yang sedang menyapu)
    const izs: string[] = [];
    for (let a: Element | null = e; a && a !== root; a = a.parentElement) {
      const v = a.getAttribute("data-audit-izin");
      if (v) izs.push(v);
    }
    const iz = izs.length ? izs.join("|") : undefined;
    const sk = skalaCss(e);
    out.push({ k, l: layerOf(e), t, b: rnd(b), o: Math.round(o * 100) / 100, a, id: idOf(e), z: out.length, fs, iz, lh, ...titip, ...(sk !== 1 ? { sk } : {}), ...(cc ? { cc } : {}), ...(kpv < 0.98 ? { kp: kpv } : {}) });
  };

  root.querySelectorAll("*").forEach((e) => {
    ekstra = {}; // warna titipan milik elemen INI saja
    const tag = e.tagName.toLowerCase();
    if (tag === "defs" || e.closest("defs, clipPath, mask, filter, linearGradient, radialGradient")) return;
    const s = style(e);
    if (s.display === "none") return;
    const r = e.getBoundingClientRect();
    const box = [r.left, r.top, r.right, r.bottom];
    if (e.closest('[data-audit="candle"]')) { push("candle", e, box); return; }
    if (e instanceof SVGElement) {
      if (tag === "text") {
        ekstra = { c: s.fill, fw: parseFloat(s.fontWeight) };
        push("txt", e, box, (e.textContent ?? "").trim().slice(0, 40), undefined, parseFloat(s.fontSize)); return;
      }
      if (tag === "image") {
        ekstra = { src: (e.getAttribute("href") ?? e.getAttribute("xlink:href") ?? "").split("/").pop()?.slice(0, 60) };
        push("img", e, box); return;
      }
      if (["rect", "path", "circle", "ellipse", "polygon", "line", "polyline"].includes(tag)) {
        const fa = alphaOf(s.fill) * parseFloat(s.fillOpacity || "1");
        const sa = alphaOf(s.stroke) * parseFloat(s.strokeOpacity || "1");
        const sw = parseFloat(s.strokeWidth || "0");
        const lineLike = tag === "line" || tag === "polyline" || fa < 0.04;
        const g = e as unknown as SVGGraphicsElement;
        const ctm = g.getScreenCTM ? g.getScreenCTM() : null;
        const skala = ctm ? Math.hypot(ctm.a, ctm.b) : 1;
        const tebal = parseFloat(s.strokeWidth || "0") * (s.vectorEffect === "non-scaling-stroke" ? 1 : skala);
        ekstra = { fl: s.fill, st: s.stroke, sw: Math.round(tebal * 100) / 100 };
        if (!lineLike && fa >= 0.04) push("fill", e, box, undefined, Math.round(fa * 100) / 100);
        else if (sa >= 0.05 && sw > 0) push("line", e, box, undefined, Math.round(sa * 100) / 100);
      }
      return;
    }
    if (tag === "img") {
      ekstra = { src: ((e as HTMLImageElement).getAttribute("src") ?? "").split("/").pop()?.slice(0, 60) };
      push("img", e, box); return;
    }
    // HTML: teks milik simpul ini sendiri
    let txt = "";
    const rects: number[][] = [];
    e.childNodes.forEach((n) => {
      if (n.nodeType === 3 && (n.textContent ?? "").trim()) {
        txt += (n.textContent ?? "").trim() + " ";
        const rg = document.createRange(); rg.selectNodeContents(n);
        Array.from(rg.getClientRects()).forEach((q) => { if (q.width > 0 && q.height > 0) rects.push([q.left, q.top, q.right, q.bottom]); });
      }
    });
    if (rects.length) {
      const u = rects.reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);
      const fsz = parseFloat(s.fontSize);
      const lhRaw = parseFloat(s.lineHeight);
      ekstra = { c: s.color, fw: parseFloat(s.fontWeight) };
      push("txt", e, u, txt.trim().slice(0, 40), undefined, fsz, isNaN(lhRaw) ? fsz * 1.2 : lhRaw);
    }
    // HTML: permukaan (latar / tepi / gambar latar)
    const bg = alphaOf(s.backgroundColor) >= 0.04 || (s.backgroundImage && s.backgroundImage !== "none");
    const bw = Math.max(parseFloat(s.borderTopWidth), parseFloat(s.borderRightWidth), parseFloat(s.borderBottomWidth), parseFloat(s.borderLeftWidth));
    const bd = bw >= 1 && Math.max(alphaOf(s.borderTopColor), alphaOf(s.borderLeftColor), alphaOf(s.borderRightColor), alphaOf(s.borderBottomColor)) >= 0.1;
    // latar selebar kanvas (tabir breakscene, latar scene mandiri) = PENUTUP: apa pun di
    // bawahnya tidak terlihat, jadi penilai membuang benda di bawah tabir pekat
    // tabir gradien (breakscene memakai gradien latar sejak 2026-09-24) = pekat
    const tabirGradien = !!s.backgroundImage && s.backgroundImage.includes("gradient") && alphaOf(s.backgroundColor) < 0.04;
    if ((bg || bd) && r.width >= 1900 && r.height >= 1000) push("bg", e, box, undefined, tabirGradien ? 1 : Math.round(alphaOf(s.backgroundColor) * 100) / 100);
    else if ((bg || bd) && r.width >= 10 && r.height >= 10) {
      ekstra = { bg: s.backgroundImage && s.backgroundImage !== "none" ? "gradien" : s.backgroundColor, st: bd ? s.borderTopColor : undefined,
        // warna latar di BAWAH gradien + gradiennya sendiri (penilai merata-ratakan hentiannya)
        bgc: s.backgroundColor, bgi: s.backgroundImage && s.backgroundImage !== "none" ? s.backgroundImage.slice(0, 400) : undefined };
      push("box", e, box, undefined, s.backgroundImage && s.backgroundImage !== "none" ? 0.5 : Math.round(alphaOf(s.backgroundColor) * 100) / 100);
    }
    // div TIPIS berwarna = garis HTML (pemisah, aksen); dicatat sebagai garis
    else if (alphaOf(s.backgroundColor) >= 0.04 && Math.min(r.width, r.height) <= 8 && Math.max(r.width, r.height) >= 20) {
      ekstra = { st: s.backgroundColor, sw: Math.round(Math.min(r.width, r.height) * 100) / 100 };
      push("hline", e, box);
    }
    // (15 Okt, pindai hilang-dom) permukaan kecil/tipis yang lolos dua cabang di atas (sisi < 10 px bergradien, atau 8–10 px) — dulu TIDAK
    // tercatat, jadi kartu yang diskalakan masker melewati ambang 10 px terbaca "hilang". Jenis sendiri: penilai tabrakan tidak memakainya.
    else if ((bg || bd) && r.width >= 1 && r.height >= 1) push("tipis", e, box);
  });
  return out;
};

export const AuditProbe: React.FC = () => {
  const frame = useCurrentFrame();
  const handle = useMemo(() => delayRender(`audit ${frame}`), [frame]);
  useEffect(() => {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      try {
        const root = document.querySelector("[data-audit-root]");
        const items = root ? collect(root) : [];
        console.log("AUDIT" + JSON.stringify({ f: frame, items }));
      } catch (err) {
        console.log("AUDITERR " + frame + " " + String(err));
      }
      continueRender(handle);
    };
    document.fonts.ready.then(() => setTimeout(run, 0));
  }, [frame, handle]);
  return null;
};
