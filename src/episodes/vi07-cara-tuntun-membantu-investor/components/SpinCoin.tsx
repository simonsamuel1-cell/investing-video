/**
 * SpinCoin — a yellow "Rp" coin spinning on its upright axis (Simon 28 Oct: his Pinterest pin 215046950940139624,
 * "koinnya pun warna kuning"). A flat disc squeezed by |cos θ|, its edge drawn as a stack of discs between the two
 * faces, so edge-on it is a bar like the pin's. Half a turn every 0.66 s, as in the pin. `t` is seconds of spin, `p`
 * pops it in; `id` names its clip path, so give each coin its own. SC03 sets three round the business sketch; SC06
 * sends them into the company ("Dana masuk").
 */
import { theme, usePalette } from "../../../core";

export const COIN = { d: 46, thick: 0.17, halfTurn: 0.66 };

export const SpinCoin = ({ t, p, x, y, phase, id, d = COIN.d }: { t: number; p: number; x: number; y: number; phase: number; id: string; d?: number }) => {
  const c = usePalette();
  const r = d / 2;
  const th = (t / COIN.halfTurn + phase) * Math.PI;
  const sq = Math.abs(Math.cos(th));
  const e = ((COIN.thick * d) / 2) * Math.sin(th) * Math.sign(Math.cos(th) || 1);
  const star = (x: number, y: number, k: number) => `M ${x} ${y - k} Q ${x} ${y} ${x + k} ${y} Q ${x} ${y} ${x} ${y + k} Q ${x} ${y} ${x - k} ${y} Q ${x} ${y} ${x} ${y - k} Z`;
  const w = d + COIN.thick * d;
  return (
    <svg width={w} height={d} viewBox={`${-w / 2} ${-r} ${w} ${d}`} style={{ position: "absolute", left: x - w / 2, top: y - r, opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})` }}>
      <clipPath id={id}>
        <circle cx={0} cy={0} r={r * 0.74} />
      </clipPath>
      {Array.from({ length: 9 }, (_, k) => (
        <ellipse key={k} cx={-e + (2 * e * k) / 8} cy={0} rx={r * sq} ry={r} fill={theme.color.coinSpinEdge} />
      ))}
      <g transform={`translate(${e.toFixed(2)} 0) scale(${Math.max(sq, 0.001).toFixed(4)} 1)`}>
        <circle cx={0} cy={0} r={r} fill={theme.color.coinSpinRing} />
        <circle cx={0} cy={0} r={r * 0.74} fill={theme.color.coinSpinFace} />
        <g clipPath={`url(#${id})`}>
          <path d={`M ${-r * 0.2} ${-r} L ${r * 0.25} ${-r} L ${-r * 0.55} ${r} L ${-r} ${r} Z M ${r * 0.42} ${-r} L ${r * 0.58} ${-r} L ${-r * 0.22} ${r} L ${-r * 0.38} ${r} Z`} fill={theme.color.coinSpinShine} />
        </g>
        <text x={0} y={r * 0.17} textAnchor="middle" fontFamily={theme.text.family} fontWeight={800} fontSize={r * 0.62} fill={c.cardBg}>Rp</text>
        <path d={`${star(-r * 0.6, -r * 0.62, r * 0.13)} ${star(r * 0.66, r * 0.56, r * 0.1)}`} fill={c.cardBg} />
      </g>
    </svg>
  );
};
