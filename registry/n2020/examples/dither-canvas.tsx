import { DitherCanvas, hexToRgb } from "@/registry/n2020/components/dither";

const FRAGMENT = `
uniform vec3 u_ink, u_paper;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = vec2(uv.x * u_resolution.x / u_resolution.y, uv.y) * 3.;
  float n = fbm(p + u_time * .05);
  float on = step(bayer8(gl_FragCoord.xy), n);
  gl_FragColor = vec4(mix(u_paper, u_ink, on), 1.);
}`;

// WebGL uniforms take numbers, so the shader cannot read CSS theme tokens.
const UNIFORMS = {
  u_ink: hexToRgb("#2b2bf5"),
  u_paper: hexToRgb("#f2f0e9"),
};

export default function DitherCanvasExample() {
  return (
    <DitherCanvas
      fragment={FRAGMENT}
      uniforms={UNIFORMS}
      cssPixelSize={3}
      fps={12}
      className="h-64 w-full border"
    />
  );
}
