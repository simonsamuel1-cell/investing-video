/**
 * lab/tests/Glsl.tsx — TEST 1 · a fragment shader as a living ground.
 *
 * A shader is not a drawing. There are no objects, no layers and no paths:
 * there is one small program that runs ONCE PER PIXEL, two million times a
 * frame, and returns a colour. Everything you see here is arithmetic on the
 * pixel's own coordinate.
 *
 * What this particular one does is DOMAIN WARPING — fbm noise whose INPUT is
 * itself displaced by more fbm noise, twice over. That is the whole trick
 * behind marble, smoke, cloth and fog: not a texture, a feedback of a field
 * into its own coordinates.
 *
 * ⚠ THE COLOURS COME IN AS UNIFORMS, FROM usePalette(). A shader is a string,
 * and a hex inside that string is a hex the palette cannot reach and the audit
 * cannot see. Passing them in keeps the effect theme-driven and keeps this
 * file honest.
 *
 * ⚠ THE DRIFT IS LINEAR — `frame / fps`, no easing. From the reference folder:
 * a motion that never starts and never stops on screen must be constant
 * velocity. An eased drift reads as a move that is about to end.
 *
 * ⚠ preserveDrawingBuffer: true, AND IT IS NOT OPTIONAL. Remotion screenshots
 * the page after the commit; without it Chrome is free to have cleared the
 * WebGL back buffer by then and every still comes out blank.
 */
import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, usePalette } from "../../core";

/** "#RRGGBB" → [0..1, 0..1, 0..1]. Reads a palette slot; never a literal. */
const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/* ── the shader ───────────────────────────────────────────────────────────
   hash → noise → fbm → domain warp. iq's simplex; five octaves is where the
   field stops reading as a pattern and starts reading as a material. */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform vec3 u_bg;
uniform vec3 u_ink1;
uniform vec3 u_ink2;
/* the two reserves, in GL space (origin bottom-left) — see the header */
uniform float u_bandY;
uniform vec4 u_logo;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}

/* ⚠ THREE OCTAVES, NOT FIVE. Five put detail at the pixel scale and the
   field came out as marble — a texture, which is a subject. A ground needs
   shapes bigger than the things standing on it. */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int k = 0; k < 3; k++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  /* ⚠ 0.9, NOT 2.6 — the single number that decides whether this is a ground
     or a texture. Under one, the blobs are bigger than the cards. */
  vec2 p = uv * 0.9;
  p.x *= u_res.x / u_res.y;

  float t = u_t * 0.035;

  /* ONE warp, not two. The second fold is what produced the marble veins. */
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - vec2(t, 0.0)));
  float f = fbm(p + 1.6 * q);

  float v = clamp(f * 0.5 + 0.5, 0.0, 1.0);
  float w = clamp(length(q), 0.0, 1.0);

  /* ⚠ KEPT QUIET ON PURPOSE. This is a GROUND — something for cards and type
     to stand on. At full strength it stops being a room and becomes a
     subject, which is the failure mode of every shader. */
  vec3 col = u_bg;
  /* ⚠ THE TWO HUES ARE PUT IN EACH OTHER'S COMPLEMENT. Driven by the same
     field they simply stack and the result is all cyan — which is what the
     first pass came out as. Indigo takes 1-v, so the ground breathes BETWEEN
     the brand's two anchors instead of toward one of them. */
  col = mix(col, u_ink2, smoothstep(0.40, 0.95, v) * 0.34);
  col = mix(col, u_ink1, smoothstep(0.30, 0.90, 1.0 - v) * 0.22);
  col = mix(col, u_ink1, smoothstep(0.55, 1.00, w) * 0.10);

  /* ═══ THE RESERVES, MASKED IN THE SHADER ═══
     A full-bleed ground always lands in the 108px subtitle band and the
     360x150 logo zone. GridGround had to be clipped with a DOM window to fix
     exactly this. Here it costs two lines: the mask is per-pixel, so instead
     of a hard clip edge the field simply FADES to paper as it approaches a
     reserve — which no rectangular clip can do. */
  float m = smoothstep(u_bandY, u_bandY + 90.0, gl_FragCoord.y);
  vec2 d = max(u_logo.xy - gl_FragCoord.xy, gl_FragCoord.xy - u_logo.zw);
  m *= smoothstep(0.0, 90.0, max(d.x, d.y));
  col = mix(u_bg, col, m);

  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(`lab/Glsl: ${gl.getShaderInfoLog(s)}`);
  }
  return s;
};

export const GlslTest = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const built = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram } | null>(null);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = usePalette();

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    if (!built.current) {
      const gl = canvas.getContext("webgl", {
        preserveDrawingBuffer: true,
        antialias: false,
      });
      if (!gl) throw new Error("lab/Glsl: no WebGL context");
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(`lab/Glsl: ${gl.getProgramInfoLog(prog)}`);
      }
      gl.useProgram(prog);
      /* one full-screen triangle — cheaper than a quad and has no seam */
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
    /* ⚠ LINEAR TIME — see the header. */
    gl.uniform1f(u("u_t"), f / fps);
    gl.uniform3fv(u("u_bg"), rgb(c.bg));
    gl.uniform3fv(u("u_ink1"), rgb(c.indigo));
    gl.uniform3fv(u("u_ink2"), rgb(c.cyan));
    /* ⚠ FLIPPED INTO GL SPACE. gl_FragCoord counts from the BOTTOM; every
       number in theme counts from the top. Passing them raw is the quiet way
       to mask the wrong edge of the frame. */
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
