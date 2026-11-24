/**
 * effects-library/panel.tsx — the Effects Library panel inside Remotion Studio (Simon, 24 Nov 2026: "maunya panel").
 *
 * Nothing in node_modules is touched. Our bundle runs in the Studio's own page, so the panel is a second React root beside the
 * Studio's, and the Studio's container is narrowed by PANEL_W while it is open. Only three outside things are relied on, and
 * mount() checks for them and stays silent if a Remotion update moves one: the container's id, the URL (Studio follows popstate;
 * goToComposition did nothing in 4.0.481) and Studio's public play / seek. The cards play small clips (scripts/effects-previews.mjs → public/effects-library), not a <Player>: the Player flags
 * the whole page as a player and the Studio then throws.
 * Never mounted while rendering (src/index.ts asks getRemotionEnvironment first).
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { pause, play, seek } from "@remotion/studio";
import { staticFile } from "remotion";
import { EFFECTS, type Effect } from "./effects";
import USAGE from "./usage.json";
import "./panel.css";

const PANEL_W = 340;
const ROOT_ID = "fx-library-root";
const STUDIO_ID = "__remotion-studio-container";
/** The four TA videos made at 30 fps; a Full composition's frame is its mp4's frame. */
const FPS30 = ["TA01", "TA03", "TA05", "TA07"];
const OPEN_KEY = "tuntun-fx-library-open";
/** Switch composition the way the browser's Back button does, then `then` once the Studio has followed. */
const go = (id: string, then?: () => void) => {
  history.pushState({}, "Studio", `/${id}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
  let tries = 0;
  const wait = () => { if (document.title.startsWith(id)) then?.(); else if (tries++ < 20) setTimeout(wait, 100); };
  if (then) setTimeout(wait, 100);
};
const here = () => decodeURIComponent(location.pathname.slice(1));
const usage = USAGE as Record<string, string[]>;
const remembered = () => { try { return localStorage.getItem(OPEN_KEY) !== "0"; } catch { return true; } };

/** One card: its poster, and the clip only while hovered or focused. */
const FxCard = ({ e, on, pick }: { e: Effect; on: boolean; pick: () => void }) => {
  const [live, setLive] = React.useState(false);
  return (
    <button className="fx" data-on={on ? 1 : 0} onClick={pick} onMouseEnter={() => setLive(true)} onMouseLeave={() => setLive(false)} onFocus={() => setLive(true)} onBlur={() => setLive(false)} title={e.how}>
      <span className="shot">
        {live ? <video src={staticFile(`effects-library/${e.id}.mp4`)} autoPlay muted loop playsInline /> : <img src={staticFile(`effects-library/${e.id}.jpg`)} alt="" loading="lazy" />}
      </span>
      <span className="meta"><b>{e.id}</b><span>{e.name}</span></span>
    </button>
  );
};

const Library = ({ setOpen }: { setOpen: (v: boolean) => void }) => {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState<Effect | null>(null);
  /** where the user was before browsing effects */
  const [back, setBack] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const usedIn = (e: Effect) => (e.from ? [e.from.video] : usage[e.symbol] ?? []);
  const hit = (e: Effect) => `${e.id} ${e.name} ${e.how} ${e.group} ${usedIn(e).join(" ")}`.toLowerCase().includes(q.trim().toLowerCase());
  const shown = EFFECTS.filter(hit);
  const groups = [...new Set(shown.map((e) => e.group))];
  const pick = (e: Effect) => {
    if (!here().startsWith("FX-")) setBack(here());
    pause(); // a video left playing must not carry on under the effect, nor the effect's playback into the video
    setSel(e);
    setCopied(false);
    go(`FX-${e.id}`, () => { seek(0); play(); });
  };
  const openScene = (e: Effect) => {
    const x = e.from;
    if (!x) return;
    pause();
    const fps = FPS30.includes(x.video) ? 30 : 60;
    go(x.comp, () => seek(Math.round(x.start * fps)));
  };
  const copy = async () => { if (!sel) return; try { await navigator.clipboard.writeText(`${sel.id} ${sel.name}`); setCopied(true); } catch { setCopied(false); } };
  return (
    <div id="fx-library" onKeyDown={(ev) => ev.stopPropagation()}>
      <header>
        <h1>Effects Library <span>{EFFECTS.length} <button className="x" aria-label="Tutup panel" onClick={() => setOpen(false)}>×</button></span></h1>
        <input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Cari efek, kode, atau video (VI02)" aria-label="Cari efek" />
      </header>
      <div className="list">
        {groups.map((g) => (
          <section key={g}>
            <h2>{g}</h2>
            <div className="grid">
              {shown.filter((e) => e.group === g).map((e) => <FxCard key={e.id} e={e} on={sel?.id === e.id} pick={() => pick(e)} />)}
            </div>
          </section>
        ))}
        {shown.length === 0 ? <h2>Tidak ada efek yang cocok.</h2> : null}
      </div>
      {sel ? (
        <footer>
          <b>{sel.id} · {sel.name}</b>
          <p>{sel.how}</p>
          <small>{sel.from ? `Potongan asli ${sel.from.video}, detik ${Math.round(sel.from.start)}` : `Komponennya dipakai di: ${usedIn(sel).join(", ") || "belum ada"}`}</small>
          <button className="act" onClick={copy}>{copied ? "Tersalin" : "Salin kode"}</button>
          {sel.from?.comp ? <button className="act alt" onClick={() => openScene(sel)}>Buka scene asli</button> : null}
          {back ? <button className="act alt" onClick={() => { pause(); go(back); setBack(""); setSel(null); }}>Kembali ke {back.split("-")[0]}</button> : null}
        </footer>
      ) : null}
    </div>
  );
};

const Shell = ({ studio, root }: { studio: HTMLElement; root: HTMLElement }) => {
  const [open, setOpen] = React.useState(remembered);
  React.useLayoutEffect(() => {
    root.dataset.open = open ? "1" : "0";
    // `position: fixed` + a transform make the narrowed container the frame its own fixed children measure against
    Object.assign(studio.style, open ? { position: "fixed", inset: `0 ${PANEL_W}px 0 0`, width: "auto" } : { position: "", inset: "", width: "" });
    try { localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch { /* private window */ }
    window.dispatchEvent(new Event("resize"));
  }, [open, root, studio]);
  return (
    <>
      <button id="fx-library-tab" onClick={() => setOpen(!open)}>Effects</button>
      {open ? <Library setOpen={setOpen} /> : null}
    </>
  );
};

type Kept = HTMLElement & { fxRoot?: ReturnType<typeof createRoot> };
export const mount = () => {
  const studio = document.getElementById(STUDIO_ID);
  if (!studio) {
    console.warn("[Effects Library] Studio berubah, panel tidak dipasang. Pakai skill tuntun-effects-library untuk memasang ulang.");
    return;
  }
  let host = document.getElementById(ROOT_ID) as Kept | null;
  if (!host) {
    host = document.createElement("div") as Kept;
    host.id = ROOT_ID;
    document.body.appendChild(host);
  }
  host.fxRoot ??= createRoot(host);
  host.fxRoot.render(<Shell studio={studio} root={host} />);
};
