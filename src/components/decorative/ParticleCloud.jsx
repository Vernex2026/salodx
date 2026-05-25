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
  uniform float uIntensity;
  uniform float uBurst;
  uniform vec3  uBurstOrigin;
  attribute float size;
  attribute vec3 customColor;
  attribute vec3 aTargetPos;

  varying vec3  vColor;
  varying float vPulse;
  varying float vCoalesce;
  varying float vIntensity;
  varying float vBurst;

  void main() {
    vColor = customColor;
    vIntensity = uIntensity;
    vBurst = uBurst;
    vec3 pos = position;

    // Wave deform — amplified by overdrive intensity when agent is typed
    float wave = sin(pos.y * 1.5 + uTime * 1.2 * uIntensity) *
                 cos(pos.z * 2.0 + uTime * 0.8 * uIntensity);
    pos.x += wave * 0.6 * uIntensity;
    pos.z -= wave * 0.6 * uIntensity;

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

    // v28 BURST — one-shot trigger on "Wyślij brief" submit.
    // uBurst encodes both phase (0..1 implode, 1..0 blast) AND amplitude:
    //   actual progress in JS = monotonic 0..1 over ~700ms
    //   shader uBurst is amplitude (0..1) lerped from progress curve
    // We use uBurst as a single "intensity" — implode strength = uBurst,
    // blast distance = uBurst * (1 - smoothstep) past peak in JS-side.
    if (uBurst > 0.001) {
      vec3 burstDir = normalize(finalPos - uBurstOrigin + vec3(0.001));
      // Implode toward origin proportional to uBurst (max 70% suction)
      vec3 imploded2 = mix(finalPos, uBurstOrigin, uBurst * 0.7);
      finalPos = imploded2;
    }

    // Pulse: frequency rises with overdrive, amplitude grows too
    vPulse = 0.6 + 0.4 * sin(uTime * 4.0 * uIntensity + finalPos.y * 5.0);
    // Brightness boost na implosion peak
    float brightBoost = 1.0 + implodeAmt * (1.0 - explodeAmt) * 1.5;
    vPulse *= brightBoost;
    // Overdrive adds bloom (saturation handled in fragment via vIntensity)
    vPulse *= (1.0 + (uIntensity - 1.0) * 0.55);
    // Burst flash — particles glow brighter during the implode peak
    vPulse *= (1.0 + uBurst * 1.8);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    float sizeBoost = mix(1.0, 1.25, clamp(uIntensity - 1.0, 0.0, 1.5));
    float burstSize = 1.0 + uBurst * 0.8;
    gl_PointSize = size * (50.0 / -mvPosition.z) * (1.0 + wave * 0.3) * sizeBoost * burstSize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vPulse;
  varying float vCoalesce;
  varying float vIntensity;
  varying float vBurst;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.42, d);
    // Mint accent na coalescence
    vec3 mintAccent = vec3(0.0, 0.9, 0.6);
    vec3 finalColor = mix(vColor, mintAccent, vCoalesce * 0.85);
    // Overdrive: shift toward cyan + amber bloom when agent is typed at
    vec3 overdrive = vec3(0.2, 1.4, 2.6);
    float od = clamp(vIntensity - 1.0, 0.0, 1.5);
    finalColor = mix(finalColor, overdrive, od * 0.35);
    // Burst — saturate to bright cyan flash (60% mix at peak)
    vec3 burstColor = vec3(0.4, 1.8, 3.0);
    finalColor = mix(finalColor, burstColor, vBurst * 0.6);
    gl_FragColor = vec4(finalColor, core * vPulse);
  }
`;

function QuantumCore({ count, reduceMotion }) {
  const materialRef = useRef(null);
  const groupRef = useRef(null);
  const scrollRef = useRef(0);
  const intensityTargetRef = useRef(1.0);
  const intensityRef = useRef(1.0);
  // v28 burst — one-shot "Wyślij brief" particle implosion.
  // burstStartRef === null means idle; otherwise = elapsedTime when fired.
  const burstStartRef = useRef(null);
  const burstOriginRef = useRef([0, 0, 0]);
  const BURST_DURATION = 0.7; // seconds, total implode + decay envelope

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
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntensity: { value: 1.0 },
      uBurst: { value: 0 },
      uBurstOrigin: { value: new THREE.Vector3(0, 0, 0) },
    }),
    []
  );

  // Kinetic feedback: CommandPalette dispatches "vernex:typing" — particles
  // shift to overdrive (faster wave, brighter pulse, cyan bloom) while user
  // is typing; lerp smoothly back to idle when typing pauses.
  useEffect(() => {
    const onTyping = (e) => {
      const active = !!(e.detail && e.detail.active);
      intensityTargetRef.current = active ? 2.4 : 1.0;
    };
    window.addEventListener("vernex:typing", onTyping);
    return () => window.removeEventListener("vernex:typing", onTyping);
  }, []);

  // v28 burst: Terminal "Wyślij brief" submit triggers one-shot implode.
  // Origin in world coords (default: middle of viewport ~ (0, -2, 0)
  // since Terminal sits in lower half of screen).
  useEffect(() => {
    const onBurst = (e) => {
      const o = (e.detail && e.detail.origin) || [0, -2, 0];
      burstOriginRef.current = o;
      burstStartRef.current = performance.now() / 1000;
    };
    window.addEventListener("vernex:burst", onBurst);
    return () => window.removeEventListener("vernex:burst", onBurst);
  }, []);

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
    // Lerp intensity toward typing target — fast attack (0.12), slow release
    const iCur = intensityRef.current;
    const iTgt = intensityTargetRef.current;
    const lerpRate = iTgt > iCur ? 0.12 : 0.05;
    intensityRef.current = iCur + (iTgt - iCur) * lerpRate;

    // Burst envelope: implode 0→1 over first 0.25s, decay 1→0 over rest
    let burstAmp = 0;
    if (burstStartRef.current !== null) {
      const tNow = performance.now() / 1000;
      const elapsed = tNow - burstStartRef.current;
      if (elapsed < BURST_DURATION) {
        const p = elapsed / BURST_DURATION;
        // Triangle: ramp up to 1 at 35% then ease back to 0
        burstAmp = p < 0.35
          ? p / 0.35
          : 1.0 - ((p - 0.35) / 0.65);
        burstAmp = Math.max(0, Math.min(1, burstAmp));
      } else {
        burstStartRef.current = null;
      }
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uIntensity.value = intensityRef.current;
      materialRef.current.uniforms.uBurst.value = burstAmp;
      const o = burstOriginRef.current;
      materialRef.current.uniforms.uBurstOrigin.value.set(o[0], o[1], o[2]);
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
