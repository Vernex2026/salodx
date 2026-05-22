import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ParticleCloud — wave-deformed plasma core (v15 "QuantumCore").
 *
 * Owner verdict on v14 (assembly + diamond shell): "perfekcyjny przez
 * to martwy, sztywny plastik". v15 hands the GPU the time uniform and
 * lets it bend space via a continuous trigonometric force field:
 *   - Vertex shader: pos.x/z deformed by sin(pos.y) * cos(pos.z) * uTime
 *   - vPulse: per-particle brightness + size pulsation via sin(uTime)
 *   - Hot-white core (rgb 3,3,3) blown out by double Bloom
 *   - Outer particles in supersaturated blue (0.1, 0.4, 2.5) /
 *     cyan (0.0, 1.8, 2.5)
 *   - Group rotation lerps toward mouse pointer + auto-spin
 *   - Vertical spindle target (narrow at y=0, wide at |y|=8) — the
 *     bright core sits exactly where the headline overlays
 *
 * Default 75 000 particles. Mobile (<768px) auto-reduces to 40% (30k).
 * prefers-reduced-motion freezes uTime + skips parallax + auto-spin.
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  attribute float size;
  attribute vec3 customColor;
  attribute vec3 aTargetPos;

  varying vec3  vColor;
  varying float vPulse;
  varying float vCoalesce;

  void main() {
    vColor = customColor;
    vec3 pos = position;

    float wave = sin(pos.y * 1.5 + uTime * 1.2) *
                 cos(pos.z * 2.0 + uTime * 0.8);
    pos.x += wave * 0.6;
    pos.z -= wave * 0.6;

    // v15 Big Bang phase compute
    float phase = clamp(uScroll, 0.0, 4.0);
    float implodeAmt = smoothstep(0.0, 1.0, phase);
    float explodeAmt = smoothstep(1.0, 2.0, phase);
    float riverAmt = smoothstep(2.0, 3.0, phase);
    float coalesceAmt = smoothstep(3.0, 4.0, phase);
    vCoalesce = coalesceAmt;

    // Phase 1: implosion toward (0,0,0)
    vec3 imploded = mix(pos, vec3(0.0), implodeAmt);
    // Phase 2: explosion shockwave outward
    vec3 outDir = normalize(pos + vec3(0.001));
    vec3 exploded = mix(imploded, pos + outDir * 8.0, explodeAmt);
    // Phase 3: river drift downward
    vec3 river = exploded + vec3(0.0, -4.0 * riverAmt, 0.0);
    // Phase 4: coalesce toward V logo target
    vec3 finalPos = mix(river, aTargetPos, coalesceAmt);

    vPulse = 0.6 + 0.4 * sin(uTime * 4.0 + finalPos.y * 5.0);
    // Brightness boost na implosion peak
    float brightBoost = 1.0 + implodeAmt * (1.0 - explodeAmt) * 1.5;
    vPulse *= brightBoost;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = size * (50.0 / -mvPosition.z) * (1.0 + wave * 0.3);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vPulse;
  varying float vCoalesce;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.42, d);
    // Mint accent na coalescence
    vec3 mintAccent = vec3(0.0, 0.9, 0.6);
    vec3 finalColor = mix(vColor, mintAccent, vCoalesce * 0.85);
    gl_FragColor = vec4(finalColor, core * vPulse);
  }
`;

function QuantumCore({ count, reduceMotion }) {
  const materialRef = useRef(null);
  const groupRef = useRef(null);
  const scrollRef = useRef(0);

  const [positions, colors, sizes, targets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const tgt = new Float32Array(count * 3);

    const colorCore = new THREE.Color(3.0, 3.0, 3.0);
    const colorBlue = new THREE.Color(0.1, 0.4, 2.5);
    const colorCyan = new THREE.Color(0.0, 1.8, 2.5);

    // V logo target positions — 2 strokes diagonally meeting w lewym
    // górnym rogu viewport (world coord ~(-5, 4, 0)).
    const stroke1Start = [-6.5, 5.0, 0];
    const stroke1End   = [-5.0, 2.5, 0];
    const stroke2Start = [-3.5, 5.0, 0];
    const stroke2End   = [-5.0, 2.5, 0];
    const half = Math.floor(count / 2);

    for (let i = 0; i < count; i += 1) {
      const y = (Math.random() - 0.5) * 16;
      const radius = (0.05 + Math.pow(Math.abs(y), 1.15)) * Math.random();
      const theta = Math.random() * Math.PI * 2;

      pos[i * 3]     = radius * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(theta);

      const isCore = Math.abs(y) < 2.5 && radius < 1.0;
      const finalColor = isCore
        ? colorCore
        : (Math.random() > 0.7 ? colorCyan : colorBlue);

      col[i * 3]     = finalColor.r;
      col[i * 3 + 1] = finalColor.g;
      col[i * 3 + 2] = finalColor.b;

      siz[i] = Math.random() * 2.0;

      // V logo target — per particle linear interpolation on stroke
      const isS1 = i < half;
      const t = (i % half) / half;
      const s = isS1 ? stroke1Start : stroke2Start;
      const e = isS1 ? stroke1End : stroke2End;
      const jitter = 0.10;
      tgt[i * 3]     = s[0] + (e[0] - s[0]) * t + (Math.random() - 0.5) * jitter;
      tgt[i * 3 + 1] = s[1] + (e[1] - s[1]) * t + (Math.random() - 0.5) * jitter;
      tgt[i * 3 + 2] = s[2] + (e[2] - s[2]) * t + (Math.random() - 0.5) * jitter;
    }
    return [pos, col, siz, tgt];
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 } }),
    []
  );

  // Big Bang scroll listener — map scrollY do uScroll phase (0..4)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      let phase;
      if (y < vh * 0.5) phase = (y / (vh * 0.5)) * 1.0;
      else if (y < vh) phase = 1.0 + ((y - vh * 0.5) / (vh * 0.5));
      else if (y < vh * 2) phase = 2.0 + ((y - vh) / vh);
      else if (y < vh * 3) phase = 3.0 + ((y - vh * 2) / vh);
      else phase = 4.0;
      scrollRef.current = phase;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    if (reduceMotion) return;
    const time = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      // Lerp uScroll uniform toward scrollRef target (smooth catch-up)
      const cur = materialRef.current.uniforms.uScroll.value;
      const target = scrollRef.current;
      materialRef.current.uniforms.uScroll.value = cur + (target - cur) * 0.08;
    }
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        time * 0.08 + targetX,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetY,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-customColor"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aTargetPos"
            count={count}
            array={targets}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </points>
    </group>
  );
}

export function ParticleCloud({ className = "", count = 75000 }) {
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
        camera={{ position: [0, 0, 9], fov: 60 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
      >
        <QuantumCore count={finalCount} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
