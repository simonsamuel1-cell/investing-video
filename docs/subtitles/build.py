"""build.py — the subtitle deliverables for the six TA videos (Simon, 22 Oct 2026).

  python3 docs/subtitles/build.py            check, then write the SRTs + the review PDF
  python3 docs/subtitles/build.py --check    only check

In:  id/<KEY>.json (extract_id.py), tr/<KEY>.json (translations), tr/CTA.json (the shared CTA clip), glossary.md
Out: ~/Documents/01 Academy/SRT/<Video name>_<ID|EN|CH|JP|KR>.srt, and one review PDF comparing every language.
"""
import html, json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.expanduser("~/Documents/01 Academy/SRT")
KEYS = ["TA01", "TA03", "TA05", "TA07", "TA09", "TA11"]
LANGS = [("id", "ID"), ("en", "EN"), ("zh", "CH"), ("ja", "JP"), ("ko", "KR")]
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# Terms that must not survive untranslated in ZH/JA/KO (Simon: "Terjemahkan").
LATIN_LEFTOVERS = ["support", "resistance", "candlestick", "candle", "breakout", "uptrend", "downtrend", "sideways",
                   "moving average", "bollinger", "volume", "timeframe", "trend"]


def load(key):
    src = json.load(open(os.path.join(HERE, "id", f"{key}.json")))
    tr = {r["i"]: r for r in json.load(open(os.path.join(HERE, "tr", f"{key}.json")))["rows"]}
    cta = json.load(open(os.path.join(HERE, "tr", "CTA.json")))["rows"]
    rows, k = [], 0
    for r in src["rows"]:
        if r["part"] == "cta":
            t = cta[k]
            k += 1
        else:
            t = tr.get(r["i"])
        rows.append(dict(r, en=t and t.get("en", ""), zh=t and t.get("zh", ""), ja=t and t.get("ja", ""), ko=t and t.get("ko", ""), id=r["text"]))
    return src["name"], rows


def check():
    problems = []
    for key in KEYS:
        name, rows = load(key)
        for r in rows:
            for lang, _ in LANGS:
                v = r.get(lang)
                if not v or not v.strip():
                    problems.append(f"{key} #{r['i']} {lang}: empty")
                    continue
                if lang in ("zh", "ja", "ko"):
                    low = v.lower()
                    for t in LATIN_LEFTOVERS:
                        if t in low:
                            problems.append(f"{key} #{r['i']} {lang}: untranslated '{t}': {v}")
                if lang == "en" and len(v) > 96:
                    problems.append(f"{key} #{r['i']} en long ({len(v)}): {v}")
                if lang in ("zh", "ja", "ko") and len(v) > 60:
                    problems.append(f"{key} #{r['i']} {lang} long ({len(v)}): {v}")
        n = {p: sum(1 for r in rows if r["part"] == p) for p in ("episode", "outro", "cta")}
        print(f"{key}  {name}  rows={len(rows)} {n}")
    return problems


def wrap(text, lang):
    """At most two lines, broken near the middle: at a space (ID/EN/KO) or after CJK punctuation (ZH/JA)."""
    limit = 42 if lang in ("id", "en") else (22 if lang in ("zh", "ja") else 26)
    t = text.strip()
    if len(t) <= limit:
        return t
    mid = len(t) / 2
    if lang in ("zh", "ja"):
        cands = [i + 1 for i, ch in enumerate(t[:-1]) if ch in "，、。：；？！）」”"]
    else:
        cands = [i for i, ch in enumerate(t) if ch == " "]
    if not cands:
        cands = [int(mid)]
    cut = min(cands, key=lambda i: abs(i - mid))
    return t[:cut].rstrip() + "\n" + t[cut:].lstrip()


LIMIT = {"id": 42, "en": 42, "zh": 22, "ja": 22, "ko": 26}


def pieces(r, lang):
    """One subtitle, or two when the text is too long for two lines: split at the sentence or clause break nearest
    the middle, the time shared by text length, so each half still fits two lines."""
    t = r[lang].strip()
    # the Indonesian stays exactly as burned into the video: same cues, same timing
    if lang == "id" or len(t) <= 2 * LIMIT[lang]:
        return [(r["start"], r["end"], t)]
    mid = len(t) / 2
    seps = "。！？，、；：" if lang in ("zh", "ja") else ".!?,;:"
    cands = [i + 1 for i, ch in enumerate(t[:-1]) if ch in seps]
    if lang not in ("zh", "ja"):
        cands = [i for i in cands if i < len(t) and t[i] == " "] or [i for i, ch in enumerate(t) if ch == " "]
    if not cands:
        cands = [int(mid)]
    cut = min(cands, key=lambda i: abs(i - mid))
    a, b = t[:cut].strip(), t[cut:].strip()
    split = r["start"] + (r["end"] - r["start"]) * len(a) / (len(a) + len(b))
    return [(r["start"], split, a), (split, r["end"], b)]


def ts(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def write_srts():
    os.makedirs(OUT, exist_ok=True)
    for key in KEYS:
        name, rows = load(key)
        for lang, tag in LANGS:
            with open(os.path.join(OUT, f"{name}_{tag}.srt"), "w", encoding="utf-8") as fh:
                n = 0
                for r in rows:
                    for st, en, text in pieces(r, lang):
                        n += 1
                        fh.write(f"{n}\n{ts(st)} --> {ts(en)}\n{wrap(text, lang)}\n\n")
    print("SRTs →", OUT)


def write_pdf():
    css = """
    @page { size: A4 landscape; margin: 12mm 10mm 12mm 10mm; }
    body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 8.4pt; color: #1d1d27; }
    h1 { font-size: 20pt; margin: 0 0 4mm; color: #3a2bb8; } h2 { font-size: 13pt; margin: 0 0 3mm; color: #3a2bb8; page-break-before: always; }
    p, li { font-size: 9.5pt; line-height: 1.45; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th { background: #efedfc; color: #3a2bb8; text-align: left; font-size: 8.4pt; padding: 3px 4px; border: 0.5px solid #cfcbe8; }
    td { vertical-align: top; padding: 3px 4px; border: 0.5px solid #dcdce4; word-wrap: break-word; }
    tr { page-break-inside: avoid; } thead { display: table-header-group; }
    tr.outro td { background: #f6f5fe; } .n { color: #888; } .t { color: #555; font-variant-numeric: tabular-nums; }
    td[lang=zh] { font-family: 'PingFang SC', 'Hiragino Sans GB', sans-serif; }
    td[lang=ja] { font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', sans-serif; }
    td[lang=ko] { font-family: 'Apple SD Gothic Neo', sans-serif; }
    .note { width: 11%; }
    """
    cols = '<colgroup><col style="width:3.2%"><col style="width:7.8%"><col style="width:16%"><col style="width:16%"><col style="width:13%"><col style="width:16%"><col style="width:15%"><col class="note" style="width:13%"></colgroup>'
    head = "<thead><tr><th>#</th><th>Waktu</th><th>ID</th><th>EN (US)</th><th>中文 (简体)</th><th>日本語</th><th>한국어</th><th>Catatan</th></tr></thead>"

    def row_html(n, r, show_time=True):
        cls = ' class="outro"' if r.get("part") == "outro" else ""
        t = f"{ts(r['start'])[:-4]}–{ts(r['end'])[3:-4]}" if show_time else ""
        return (f"<tr{cls}><td class=n>{n}</td><td class=t>{t}</td><td lang=id>{html.escape(r['id'])}</td><td lang=en>{html.escape(r['en'])}</td>"
                f"<td lang=zh>{html.escape(r['zh'])}</td><td lang=ja>{html.escape(r['ja'])}</td><td lang=ko>{html.escape(r['ko'])}</td><td></td></tr>")

    parts = []
    names = []
    for key in KEYS:
        name, rows = load(key)
        names.append((key, name, rows))
    cover = ["<h1>Review Subtitle — TA01, TA03, TA05, TA07, TA09, TA11</h1>",
             "<p>Perbandingan subtitle tiap video dalam 5 bahasa: Indonesia (ID), Inggris US (EN), Mandarin simplified (CH), Jepang (JP), Korea (KR). Setiap baris = satu subtitle di file SRT, dengan waktu yang sama persis di semua bahasa (mengikuti file video final di Hasil/: intro, episode, outro &ldquo;Di video selanjutnya&rdquo;, lalu CTA).</p>",
             "<ul>"]
    for key, name, rows in names:
        n = {p: sum(1 for r in rows if r["part"] == p) for p in ("episode", "outro", "cta")}
        cover.append(f"<li><b>{key}</b> — {html.escape(name)}: {len(rows)} baris ({n['episode']} episode, {n['outro']} outro, {n['cta']} CTA)</li>")
    cover += ["</ul>",
              "<p><b>Catatan:</b></p><ul>",
              "<li>Baris CTA (Chart Pro) sama di semua video, jadi ditampilkan sekali di bagian terakhir; di file SRT tiap video tetap lengkap.</li>",
              "<li>TA05: tiga baris dengan kata &ldquo;timeframe&rdquo; yang salah tempat di subtitle video sudah diperbaiki di SRT (video belum diubah).</li>",
              "<li>Istilah teknikal diterjemahkan ke istilah lokal (glossary terlampir di repo: docs/subtitles/glossary.md). Terjemahan dibuat oleh AI — disarankan dicek native speaker untuk CH/JP/KR; kolom Catatan kosong untuk itu.</li>",
              "<li>Baris berlatar ungu muda = outro &ldquo;Di video selanjutnya&rdquo;.</li></ul>"]
    parts.append("".join(cover))
    for key, name, rows in names:
        body = "".join(row_html(r["i"], r) for r in rows if r["part"] != "cta")
        parts.append(f"<h2>{key} — {html.escape(name)}</h2><table>{cols}{head}<tbody>{body}</tbody></table>")
    cta_rows = [r for r in names[0][2] if r["part"] == "cta"]
    first = cta_rows[0]["start"]
    body = "".join(row_html(i + 1, dict(r, start=r["start"] - first, end=r["end"] - first)) for i, r in enumerate(cta_rows))
    parts.append(f"<h2>CTA — Chart Pro (sama di semua video; waktu dari awal klip CTA)</h2><table>{cols}{head}<tbody>{body}</tbody></table>")
    doc = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{''.join(parts)}</body></html>"
    os.makedirs(OUT, exist_ok=True)
    tmp = os.path.join(tempfile.mkdtemp(), "review.html")
    open(tmp, "w", encoding="utf-8").write(doc)
    pdf = os.path.join(OUT, "Review Subtitle - TA01 TA03 TA05 TA07 TA09 TA11.pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--user-data-dir={tempfile.mkdtemp()}",
                    f"--print-to-pdf={pdf}", "file://" + tmp], check=True, capture_output=True)
    print("PDF →", pdf)


if __name__ == "__main__":
    probs = check()
    for p in probs:
        print("  !", p)
    print(f"{len(probs)} problem(s)")
    if "--check" not in sys.argv:
        write_srts()
        write_pdf()
