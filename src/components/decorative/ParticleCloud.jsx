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
  attribute float size;
  attribute vec3 customColor;

  varying vec3  vColor;
  varying float vPulse;

  void main() {
    vColor = customColor;
    vec3 pos = position;

    float wave = sin(pos.y * 1.5 + uTime * 1.2) *
                 cos(pos.z * 2.0 + uTime * 0.8);
    pos.x += wave * 0.6;
    pos.z -= wave * 0.6;

    vPulse = 0.6 + 0.4 * sin(uTime * 4.0 + pos.y * 5.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (50.0 / -mvPosition.z) * (1.0 + wave * 0.3);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vPulse;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.42, d);
    gl_FragColor = vec4(vColor, core * vPulse);
  }
`;

function QuantumCore({ count, reduceMotion }) {
  const materialRef = useRef(null);
  const groupRef = useRef(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const colorCore = new THREE.Color(3.0, 3.0, 3.0);
    const colorBlue = new THREE.Color(0.1, 0.4, 2.5);
    const colorCyan = new THREE.Color(0.0, 1.8, 2.5);

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
    }
    return [pos, col, siz];
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (reduceMotion) return;
    const time = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
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
