"""extract_id.py — the Indonesian subtitles of the six finished TA videos, timed to the files in Hasil/.

Each video = its episode cues (+ intro offset) + the next-video outro lines + the CTA's burned-in lines.
Frame maths copied from core/EpisodeWrap.tsx: intro 4 s, NEXT_PAUSE 30 frames, hold 1 s, CTA floor(86.216*fps).
Writes docs/subtitles/id/<KEY>.json: [{"i", "start", "end", "text", "part"}] in seconds.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "src")
CUE = re.compile(r'\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*text:\s*"((?:[^"\\]|\\.)*)"\s*\}')
SCUE = re.compile(r'\{\s*start:\s*s\(([\d.]+)\),\s*end:\s*s\(([\d.]+)\),\s*text:\s*"((?:[^"\\]|\\.)*)"\s*\}')

VIDEOS = [
    dict(key="TA01", name="Video 01 - Memahami Pergerakan Pasar dari Grafik", fps=30, intro=True, E=7857,
         cues="episodeChartMemory/subtitles.ts", next="episodeChartMemory/NextVideoCandle.tsx", clip=7.883),
    dict(key="TA03", name="Video 03 - Candlestick (Adv) - Dub Indo Male", fps=30, intro=True, E=11738,
         cues="episodeCandlestick/subtitlesIndo.ts", next="episodeCandlestick/NextVideo.tsx", clip=7.012),
    dict(key="TA05", name="Video 05 - Market Structure_Dub Indo", fps=30, intro=True, E=11832,
         cues="episode20marketstructure/subtitles.ts", next="episode20marketstructure/NextVideo.tsx", clip=7.094),
    dict(key="TA07", name="Video 07 - Moving Average_Dub Indo", fps=30, intro=True, E=9186,
         cues="episodes/019-moving-average/subtitles.ts", next="episodes/019-moving-average/NextVideo.tsx", clip=5.027),
    dict(key="TA09", name="Video 09 - Volume_Dub Indo", fps=60, intro=True, E=20551,
         cues="episodes/020-volume/subtitles.ts", next=None, clip=None),
    dict(key="TA11", name="Video 11 - TA Mistakes - Dub Indo", fps=60, intro=False, E=16965,
         cues="episodes/022-ta-mistakes/subtitles.ts", next=None, clip=None),
]
# TA09's outro lines are frames on the episode timeline: NEXT.at (19890) + k (020-volume/outroCues.ts).
TA09_OUTRO = [(0, 110, "Di video selanjutnya, kita akan bahas"), (113, 224, "multi-timeframe analysis."),
              (248, 345, "Gimana melihat satu saham"), (352, 426, "dari beberapa timeframe,"),
              (428, 613, "dan menggabungkan sinyal yang saling mendukung.")]
# TA05: the word "timeframe" sits one line late in the burned-in subtitles (aligner slip); fixed here.
FIX = {"TA05": {"dalam uptrend. timeframe": "dalam uptrend.",
                "Karena itu, lihat besar lebih dulu. timeframe": "Karena itu, lihat timeframe besar lebih dulu.",
                "Arah pada yang lebih tinggi": "Arah pada timeframe yang lebih tinggi"}}

def unesc(t):
    return t.replace('\\"', '"')

cta = json.load(open(os.path.join(ROOT, "docs/subtitles/cta-id.json")))
os.makedirs(os.path.join(ROOT, "docs/subtitles/id"), exist_ok=True)
for v in VIDEOS:
    fps = v["fps"]
    I = round(4 * fps) if v["intro"] else 0
    out = []
    for a, b, t in CUE.findall(open(os.path.join(SRC, v["cues"])).read()):
        t = FIX.get(v["key"], {}).get(unesc(t), unesc(t))
        out.append(((I + int(a)) / fps, (I + int(b)) / fps, t, "episode"))
    tail = 0
    if v["next"]:
        clip_at = I + v["E"] + 30
        for a, b, t in SCUE.findall(open(os.path.join(SRC, v["next"])).read()):
            out.append(((clip_at + round(float(a) * fps)) / fps, (clip_at + round(float(b) * fps)) / fps, unesc(t), "outro"))
        tail = 30 + round(v["clip"] * fps) + round(1 * fps)
    if v["key"] == "TA09":
        for a, b, t in TA09_OUTRO:
            out.append(((I + 19890 + a) / fps, (I + 19890 + b) / fps, t, "outro"))
    cta_at = (I + v["E"] + tail) / fps
    for a, b, t in cta:
        out.append((cta_at + a, cta_at + b, t, "cta"))
    out.sort(key=lambda r: r[0])
    rows = [dict(i=i + 1, start=round(s, 3), end=round(e, 3), text=t, part=p) for i, (s, e, t, p) in enumerate(out)]
    for x, y in zip(rows, rows[1:]):
        assert y["start"] >= x["start"], (v["key"], x, y)
    json.dump(dict(key=v["key"], name=v["name"], rows=rows), open(os.path.join(ROOT, f"docs/subtitles/id/{v['key']}.json"), "w"), ensure_ascii=False, indent=1)
    print(v["key"], len(rows), "lines", f"ends {rows[-1]['end']:.2f}s", {p: sum(1 for r in rows if r["part"] == p) for p in ("episode", "outro", "cta")})
