"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/registry/n2020/lib/utils";

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function bayerPath(
  rows: number,
  cell: number,
  density: (row: number) => number,
) {
  let path = "";
  for (let row = 0; row < rows; row++) {
    const threshold = density(row) * 16;
    for (let column = 0; column < 4; column++) {
      if (BAYER_4[row % 4][column] < threshold) {
        path += `M${column * cell} ${row * cell}h${cell}v${cell}h-${cell}z`;
      }
    }
  }
  return path;
}

export function DitherPattern({
  id,
  color,
  density,
  cell = 2,
}: {
  id: string;
  color: string;
  density: number;
  cell?: number;
}) {
  return (
    <pattern
      id={id}
      width={cell * 4}
      height={cell * 4}
      patternUnits="userSpaceOnUse"
    >
      <path
        d={bayerPath(4, cell, () => density)}
        fill={color}
        shapeRendering="crispEdges"
      />
    </pattern>
  );
}

export function DitherGradientPattern({
  id,
  color,
  height,
  topDensity = 1,
  bottomDensity = 0,
  cell = 2,
}: {
  id: string;
  color: string;
  height: number;
  topDensity?: number;
  bottomDensity?: number;
  cell?: number;
}) {
  const rows = Math.ceil(height / cell);
  return (
    <pattern
      id={id}
      width={cell * 4}
      height={rows * cell}
      patternUnits="userSpaceOnUse"
    >
      <path
        d={bayerPath(
          rows,
          cell,
          (row) =>
            topDensity + ((bottomDensity - topDensity) * row) / (rows - 1),
        )}
        fill={color}
        shapeRendering="crispEdges"
      />
    </pattern>
  );
}

export function DitherMeter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const id = useId();
  const filled = Math.max(0, Math.min(1, value)) * 100;
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height={8}
      className={cn("block", className)}
    >
      <defs>
        <DitherPattern id={id} color="currentColor" density={0.25} />
      </defs>
      <rect width="100%" height={8} fill={`url(#${id})`} />
      <rect width={`${filled}%`} height={8} fill="currentColor" />
    </svg>
  );
}

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const PRELUDE = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_px;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.02+vec2(17.,9.);a*=.5;}return s;}
float bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
#define bayer4(a) (bayer2(.5*(a))*.25+bayer2(a))
#define bayer8(a) (bayer4(.5*(a))*.25+bayer2(a))
`;

export type DitherUniforms = Record<string, number | readonly number[]>;

export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export function DitherCanvas({
  fragment,
  uniforms,
  cssPixelSize,
  fps = 20,
  className,
}: {
  fragment: string;
  uniforms: DitherUniforms;
  cssPixelSize?: number;
  fps?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef(uniforms);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    uniformsRef.current = uniforms;
    redrawRef.current();
  }, [uniforms]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;

    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const shaders: WebGLShader[] = [];
    const release = () => {
      for (const shader of shaders) gl.deleteShader(shader);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, PRELUDE + fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) return release();
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return release();
      }
      gl.attachShader(program, shader);
    }
    gl.bindAttribLocation(program, 0, "p");
    gl.linkProgram(program);
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL method, not a React hook.
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    function draw() {
      if (!canvas || !gl) return;
      const scale = cssPixelSize ? 1 / cssPixelSize : window.devicePixelRatio;
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      const all: DitherUniforms = {
        ...uniformsRef.current,
        u_resolution: [width, height],
        u_time: performance.now() / 1000,
        u_px: scale,
      };
      for (const [name, value] of Object.entries(all)) {
        const location = gl.getUniformLocation(program, name);
        if (typeof value === "number") gl.uniform1f(location, value);
        else if (value.length === 2) gl.uniform2f(location, value[0], value[1]);
        else gl.uniform3f(location, value[0], value[1], value[2]);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    redrawRef.current = draw;

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (!visible || now - last < 1000 / fps) return;
      last = now;
      draw();
    }
    if (!still && fps > 0) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      redrawRef.current = () => {};
      release();
    };
  }, [fragment, cssPixelSize, fps]);

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas without tabIndex is not focusable.
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block [image-rendering:pixelated]", className)}
    />
  );
}
