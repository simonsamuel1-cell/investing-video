# Inventaris Komponen — 5 Episode Terakhir
### Dasar untuk `src/core/`

Diukur dari `investing-video`, branch: Moving-Average, Market-Structure, Chart, Candlestick-Intermediate, Concept-Sector-Revision. Folder backup (`episodeMovingAverage2`, `episodeChartMemory2`) dikeluarkan dari hitungan.

**104 file komponen, 9.701 baris, di 5 episode.**

---

## Temuan akar masalah

Hanya **8 nama komponen** yang muncul di lebih dari satu episode. Itu terlihat seperti "memang tiap episode beda". Bukan.

Bandingkan `Captions.tsx` di Moving-Average (45 L) dengan Market-Structure (47 L). Fungsinya identik — teks cue di band bawah. Seluruh perbedaannya cuma nama kunci theme:

| Moving-Average | Market-Structure |
|---|---|
| `theme.layout.width` | `theme.canvas.width` |
| `theme.colors.indigo` | `theme.color.indigo` |
| `theme.type.family` | `theme.text.family` |
| `CAPTION_BAND.top` | `theme.captionBand.top` |

`SafeArea` Chart vs Candlestick: sama persis, kecuali Chart menambah hook `usePalette`.

**Jadi komponen tidak bisa dipakai ulang bukan karena desainnya beda — tapi karena skema theme diganti nama tiap episode.** Ini kabar bagus: memperbaiki skema theme sekali langsung membuka sebagian besar komponen chrome untuk dipakai bersama.

Duplikasi dari nama yang sama saja sudah 968 baris. Duplikasi **berdasarkan fungsi** jauh lebih besar — lihat di bawah.

---

## Tier 0 — Skema theme (memblokir semua yang lain)

Harus selesai sebelum satu komponen pun dipindahkan.

Basis: **`theme.ts` Market-Structure**. Alasannya bukan selera — layout-nya diturunkan dari margin (`active`, `card`, `captionBand`, `logoZone` semua dihitung dari `MARGIN`), bukan diketik manual. Ubah margin, seluruh episode ikut bergeser. Empat theme lain mengetik koordinat langsung.

Yang harus berubah dari versi Market-Structure:
- **`fps` keluar dari theme.** Komponen tidak boleh tahu fps. Durasi dalam detik atau lewat `useVideoConfig().fps`.
- **Nama kunci dibekukan.** `theme.color`, `theme.text`, `theme.canvas`, `theme.margin`, `theme.captionBand`, `theme.logoZone`. Setelah ini tidak boleh diganti nama lagi — penggantian nama itulah yang memutus reuse.
- **Palet sebagai slot, bukan nilai.** ⚠ Koreksi dari versi pertama dokumen ini: 52 hex di Chart bukan improvisasi — itu **satu skema 14 slot yang diisi empat kali** (`terang`, `gelap`, `kertas`, `ungu`). Itu arsitektur warna paling matang dari kelima episode dan satu-satunya yang memisahkan slot dari nilai. Core memakai skema Chart; nilainya `terang`, yang isinya sama dengan 13 warna Market-Structure. **Konsekuensi: episode Chart bisa dimigrasi tanpa perubahan visual sama sekali.**
- **`bg` = `#F5F5F5`.** Moving-Average memakai `#FFFFFF`, menyimpang dari spesifikasi brand dan dari 4 episode lain.

---

## Tier 1 — Core chrome

Tiap episode butuh, tidak ada alasan berbeda. Prioritas tertinggi.

| Fungsi | File sekarang | LOC | Ambil dari |
|---|---|---|---|
| Panggung + background | SafeArea ×4 (54/25/27/111), Stage (MS 84) | 301 | Stage (MS) + `transparent` prop dari Chart |
| Logo mark | Watermark ×2 (52/43), TuntunMark ×2 (114/109) | 318 | TuntunMark (MA) — paling lengkap |
| Subtitle band | Captions ×2 (45/47), Subtitles ×2 (48/45) | 185 | Captions (MS) + prop `show` |
| Chip / label | Chip ×4 (142/99/96/70), LabelChip, PivotLabel, IllustrationTag, SourceTag, DisclaimerChip | 654 | Chip (MS) sebagai basis, varian jadi prop |
| Tipografi | Text (MS 111), TextBlock (MA 156), StatementText, Heading, TitleBlock, TitleChip, ClosingCaption, TextCard | 674 | Text (MS) + reveal per kata dari TextBlock (MA) |
| Penanda titik | Ping ×3 (40/43/58) | 141 | Ping (CS) — paling lengkap |
| Kotak sorot | HighlightBox ×3 (70/110/48) | 228 | HighlightBox (MS) |

**Subtotal: 2.501 baris → perkiraan ~700 baris di core.**

---

## Tier 2 — Mesin chart

Komponen termahal dan paling sering dikoreksi. Ditulis ulang 10 kali.

| Fungsi | File sekarang | LOC |
|---|---|---|
| Chart candle | ChartFrame (MA 252), CandleChart (MS 147), CandlestickChart (Chart 109), DemoChart (CS 190), CandleSeries (CS 78), BbriChart (CS 46) | 822 |
| Candle tunggal | Candle (CS 68), LiveCandle (CS 34), AnatomyCandle (Chart 104) | 206 |
| Line chart | LineChart (Chart 56) | 56 |
| Anotasi level | ZoneBand (34), RangeBand (92), ReferenceLine (73), SwingLines (58), StructureLine (213) | 470 |
| Panah & coret | Arrow (75), AxisArrow (69), Strike (55) | 199 |
| Reveal | RevealMask (52), RevealCurtain (22), FocusFrame (45), MagnifierLens (63) | 182 |
| Indikator | MALine (55), BollingerBands (154), IndicatorOverlays (90), Studies (116) | 415 |

**Subtotal: 2.350 baris → perkiraan ~900 baris di core.**

Basisnya `ChartFrame` (MA) — paling matang secara fitur, tapi 252 baris dan perlu dipangkas. `CandleChart` (MS) lebih bersih tapi lebih sedikit fiturnya. Rencana: struktur dari MS, fitur dari MA.

Satu aturan yang harus masuk: **input data satu format saja.** Sekarang tiap episode punya format sendiri — `ggrm.json`, `asii.ts`, `bmri.ts`, `shots.ts` (anchor `[t, price]` hasil tracing), `bbri-placeholder.ts`. Core menerima satu bentuk OHLCV; konversi dari CSV TradingView dilakukan di luar komponen.

---

## Tier 3 — Pola berulang

Muncul di beberapa episode dengan bentuk berbeda. Masuk core setelah Tier 1–2 stabil.

| Fungsi | File | LOC |
|---|---|---|
| Kartu / panel | QuoteBox (237), ReadingCard (189), PrincipleCard (70), PatternCard (93), ReferenceCard (85), PriceCard (70), Card (77), Callout (153), TextCard | 974 |
| Split & pane | ComparePanels (77), SubPane (105), SplitDivider (84) | 266 |
| Countdown kuis | Countdown (57), CountdownNumeral (49), QuizTitle (108) | 214 |
| Roadmap / progress | StepLink (59), TallyStrip (71) | 130 |
| Mockup aplikasi | PhoneFrame (147), PhoneCenter (47), DeviceFrame (93), ScreenClip (57), AppSummaryPanel (89), BbriVideo (67) | 500 |

---

## Tetap milik episode

Ini memang spesifik topik. Jangan dipaksa masuk core.

`SessionView` (422), `ContextStrip` (251), `PatternGlyph` (186), `PatternPairScene` (164), `PatternTabRow` (116), `CaseStudyScene` (199), `CaseStudyTabs` (116), `CaseStudyTabsPair` (99), `CaseStudyLayoutFrame` (67), `CaseStudyLayout` (19), `SessionClockAxis` (57), `TallyStrip` — Candlestick
`TimeframeImages` (227), `TimeframeSelector` (92), `SmileCurves` (63) — Chart
`ForceBars` (73) — Market-Structure
`ThemeStocksDiagram` (206), `TickerGrid` (126), `RecapMontage` (161) — Concept-Sector

---

## Dibuang

- `episodeMovingAverage2/` (5.888 L) dan `episodeChartMemory2/` (4.440 L) — backup beku. Setelah semua di `main`, git sendiri yang jadi backup. **10.328 baris hilang tanpa kehilangan apa pun.**
- `threeLab/` (286 L) — eksperimen, bukan produksi.
- Arsitektur lama `src/components` + `src/scenes` di root (Concept-Sector, Bandarmology, Event-Driven, Fair-Value) — ditinggalkan saat pindah ke pola `episodeX/`.

---

## Audit otomatis yang ikut lahir dari ini

Setelah theme jadi satu skema, empat cek bisa jalan otomatis dan menolak sebelum render:

1. Tidak ada elemen menyentuh band subtitle 108 px bawah.
2. Tidak ada elemen di zona logo 360×150 kanan atas.
3. Tidak ada hex di luar palet theme.
4. `candleGreen` / `candleRed` hanya dipakai badan dan sumbu candle.
5. Tidak ada angka frame telanjang di dalam komponen.

Ini menghapus seluruh kategori "Teknis" dari daftar penolakanmu — tanpa perlu penilaian selera sama sekali.

---

## Urutan kerja

1. **Tier 0** — kunci skema theme. Tidak ada yang bisa jalan sebelum ini.
2. **Tier 1** — core chrome. 7 komponen, dampak langsung ke tiap episode.
3. **Audit** — 5 cek di atas.
4. **Tier 2** — mesin chart. Paling besar, paling berharga.
5. **Buktikan dengan Video 20** sebagai episode pertama yang dibangun di atas core.
6. **Tier 3** menyusul saat dibutuhkan.

Migrasi episode lama: opsional, satu per satu, tiap kali diverifikasi render still sebelum/sesudah.

---

## Keputusan — sudah diambil

- **Chip** — dipangkas ke set opsi minimal. Varian yang ada lahir dari penilaian desain sesaat dan tidak konsisten antar episode, jadi tidak dipertahankan. Set final ditentukan setelah penghitungan pemakaian per opsi.
- **Palet** — core memakai skema 14 slot dari Chart, default `terang`. Bukan nilai datar Market-Structure.
- **`usePalette`** — masuk core, terpasang penuh, meski belum tentu dipakai. Mesinnya bagian yang mahal dan sudah ditulis.

## Status

**Tier 0 selesai** — `core/theme.ts` dan `core/palette.tsx` sudah ditulis, lolos `tsc`, dan nilai turunannya diverifikasi:

```
active       { x: 96, y: 54, w: 1728, h: 918 }
card         { x: 96, y: 190, w: 1728, h: 686 }
plot         { x: 160, y: 254, w: 1546, h: 558 }
captionBand  { top: 972, height: 108 }
reveal       12 frame @30fps  ·  24 frame @60fps
palettes     terang, gelap, kertas, ungu — 14 slot
theme.canvas.fps → tidak ada (sesuai rencana)
```

**Tier 1 selesai** — 12 file di `core/`, lolos `tsc --strict`, lolos audit sendiri (`✓ audit clean — 12 files`).

| File | Isi |
|---|---|
| `theme.ts` | token + layout turunan + 4 palet × 14 slot |
| `palette.tsx` | `usePalette`, `useShadow`, `PaletteProvider` |
| `useMotion.ts` | detik → frame di fps Composition |
| `helpers.ts` | timing, easing, format harga/persen, geometri rect |
| `Stage.tsx` | `Stage`, `Card`, `Layer` |
| `Text.tsx` | `Title`, `Line`, `Words` (reveal per kata) |
| `Chip.tsx` | 10 prop, dipangkas dari 14 |
| `Ping.tsx`, `HighlightBox.tsx`, `Captions.tsx`, `Watermark.tsx` | — |
| `index.ts` | satu permukaan import |

**Audit selesai** — 3 script:

- `scripts/audit.mjs` — 8 aturan statis. Dijalankan ke repo apa adanya: **141 pelanggaran di 86 file**, termasuk 55 hex di luar palet, 29 pemakaian warna candle di luar komponen candle, 13 komponen core yang didefinisikan ulang, dan 2 `fps` literal.
- `scripts/audit-frames.mjs` — cek geometri pada still hasil render: band subtitle 108px kosong, zona logo 360×150 kosong.
- `scripts/srt-to-cues.mjs` — SRT terkoreksi → `subtitles.ts` di fps mana pun, dihitung dari milidetik. Diuji dengan SRT Video 20 @60fps: `VO_END = 19592`, cocok persis dengan dokumen sync.

**Tier 2 selesai** — `core/chart/`, 7 file.

| File | Isi |
|---|---|
| `series.ts` | **3 sumber → 1 output.** `fromOHLC` (data asli), `fromScreenshot` (anchor traced), `fromShape` (uptrend/downtrend/sideways/reversal/drift). Semua jadi `Bar[]`; komponen chart tidak tahu asalnya. Plus `sma`, `ema`, `bollinger`, `volumeOf`, `domainOf` |
| `grid.ts` | ruang koordinat bersama — `gridOf`, `pathOf`, `drawPath`, `ticksOf`, `candleWidth` |
| `Candles.tsx` | candle + volume histogram. **Satu-satunya file yang boleh menyebut candleGreen/candleRed** — audit menegakkan lewat nama file |
| `Chart.tsx` | chart lengkap: gridline, price scale, mode line/candle, `TimeAxis` |
| `Indicators.tsx` | `IndicatorLine` (draw-on trim path), `IndicatorBand`, `CrossMark` |
| `Annotations.tsx` | `Level` (restyle saat broken, bukan digambar ulang), `PriceTag`, `Zone`, `SwingMarks`, `Arrow`, `RevealMask` |

`SourceKind` ikut jalan bersama series, jadi tag **Ilustrasi** tidak bisa hilang karena lupa — `SourceTag` membacanya. Ganti traced ke export asli, tagnya copot sendiri.

**Tier 3 selesai** — 6 file.

`Panel.tsx` (`Panel`, `StatCard`, `KeyPoint`) · `StepRail.tsx` (roadmap satu objek dibawa lintas episode + `ChapterCard`) · `Countdown.tsx` (**menerima array frame per angka**, bukan interval — countdown rekaman tidak pernah rata) · `Screen.tsx` (`DeviceFrame`, `ScreenClip` — aset dipakai verbatim) · `Split.tsx` (`splitRects`, `SplitDivider`, `SplitLabels`) · `SourceTag.tsx`

## Verifikasi

**25 file, 3.285 baris.** `tsc --strict` bersih. `audit.mjs` → `✓ audit clean — 25 files`.

Mesin chart diuji fungsional:

```
kinds:            synthetic · traced · market
trend  up +3476   down −2419   sideways +165
doji count:       0        (body minimum 0.0231 dari range, floor 0.023)
closes preserved: true     (open bergerak, close tidak pernah)
traced anchors:   1300 → 1748   (anchor 1300 → 1750)
determinism:      true     (dua panggilan seed sama = bar identik)
sma/ema warmup:   19 null  (bukan nol — nol menarik garis ke lantai)
band contains mid: true
ticks:            4 level dari tangga 1/2/5
```

Berikutnya: bangun Video 20 di atas core. Kalau jadi tanpa menulis satu komponen baru pun, core-nya terbukti.
