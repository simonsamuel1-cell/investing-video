/**
 * VI03 · SC06 — "Murah Asli vs Murah Palsu", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC06.png, in VI02's look.
 *
 *  A  "Tapi sesuatu yang terlihat murah": the line, "belum tentu benar-benar murah" lit.
 *  B  "Kembali ke warung Ibu Sari" (a cut): her warung, and the profit of the years ahead as twenty bars; "Total nilai" vs
 *     "Harga hari ini" on "membandingkannya".
 *  C  "Cara yang terlihat lebih mudah" (a cut): Laba hari ini × kelipatan, Aset bersih hari ini — both stamped "Hari ini".
 *  D  "Bayangkan besok ada warung baru" (a cut): across from her warung, a bigger shop (Lebih besar, AC, Pesan antar);
 *     her profit and net assets today unchanged (ticks); customers drift across.
 *  E  "Artinya: laba … di masa depan sudah berubah" (a cut): B's bars again, the later years shrinking, Total nilai with them.
 *  F  "Inilah inti masalahnya" (a cut): Orang Tuntun, "Investasi menguji kemampuan menilai masa depan."
 *  G  "Contohnya terlihat pada perusahaan batu bara pada 2022" (a cut): PTBA — PE ±3,4x at the end of 2022 (close Rp3.690 /
 *     EPS 2022 Rp1.091), "Kelihatannya murah"; net profit Rp12,6 T (2022) → Rp6,1 T (2023), −51%.
 *  H  "Itulah alasan Tuntun melakukan riset mendalam" (a cut): the mascot, Tuntun's research screens (IN07's), "Diikuti terus";
 *     "Bukan sekadar beberapa rasio" in grey.
 *
 * The bars of B/E are Ibu Sari's example (no figures on them). PTBA: Bisnis.com / Kontan from the company's 2022 and 2023 reports;
 * price from Yahoo Finance.
 */
import {
  AppearE as Appear,
  CardE as Card,
  DrawingVI03E as Drawing,
  FigureE as Figure,
  LineE as Line,
  WordPillE as WordPill,
} from "../../../editable";
import { Img, staticFile, useCurrentFrame, Interactive } from "remotion";
import {
  SoftGround,
  Stage,
  TuntunMark,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  Glyph,
  Mark,
  ORANG_TUNTUN_RIGHT,
  OrangTuntun,
  Ring,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// B/E — the years ahead
const YEARS = 20;
const BARS = { x: 760, w: 960, floor: 560, h: 230, gap: 12 };
const barW = (BARS.w - (YEARS - 1) * BARS.gap) / YEARS;
const VS = { y: 660, w: 400, h: 170, gap: 140 };
const B_WARUNG = { cx: 400, h: 330, floor: 560 };
const B_IBU = { cx: 640, h: 290 };
/** After the new shop: each later year a little lower (E). */
const shrink = (i: number) =>
  1 - 0.55 * Math.min(1, Math.max(0, (i - 1) / (YEARS - 4)));

// C — the two shortcuts
const EASY = { w: 640, h: 330, y: 250, gap: 80 };

// D — the street
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 800;
const D_WARUNG = { cx: 470, h: 380 };
const D_IBU = { cx: 250, h: 330 };
const SHOP = { cx: 1310, h: 330 };
const SCOOT = { cx: 1630, h: 150 };
const NEW_CHIPS = [
  { icon: "storefront", text: "Lebih besar", at: "lebih besar" },
  { icon: "snowflake", text: "AC", at: "Ada AC" },
  { icon: "moped", text: "Pesan antar", at: "pesan antar" },
] as const;
const SAME = [
  { text: "Laba hari ini", at: "Laba Ibu Sari" },
  { text: "Aset bersih", at: "Aset bersihnya" },
] as const;
const WALKERS = 6;

// G — PTBA
const COAL = { x: 260, y: 200, w: 1400, h: 640 };
const PROFIT = [
  { year: "2022", v: 12.6, label: "Rp12,6 T" },
  { year: "2023", v: 6.1, label: "Rp6,1 T" },
] as const;
const PBAR = { x0: 1000, w: 180, gap: 90, floor: 720, full: 340 };

// H — Tuntun's research
const SHOTS = [
  { src: "art/in07/app/sc04-riset-1-financial.jpg", title: "Laporan keuangan" },
  { src: "art/in07/app/sc04-riset-2-valuation.jpg", title: "Model" },
  { src: "art/in07/app/sc04-riset-5-event.jpg", title: "Peristiwa" },
] as const;
const THUMB = { w: 360, h: 300, y: 300, gap: 50 };
const thumbX = (i: number) =>
  CX + 70 - (3 * THUMB.w + 2 * THUMB.gap) / 2 + i * (THUMB.w + THUMB.gap);

/** The twenty years ahead: equal bars, the later ones shrinking by `cut`; `grow` 0..1 draws them in from the left. */
const Years = ({
  grow,
  cut,
  tone,
}: {
  grow: number;
  cut: number;
  tone: string;
}) => {
  const c = usePalette();
  return (
    <>
      {Array.from({ length: YEARS }, (_, i) => {
        const p = Math.min(1, Math.max(0, grow * YEARS - i));
        if (p <= 0.001) return null;
        const h = BARS.h * mix(1, shrink(i), cut) * p;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: BARS.x + i * (barW + BARS.gap),
              top: BARS.floor - h,
              width: barW,
              height: h,
              borderRadius: 8,
              background: i === 0 ? c.indigo : tone,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: BARS.x,
          top: BARS.floor + 14,
          ...typeStyle("label"),
          fontSize: 28,
          fontWeight: 600,
          color: c.slate,
          opacity: grow,
        }}
      >
        Tahun 1
      </div>
      <div
        style={{
          position: "absolute",
          left: BARS.x + BARS.w - 200,
          width: 200,
          textAlign: "right",
          top: BARS.floor + 14,
          ...typeStyle("label"),
          fontSize: 28,
          fontWeight: 600,
          color: c.slate,
          opacity: grow,
        }}
      >
        Tahun 20
      </div>
    </>
  );
};

/** "Total nilai" vs "Harga hari ini", the first with the bars' sum as its own bar. */
const Versus = ({
  totalP,
  priceP,
  cut,
  lit,
}: {
  totalP: number;
  priceP: number;
  cut: number;
  lit: number;
}) => {
  const c = usePalette();
  const shadow = useShadow();
  const x0 = CX - VS.w - VS.gap / 2 + 60;
  const x1 = CX + VS.gap / 2 + 60;
  return (
    <>
      {totalP > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: x0,
            top: VS.y + (1 - totalP) * 14,
            width: VS.w,
            height: VS.h,
            opacity: totalP,
          }}
        >
          <Card
            x={0}
            y={0}
            w={VS.w}
            h={VS.h}
            style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}
          >
            <Ring p={lit} tone={c.indigo} />
            <div
              style={{
                position: "absolute",
                left: 30,
                top: 26,
                ...typeStyle("label"),
                fontSize: 34,
                fontWeight: 600,
                color: c.ink,
              }}
            >
              Total nilai
            </div>
            <div
              style={{
                position: "absolute",
                left: 30,
                top: 92,
                width: (VS.w - 60) * mix(1, 0.62, cut),
                height: 40,
                borderRadius: 20,
                background: c.indigo,
              }}
            />
          </Card>
        </div>
      ) : null}
      {priceP > 0.001 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: CX - VS.gap / 2 + 60,
              width: VS.gap,
              top: VS.y + VS.h / 2 - 34,
              textAlign: "center",
              opacity: priceP,
              ...typeStyle("title"),
              fontSize: 48,
              fontWeight: 600,
              color: c.slate,
            }}
          >
            vs
          </div>
          <div
            style={{
              position: "absolute",
              left: x1,
              top: VS.y + (1 - priceP) * 14,
              width: VS.w,
              height: VS.h,
              opacity: priceP,
            }}
          >
            <Card x={0} y={0} w={VS.w} h={VS.h}>
              <div
                style={{
                  position: "absolute",
                  left: 30,
                  top: 26,
                  ...typeStyle("label"),
                  fontSize: 34,
                  fontWeight: 600,
                  color: c.ink,
                }}
              >
                Harga hari ini
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 30,
                  top: 92,
                  width: (VS.w - 60) * 0.5,
                  height: 40,
                  borderRadius: 20,
                  background: theme.color.skeleton,
                }}
              />
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  const backAt = W("Kembali ke warung");
  const easyAt = W("Cara yang terlihat");
  const newAt = W("Bayangkan besok");
  const meansAt = W("Artinya: laba");
  const testAt = W("Inilah inti");
  const coalAt = W("Contohnya terlihat");
  const tuntunAt = W("Itulah alasan");

  // B
  const grow = ease(f, W("total nilai"), m.sec(1.6));
  const totalP = ease(f, W("total nilai") + m.sec(1.2), m.reveal);
  const priceP = ease(f, W("membandingkannya"), m.reveal);

  // C
  const stamp = ease(f, W("Masalahnya"), m.pop);

  // D
  const shopP = ease(f, W("warung baru"), m.reveal);
  const drift = ease(f, W("jumlah pelanggan"), m.sec(2.2));

  // E
  const cut = ease(f, W("masa depan sudah"), m.sec(1.4));
  const valueLit = ease(f, W("nilai bisnisnya"), m.pop);

  // G
  const peP = ease(f, W("PE sekitar"), m.reveal);
  const cheapP = ease(f, W("Kelihatannya"), m.pop);
  const p2022 = ease(f, W("tahun berikutnya"), m.reveal);
  const p2023 = ease(f, W("labanya turun"), m.reveal);
  const halfP = ease(f, W("sekitar separuh"), m.pop);

  // H
  const ratios = ease(f, W("Bukan sekadar"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — looks cheap, isn't always */}
      <Shot start={-1} to={backAt} block={BLOCK.SC06} cutIn={false}>
        <Appear at={-m.reveal} style={{ left: 0, top: 0 }}>
          <Line
            x={160}
            y={400}
            w={1600}
            text="Terlihat murah"
            size={80}
            align="center"
            weight={600}
          />
        </Appear>
        <Appear at={W("belum tentu")} style={{ left: 0, top: 0 }}>
          <Line
            x={160}
            y={540}
            w={1600}
            text="belum tentu benar-benar murah"
            mark="benar-benar murah"
            size={64}
            align="center"
            weight={500}
          />
        </Appear>
      </Shot>

      {/* B — what the warung will make, year after year, against today's price */}
      <Shot start={backAt} to={easyAt} block={BLOCK.SC06}>
        <Figure
          name="warung"
          cx={B_WARUNG.cx}
          floor={B_WARUNG.floor}
          h={B_WARUNG.h}
          style={{ opacity: ease(f, backAt - m.reveal, m.reveal) }}
        />
        <Figure
          name="ibu-sari"
          cx={B_IBU.cx}
          floor={B_WARUNG.floor}
          h={B_IBU.h}
          style={{ opacity: ease(f, backAt - m.reveal, m.reveal) }}
        />
        <Years grow={grow} cut={0} tone={theme.color.indigoWashDeepSolid} />
        <Appear at={W("sepuluh atau")} style={{ left: 0, top: 0 }}>
          <WordPill
            x={BARS.x + BARS.w / 2}
            y={BARS.floor - BARS.h - 60}
            text="10–20 tahun ke depan"
            size={32}
          />
        </Appear>
        <Versus totalP={totalP} priceP={priceP} cut={0} lit={0} />
      </Shot>

      {/* C — the easy ways: both only describe today */}
      <Shot start={easyAt} to={newAt} block={BLOCK.SC06}>
        {[
          {
            icon: "calculator",
            title: "Laba hari ini",
            sub: "× kelipatan",
            at: W("laba hari ini"),
          },
          {
            icon: "bank",
            title: "Aset bersih",
            sub: "hari ini",
            at: W("aset bersih"),
          },
        ].map((k, i) => {
          const p = ease(f, k.at - m.sec(0.2), m.reveal);
          const x = CX - EASY.w - EASY.gap / 2 + i * (EASY.w + EASY.gap);
          return p > 0.001 ? (
            <div
              key={k.title}
              style={{
                position: "absolute",
                left: x,
                top: EASY.y + (1 - p) * 14,
                width: EASY.w,
                height: EASY.h,
                opacity: p,
              }}
            >
              <Card x={0} y={0} w={EASY.w} h={EASY.h}>
                <div
                  style={{
                    position: "absolute",
                    left: (EASY.w - 120) / 2,
                    top: 40,
                    width: 120,
                    height: 120,
                    borderRadius: 999,
                    background: theme.color.neutralDisc,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph icon={k.icon} size={64} tone={c.indigo} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    width: EASY.w,
                    top: 190,
                    textAlign: "center",
                    ...typeStyle("title"),
                    fontSize: 50,
                    fontWeight: 600,
                    color: c.ink,
                  }}
                >
                  {k.title}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    width: EASY.w,
                    top: 256,
                    textAlign: "center",
                    ...typeStyle("label"),
                    fontSize: 38,
                    fontWeight: 500,
                    color: c.slate,
                  }}
                >
                  {k.sub}
                </div>
              </Card>
              {stamp > 0.001 ? (
                <div
                  style={{
                    position: "absolute",
                    left: EASY.w - 120,
                    top: -30,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 22px 8px 12px",
                    borderRadius: 999,
                    background: theme.color.indigoWashSolid,
                    boxShadow: `inset 0 0 0 2px ${c.indigo}`,
                    opacity: stamp,
                    transform: `scale(${(0.8 + 0.2 * stamp).toFixed(3)})`,
                  }}
                >
                  <Glyph icon="calendar-check" size={30} tone={c.indigo} />
                  <div
                    style={{
                      ...typeStyle("label"),
                      fontSize: 28,
                      fontWeight: 600,
                      color: c.indigo,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Hari ini
                  </div>
                </div>
              ) : null}
            </div>
          ) : null;
        })}
        <Appear at={W("hanya menggambarkan")} style={{ left: 0, top: 0 }}>
          <Line
            x={160}
            y={720}
            w={1600}
            text="Hanya menggambarkan kondisi hari ini."
            mark="hari ini"
            size={52}
            align="center"
            weight={500}
          />
        </Appear>
      </Shot>

      {/* D — a bigger shop across the street */}
      <Shot start={newAt} to={meansAt} block={BLOCK.SC06}>
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: FRAME.x,
            top: FRAME.y,
            width: FRAME.w,
            height: FRAME.h,
            borderRadius: theme.shape.cardRadius,
            background: c.cardBg,
            boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`,
          }}
        />
        <Figure name="warung" cx={D_WARUNG.cx} floor={FLOOR} h={D_WARUNG.h} />
        <Figure name="ibu-sari" cx={D_IBU.cx} floor={FLOOR} h={D_IBU.h} />
        {shopP > 0.001 ? (
          <Drawing
            name="minimarket"
            cx={SHOP.cx}
            floor={FLOOR}
            h={SHOP.h}
            style={{
              opacity: shopP,
              transform: `translateY(${((1 - shopP) * 16).toFixed(1)}px)`,
            }}
          />
        ) : null}
        <Appear
          at={W("pesan antar")}
          style={{
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
          }}
        >
          <Drawing name="scooter" cx={SCOOT.cx} floor={FLOOR} h={SCOOT.h} />
        </Appear>
        {/* the new shop's three advantages, in a row over it, each as wide as its word */}
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: 1000,
            top: 250,
            display: "flex",
            gap: 16,
          }}
        >
          {NEW_CHIPS.map((k) => {
            const p = ease(f, W(k.at), m.reveal);
            return (
              <div
                key={k.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  height: 84,
                  padding: "0 24px 0 12px",
                  borderRadius: 999,
                  background: c.cardBg,
                  boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
                  opacity: p,
                  transform: `translateY(${((1 - p) * 14).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 999,
                    background: theme.color.neutralDisc,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <Glyph icon={k.icon} size={32} tone={c.indigo} />
                </div>
                <div
                  style={{
                    ...typeStyle("label"),
                    fontSize: 28,
                    fontWeight: 600,
                    color: c.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {k.text}
                </div>
              </div>
            );
          })}
        </Interactive.Div>
        {SAME.map((k, i) => (
          <Appear
            key={k.text}
            at={W(k.at)}
            style={{ left: 220, top: 228 + i * 92, width: 340, height: 76 }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                height: 76,
                padding: "0 20px",
                borderRadius: 999,
                background: c.cardBg,
                boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
              }}
            >
              <div
                style={{
                  ...typeStyle("label"),
                  fontSize: 30,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {k.text}
              </div>
              <Mark kind="check" p={1} x={340 - 40} y={38} size={46} />
            </div>
          </Appear>
        ))}
        {/* the customers of tomorrow drift across the street */}
        {drift > 0.001
          ? Array.from({ length: WALKERS }, (_, i) => {
              const p = Math.min(1, Math.max(0, drift * 1.6 - i * 0.12));
              // they gather in the street, just short of the new shop's door
              const x = mix(D_WARUNG.cx + 200, SHOP.cx - 330 + (i % 2) * 70, p);
              const y = 520 + Math.floor(i / 2) * 76;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x - 30,
                    top: y - 30,
                    width: 60,
                    height: 60,
                    borderRadius: 999,
                    background: c.cardBg,
                    boxShadow: `${shadow.soft}, inset 0 0 0 2px ${c.indigo}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: Math.min(1, drift * 4),
                  }}
                >
                  <Glyph icon="users-three" size={34} tone={c.indigo} />
                </div>
              );
            })
          : null}
      </Shot>

      {/* E — tomorrow's profit changed, and the value with it */}
      <Shot start={meansAt} to={testAt} block={BLOCK.SC06}>
        <Figure
          name="warung"
          cx={B_WARUNG.cx}
          floor={B_WARUNG.floor}
          h={B_WARUNG.h}
        />
        <Figure
          name="ibu-sari"
          cx={B_IBU.cx}
          floor={B_WARUNG.floor}
          h={B_IBU.h}
        />
        <Years grow={1} cut={cut} tone={theme.color.indigoWashDeepSolid} />
        <Appear
          at={W("masa depan sudah") + m.sec(0.6)}
          style={{ left: 0, top: 0 }}
        >
          <WordPill
            x={BARS.x + BARS.w * 0.68}
            y={BARS.floor - BARS.h - 60}
            text="Laba masa depan berubah"
            size={32}
          />
        </Appear>
        <Versus
          totalP={1}
          priceP={1}
          cut={ease(f, W("nilai bisnisnya"), m.move)}
          lit={valueLit}
        />
      </Shot>

      {/* F — the heart of it */}
      <Shot start={testAt} to={coalAt} block={BLOCK.SC06}>
        <OrangTuntun at={testAt} />
        <Appear
          at={W("Investasi menguji")}
          style={{
            left: ORANG_TUNTUN_RIGHT + 70,
            top: 330,
            width: 1760 - ORANG_TUNTUN_RIGHT - 70,
            height: 260,
          }}
        >
          <Card
            x={0}
            y={0}
            w={1760 - ORANG_TUNTUN_RIGHT - 70}
            h={260}
            style={{ boxShadow: shadow.glow }}
          >
            <Ring p={1} tone={c.indigo} />
            <Line
              x={50}
              y={130}
              w={1760 - ORANG_TUNTUN_RIGHT - 170}
              text="Investasi menguji kemampuan kita menilai masa depan."
              mark="masa depan"
              size={52}
              weight={500}
            />
          </Card>
        </Appear>
      </Shot>

      {/* G — coal, 2022: PTBA */}
      <Shot start={coalAt} to={tuntunAt} block={BLOCK.SC06}>
        <Card x={COAL.x} y={COAL.y} w={COAL.w} h={COAL.h}>
          <Interactive.Div
            name="PTBA"
            style={{
              position: "absolute",
              left: 50,
              top: 40,
              fontFamily: typeStyle("title").fontFamily,
              letterSpacing: typeStyle("title").letterSpacing,
              lineHeight: typeStyle("title").lineHeight,
              fontSize: 64,
              fontWeight: 700,
              color: c.ink,
            }}
          >
            PTBA
          </Interactive.Div>
          <Interactive.Div
            name="Bukit Asam · batu bara"
            style={{
              position: "absolute",
              left: 50,
              top: 120,
              fontFamily: typeStyle("label").fontFamily,
              letterSpacing: typeStyle("label").letterSpacing,
              lineHeight: typeStyle("label").lineHeight,
              fontSize: 32,
              fontWeight: 500,
              color: c.slate,
            }}
          >
            Bukit Asam · batu bara
          </Interactive.Div>
        </Card>
        <Appear
          at={W("harga batu bara")}
          style={{ left: COAL.x + 50, top: COAL.y + 210 }}
        >
          <div
            style={{
              padding: "10px 26px",
              borderRadius: 999,
              background: theme.color.neutralDisc,
              ...typeStyle("label"),
              fontSize: 30,
              fontWeight: 600,
              color: c.slate,
              whiteSpace: "nowrap",
            }}
          >
            2022 · harga batu bara tinggi
          </div>
        </Appear>
        {peP > 0.001 ? (
          <Interactive.Div
            name="PE akhir 2022"
            style={{
              position: "absolute",
              left: COAL.x + 50,
              top: COAL.y + 300 + (1 - peP) * 14,
              opacity: peP,
            }}
          >
            <div
              style={{
                ...typeStyle("label"),
                fontSize: 34,
                fontWeight: 600,
                color: c.slate,
              }}
            >
              PE akhir 2022
            </div>
            <div
              style={{
                ...typeStyle("title"),
                fontSize: 130,
                fontWeight: 700,
                lineHeight: 1.05,
                color: c.indigo,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ±3,4x
            </div>
            <div
              style={{
                marginTop: 8,
                ...typeStyle("label"),
                fontSize: 24,
                fontWeight: 500,
                color: c.slate,
                whiteSpace: "nowrap",
              }}
            >
              Rp3.690 ÷ laba per saham Rp1.091
            </div>
          </Interactive.Div>
        ) : null}
        {cheapP > 0.001 ? (
          <Interactive.Div
            name="Kelihatannya murah"
            style={{
              position: "absolute",
              left: COAL.x + 50,
              top: COAL.y + 560,
              opacity: cheapP,
              padding: "10px 26px",
              borderRadius: 999,
              background: theme.color.indigoWashSolid,
              boxShadow: `inset 0 0 0 2px ${c.indigo}`,
              fontFamily: typeStyle("label").fontFamily,
              letterSpacing: typeStyle("label").letterSpacing,
              lineHeight: typeStyle("label").lineHeight,
              fontSize: 32,
              fontWeight: 600,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            Kelihatannya murah
          </Interactive.Div>
        ) : null}
        {/* net profit, 2022 → 2023 */}
        {PROFIT.map((k, i) => {
          const p = i === 0 ? p2022 : p2023;
          if (p <= 0.001) return null;
          const h = (k.v / PROFIT[0].v) * PBAR.full * p;
          const x = PBAR.x0 + i * (PBAR.w + PBAR.gap);
          return (
            <div key={k.year} style={{ position: "absolute", inset: 0 }}>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: PBAR.floor - h,
                  width: PBAR.w,
                  height: h,
                  borderRadius: 22,
                  background: i === 0 ? c.indigo : theme.color.indigoWashSolid,
                  boxShadow:
                    i === 1 ? `inset 0 0 0 3px ${c.indigo}` : undefined,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 40,
                  width: PBAR.w + 80,
                  top: PBAR.floor - h - 56,
                  textAlign: "center",
                  opacity: p,
                  ...typeStyle("title"),
                  fontSize: 38,
                  fontWeight: 600,
                  color: c.ink,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x - 40,
                  width: PBAR.w + 80,
                  top: PBAR.floor + 14,
                  textAlign: "center",
                  opacity: p,
                  ...typeStyle("label"),
                  fontSize: 32,
                  fontWeight: 600,
                  color: c.slate,
                }}
              >
                {k.year}
              </div>
            </div>
          );
        })}
        <Appear
          at={W("tahun berikutnya")}
          style={{ left: PBAR.x0, top: COAL.y + 60 }}
        >
          <div
            style={{
              ...typeStyle("label"),
              fontSize: 30,
              fontWeight: 600,
              color: c.slate,
            }}
          >
            Laba bersih
          </div>
        </Appear>
        {halfP > 0.001 ? (
          <Interactive.Div
            name="−51%"
            style={{
              position: "absolute",
              left: PBAR.x0 + 2 * PBAR.w + PBAR.gap + 30,
              top: PBAR.floor - PBAR.full * 0.49 - 40,
              opacity: halfP,
              transform: `scale(${(0.8 + 0.2 * halfP).toFixed(3)})`,
              padding: "10px 26px",
              borderRadius: 999,
              background: c.cardBg,
              boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.crossRed}`,
              fontFamily: typeStyle("title").fontFamily,
              letterSpacing: typeStyle("title").letterSpacing,
              lineHeight: typeStyle("title").lineHeight,
              fontSize: 44,
              fontWeight: 700,
              color: theme.color.crossRed,
              whiteSpace: "nowrap",
            }}
          >
            −51%
          </Interactive.Div>
        ) : null}
      </Shot>

      {/* H — why Tuntun researches, and keeps following */}
      <Shot start={tuntunAt} to={1e6} block={BLOCK.SC06} cutOut={false}>
        <TuntunMark x={210} y={THUMB.y + THUMB.h / 2} height={150} />
        <Appear at={tuntunAt} style={{ left: 0, top: 0 }}>
          <Line
            x={340}
            y={210}
            w={1400}
            text="Riset mendalam"
            size={56}
            weight={600}
          />
        </Appear>
        {SHOTS.map((s, i) => (
          <Appear
            key={s.src}
            at={W("riset mendalam") + i * m.sec(0.25)}
            style={{
              left: thumbX(i),
              top: THUMB.y,
              width: THUMB.w,
              height: THUMB.h + 60,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: THUMB.w,
                height: THUMB.h,
                borderRadius: theme.shape.cardRadius,
                background: c.cardBg,
                boxShadow: shadow.soft,
                overflow: "hidden",
              }}
            >
              {/* cropped, never stretched: the screens are tall */}
              <Img
                showInTimeline={false}
                src={staticFile(s.src)}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: THUMB.w,
                  height: THUMB.h,
                  objectFit: "cover",
                  objectPosition: "top",
                  maxWidth: "none",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: THUMB.w,
                top: THUMB.h + 16,
                textAlign: "center",
                ...typeStyle("label"),
                fontSize: 30,
                fontWeight: 600,
                color: c.ink,
              }}
            >
              {s.title}
            </div>
          </Appear>
        ))}
        <Appear at={W("terus mengikuti")} style={{ left: 0, top: 0 }}>
          <Interactive.Div
            name="Diikuti terus"
            style={{
              position: "absolute",
              left: thumbX(2) + THUMB.w,
              top: THUMB.y - 30,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 22px 8px 12px",
              borderRadius: 999,
              background: theme.color.indigoWashSolid,
              boxShadow: `inset 0 0 0 2px ${c.indigo}`,
            }}
          >
            <Glyph icon="calendar-check" size={30} tone={c.indigo} />
            <div
              style={{
                ...typeStyle("label"),
                fontSize: 28,
                fontWeight: 600,
                color: c.indigo,
                whiteSpace: "nowrap",
              }}
            >
              Diikuti terus
            </div>
          </Interactive.Div>
        </Appear>
        {ratios > 0.001 ? (
          <Interactive.Div
            name="Bukan sekadar beberapa rasio"
            style={{
              position: "absolute",
              left: CX + 70,
              top: 800,
              transform: "translate(-50%, -50%)",
              opacity: ratios,
              padding: "12px 32px",
              borderRadius: 999,
              background: theme.color.neutralDisc,
              fontFamily: typeStyle("label").fontFamily,
              letterSpacing: typeStyle("label").letterSpacing,
              lineHeight: typeStyle("label").lineHeight,
              fontSize: 36,
              fontWeight: 600,
              color: c.slate,
              whiteSpace: "nowrap",
            }}
          >
            Bukan sekadar beberapa rasio
          </Interactive.Div>
        ) : null}
      </Shot>
    </Stage>
  );
};
