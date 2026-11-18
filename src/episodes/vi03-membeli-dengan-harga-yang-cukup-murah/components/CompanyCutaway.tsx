import type { CSSProperties } from "react";
import { usePalette } from "../../../core";

/** Editable artwork: every mark is an SVG primitive, never a raster image. */
export const COMPANY_VIEW = { w: 1000, h: 530 };

function Pendant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} data-part="pendant">
      <path d="M0 0V24 M-4 24H4V30H-4Z" />
      <path d="M-30 51Q-22 31 0 30Q22 31 30 51Z" />
      <ellipse cy={52} rx={32} ry={5} />
    </g>
  );
}

function Head({ woman = false }: { woman?: boolean }) {
  const c = usePalette();
  return (
    <g data-part="head">
      {woman && <path d="M-15 8Q-28-5-20-25Q-18-43 0-42Q22-42 23-19L29 7Q21 19 7 12Z" fill={c.ink} />}
      <path d="M-15-27Q-14-41 2-38Q20-36 17-21L20-16L15-13Q13 2 0 2Q-16 1-16-14Z" />
      <path d="M-16-16Q-24-28-13-38Q-3-46 14-38L19-30Q4-25-2-33Q-7-21-16-16Z" fill={c.ink} />
      <path d="M-15-14Q-24-19-20-10L-14-8 M1-7Q6-3 10-8" fill="none" strokeWidth={2} />
      <circle cx={9} cy={-20} r={1.8} fill={c.ink} stroke="none" />
    </g>
  );
}

/** Shared character construction keeps the small figures consistent. */
function Employee({ x, y, scale = 1, kind = "suit", mirror = false }: {
  x: number; y: number; scale?: number;
  kind?: "suit" | "presenter" | "woman" | "worker" | "seated";
  mirror?: boolean;
}) {
  const c = usePalette();
  const woman = kind === "woman";
  const suited = kind === "suit" || kind === "presenter";
  return (
    <g transform={`translate(${x} ${y}) scale(${mirror ? -scale : scale} ${scale})`} strokeWidth={3} data-part={`employee-${kind}`}>
      {kind === "seated" ? <>
        <path d="M-18 49L12 53L23 76L37 76L39 83H15L2 65L-20 65Z" fill={c.ink} />
        <path d="M-25 16Q-19 4-6 5L10 13L17 40L39 42L39 49L7 49L-2 31L-3 55H-31Z" />
        <path d="M13 40L31 38L38 42 M-27 54H1V63H-27Z M-24 63V83 M-3 63V83" />
      </> : <>
        <path d="M-14 51L-17 93L-25 96V101H-8L-2 62L5 96H24V91L16 88L14 49Z" fill={suited || kind === "worker" ? c.ink : c.cardBg} />
        <path d={woman ? "M-18 12Q-12 4 3 5Q14 6 19 17L14 41L23 70H-23L-15 39Z" : "M-19 14Q-12 4 3 5Q13 5 19 14L17 57H-20Z"} fill={suited ? c.ink : c.cardBg} />
        {suited && <path d="M-10 8L0 32L9 8 M-1 11L3 17L0 27L-4 17Z" fill={c.cardBg} stroke={c.cardBg} strokeWidth={1.5} />}
        {kind === "presenter" ? <>
          <path d="M-17 14L-33 34L-17 46L-12 38L-23 32L-10 22 M16 16L33 30L46 7L52 11L41 43Q35 50 27 44L12 33" fill={c.ink} />
          <path d="M46 9L44 0Q45-4 48-1L50 3L50-9Q53-13 55-8V1Q63-1 62 6L55 14Z" />
        </> : kind === "worker" ? <>
          <path d="M-16 17L4 35L37 36L37 44H0L-23 25 M13 14L29 28L44 30L44 37H25L8 25" />
          <path d="M-3 13L-3 54 M-15 43H-7 M0 5L7 15L13 10" />
        </> : woman ? <>
          <path d="M-18 16L-25 37Q-24 44-17 44H11L14 36H-15L-9 24 M16 16L25 34L15 44" />
          <path d="M-1 27H31L22 48H-10Z M-18 37L-7 37L-4 43H-17" />
        </> : <>
          <path d="M-18 15L-25 53L-18 57L-9 24 M17 15L23 55L15 58L8 25" fill={c.ink} />
          <path d="M-25 52L-18 53L-18 62H-24Z M15 54H23V63H16Z" />
        </>}
      </>}
      <path d="M-7-1V8L0 12L6 5V-4" />
      <Head woman={woman} />
    </g>
  );
}

function Robot() {
  const c = usePalette();
  return (
    <g transform="translate(69 166)" strokeWidth={3} data-part="robot">
      <path d="M-12 34L-15 62L-9 82H-2L-4 60L1 46L6 62L5 82H13L18 60L13 32Z" />
      <path d="M-17 0L-21 28L-11 43H11L21 28L17 0Z M-12 7H12L9 23H-9Z" />
      <path d="M-23 4L-30 29L-27 48 M23 4L30 29L28 48 M-30 48L-34 58M-30 48L-25 57 M28 48L23 57M28 48L32 58" fill="none" />
      <circle cx={-22} cy={3} r={7} /><circle cx={22} cy={3} r={7} />
      <circle cy={-20} r={19} /><path d="M-18-24H18V-15H-18Z" fill={c.ink} />
      <circle cx={-8} cy={-20} r={2} fill={c.cardBg} stroke="none" /><circle cx={8} cy={-20} r={2} fill={c.cardBg} stroke="none" />
      <path d="M-6-8H6 M-7-1V0M7-1V0" />
    </g>
  );
}

function Factory() {
  const c = usePalette();
  return (
    <g data-part="factory">
      <g data-part="pipes" fill="none">
        <path d="M190 82H940 M190 89H940 M217 145H322 M365 145H499 M623 169H665 M755 197H811 M832 156V111H912 M839 156V118H912" />
      </g>
      {[192, 921].map((x) => <g key={x}>
        <path d={`M${x-9} 62V142H${x+9}V62`} />
        <rect x={x-18} y={52} width={36} height={11} rx={2} />
        {[77,94,111,128].map((y) => <circle key={y} cx={x} cy={y} r={2.5} fill={c.ink} />)}
      </g>)}
      <rect x={160} y={137} width={74} height={39} rx={3} />
      <rect x={174} y={151} width={44} height={12} rx={1} />
      <rect x={274} y={119} width={78} height={49} rx={3} />
      {[289,312,335,373,397,421,445,469].map((x) => <circle key={x} cx={x} cy={145} r={5} />)}
      <g data-part="control-cabinet">
        <rect x={501} y={115} width={119} height={122} rx={5} />
        <path d="M510 115V110H611V115" />
        {[0,1,2].flatMap((row) => [0,1,2].map((col) => <rect key={`${row}-${col}`} x={519+col*32} y={134+row*28} width={17} height={16} rx={1} fill={c.ink} />))}
      </g>
      <g data-part="screen-cabinet">
        <path d="M697 116V89H721V116" /><rect x={687} y={80} width={45} height={12} rx={2} />
        <circle cx={703} cy={102} r={2} /><circle cx={715} cy={102} r={2} />
        <rect x={656} y={116} width={100} height={121} rx={5} />
        <rect x={670} y={131} width={72} height={90} rx={2} />
        {[145,153,161,169,177].map((y) => <path key={y} d={`M681 ${y}H731`} strokeWidth={2} />)}
        <rect x={682} y={190} width={16} height={15} fill={c.ink} /><rect x={713} y={190} width={16} height={15} fill={c.ink} />
      </g>
      <g data-part="motor">
        <rect x={785} y={143} width={83} height={65} rx={3} />
        {[799,820,841].map((x) => <rect key={x} x={x} y={154} width={13} height={10} fill={c.ink} />)}
        {[178,190,201].map((y) => <circle key={y} cx={798} cy={y} r={2.5} fill={c.ink} />)}
        <path d="M828 220V181H900V188H835V220Z" />
        <rect x={895} y={139} width={67} height={84} rx={4} />
        <circle cx={928} cy={165} r={12} /><circle cx={928} cy={165} r={4} />
        <rect x={909} y={195} width={38} height={13} />
        <path d="M904 224V275H911V224 M946 224V275H953V224" />
      </g>
      <g data-part="laptop-station">
        <rect x={163} y={224} width={94} height={9} rx={2} />
        <path d="M204 233V270M181 270H231" />
        <rect x={180} y={186} width={58} height={36} rx={2} /><rect x={185} y={191} width={48} height={25} fill={c.ink} />
      </g>
      <Employee x={321} y={195} scale={0.8} kind="worker" />
      <g data-part="conveyor">
        <path d="M366 242V275H374V242 M867 242V275H875V242" />
        <rect x={361} y={229} width={520} height={12} rx={5} />
        <rect x={375} y={245} width={492} height={20} rx={10} />
        <circle cx={386} cy={255} r={7} /><circle cx={855} cy={255} r={7} />
        <path d="M400 255H840" strokeWidth={2} />
        {[379,568,627,692,748,804,849].map((x) => <rect key={x} x={x} y={217} width={12} height={12} rx={1} />)}
        <rect x={379} y={205} width={12} height={12} rx={1} />
      </g>
    </g>
  );
}

function Meeting() {
  const c = usePalette();
  return (
    <g data-part="meeting-floor">
      {[494,534,574,614].map((x,i) => <g key={x} data-part="clock">
        <circle cx={x} cy={351} r={15} />
        <path d={`M${x} 340V351L${x+(i%2 ? 6 : -6)} 355`} strokeWidth={2.5} fill="none" />
      </g>)}
      <g data-part="presentation-board">
        <rect x={444} y={377} width={264} height={101} rx={3} />
        <path d="M452 388H700 M452 396H700" strokeWidth={2} />
        <rect x={542} y={406} width={64} height={59} rx={1} /><rect x={622} y={406} width={64} height={59} rx={1} />
        {[416,425,434,443,452].map((y) => <path key={y} d={`M551 ${y}H596 M631 ${y}H677`} strokeWidth={2} />)}
        {[412,423,434,445].map((y) => <path key={y} d={`M456 ${y}H486`} strokeWidth={2} />)}
      </g>
      <g data-part="office-door">
        <rect x={909} y={376} width={57} height={137} rx={2} /><rect x={917} y={385} width={41} height={120} />
        <path d="M917 460H958 M937 385V453 M917 453H958 M923 467H928" />
      </g>
      <Employee x={210} y={439} scale={0.85} kind="seated" />
      <g data-part="office-desk">
        <rect x={166} y={466} width={153} height={8} rx={2} />
        <path d="M174 474V514H182V474 M303 474V514H311V474" />
        <path d="M245 462L254 432H294L285 462Z M237 465H294" />
        <circle cx={270} cy={448} r={2} fill={c.ink} />
      </g>
      <Employee x={365} y={427} scale={0.86} kind="woman" />
      <Employee x={509} y={428} scale={0.85} kind="presenter" />
      <Employee x={748} y={429} scale={0.83} mirror />
      <Employee x={799} y={430} scale={0.82} mirror />
      <Employee x={850} y={430} scale={0.82} mirror />
      <g data-part="briefcase">
        <path d="M743 478V472H758V478" />
        <rect x={733} y={478} width={37} height={25} rx={2} />
      </g>
    </g>
  );
}

export function CompanyCutaway({ style }: { style?: CSSProperties }) {
  const c = usePalette();
  return (
    <svg viewBox={`0 0 ${COMPANY_VIEW.w} ${COMPANY_VIEW.h}`} style={style} fill={c.cardBg} stroke={c.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Ilustrasi perusahaan dua lantai: produksi dan kantor">
      <g data-part="building-shell">
        <path d="M135 42H977V519H135Z" strokeWidth={7} />
        {[170,385,600,815].map((x) => <g key={x}>
          <path d={`M${x-12} 12H${x+93}`} strokeWidth={7} />
          {[0,18,36,54,72].map((dx) => <path key={dx} d={`M${x+dx} 13V30`} />)}
        </g>)}
        <rect x={116} y={30} width={874} height={16} rx={5} strokeWidth={6} />
      </g>
      <Pendant x={327} y={46} /><Pendant x={550} y={46} /><Pendant x={777} y={46} />
      <Factory />
      <Pendant x={327} y={289} /><Pendant x={550} y={289} /><Pendant x={777} y={289} />
      <Meeting />
      <g data-part="balconies">
        <Robot />
        <Employee x={69} y={444} scale={0.85} kind="woman" />
        <path d="M135 233H23Q17 233 17 240V281Q17 289 25 289H135Z M135 473H23Q17 473 17 481V511Q17 519 25 519H135Z" />
      </g>
      <g data-part="floor-beams" strokeWidth={7}>
        <path d="M135 285H977 M135 519H977 M135 46V519 M977 46V519" fill="none" />
      </g>
    </svg>
  );
}
