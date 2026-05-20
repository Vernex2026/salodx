import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * ParticleCloud — volumetric particle hero background (Gemini-tier).
 *
 * Architecture:
 *  - Custom ShaderMaterial — soft glowing circular particles (no
 *    square pixels). Bright core via two smoothstep alpha lobes.
 *  - GPU-side assembly: vertex shader lerps scatter→target through
 *    uProgress over ~2.4s with easeOutCubic.
 *  - <Bloom> post-processing — the "50% of Gemini effect".
 *  - AdditiveBlending + alpha gradient → overlapping particles sum
 *    brightness for a volumetric cloud read.
 *  - Shape: diamond with empty waist → headline sits in the void,
 *    no manual masking needed.
 *  - Geometry built once via useMemo — zero rebuilds on re-render.
 *  - Mobile (<768px) → ~40% count. prefers-reduced-motion → instant
 *    assembled state, no parallax.
 */

const COLORS = [
  new THREE.Color("#F5F7FA"),
  new THREE.Color("#4D7CFF"),
  new THREE.Color("#00E5FF"),
  new THREE.Color("#7B5CFF"),
];
const COLOR_WEIGHTS = [0.58, 0.24, 0.12, 0.06];

function weightedColor() {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < COLORS.length; i += 1) {
    acc += COLOR_WEIGHTS[i];
    if (r <= acc) return COLORS[i];
  }
  return COLORS[0];
}

const VERTEX = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  attribute vec3  aTarget;
  attribute vec3  aScatter;
  attribute vec3  aColor;
  attribute float aSize;
  attribute float aSeed;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    float p = 1.0 - pow(1.0 - uProgress, 3.0);

    vec3 pos = mix(aScatter, aTarget, p);

    float d = uTime * 0.25 + aSeed * 6.2831;
    pos.x += sin(d) * 0.05 * p;
    pos.y += cos(d * 0.9) * 0.05 * p;
    pos.z += sin(d * 1.1) * 0.05 * p;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = aSize * uPixelRatio * (140.0 / -mv.z) * p;

    vAlpha = p * smoothstep(-14.0, -2.0, mv.z);
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    alpha += smoothstep(0.22, 0.0, dist) * 0.6;

    gl_FragColor = vec4(vColor, alpha * vAlpha * 0.85);
  }
`;

function Cloud({ count, reduceMotion }) {
  const pointsRef = useRef(null);
  const matRef = useRef(null);
  const progress = useRef(reduceMotion ? 1 : 0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const target = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const color = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const y = (Math.random() - 0.5) * 2;
      const theta = Math.random() * Math.PI * 2;
      const ringR = (1.0 - Math.pow(Math.abs(y), 1.4)) * 2.6;
      const shell = 0.86 + Math.random() * 0.22;
      const clump = 0.9 + Math.sin(theta * 3.0) * 0.12;

      target[i * 3]     = Math.cos(theta) * ringR * shell * clump;
      target[i * 3 + 1] = y * 3.0;
      target[i * 3 + 2] = Math.sin(theta) * ringR * shell * clump;

      const sr = 9 + Math.random() * 7;
      const st = Math.random() * Math.PI * 2;
      const sp = Math.acos(2 * Math.random() - 1);
      scatter[i * 3]     = sr * Math.sin(sp) * Math.cos(st);
      scatter[i * 3 + 1] = sr * Math.sin(sp) * Math.sin(st);
      scatter[i * 3 + 2] = sr * Math.cos(sp);

      const c = weightedColor();
      color[i * 3] = c.r;
      color[i * 3 + 1] = c.g;
      color[i * 3 + 2] = c.b;
      size[i] = Math.random() > 0.92
        ? 14 + Math.random() * 10
        : 4 + Math.random() * 7;
      seed[i] = Math.random();
    }

    g.setAttribute("position", new THREE.BufferAttribute(target, 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uProgress: { value: reduceMotion ? 1 : 0 },
          uTime: { value: 0 },
          uPixelRatio: {
            value: Math.min(
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
              2
            ),
          },
        },
      }),
    [reduceMotion]
  );

  useFrame((state, delta) => {
    if (!matRef.current || !pointsRef.current) return;

    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta / 2.4, 1);
      matRef.current.uniforms.uProgress.value = progress.current;
    }
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    const p = progress.current;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.045 * p;
    pointsRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.04 * p;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive ref={matRef} object={material} attach="material" />
    </points>
  );
}

function CameraRig() {
  useFrame((state) => {
    const x = state.pointer.x * 0.4;
    const y = state.pointer.y * 0.25;
    state.camera.position.x += (x - state.camera.position.x) * 0.04;
    state.camera.position.y += (y - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function ParticleCloud({ className = "", count = 22000 }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [finalCount, setFinalCount] = useState(count);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    setReduceMotion(rm);
    setFinalCount(Math.round(count * (mobile ? 0.4 : 1)));
    setResolved(true);
  }, [count]);

  if (!resolved) return null;

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
      >
        <Cloud count={finalCount} reduceMotion={reduceMotion} />
        {!reduceMotion && <CameraRig />}
        <EffectComposer>
          <Bloom
            intensity={1.15}
            luminanceThreshold={0.05}
            luminanceSmoothing={0.4}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
