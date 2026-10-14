"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DitherCanvas, hexToRgb } from "@/registry/n2020/components/dither";

const CLOUD_BAND_FRAGMENT = `
uniform vec3 u_zenith, u_horizon, u_shade, u_light, u_ground;
float ditherQuantize(float x, float levels, float b){ return clamp(floor(x * levels + b) / levels, 0., 1.); }
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = vec2(uv.x * u_resolution.x / u_resolution.y, uv.y) * .55;
  float b = bayer8(gl_FragCoord.xy);
  float t = u_time * .006;
  vec2 cp = vec2(p.x * .8 + t, p.y * 2.2);
  float warp = fbm(cp * 1.2 + 3.1);
  float n = fbm(cp * 1.4 + vec2(warp, -warp * .5));
  float wisps = fbm(vec2(p.x * 1.1 - t * 1.6, p.y * 5.) + 11.);
  float d = n + .18 * wisps + .2 * uv.x - .12;
  float cloud = smoothstep(.46, .62, d);
  vec3 sky = mix(u_horizon, u_zenith, ditherQuantize(smoothstep(.25, 1., uv.y), 5., b));
  vec3 cl = mix(u_shade, u_light, ditherQuantize(smoothstep(.56, .8, d + .3 * (fbm(cp * 3.6 + 7.) - .5)), 3., b));
  vec3 col = mix(sky, cl, ditherQuantize(cloud, 4., b));
  col = mix(u_ground, col, ditherQuantize(smoothstep(.04, .7, uv.y) * smoothstep(-.1, .55, uv.x), 8., b));
  gl_FragColor = vec4(col, 1.);
}`;

const PALETTES = {
  light: {
    u_zenith: hexToRgb("#2b2bf5"),
    u_horizon: hexToRgb("#b9b9f2"),
    u_shade: hexToRgb("#d9d7ea"),
    u_light: hexToRgb("#ffffff"),
    u_ground: hexToRgb("#f2f0e9"),
  },
  dark: {
    u_zenith: hexToRgb("#0b0c14"),
    u_horizon: hexToRgb("#15154a"),
    u_shade: hexToRgb("#2020a8"),
    u_light: hexToRgb("#5a5aff"),
    u_ground: hexToRgb("#0b0c14"),
  },
};

export function Sky({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [dark, setDark] = useState(false);

  // Follow the theme's `dark` variant, which applies inside any `.dark` ancestor.
  useLayoutEffect(() => {
    const update = () => setDark(ref.current?.closest(".dark") != null);
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="contents">
      <DitherCanvas
        fragment={CLOUD_BAND_FRAGMENT}
        uniforms={PALETTES[dark ? "dark" : "light"]}
        cssPixelSize={3}
        fps={12}
        className={className}
      />
    </span>
  );
}
