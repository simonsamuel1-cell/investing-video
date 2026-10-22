/**
 * lab/tests/RaymarchCandles.tsx — TEST 01b · raymarching.
 *
 * ⚠ THERE IS NO GEOMETRY IN THIS FILE. No mesh, no vertices, no 3D engine.
 * Every pixel fires a ray into an imaginary space and walks along it until it
 * is close enough to a surface DESCRIBED BY A FORMULA. Depth, lighting and
 * fog fall out of that walk. It is the same technique as the fbm ground, one
 * dimension up.
 *
 * ⚠ AND THE TAPE IS INFINITE BECAUSE SPACE IS FOLDED. `mod`-ing the x axis
 * makes ONE box description repeat forever, so the cost is the same for ten
 * candles or ten thousand — the loop never iterates over a list. That is the
 * thing raymarching gives that a 3D scene graph cannot: unbounded content at
 * constant cost.
 *
 * ⚠ THE FILENAME CARRIES "Candle" ON PURPOSE. The audit confines
 * candleGreen/candleRed to files named that way; these ARE candle bodies, so
 * the exemption is visible from the file listing rather than buried.
 *
 * ⚠ DRIFT IS LINEAR — `frame / fps`. A camera that never starts and never
 * stops on screen is constant velocity; easing it would read as a move about
 * to end.
 */
import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, usePalette } from "../../core";

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform vec3 u_bg;
uniform vec3 u_up;
uniform vec3 u_down;
uniform vec3 u_ink;
uniform float u_bandY;
uniform vec4 u_logo;

float hash1(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

/* ⚠ SPACE IS FOLDED HERE, AND THIS IS THE WHOLE TRICK. One box, repeated by
   taking x modulo the spacing. id survives the fold, so each cell can still
   have its own height — the tape is procedural, not stored. */
const float SP = 1.0;

/* returns (distance, material) — 1 = rising, 2 = falling, 3 = ground */
vec2 map(vec3 p) {
  float idc = floor(p.x / SP + 0.5);

  /* ⚠ THE THREE NEIGHBOURING CELLS, NOT JUST THIS ONE. A folded space breaks
     the distance field at every cell boundary: inside one cell the formula
     knows nothing about the box next door, so a ray travelling at an angle
     steps straight through its corner and the surface comes out torn. Looking
     one cell either way is the standard repair, and it is why the first pass
     had notches cut out of every candle top. */
  float best = 1e9;
  float mat = 3.0;
  for (int k = -1; k <= 1; k++) {
    float id = idc + float(k);
    vec3 q = p;
    q.x -= SP * id;

    float a = hash1(id);
    float b = hash1(id + 37.0);
    float top = 0.5 + a * 2.1;
    float bot = top - (0.35 + b * 1.1);
    float cy = (top + bot) * 0.5;
    float ch = (top - bot) * 0.5;

    float body = sdBox(q - vec3(0.0, cy, 0.0), vec3(0.33, ch, 0.33));
    float wick = sdBox(q - vec3(0.0, top + 0.34, 0.0), vec3(0.05, 0.36, 0.05));
    float d = min(body, wick);

    if (d < best) {
      best = d;
      mat = hash1(id + 11.0) > 0.47 ? 1.0 : 2.0;
    }
  }

  float ground = p.y;
  if (ground < best) return vec2(ground, 3.0);
  return vec2(best, mat);
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    map(p + e.xyy).x - map(p - e.xyy).x,
    map(p + e.yxy).x - map(p - e.yxy).x,
    map(p + e.yyx).x - map(p - e.yyx).x
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  /* ⚠ PULLED WAY BACK AND RAISED. At the first distance six candles filled
     the frame and the thing read as blocks, not as a tape. A chart is a LONG
     row seen from a little above; the subject is the sequence, not a box. */
  float x = u_t * 1.6;
  vec3 ro = vec3(x, 5.6, 13.0);
  vec3 ta = vec3(x + 9.0, 1.3, 0.0);

  vec3 f = normalize(ta - ro);
  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));
  vec3 u = cross(f, r);
  /* a longer lens — less perspective distortion down a long row */
  vec3 rd = normalize(uv.x * r + uv.y * u + 2.3 * f);

  float t = 0.0;
  float mat = 0.0;
  for (int i = 0; i < 72; i++) {
    vec3 p = ro + rd * t;
    vec2 h = map(p);
    if (h.x < 0.0015 * t || t > 60.0) { mat = h.y; break; }
    t += h.x * 0.9;
    mat = h.y;
  }

  vec3 col = u_bg;
  if (t < 60.0) {
    vec3 p = ro + rd * t;
    vec3 n = normalAt(p);
    vec3 ld = normalize(vec3(-0.4, 0.85, 0.45));
    float dif = clamp(dot(n, ld), 0.0, 1.0);
    float amb = 0.55 + 0.45 * n.y;

    vec3 base = mat < 1.5 ? u_up : (mat < 2.5 ? u_down : u_bg);
    /* ⚠ THE FLOOR NEEDED A GRID, NOT MORE COLOUR. At a flat tone it was
       within a hair of the paper and the candles read as floating — raising
       the tone only greyed the frame. Ruled lines give the plane a direction
       and a depth cue, and they are the episode's own drifting grid seen in
       perspective. Faded with distance, or they alias into noise. */
    if (mat > 2.5) {
      vec2 g = abs(fract(p.xz) - 0.5);
      float line = 1.0 - smoothstep(0.0, 0.035, min(g.x, g.y));
      line *= exp(-0.035 * t);
      base = mix(mix(u_bg, u_ink, 0.035), mix(u_bg, u_ink, 0.30), line);
    }

    col = base * (0.5 * amb + 0.7 * dif);
    /* ⚠ PULLED TOWARD THE PAPER. Full-strength candle colour across surfaces
       this large is far louder than anything else in the brand. */
    col = mix(col, u_bg, 0.26);
  }

  /* ⚠ FOG INTO THE PAPER, NOT INTO BLACK. The far end of the tape has to
     dissolve into the episode's own ground or the frame grows an edge. */
  col = mix(col, u_bg, 1.0 - exp(-0.0013 * t * t));

  /* the two reserves, masked per pixel — same device as test 01 */
  float m = smoothstep(u_bandY, u_bandY + 90.0, gl_FragCoord.y);
  vec2 d2 = max(u_logo.xy - gl_FragCoord.xy, gl_FragCoord.xy - u_logo.zw);
  m *= smoothstep(0.0, 90.0, max(d2.x, d2.y));
  col = mix(u_bg, col, m);

  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(`lab/RaymarchCandles: ${gl.getShaderInfoLog(s)}`);
  }
  return s;
};

export const RaymarchCandlesTest = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const built = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram } | null>(null);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = usePalette();

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!built.current) {
      const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: false });
      if (!gl) throw new Error("lab/RaymarchCandles: no WebGL context");
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(`lab/RaymarchCandles: ${gl.getProgramInfoLog(prog)}`);
      }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      built.current = { gl, prog };
    }

    const { gl, prog } = built.current;
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u("u_res"), canvas.width, canvas.height);
    gl.uniform1f(u("u_t"), f / fps);
    gl.uniform3fv(u("u_bg"), rgb(c.bg));
    gl.uniform3fv(u("u_up"), rgb(c.candleGreen));
    gl.uniform3fv(u("u_down"), rgb(c.candleRed));
    gl.uniform3fv(u("u_ink"), rgb(c.indigo));
    const H = theme.canvas.height;
    gl.uniform1f(u("u_bandY"), H - theme.captionBand.top);
    gl.uniform4f(
      u("u_logo"),
      theme.canvas.width - theme.logoZone.width,
      H - theme.logoZone.height,
      theme.canvas.width,
      H,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [f, fps, c]);

  return (
    <AbsoluteFill>
      <canvas ref={ref} width={theme.canvas.width} height={theme.canvas.height} />
    </AbsoluteFill>
  );
};
