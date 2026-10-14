import { useEffect, useRef } from "react";
import { cn } from "@/registry/n2020/lib/utils";

/** The side of one grain in CSS pixels. */
const GRAIN_SIZE = 1.5;

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

// The bright parts of the image become the ink. The dark parts stay
// transparent, so the background shows through. Grain breaks up the edge, and
// the image fades out at the left and at the bottom.
const FRAGMENT = `
precision highp float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_imageAspect, u_px, u_grain;
uniform vec4 u_ink;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 scale = aspect > u_imageAspect ? vec2(1., u_imageAspect / aspect) : vec2(aspect / u_imageAspect, 1.);
  vec3 color = texture2D(u_image, (vec2(uv.x, 1. - uv.y) - .5) * scale + .5).rgb;
  float light = smoothstep(.08, .8, dot(color, vec3(.299, .587, .114)));
  float grain = hash(floor(px / (u_grain * u_px))) - .5;
  float alpha = smoothstep(.46, .54, light + grain * .42);
  alpha *= smoothstep(0., .3, uv.y) * smoothstep(0., .22, uv.x) * u_ink.a;
  gl_FragColor = vec4(u_ink.rgb * alpha, alpha);
}`;

/** Reads the CSS `color` of an element as numbers from 0 to 1. */
function inkOf(element: Element) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return [0, 0, 0, 1];
  context.fillStyle = getComputedStyle(element).color;
  context.fillRect(0, 0, 1, 1);
  return [...context.getImageData(0, 0, 1, 1).data].map((value) => value / 255);
}

/**
 * Draws a photo as grainy ink on a transparent canvas. The ink is the text
 * colour of the canvas, so a class such as `text-foreground` sets it. Use a
 * photo with a bright subject on a black background.
 */
export function GrainImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!canvas || !gl) return;

    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    const shaders: WebGLShader[] = [];
    const release = () => {
      for (const shader of shaders) gl.deleteShader(shader);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    for (const [type, source] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, FRAGMENT],
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

    const image = new Image();
    let loaded = false;

    function draw() {
      if (!canvas || !gl || !loaded) return;
      const scale = window.devicePixelRatio;
      const width = Math.round(canvas.clientWidth * scale);
      const height = Math.round(canvas.clientHeight * scale);
      if (width === 0 || height === 0) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      const [red, green, blue, alpha] = inkOf(canvas);
      const uniform = (name: string) => gl.getUniformLocation(program, name);
      gl.uniform2f(uniform("u_resolution"), width, height);
      gl.uniform1f(uniform("u_px"), scale);
      gl.uniform1f(uniform("u_grain"), GRAIN_SIZE);
      gl.uniform1f(
        uniform("u_imageAspect"),
        image.naturalWidth / image.naturalHeight,
      );
      gl.uniform4f(uniform("u_ink"), red, green, blue, alpha);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      loaded = true;
      draw();
    };
    image.src = src;

    // A resize also covers a breakpoint that changes the ink colour.
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => {
      image.onload = null;
      observer.disconnect();
      release();
    };
  }, [src]);

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas without tabIndex is not focusable.
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block", className)}
    />
  );
}
