/**
 * Scene 11 — Public Data Tracks (2502, dur 327). Header + four white icon-cards
 * fading in as the VO names each (stagger ~30,110,190,260): Broker Net Buying,
 * Foreign Flows, Insider Trades, Shareholder Count. Indigo icons, cyan accent.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, textReveal } from "../helpers";

const { colors, font, type, radius, border } = theme;

const ICONS: Record<string, React.ReactNode> = {
  broker: <path d="M -34 26 L -12 -6 L 8 14 L 34 -28" />,
  foreign: <circle cx={0} cy={0} r={30} />,
  insider: <rect x={-26} y={-30} width={52} height={60} rx={6} />,
  holders: <g><circle cx={-18} cy={-6} r={14} /><circle cx={18} cy={-6} r={14} /><circle cx={0} cy={20} r={14} /></g>,
};

const CARDS = [
  { key: "broker", label: "Broker Net Buying", at: 30 },
  { key: "foreign", label: "Foreign Flows", at: 110 },
  { key: "insider", label: "Insider Trades", at: 190 },
  { key: "holders", label: "Shareholder Count", at: 260 },
];

export const Scene11 = () => {
  const f = useCurrentFrame();
  const W = 396;
  const GAP = 28;

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 110,
          width: 1272,
          fontSize: type.header,
          fontWeight: font.weights.extrabold,
          ...textReveal(f, 8, 18),
        }}
      >
        Public Data Tracks
      </div>

      {CARDS.map((c, i) => (
        <div
          key={c.key}
          style={{
            position: "absolute",
            left: 96 + i * (W + GAP),
            top: 300,
            width: W,
            height: 420,
            boxSizing: "border-box",
            background: colors.card,
            border: `${border.regular}px solid ${colors.divider}`,
            borderRadius: radius.lg,
            padding: 32,
            opacity: fadeIn(f, c.at, 18),
            transform: `translateY(${(1 - fadeIn(f, c.at, 18)) * 14}px)`,
          }}
        >
          <div style={{ height: 6, width: 64, background: colors.cyan, borderRadius: 3, marginBottom: 28 }} />
          <svg width={120} height={120} viewBox="-60 -60 120 120" stroke={colors.indigo} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[c.key]}
          </svg>
          <div style={{ marginTop: 36, fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.text, lineHeight: 1.2 }}>{c.label}</div>
        </div>
      ))}
    </SafeArea>
  );
};
