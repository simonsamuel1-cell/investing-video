import React, { useEffect } from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { SCENES, TOTAL } from './cues';
import { INTRO_N, LATAR_INTRO, OUTRO_N } from './introOutro';
import { Babak } from './Babak';
import { cin } from './parts/kit';

/**
 * Value Investing · Video 01 — Apa Itu Value Investing?
 * TAHAP 1 (29 Okt, pola Investing 101 V06): komposisi utama = Babak (latar + VO + watermark + subtitle). Scene ditambahkan ke Babak saat dibangun.
 * Tiap scene naskah terpasang sebagai <Sequence> bernama (penanda timeline Studio, tanpa isi).
 */
export const Episode: React.FC = () => {
  const f = useCurrentFrame();
  // PROBE PEMUTARAN Studio (hanya bila scripts/studio_fps.mjs memasang window.__pb)
  useEffect(() => {
    const w = window as unknown as { __pb?: [number, number][] };
    if (w.__pb) w.__pb.push([f, performance.now()]);
  }, [f]);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {SCENES.map((s) => (
        <Sequence key={s.n} from={s.a} durationInFrames={s.b - s.a} name={`SCENE ${String(s.n).padStart(2, '0')} · ${s.bab}`} layout="none">
          {null}
        </Sequence>
      ))}
      <Babak />
      {/* intro Tuntun Academy (frame 0–239) & outro (sesudah VO) — video penuh di ATAS Babak, termasuk watermark & subtitle (zIndex 2 di Babak) → zIndex 10;
          logo Tuntun sudah ada di video intro/outro (src/introOutro.ts) */}
      {/* 2 Nov (Simon: "Tambahkan film dissolve saat transisi dari intro ke scene 1" · "… dari scene 8 ke outro"): DISSOLVE 60 f inOut cubic berpusat di
          potongan — intro memudar f210–270 di atas Scene 1 (detik terakhir intro = kartu judul diam; 30 f sesudah potongan = frame terakhirnya,
          public/intro/intro-vi01-akhir.png); outro muncul TOTAL−30…TOTAL+30 di atas Scene 8 (frame 0 outro = latar kosong #FDFDFD → paruh pertama
          cukup latar, video mulai tepat di TOTAL seperti dulu — waktu VO/Premiere tidak bergeser) */}
      <Sequence from={0} durationInFrames={INTRO_N + 30} name="INTRO · Tuntun Academy">
        <AbsoluteFill style={{ background: LATAR_INTRO, zIndex: 10, opacity: 1 - cin(f, INTRO_N) }}>
          {f < INTRO_N ? <OffthreadVideo src={staticFile('intro/intro-vi01.mp4')} muted /> : <Img src={staticFile('intro/intro-vi01-akhir.png')} />}
        </AbsoluteFill>
      </Sequence>
      <Sequence from={TOTAL - 30} durationInFrames={OUTRO_N + 30} name="OUTRO · Tuntun Academy">
        <AbsoluteFill style={{ background: LATAR_INTRO, zIndex: 10, opacity: cin(f, TOTAL) }}>
          <Sequence from={30} layout="none"><OffthreadVideo src={staticFile('intro/outro-2.mp4')} muted /></Sequence>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

/** garis bantu alignment (komposisi ApaItuValueInvesting-Guide) — tanpa VO, lapisan Guide di atas semuanya */
export const EpisodeGuide: React.FC = () => <Babak vo={false} guide />;
