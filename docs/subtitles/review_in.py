"""review_in.py — one crosscheck PDF per Investing 101 video (IN01, IN04, IN07), in the layout of Simon's reference
"Investing 101_Video 02 - … _Crosscheck Terjemahan.pdf" (19 Nov 2026: "Coba buat review setiap videonya terpisah. Gunakan pdf
ini sebagai referensi"): title, the video it follows, notes for the checker, the QC results, every subtitle in five languages
with its time, then the glossary (shared, and this video's own terms).

  python3 docs/subtitles/review_in.py

In:  id/<KEY>.json, tr/<KEY>.json and the SRTs build.py --keys IN01,IN04,IN07 --no-split wrote to ~/Documents/01 Academy/SRT.
Out: ~/Documents/01 Academy/SRT/Investing 101_<KEY> - <title>_Crosscheck Terjemahan.pdf
"""
import html, json, os, re, subprocess, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SRT = os.path.expanduser("~/Documents/01 Academy/SRT")
HASIL = os.path.expanduser("~/Documents/01 Academy/Hasil")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LANGS = [("ID", "id"), ("EN", "en"), ("CH", "zh"), ("JP", "ja"), ("KR", "ko")]

COMMON_NOTES = [
    "CH memakai Mandarin Sederhana (简体). JP memakai bentuk sopan です/ます, KR memakai 해요체.",
    "Kode saham, nama orang, merek, nama lembaga, dan nama fitur/menu aplikasi (Tuntun, Tuntun AI, Reference Fair Value, Company Quality, dll.) tidak diterjemahkan.",
    "Jumlah Rupiah memakai format internasional di EN (Rp5.000.000 → Rp5,000,000); CH/JP/KR mengikuti glosarium (juta → 万 / 만).",
    "Satu baris = satu subtitle di video: kelima bahasa memakai pembagian baris dan timestamp yang sama. Kalimat yang terbagi di beberapa baris diterjemahkan dengan titik potong yang sama supaya tetap sinkron.",
    "Terjemahan dibuat oleh AI; mohon dicek native speaker untuk CH/JP/KR.",
]

VIDEOS = {
    "IN01": dict(
        title="Passive Income",
        notes=[
            "&lsquo;GAJIAN&rsquo; (huruf kapital di video) → EN &lsquo;PAYDAY&rsquo; (tetap kapital), CH 发薪日, JP 「給料日」, KR 월급날.",
            "&lsquo;exposure&rsquo; (cue 54) tidak punya padanan yang rapi, jadi diterjemahkan sebagai ikut menikmati pertumbuhan nilainya: EN &lsquo;share in the growth of its value&rsquo;, CH 分享…价值增长, JP 価値の成長を共にできます, KR 가치의 성장을 함께 누려요.",
            "Nama BCA, Indomie, Ultra Milk, United Tractors dan Lo Kheng Hong tetap huruf Latin di semua bahasa (tanpa nama Mandarin untuk Lo Kheng Hong).",
            "Jumlah Rupiah kecil (Rp50.000, Rp100.000, Rp300.000, Rp250, Rp15.000) ditulis Rp50,000 dst. di semua bahasa, tidak memakai bentuk 万.",
        ],
        terms=[
            ("passive income", "passive income", "被动收入", "不労所得", "패시브 인컴"),
            ("gajian", "payday", "发薪日", "給料日", "월급날"),
            ("compounding", "compounding", "复利", "複利", "복리"),
            ("aset manusia (human asset)", "human assets", "人力资产", "人的資産", "인적 자산"),
            ("aset finansial", "financial assets", "金融资产", "金融資産", "금융 자산"),
            ("side hustle / freelance", "side hustle / freelance", "副业 / 自由职业", "副業 / フリーランス", "부업 / 프리랜서"),
            ("estafet", "relay", "接力赛", "リレー", "이어달리기"),
        ],
    ),
    "IN04": dict(
        title="Cari Investasi yang Cocok? Kenali Dirimu Dulu",
        notes=[
            "Nama profil dan rencana Tuntun tetap Inggris: Tuntun Personal Investment Plan, Guardian Achiever, Stable Architect, Bold Leader, Strategic Master. CH menambah 型, JP タイプ, KR 유형 sesudah nama tipe.",
            "Cue 50–51: di video jumlah &lsquo;Rp3,2 | juta&rsquo; terpotong di dua baris. Di keempat bahasa jumlahnya utuh di cue 50, cue 51 mulai dengan lanjutan kalimatnya.",
            "&lsquo;market crash&rsquo;: CH 股市崩盘 (cue 42: 市场大跌), JP 暴落, KR 폭락.",
            "&lsquo;instrumen (relatif stabil)&rsquo; → CH 产品, JP 商品, KR 상품 di konteks ini; &lsquo;kemampuan&rsquo; → EN skill, KR 실력.",
            "Tiga baris terakhir (latar ungu muda) = outro &ldquo;Di video selanjutnya&rdquo;.",
        ],
        terms=[
            ("reksa dana pasar uang", "money market fund", "货币市场基金", "MMF（マネー・マーケット・ファンド）", "MMF"),
            ("reksa dana indeks", "index fund", "指数基金", "インデックスファンド", "인덱스 펀드"),
            ("reksa dana saham", "equity fund", "股票型基金", "株式ファンド", "주식형 펀드"),
            ("saham individual", "individual stocks", "个股", "個別株", "개별 주식"),
            ("drawdown", "drawdown", "回撤", "ドローダウン", "낙폭"),
            ("indikator teknikal", "technical indicators", "技术指标", "テクニカルインジケーター", "기술적 지표"),
            ("market crash", "market crash", "股市崩盘", "暴落", "폭락"),
            ("cash flow", "cash flow", "现金流", "キャッシュフロー", "현금 흐름"),
            ("toleransi (risiko)", "tolerance", "承受度", "許容度", "감내도"),
            ("profil investasi", "investment profile", "投资画像", "投資プロフィール", "투자 프로필"),
            ("naik level", "level up", "升级", "レベルアップ", "레벨업"),
        ],
    ),
    "IN07": dict(
        title="Cara Tuntun Membantu Investor Mengurangi Kesalahan",
        notes=[
            "&lsquo;Layar penuh warna merah&rsquo; (cue 3 dan 119, pasar turun) di CH/JP/KR ditulis sebagai penurunan (满屏下跌 / 下落一色 / 온통 하락), karena di pasar Tiongkok, Jepang dan Korea warna merah justru berarti naik.",
            "Nama fitur tetap Inggris: Company Quality, Reference Fair Value, Fair Value, Bullish Signals, Fund Flow, Market Valuation, Event Research, Deep Research Report, Tuntun Guidance, Invest with Guidance, Module Value Investing. &lsquo;fair value&rsquo; huruf kecil di VO ditulis sebagai nama fitur Fair Value.",
            "&lsquo;harga wajar&rsquo; (cue 54, 96) → EN fair price, CH 合理价格, JP 適正価格, KR 적정 가격.",
            "Waktu &lsquo;13.43 WIB&rsquo; → EN 1:43 p.m. WIB, CH 13:43（WIB）, JP 13時43分（WIB）, KR 오후 1시 43분(WIB).",
            "&lsquo;dia&rsquo; (orang dalam skenario) → EN they, CH 他; JP dan KR menghilangkan subjek.",
        ],
        terms=[
            ("voice note", "voice note", "语音", "ボイスメッセージ", "음성 메시지"),
            ("grup (chat)", "group chat", "群", "グループ", "단톡방"),
            ("harga wajar", "fair price", "合理价格", "適正価格", "적정 가격"),
            ("valuasi", "valuation", "估值", "バリュエーション", "밸류에이션"),
            ("leverage", "leverage", "杠杆", "レバレッジ", "레버리지"),
            ("dana pinjaman", "borrowed money", "借钱投资", "借りたお金", "빌린 돈"),
            ("fundamental", "fundamentals", "基本面", "ファンダメンタルズ", "펀더멘털"),
            ("riset industri / perusahaan", "industry / company research", "行业研究 / 公司研究", "業界調査 / 企業調査", "산업 / 기업 리서치"),
            ("sentimen (takut / serakah)", "sentiment (fear / greed)", "市场情绪（恐惧 / 贪婪）", "市場心理（恐怖 / 強欲）", "시장 심리 (공포 / 탐욕)"),
            ("perdagangan dihentikan sementara", "trading halted", "暂停交易", "取引停止", "거래 정지"),
            ("analisis portofolio", "portfolio analysis", "投资组合分析", "ポートフォリオ分析", "포트폴리오 분석"),
        ],
    ),
}
# shared terms; a row is shown in a video's PDF only when its Indonesian appears in that video (any of the `find` words)
SHARED = [
    (("saham",), "saham", "stock(s)", "股票", "株 / 株式", "주식"),
    (("investor",), "investor", "investor", "投资者", "投資家", "투자자"),
    (("instrumen",), "instrumen investasi", "investment instrument", "投资工具", "投資商品", "투자 상품"),
    (("reksa dana",), "reksa dana", "mutual fund", "基金", "投資信託", "펀드"),
    (("deposito",), "deposito", "time deposit", "定期存款", "定期預金", "정기예금"),
    (("dividen",), "dividen", "dividend", "股息", "配当", "배당금"),
    (("return",), "return / imbal hasil", "return", "收益率 / 回报", "リターン", "수익률"),
    (("risiko",), "risiko", "risk", "风险", "リスク", "리스크"),
    (("portofolio",), "portofolio", "portfolio", "投资组合", "ポートフォリオ", "포트폴리오"),
    (("laporan keuangan",), "laporan keuangan", "financial statements", "财务报表", "財務諸表", "재무제표"),
    (("dana darurat",), "dana darurat", "emergency fund", "应急资金", "生活防衛資金", "비상금"),
    (("jangka panjang", "jangka pendek"), "jangka panjang / pendek", "long term / short term", "长期 / 短期", "長期 / 短期", "장기 / 단기"),
    (("tuntun",), "Tuntun (aplikasi)", "Tuntun", "Tuntun", "Tuntun", "Tuntun"),
    (("di video selanjutnya",), "“Di video selanjutnya,” (outro)", "In the next video,", "在下一个视频中，", "次の動画では、", "다음 영상에서는"),
]

TS = re.compile(r"(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)")


def srt_times(path):
    out = []
    for m in TS.finditer(open(path, encoding="utf-8").read()):
        g = list(map(int, m.groups()))
        out.append((g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000, g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000))
    return out


def mmss(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def video_seconds(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


CSS = """
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
@page { size: A4 landscape; margin: 12mm 11mm 12mm 11mm; }
body { font-family: 'Plus Jakarta Sans', -apple-system, 'Helvetica Neue', sans-serif; font-size: 8.4pt; color: #1d1d27; }
h1 { font-size: 21pt; line-height: 1.18; margin: 0 0 3mm; color: #5F4DEE; font-weight: 700; }
h2 { font-size: 13pt; margin: 7mm 0 3mm; color: #5F4DEE; font-weight: 700; }
.meta { font-size: 9pt; line-height: 1.5; margin: 0 0 1.5mm; } .meta b { font-weight: 700; }
.box { background: #f4f3fe; border-left: 4px solid #5F4DEE; padding: 3mm 5mm 3mm 5mm; margin: 4mm 0; }
.box.qc { background: #f2fafd; border-left-color: #5CC8E3; }
.box h3 { margin: 0 0 1.5mm; font-size: 10pt; font-weight: 700; }
.box ul { margin: 0; padding-left: 5mm; } .box li { font-size: 8.4pt; line-height: 1.55; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
th { background: #5F4DEE; color: #fff; text-align: left; font-size: 8.6pt; font-weight: 600; padding: 5px 5px; }
td { vertical-align: top; padding: 5px 5px; border-bottom: 0.5px solid #e2e2ea; word-wrap: break-word; line-height: 1.45; }
tr { page-break-inside: avoid; } thead { display: table-header-group; }
td.n { color: #9a9aa6; text-align: right; padding-right: 8px; } td.t { font-family: Menlo, monospace; font-size: 7.4pt; color: #444; }
td.id { font-weight: 700; } tr.sec td { background: #efedfc; color: #5F4DEE; font-weight: 600; font-size: 9pt; }
tr.outro td { background: #f6f5fe; } table.gl tr:nth-child(even) td { background: #fafafd; }
[lang=zh] { font-family: 'PingFang SC', 'Hiragino Sans GB', sans-serif; }
[lang=ja] { font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', sans-serif; }
[lang=ko] { font-family: 'Apple SD Gothic Neo', sans-serif; }
"""


def build(key):
    v = VIDEOS[key]
    src = json.load(open(os.path.join(HERE, "id", f"{key}.json")))
    tr = {r["i"]: r for r in json.load(open(os.path.join(HERE, "tr", f"{key}.json")))["rows"]}
    rows = src["rows"]
    name = src["name"]
    # QC on the delivered files
    times = {tag: srt_times(os.path.join(SRT, f"{name}_{tag}.srt")) for tag, _ in LANGS}
    same = all(times[tag] == times["ID"] for tag, _ in LANGS)
    counts = {tag: len(t) for tag, t in times.items()}
    overlaps = sum(1 for a, b in zip(times["ID"], times["ID"][1:]) if b[0] < a[1] - 1e-6)
    durs = [e - s for s, e in times["ID"]]
    src_match = len(times["ID"]) == len(rows) and all(abs(t[0] - r["start"]) < 0.002 and abs(t[1] - r["end"]) < 0.002 for t, r in zip(times["ID"], rows))
    mp4 = os.path.join(HASIL, f"{src.get('mp4', name)}_Full.mp4")
    vid = video_seconds(mp4) if os.path.exists(mp4) else 0
    last = rows[-1]["end"]
    if key == "IN01":
        vid_note = (f"File di Hasil/ ({os.path.basename(mp4)}, {vid:.1f} dtk) dirender 12 Okt, SEBELUM scene terakhir ditambahkan; versi terbaru {342.9:.1f} dtk. "
                    f"Subtitle ini mengikuti versi terbaru (baris terakhir berakhir {mmss(last)}), jadi video perlu dirender ulang supaya cocok.")
    else:
        vid_note = f"Durasi video final di Hasil/ {vid:.2f} dtk; baris terakhir berakhir di {mmss(last)}, masih di dalam video."
    qc = [
        f"Kelima SRT: {counts['ID']} baris, " + ("timestamp identik di semua bahasa" if same else "TIMESTAMP BERBEDA: " + str(counts)) + f", {'tidak ada' if not overlaps else overlaps} baris yang tumpang tindih; baris tersingkat {min(durs):.2f} dtk, terpanjang {max(durs):.2f} dtk. Format UTF-8 + LF.",
        "Teks ID = subtitle yang terbakar di video (sumber: subtitles.ts episode, diambil apa adanya); waktu = frame cue + intro 240 frame (4 dtk)" + (" — cocok baris per baris." if src_match else " — ADA YANG TIDAK COCOK."),
        vid_note,
        "Tidak ada baris kosong, tidak ada istilah teknikal yang tertinggal dalam huruf Latin di CH/JP/KR (cek otomatis build.py).",
    ]
    present = " ".join(r["text"].lower() for r in rows)
    shared = [s[1:] for s in SHARED if any(w in present for w in s[0])]

    head = name if name.startswith("Investing 101") else f"Investing 101_{key} - {v['title']}"
    out = [f"<h1>{html.escape(head)} — Crosscheck Terjemahan Subtitle</h1>",
           f"<p class=meta><b>Video acuan:</b> {html.escape(os.path.basename(mp4))} (1920×1080, 60 fps) · <b>Jumlah baris:</b> {len(rows)} (isi {sum(1 for r in rows if r['part'] == 'episode')}"
           + (f", outro {sum(1 for r in rows if r['part'] == 'outro')}" if any(r['part'] == 'outro' for r in rows) else "") + ") · <b>Bahasa:</b> ID · EN · CH (Mandarin Sederhana) · JP · KR</p>",
           "<p class=meta><b>Waktu:</b> sama persis dengan subtitle yang terbakar di video; intro 4 detik sudah dihitung. Kelima bahasa memakai timestamp yang identik; pembagian baris = baris subtitle di video.</p>",
           "<div class=box><h3>Catatan untuk pemeriksa</h3><ul>" + "".join(f"<li>{n}</li>" for n in COMMON_NOTES + v["notes"]) + "</ul></div>",
           "<div class='box qc'><h3>Hasil QC</h3><ul>" + "".join(f"<li>{html.escape(q)}</li>" for q in qc) + "</ul></div>",
           "<table><colgroup><col style='width:3.4%'><col style='width:8.2%'><col style='width:17%'><col style='width:17.4%'><col style='width:17%'><col style='width:18.5%'><col style='width:18.5%'></colgroup>",
           "<thead><tr><th>No</th><th>Waktu</th><th>ID (di video)</th><th>EN</th><th>CH 简体</th><th>JP</th><th>KR</th></tr></thead><tbody>"]
    section = None
    for r in rows:
        if r["part"] != section:
            section = r["part"]
            label = "Isi video" if section == "episode" else "Outro — video selanjutnya"
            out.append(f"<tr class=sec><td colspan=7>{label}</td></tr>")
        t = tr[r["i"]]
        cls = " class=outro" if r["part"] == "outro" else ""
        out.append(f"<tr{cls}><td class=n>{r['i']}</td><td class=t>{mmss(r['start'])}<br>{mmss(r['end'])}</td><td class=id lang=id>{html.escape(r['text'])}</td>"
                   f"<td lang=en>{html.escape(t['en'])}</td><td lang=zh>{html.escape(t['zh'])}</td><td lang=ja>{html.escape(t['ja'])}</td><td lang=ko>{html.escape(t['ko'])}</td></tr>")
    out.append("</tbody></table>")
    gl_head = "<table class=gl><colgroup><col style='width:20%'><col style='width:20%'><col style='width:20%'><col style='width:20%'><col style='width:20%'></colgroup><thead><tr><th>Istilah</th><th>EN</th><th>CH 简体</th><th>JP</th><th>KR</th></tr></thead><tbody>"
    def gl_rows(items):
        return "".join(f"<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td><td lang=zh>{html.escape(c)}</td><td lang=ja>{html.escape(d)}</td><td lang=ko>{html.escape(e)}</td></tr>" for a, b, c, d, e in items)
    out.append("<h2 style='page-break-before: always'>Glosarium istilah (dipakai di ketiga video Investing 101)</h2>" + gl_head + gl_rows(shared) + "</tbody></table>")
    out.append("<h2>Istilah khusus video ini</h2>" + gl_head + gl_rows(v["terms"]) + "</tbody></table>")

    doc = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(out)}</body></html>"
    tmp = os.path.join(tempfile.mkdtemp(), "review.html")
    open(tmp, "w", encoding="utf-8").write(doc)
    pdf = os.path.join(SRT, f"{head.replace('?', '')}_Crosscheck Terjemahan.pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=8000", f"--user-data-dir={tempfile.mkdtemp()}",
                    f"--print-to-pdf={pdf}", "file://" + tmp], check=True, capture_output=True)
    print(key, "→", pdf, "| QC:", "same times" if same else "TIMES DIFFER", "| overlaps", overlaps, "| src match", src_match)


if __name__ == "__main__":
    for k in VIDEOS:
        build(k)
