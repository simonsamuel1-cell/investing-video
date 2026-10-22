/**
 * lab/tests/Blobs.tsx — TEST 01c · an endless morphing blob field.
 *
 * Simon: "blurred blob yang morphing tanpa bentuk yang jelas dan tanpa batas."
 *
 * ⚠ THERE ARE NO EDGES ANYWHERE IN THIS FILE. Each blob is a GAUSSIAN — a
 * falloff that never reaches zero — so there is nothing to anti-alias and
 * nothing to blur afterwards. The softness is not a post effect; it is the
 * only shape these things have. That is why a shader is the right medium for
 * it and a DOM blur is not: no element, no bounding box, no edge to hide.
 *
 * ⚠ AND THEY MERGE BY ADDITION, WHICH IS WHAT MAKES IT READ AS MORPHING. Two
 * overlapping falloffs simply sum, so the pair becomes one larger mass and
 * separates again without any shape ever being defined. Nothing is being
 * interpolated between two forms — there are no forms.
 *
 * ═══ ⚠ IT LOOPS EXACTLY, AND THAT IS THE USEFUL PART ═══
 *
 * Every drift here is driven by cos/sin of ONE angle that turns a full circle
 * over LOOP frames, with whole-number rates. So frame LOOP is bit-identical to
 * frame 0 and the field can run under a whole episode — or be rendered once
 * and repeated — with no seam. A background driven by raw elapsed time cannot
 * do that: it is never in the same place twice.
 */
import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme, usePalette } from "../../core";

/** Frames for one full turn. Anything divides into it cleanly at 60fps. */
export const BLOB_LOOP = 600;

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
uniform float u_th;
uniform vec3 u_bg;
uniform vec3 u_c1;
uniform vec3 u_c2;
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

float fbm(vec2 p) {
  return 0.6 * noise(p) + 0.3 * noise(p * 2.1);
}

/* A blob is a falloff, not a disc. It has no radius and no rim. */
float blob(vec2 p, vec2 c, float s) {
  vec2 v = p - c;
  return exp(-dot(v, v) / (2.0 * s * s));
}

/* ⚠ WHOLE-NUMBER RATES ONLY. A fractional rate never returns to its starting
   point and the loop grows a seam. */
vec2 orbit(float rx, float ry, float a, float b, float ph) {
  return vec2(rx * cos(a * u_th + ph), ry * sin(b * u_th + ph * 1.7));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  /* ⚠ THE WARP IS ON THE SAME CIRCLE. Driven by elapsed time instead it
     would be the one thing that refuses to loop. */
  vec2 wob = vec2(cos(u_th), sin(u_th)) * 0.7;
  p += 0.055 * vec2(fbm(p * 1.6 + wob), fbm(p * 1.6 + 7.3 - wob));

  /* two families, so the two brand hues drift independently and cross */
  float a = 0.0;
  a += blob(p, orbit(0.62, 0.30, 1.0, 1.0, 0.0), 0.30);
  a += blob(p, orbit(0.40, 0.34, 1.0, 2.0, 2.1), 0.26);
  a += blob(p, orbit(0.70, 0.22, 2.0, 1.0, 4.4), 0.24);

  float b = 0.0;
  b += blob(p, orbit(0.55, 0.33, 1.0, 1.0, 3.1), 0.31);
  b += blob(p, orbit(0.66, 0.26, 2.0, 1.0, 1.2), 0.25);
  b += blob(p, orbit(0.34, 0.36, 1.0, 2.0, 5.6), 0.27);

  /* ⚠ KEPT FAINT. This is a ground. The moment a blob has a readable edge it
     has become a subject, and nothing can be laid on top of it. */
  vec3 col = u_bg;
  col = mix(col, u_c1, smoothstep(0.15, 1.05, a) * 0.30);
  col = mix(col, u_c2, smoothstep(0.15, 1.05, b) * 0.26);

  /* the two reserves, masked per pixel */
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
    throw new Error(`lab/Blobs: ${gl.getShaderInfoLog(s)}`);
  }
  return s;
};

export const BlobsTest = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const built = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram } | null>(null);
  const f = useCurrentFrame();
  const c = usePalette();

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!built.current) {
      const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: false });
      if (!gl) throw new Error("lab/Blobs: no WebGL context");
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(`lab/Blobs: ${gl.getProgramInfoLog(prog)}`);
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
    /* ⚠ ONE ANGLE, MODULO THE LOOP — this is what makes frame LOOP identical
       to frame 0. Passing raw seconds here would undo the whole arrangement. */
    gl.uniform1f(u("u_th"), ((f % BLOB_LOOP) / BLOB_LOOP) * Math.PI * 2);
    gl.uniform3fv(u("u_bg"), rgb(c.bg));
    gl.uniform3fv(u("u_c1"), rgb(c.indigo));
    gl.uniform3fv(u("u_c2"), rgb(c.cyan));
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
  }, [f, c]);

  return (
    <AbsoluteFill>
      <canvas ref={ref} width={theme.canvas.width} height={theme.canvas.height} />
    </AbsoluteFill>
  );
};
