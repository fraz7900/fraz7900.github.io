"use client";

import { useEffect, useRef } from "react";

/*
 * Full-screen animated backdrop: a slow teal/sky nebula with twinkling stars that
 * leans toward the pointer and drifts with scroll. WebGL only; if WebGL is missing
 * the static CSS gradient behind it remains. Reduced motion renders a single frame.
 */

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.; float a = .5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= .5; }
  return v;
}
float starLayer(vec2 uv, float density, float t){
  vec2 g = uv * density; vec2 id = floor(g); vec2 f = fract(g) - .5;
  float h = hash(id);
  if (h < .945) return 0.;
  vec2 o = vec2(hash(id + 1.3), hash(id + 7.7)) - .5;
  float d = length(f - o * .6);
  float twinkle = .55 + .45 * sin(t * (.8 + h * 2.) + h * 30.);
  return smoothstep(.075, 0., d) * twinkle;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  vec2 m = (uPointer - .5 * uRes) / uRes.y;
  float t = uTime * .028;
  vec2 toPointer = uv - m;
  float pull = exp(-dot(toPointer, toPointer) * 6.);
  vec2 p = uv * 1.25 + vec2(t, -t * .6) + vec2(0., uScroll * .00028) - toPointer * pull * .09;
  float n = fbm(p + fbm(p + t) * .8);
  vec3 deep = vec3(.024, .043, .078);
  vec3 teal = vec3(.21, .82, .73);
  vec3 sky = vec3(.42, .71, 1.);
  vec3 amber = vec3(.95, .71, .35);
  vec3 neb = mix(sky, teal, smoothstep(.3, .8, n));
  neb = mix(neb, amber, smoothstep(.72, .95, fbm(p * 1.7 + 3.)) * .3);
  float a = smoothstep(.26, .86, n) * .62;
  vec3 col = deep + neb * a + teal * pull * .045;
  vec2 s = uv + vec2(t * .2, uScroll * .00018);
  float st = starLayer(s, 22., uTime) + starLayer(s * 1.6 + 4., 32., uTime * 1.2) * .6;
  col += vec3(.85, .92, 1.) * st;
  col *= smoothstep(1.5, .25, length(uv));
  gl_FragColor = vec4(col, 1.);
}`;

const RESOLUTION_SCALE = 0.75;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;
    const program = createProgram(gl);
    if (!program) return;

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      scroll: gl.getUniformLocation(program, "uScroll"),
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const eased = { ...target };
    let frame = 0;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * RESOLUTION_SCALE;
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      const scale = canvas.width / window.innerWidth;
      eased.x += (target.x - eased.x) * 0.06;
      eased.y += (target.y - eased.y) * 0.06;
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, now / 1000);
      gl.uniform2f(uniforms.pointer, eased.x * scale, (window.innerHeight - eased.y) * scale);
      gl.uniform1f(uniforms.scroll, window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(loop);
    };
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };

    resize();
    canvas.dataset.ready = "true";
    if (reduced) {
      draw(0);
    } else {
      frame = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,#0d2a33_0%,#060b14_55%)]"
    >
      <canvas ref={canvasRef} className="size-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100" />
    </div>
  );
}
