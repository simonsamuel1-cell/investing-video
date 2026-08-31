# VIDEO 20 — VOLUME
## Script re-timed against the recorded VO

**Source of timing:** `Volume_Sub.srt` (Premiere STT), corrected → `Volume_Sub_CORRECTED.srt`
**VO length:** 00:05:26.533 · **19,592 frames @ 60 fps** · recommended comp length **19,620 f** (short tail)
**Original script estimate:** 04:38 → real VO runs **+48.5 s longer**. Every timestamp in the original script is dead; use only the table below.

Two timings are given per scene:
- **VO** — first word in / last word out, straight from the corrected SRT.
- **BLOCK** — the contiguous AE/Illustrator scene block, cut at the midpoint of the silence between scenes. Blocks butt end-to-end with no gaps, so the timeline is continuous from f0 to f19592.

---

## Master timing table

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | SRT cues |
|---|---|---|---|---|---|
| SC01 | 0 – 809 | 00:00.000 – 00:13.483 | 13.48 s | 00:00.166 – 00:13.266 | 1–7 |
| SC02 | 809 – 1460 | 00:13.483 – 00:24.333 | 10.85 s | 00:13.700 – 00:24.100 | 8–13 |
| SC03 | 1460 – 2388 | 00:24.333 – 00:39.800 | 15.47 s | 00:24.566 – 00:39.533 | 14–21 |
| SC04 | 2388 – 3339 | 00:39.800 – 00:55.650 | 15.85 s | 00:40.066 – 00:55.566 | 22–29 |
| SC05 | 3339 – 4200 | 00:55.650 – 01:10.000 | 14.35 s | 00:55.733 – 01:09.900 | 30–36 |
| SC06 | 4200 – 4894 | 01:10.000 – 01:21.566 | 11.57 s | 01:10.100 – 01:21.366 | 37–42 |
| SC07 | 4894 – 5891 | 01:21.566 – 01:38.183 | 16.62 s | 01:21.766 – 01:38.000 | 43–48 |
| SC08 | 5891 – 6798 | 01:38.183 – 01:53.300 | 15.12 s | 01:38.366 – 01:53.300 | 49–57a |
| SC09 | 6798 – 7473 | 01:53.300 – 02:04.550 | 11.25 s | 01:53.300 – 02:04.400 | 57b–63 |
| SC10 | 7473 – 8154 | 02:04.550 – 02:15.900 | 11.35 s | 02:04.700 – 02:15.900 | 64–68a |
| SC11 | 8154 – 8851 | 02:15.900 – 02:27.516 | 11.62 s | 02:15.900 – 02:27.333 | 68b–74 |
| SC12 | 8851 – 9541 | 02:27.516 – 02:39.016 | 11.50 s | 02:27.700 – 02:38.766 | 75–80 |
| SC13 | 9541 – 10411 | 02:39.016 – 02:53.516 | 14.50 s | 02:39.266 – 02:53.333 | 81–86 |
| SC14 | 10411 – 11201 | 02:53.516 – 03:06.683 | 13.17 s | 02:53.700 – 03:06.366 | 87–94 |
| SC15A | 11201 – 12966 | 03:06.683 – 03:36.100 | 29.42 s | 03:07.000 – 03:35.733 | 95–111 |
| SC15B | 12966 – 14449 | 03:36.100 – 04:00.816 | 24.72 s | 03:36.466 – 04:00.566 | 112–122 |
| SC16 | 14449 – 15355 | 04:00.816 – 04:15.916 | 15.10 s | 04:01.066 – 04:15.666 | 123–130 |
| SC17 | 15355 – 16593 | 04:15.916 – 04:36.550 | 20.63 s | 04:16.166 – 04:36.400 | 131–143 |
| SC18 | 16593 – 17760 | 04:36.550 – 04:56.000 | 19.45 s | 04:36.700 – 04:55.733 | 144–153 |
| SC19 | 17760 – 18704 | 04:56.000 – 05:11.733 | 15.73 s | 04:56.266 – 05:11.600 | 154–160 |
| SC20 | 18704 – 19592 | 05:11.733 – 05:26.533 | 14.80 s | 05:11.866 – 05:26.533 | 161–167 |

**Two scene cuts fall mid-cue** (the narration runs straight through, no silence):
- **SC08 → SC09** at f6798 (01:53.300) — inside cue 57, between "posisi." and "Ketiga,".
- **SC10 → SC11** at f8154 (02:15.900) — inside cue 68, between "sudah datang." and "Nah,".
Both are hard cuts on the word, not on silence. Do not add a transition wipe at these two points.

---

## Transition cards — the real problem

The script assumes ±1 s of air for every roadmap / chapter card. The recorded VO does not contain it. Actual silence between scenes:

| Card | Sits between | Real silence available |
|---|---|---|
| LEARNING ROADMAP | SC02 → SC03 | **0.47 s** |
| CHAPTER 02 | SC06 → SC07 | **0.40 s** |
| KEY POINT — QUICK RECAP + CHAPTER 03 | SC10 → SC11 | **0.00 s** |
| PRACTICE — NOW YOU TRY | SC14 → SC15A | **0.63 s** |
| CHAPTER 04 | SC15B → SC16 | **0.50 s** |
| CHAPTER 05 | SC17 → SC18 | **0.30 s** |
| FINAL RECAP | SC19 → SC20 | **0.27 s** |

**Applied default — VO stays untouched, cards ride over the cut.** Each card is a full-frame overlay that starts **36 f before** the outgoing scene's last word ends and clears **36 f after** the incoming scene's first word starts. The outgoing scene has already made its point by then, so nothing is lost.

| Card | Overlay window (frames) | Length |
|---|---|---|
| LEARNING ROADMAP | 1410 – 1510 | 100 f / 1.67 s |
| CHAPTER 02 | 4846 – 4942 | 96 f / 1.60 s |
| CHAPTER 03 | 8118 – 8214 | 96 f / 1.60 s |
| PRACTICE — NOW YOU TRY | 11146 – 11256 | 110 f / 1.83 s |
| CHAPTER 04 | 14398 – 14500 | 102 f / 1.70 s |
| CHAPTER 05 | 16548 – 16638 | 90 f / 1.50 s |
| FINAL RECAP | 18660 – 18748 | 88 f / 1.47 s |

**KEY POINT — QUICK RECAP (4 combinations) is removed as a standalone card.** There is literally zero silence at SC10 → SC11 to hold a four-row table. Instead the table is **built progressively across SC07–SC10**: row 1 fills in on SC07, row 2 on SC08, row 3 on SC09, row 4 on SC10. By f8154 the complete table is already on screen and simply holds under the CHAPTER 03 overlay. Same information, no extra runtime, and it satisfies "reuse a shared visual, never rebuild it."

**Alternative if you'd rather keep the cards as written:** insert ~1.0 s of silence at each of the 7 cut points in Premiere before assembly. That pushes total runtime to ~05:33 and every frame number above shifts. Say the word and I'll regenerate the table against the re-cut VO.

---

# SCENES

### SCENE 01 — f0–809 · 00:00.000–00:13.483
**NARRATION** (VO 00:00.166–00:13.266)
Bayangin kamu sudah beberapa minggu mantau satu saham yang selalu mentok di resistance. Hari ini, akhirnya tembus dan candle ditutup di atas level itu.
Kelihatannya valid. Tapi, apa berarti langsung beli?

**Beat anchors**
- "mentok di resistance" — 00:03.5 · f210
- "akhirnya tembus" — 00:06.2 · f372
- "Kelihatannya valid" — 00:09.3 · f556
- "langsung beli?" — 00:12.5 · f748

**VISUAL**
Candlestick chart yang beberapa kali gagal melewati garis RESISTANCE. Setiap menyentuh resistance → harga kembali turun.
Candle terbaru close di atas resistance: BREAKOUT ✓
Tombol muncul: BUY?
Jangan ditekan. Volume di bagian bawah chart masih redup/blur.

---

### SCENE 02 — f809–1460 · 00:13.483–00:24.333
**NARRATION** (VO 00:13.700–00:24.100)
Belum tentu. Sebelum masuk, ada satu hal lagi yang perlu kamu cek: volume.
Karena dua breakout yang kelihatannya sama, bisa punya kekuatan yang sangat berbeda.

**Beat anchors**
- "Belum tentu." — 00:13.7 · f822
- "volume" — 00:18.6 · f1114
- "kekuatan yang sangat berbeda" — 00:22.2 · f1330

**VISUAL**
Kamera turun ke volume bar.
Split screen:
BREAKOUT A — Price ↑ + High Volume
vs. BREAKOUT B — Price ↑ + Low Volume
SAME BREAKOUT, DIFFERENT VOLUME / Which One is More Convincing?

**→ LEARNING ROADMAP overlay f1410–1510**
VOLUME ANALYSIS · 01 Understand Volume ● / 02 Read Price + Volume / 03 Confirm the Move / 04 Read the Context / 05 Use It Correctly. Part 01 highlighted, sisanya redup.

---

## PART 01 — UNDERSTAND VOLUME

### SCENE 03 — f1460–2388 · 00:24.333–00:39.800
**NARRATION** (VO 00:24.566–00:39.533)
Kita pahami dulu apa itu volume.
Volume menunjukkan berapa banyak lembar saham yang diperdagangkan dalam satu periode.
Kalau kamu pakai chart harian, satu volume bar mewakili transaksi selama satu hari. Kalau chart-nya lima menit, satu bar berarti transaksi selama lima menit.

**Beat anchors**
- "apa itu volume" — 00:25.5 · f1530
- "dalam satu periode" — 00:30.6 · f1836
- "chart harian" — 00:31.8 · f1908
- "chart-nya lima menit" — 00:36.3 · f2178

**VISUAL**
Satu candle dan satu volume bar sebagai satu pasangan.
1 CANDLE ←→ 1 VOLUME BAR
1D — Volume = Shares Traded in 1 Day
5M — Volume = Shares Traded in 5 Minutes
Akhiri: VOLUME = SHARES TRADED within each period

---

### SCENE 04 — f2388–3339 · 00:39.800–00:55.650
**NARRATION** (VO 00:40.066–00:55.566)
Tapi jangan salah baca. Volume bukan jumlah orang yang bertransaksi.
Volume tinggi bisa saja datang dari beberapa pemain besar, atau dari saham yang sama berpindah tangan berkali-kali.
Jadi, volume menunjukkan seberapa banyak saham yang diperdagangkan, bukan berapa banyak orang yang ikut transaksi.

**Beat anchors**
- "bukan jumlah orang" — 00:41.4 · f2484
- "beberapa pemain besar" — 00:44.9 · f2694
- "berpindah tangan berkali-kali" — 00:47.3 · f2838
- "bukan berapa banyak orang" — 00:53.6 · f3216

**VISUAL**
Split screen.
CASE A — 100 Investors × 1,000 Shares = 100K Volume
CASE B — 2 Large Players × 500K Shares = 1M Volume
Coret: VOLUME = NUMBER OF PEOPLE
Munculkan: VOLUME = SHARES TRADED ✓

---

### SCENE 05 — f3339–4200 · 00:55.650–01:10.000
**NARRATION** (VO 00:55.733–01:09.900)
Satu volume bar juga nggak bisa dinilai sendirian.
Sepuluh juta lembar bisa sangat besar untuk satu saham, tapi biasa saja untuk saham lain.
Karena itu, bandingkan volume hari ini dengan periode sebelumnya atau dengan average volume-nya.

**Beat anchors**
- "dinilai sendirian" — 00:57.5 · f3450
- "10 juta lembar" — 00:59.1 · f3548
- "biasa saja untuk saham lain" — 01:02.1 · f3724
- "average volume-nya" — 01:08.5 · f4110

**VISUAL**
Dua saham sama-sama TODAY'S VOLUME: 10M
STOCK A — 2M · 3M · 2M · 4M · 10M → UNUSUALLY HIGH ↑
STOCK B — 12M · 9M · 14M · 11M · 10M → NORMAL
AVERAGE VOLUME
Key-point card: VOLUME IS RELATIVE / Compare It, Don't Read the Number Alone

---

### SCENE 06 — f4200–4894 · 01:10.000–01:21.566
**NARRATION** (VO 01:10.100–01:21.366)
Cara paling gampang mengingatnya begini: harga menunjukkan ke mana pasar bergerak.
Volume menunjukkan seberapa ramai transaksi di balik pergerakan itu.
Jadi, selalu baca volume bersama harga.

**Beat anchors**
- "harga menunjukkan ke mana" — 01:11.9 · f4314
- "volume menunjukkan seberapa ramai" — 01:14.3 · f4458
- "baca volume bersama harga" — 01:18.2 · f4692

**VISUAL**
PRICE — Where is it moving? ↑ ↓
VOLUME — How active is the move? ▂ ▅ █
Keduanya menyatu: READ PRICE + VOLUME TOGETHER

**→ CHAPTER 02 overlay f4846–4942**
01 ✓ → 02 ● → 03 → 04 → 05 · 02 — READ PRICE + VOLUME · The 4 Basic Combinations

---

## PART 02 — READ PRICE + VOLUME

### SCENE 07 — f4894–5891 · 01:21.566–01:38.183
**NARRATION** (VO 01:21.766–01:38.000)
Sekarang setelah tahu apa itu volume, kita lihat cara membacanya bersama harga.
Ada empat kombinasi dasar yang perlu kamu kenali.
Pertama, harga naik dan volume ikut naik. Ini biasanya membuat kenaikan lebih meyakinkan, karena aktivitas transaksi ikut meningkat.

**Beat anchors**
- "empat kombinasi dasar" — 01:26.7 · f5202
- "Pertama" — 01:29.9 · f5394
- "lebih meyakinkan" — 01:34.4 · f5664

**VISUAL**
PRICE ↑ + VOLUME ↑ → STRONGER CONFIRMATION ✓ / Rising Price + Rising Participation
**Recap table row 1 fills in** (persists to f8154).

---

### SCENE 08 — f5891–6798 · 01:38.183–01:53.300
**NARRATION** (VO 01:38.366–01:53.300 · ends mid-cue 57 on "posisi.")
Kedua, harga naik tapi volumenya justru turun.
Harga masih bisa terus naik, jadi ini bukan otomatis sinyal jual. Tapi aktivitas yang mendukung kenaikannya mulai berkurang.
Artinya, kamu perlu lebih hati-hati dan lebih disiplin mengelola posisi.

**Beat anchors**
- "Kedua" — 01:38.4 · f5902
- "bukan otomatis sinyal jual" — 01:44.1 · f6248
- "mulai berkurang" — 01:47.5 · f6450
- "lebih hati-hati" — 01:50.2 · f6612

**VISUAL**
Higher High ↑ sementara Volume ↓
PRICE ↑ + VOLUME ↓ → PARTICIPATION WEAKENING ⚠
Coret: SELL NOW → WATCH MORE CLOSELY
**Recap table row 2 fills in.**

---

### SCENE 09 — f6798–7473 · 01:53.300–02:04.550
**NARRATION** (VO 01:53.300–02:04.400 · starts mid-cue 57 on "Ketiga,")
Ketiga, harga turun dan volume ikut membesar.
Artinya, penurunan terjadi dengan aktivitas transaksi yang makin tinggi. Ini membuat tekanan jual terlihat lebih serius dan perlu lebih diwaspadai.

**Beat anchors**
- "Ketiga" — 01:53.3 · f6798
- "volume ikut membesar" — 01:55.5 · f6930
- "tekanan jual lebih serius" — 02:00.3 · f7218

**VISUAL**
PRICE ↓ + VOLUME ↑ → STRONGER SELLING PRESSURE ⚠
**Recap table row 3 fills in.**

---

### SCENE 10 — f7473–8154 · 02:04.550–02:15.900
**NARRATION** (VO 02:04.700–02:15.900 · ends mid-cue 68 on "sudah datang.")
Keempat, harga turun tapi volumenya mengecil.
Artinya, tekanan jual mulai mereda. Tapi jangan langsung menganggap harga pasti berbalik naik.
Seller yang mulai berkurang belum tentu berarti buyer sudah datang.

**Beat anchors**
- "Keempat" — 02:04.7 · f7482
- "mulai mereda" — 02:08.9 · f7734
- "belum tentu berarti buyer" — 02:14.3 · f8058

**VISUAL**
PRICE ↓ + VOLUME ↓ → Selling Pressure Easing
LESS SELLING ≠ MORE BUYING
Coret: BUY → WAIT FOR CONFIRMATION
**Recap table row 4 fills in — table now complete:**
↑ ↑ Stronger Confirmation ✓ / ↑ ↓ Weakening Participation ⚠ / ↓ ↑ Stronger Selling Pressure ⚠ / ↓ ↓ Selling Pressure Easing
PRICE TELLS THE MOVE · VOLUME ADDS CONTEXT

**→ CHAPTER 03 overlay f8118–8214** (table holds underneath)
01 ✓ → 02 ✓ → 03 ● → 04 → 05 · 03 — CONFIRM THE MOVE · Breakout • Breakdown • Real Case

---

## PART 03 — CONFIRM THE MOVE

### SCENE 11 — f8154–8851 · 02:15.900–02:27.516
**NARRATION** (VO 02:15.900–02:27.333 · starts mid-cue 68 on "Nah,")
Nah, setelah tahu kombinasi dasarnya, sekarang kita pakai volume untuk mengonfirmasi breakout dan breakdown.
Kita kembali ke breakout tadi.
Resistance adalah area yang sebelumnya berkali-kali menahan kenaikan.

**Beat anchors**
- "mengonfirmasi breakout dan breakdown" — 02:20.8 · f8448
- "kembali ke breakout tadi" — 02:22.2 · f8532
- "berkali-kali menahan kenaikan" — 02:26.4 · f8784

**VISUAL**
Kembali ke chart Scene 01 (chart yang sama, dibawa lintas scene — bukan dibangun ulang).
TEST 1 ✕ · TEST 2 ✕ · TEST 3 ✕ · RESISTANCE
Visualisasikan selling pressure/supply di area resistance: REPEATED SELLING PRESSURE

---

### SCENE 12 — f8851–9541 · 02:27.516–02:39.016
**NARRATION** (VO 02:27.700–02:38.766)
Supaya harga bisa menembus resistance, minat beli harus cukup kuat untuk menyerap saham yang dijual di area itu.
Kalau breakout terjadi dengan volume jauh lebih tinggi dari biasanya, pergerakannya jadi terlihat lebih meyakinkan.

**Beat anchors**
- "menyerap saham yang dijual" — 02:30.7 · f9042
- "volume jauh lebih tinggi" — 02:34.1 · f9246
- "lebih meyakinkan" — 02:36.3 · f9378

**VISUAL**
Supply di resistance perlahan terserap. Harga menembus resistance.
Volume melonjak melewati AVERAGE VOLUME
BREAKOUT + HIGH VOLUME → STRONGER CONFIRMATION ✓

---

### SCENE 13 — f9541–10411 · 02:39.016–02:53.516
**NARRATION** (VO 02:39.266–02:53.333)
Sebaliknya, kalau candle sudah close di atas resistance tapi volumenya biasa saja, breakout-nya belum tentu gagal.
Hanya saja, konfirmasinya lebih lemah.
Kamu bisa menunggu candle berikutnya, retest, atau sinyal tambahan sebelum mengambil keputusan.

**Beat anchors**
- "volumenya biasa saja" — 02:42.2 · f9732
- "belum tentu gagal" — 02:44.2 · f9852
- "konfirmasinya lebih lemah" — 02:46.2 · f9972
- "retest" — 02:50.5 · f10230

**VISUAL**
CLOSE ABOVE RESISTANCE ✓ · VOLUME ≈ AVERAGE
→ BREAKOUT ✓ / WEAK CONFIRMATION ⚠
NEXT CANDLE • RETEST • OTHER CONFIRMATION
Key point: LOW VOLUME ≠ FAILED BREAKOUT

---

### SCENE 14 — f10411–11201 · 02:53.516–03:06.683
**NARRATION** (VO 02:53.700–03:06.366)
Logika yang sama berlaku pada breakdown.
Saat harga menembus support dengan volume besar, tekanan jual terlihat lebih serius.
Tapi kalau support ditembus dengan volume tipis, tetap waspada tanpa langsung menyimpulkan penurunannya pasti berlanjut.

**Beat anchors**
- "berlaku pada breakdown" — 02:53.7 · f10422
- "volume besar" — 02:57.4 · f10644
- "volume tipis" — 03:01.9 · f10914
- "pasti berlanjut" — 03:05.6 · f11136

**VISUAL**
BREAKDOWN A — Price ↓ Support + High Volume → STRONGER SELLING PRESSURE ⚠
vs. BREAKDOWN B — Price ↓ Support + Low Volume → WEAKER CONFIRMATION
WAIT FOR WHAT HAPPENS NEXT

**→ PRACTICE overlay f11146–11256** (Part 03 tetap aktif)
NOW YOU TRY · BRPT — PREDICTION GAME · Read the Price • Compare the Volume

---

### SCENE 15A — f11201–12966 · 03:06.683–03:36.100 · **29.4 s**
**NARRATION** (VO 03:07.000–03:35.733)
Sekarang kita coba pakai logika tadi di chart nyata.
Aplikasi menandai BRPT — harganya baru menembus ke level terendah sebulan terakhir.
Kelihatannya tekanan jual. Tapi lihat dua hari terakhir.
Saat breakdown, volumenya cukup besar, tapi masih kalah dari hari-hari ramai sebelumnya. Besoknya harga malah rebound, dengan volume yang lebih besar dari hari breakdown.
Menurutmu, harga akan lanjut turun, atau breakdown-nya cuma jebakan?
Tiga… dua… satu.

**Beat anchors**
- "BRPT" — 03:11.7 · f11500
- "level terendah sebulan terakhir" — 03:14.3 · f11656
- "lihat dua hari terakhir" — 03:16.7 · f11804
- "Saat breakdown" — 03:19.1 · f11946
- "masih kalah dari hari-hari ramai" — 03:21.2 · f12070
- "Besoknya … rebound" — 03:24.9 · f12292
- "lanjut turun / jebakan?" — 03:28.8 · f12528
- **"Tiga…"** — ~03:32.83 · **f12770**
- **"dua…"** — 03:34.533 · **f12872**
- **"satu."** — ~03:35.20 · **f12912** (cue 111 out 03:35.733 · f12944)

> ⚠ Countdown is tight and **uneven**: Tiga→dua ≈ **102 f**, dua→satu ≈ **40 f**, then 32 f of tail. Total window ≈ 174 f / 2.9 s. Land each numeral on its spoken word — do not space them on an even grid.

**VISUAL**
BRPT · Breakout Low 1M
Chart sampai 1 Juli 2026, seluruh data setelahnya di-mask.
30 JUN — BREAKDOWN ↓ / High, but not exceptional
vs. 1 JUL — REBOUND ↑
① SUPPORT BROKEN
② BREAKDOWN VOLUME < PRIOR SPIKES
③ REBOUND VOLUME > BREAKDOWN VOLUME
WHAT HAPPENS NEXT? · A. CONTINUE DOWN ↓ · B. FALSE BREAKDOWN & RECOVER ↑
3 → 2 → 1
`[NEEDS DATA: BRPT daily OHLCV + volume, window ±1 bulan sekitar 30 Jun – 1 Jul 2026]`

---

### SCENE 15B — f12966–14449 · 03:36.100–04:00.816 · **24.7 s**
**NARRATION** (VO 03:36.466–04:00.566)
Ternyata harga lanjut naik sampai sekitar 1.750.
Clue-nya sudah terlihat dari dua candle tadi.
Volume saat breakdown tidak terlalu dominan dibanding hari-hari ramai sebelumnya. Lalu saat harga rebound, volumenya justru lebih besar.
Artinya, breakdown mulai kehilangan konfirmasi dan buyer mulai memberi respons.
Bukan jaminan harga pasti naik, tapi volume sudah memberi alasan untuk mencurigai breakdown tadi.

**Beat anchors**
- "sampai sekitar 1.750" — 03:38.6 · f13116
- "dua candle tadi" — 03:41.5 · f13290
- "volumenya justru lebih besar" — 03:48.3 · f13698
- "kehilangan konfirmasi" — 03:51.5 · f13890
- "Bukan jaminan harga pasti naik" — 03:55.6 · f14136

**VISUAL**
REVEAL — mask dibuka, harga bergerak 1,300 → 1,500 → 1,600 → ~1,750 ↑, kembali ke atas support.
FALSE BREAKDOWN
30 JUN — Breakdown ↓ / Moderate Volume vs. 1 JUL — Rebound ↑ / Stronger Volume
BREAKDOWN ACTIVITY < REBOUND ACTIVITY
→ BREAKDOWN CONFIRMATION WEAKENS ⚠ → PRICE RECOVERS ✓
Not a Guarantee — Read the Response
`[NEEDS DATA: BRPT continuation ke ~1.750 — tanggal & close harian]`

**→ CHAPTER 04 overlay f14398–14500**
01 ✓ → 02 ✓ → 03 ✓ → 04 ● → 05 · 04 — READ THE CONTEXT · Trend Health • Volume Spike

---

## PART 04 — READ THE CONTEXT

### SCENE 16 — f14449–15355 · 04:00.816–04:15.916
**NARRATION** (VO 04:01.066–04:15.666)
Volume bukan cuma berguna saat breakout. Kita juga bisa memakainya untuk membaca kesehatan trend.
Dalam uptrend yang sehat, dorongan harga naik biasanya datang dengan volume lebih kuat, sementara pullback atau koreksi sementaranya terjadi dengan volume lebih ringan.

**Beat anchors**
- "kesehatan trend" — 04:05.3 · f14720
- "Dalam uptrend yang sehat" — 04:07.2 · f14832
- "volume lebih kuat" — 04:09.7 · f14984
- "pullback" — 04:11.7 · f15102
- "volume lebih ringan" — 04:14.1 · f15246

**VISUAL**
Staircase uptrend:
RALLY — Price ↑ + Higher Volume
PULLBACK — Price ↓ + Lower Volume
Rally berikutnya kembali disertai volume lebih kuat.
HEALTHY UPTREND · Rally = Stronger Volume · Pullback = Lighter Volume

---

### SCENE 17 — f15355–16593 · 04:15.916–04:36.550 · **20.6 s**
**NARRATION** (VO 04:16.166–04:36.400)
Tapi besar kecilnya volume tetap harus dibaca sesuai konteks harga.
Misalnya volume spike, yaitu lonjakan volume yang jauh lebih tinggi dari biasanya.
Di dekat breakout, volume spike bisa menjadi konfirmasi. Setelah rally panjang, bisa menunjukkan profit taking. Saat harga jatuh tajam, bisa menunjukkan panic selling.

**Beat anchors**
- "sesuai konteks harga" — 04:19.1 · f15546
- "volume spike" — 04:21.1 · f15666
- "dari biasanya" — 04:26.5 · f15990
- "Di dekat breakout" — 04:27.4 · f16044
- "Setelah rally panjang" — 04:30.7 · f16244
- "Saat harga jatuh tajam" — 04:33.6 · f16416

**VISUAL**
VOLUME SPIKE · Much Higher Than Usual
Satu spike yang sama ditampilkan dalam tiga konteks (spike-nya dipindah, bukan digambar ulang):
1 — BREAKOUT → STRONGER CONFIRMATION ✓
2 — AFTER LONG RALLY → PROFIT TAKING? ⚠
3 — SHARP DROP → PANIC SELLING? ⚠
SAME VOLUME SPIKE · DIFFERENT CONTEXT
Key point: CONTEXT CHANGES THE MEANING

**→ CHAPTER 05 overlay f16548–16638**
01 ✓ → 02 ✓ → 03 ✓ → 04 ✓ → 05 ● · 05 — USE VOLUME CORRECTLY · Common Mistakes • Limitations

---

## PART 05 — USE VOLUME CORRECTLY

### SCENE 18 — f16593–17760 · 04:36.550–04:56.000 · **19.5 s**
**NARRATION** (VO 04:36.700–04:55.733)
Sebelum selesai, ada beberapa hal yang sering salah dibaca saat menggunakan volume.
Pertama, warna volume bar.
Volume hijau atau merah biasanya hanya mengikuti warna candle. Bukan berarti volume hijau cuma pembelian, atau volume merah cuma penjualan.
Nah, setiap transaksi tetap punya pembeli dan penjual.

**Beat anchors**
- "sering salah dibaca" — 04:39.5 · f16770
- "Pertama, warna volume bar" — 04:42.3 · f16938
- "mengikuti warna candle" — 04:45.3 · f17118
- "cuma pembelian" — 04:47.7 · f17262
- "pembeli dan penjual" — 04:54.9 · f17694

**VISUAL**
COMMON MISTAKE
🟩 GREEN VOLUME — BUYERS ONLY · 🟥 RED VOLUME — SELLERS ONLY (dicoret)
BUYER ↔ TRANSACTION ↔ SELLER
EVERY TRADE HAS A BUYER + A SELLER
GREEN CANDLE → GREEN VOLUME BAR · RED CANDLE → RED VOLUME BAR
COLOR FOLLOWS THE CANDLE

---

### SCENE 19 — f17760–18704 · 04:56.000–05:11.733
**NARRATION** (VO 04:56.266–05:11.600)
Terakhir, pahami juga batasnya.
Volume membantu mengonfirmasi apa yang sudah terjadi, bukan memastikan apa yang akan terjadi berikutnya.
Karena itu, tetap baca volume bersama trend, support dan resistance, pola candle, serta kondisi market secara keseluruhan.

**Beat anchors**
- "pahami juga batasnya" — 04:56.3 · f17776
- "apa yang sudah terjadi" — 05:00.0 · f18000
- "bukan memastikan" — 05:01.1 · f18064
- "trend" — 05:05.9 · f18354 · "support dan resistance" — 05:06.6 · f18396 · "pola candle" — 05:07.9 · f18476 · "market" — 05:09.1 · f18546

**VISUAL**
LIMITATION — chart berhenti pada candle hari ini. Di masa depan: NEXT CANDLE ?
Coret: VOLUME = PREDICTION → VOLUME = CONFIRMATION ✓
TREND / SUPPORT / RESISTANCE / CANDLE / MARKET CONTEXT → COMPLETE ANALYSIS

**→ FINAL RECAP overlay f18660–18748**

---

### SCENE 20 — f18704–19592 · 05:11.733–05:26.533
**NARRATION** (VO 05:11.866–05:26.533)
Ingatlah bahwa harga menunjukkan arahnya, sedangkan volume menunjukkan seberapa ramai transaksi di baliknya.
Volume bukan alat untuk menebak candle berikutnya, tapi membantu menilai apakah sebuah pergerakan cukup meyakinkan atau justru perlu diwaspadai.

**Beat anchors**
- "harga menunjukkan arahnya" — 05:13.0 · f18780
- "transaksi di baliknya" — 05:16.1 · f18968
- "bukan alat untuk menebak" — 05:17.8 · f19068
- "cukup meyakinkan" — 05:22.5 · f19350
- "perlu diwaspadai" — 05:24.7 · f19484

**VISUAL**
Roadmap kembali, semua ✓:
01 Understand Volume ✓ / 02 Read Price + Volume ✓ / 03 Confirm the Move ✓ / 04 Read the Context ✓ / 05 Use It Correctly ✓
Collapse menjadi: PRICE = DIRECTION · VOLUME = PARTICIPATION · READ THEM TOGETHER
Hierarchy: PRICE MOVEMENT → COMPARE VOLUME → CHECK CONTEXT → CONFIRM THE MOVE
Final: PRICE TELLS YOU WHERE · VOLUME TELLS YOU HOW STRONG

---

## Open items

- `[NEEDS DATA]` BRPT daily OHLCV + volume covering the breakdown (30 Jun) and the recovery to ~1.750 — needed for SC15A and SC15B, generated once and shared.
- Countdown numerals in SC15A are unevenly spaced in the recording (92 f / 48 f). Confirmed intentional — they land on the spoken word.
- KEY POINT recap card folded into SC07–SC10 as a progressive table (zero silence available at the SC10 → SC11 cut). If you want it as a standalone card, the VO needs a ~1.5 s insert there.
