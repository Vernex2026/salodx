import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import HeroOrbFallback from "./HeroOrbFallback";

const BANKS = [
  { letter: "m", color: "#E11D48" },  // mBank
  { letter: "S", color: "#DC2626" },  // Santander
  { letter: "I", color: "#F97316" },  // ING
  { letter: "P", color: "#1E40AF" },  // PKO
  { letter: "P", color: "#B91C1C" },  // Pekao
  { letter: "A", color: "#16A34A" },  // Alior
  { letter: "M", color: "#7C3AED" },  // Millennium
  { letter: "B", color: "#0EA5E9" },  // BNP
  { letter: "C", color: "#0891B2" },  // Citi
  { letter: "N", color: "#D97706" },  // Nest
  { letter: "T", color: "#DC2626" },  // Toyota Bank
  { letter: "V", color: "#16A34A" },  // VeloBank
  { letter: "R", color: "#1F2937" },  // Revolut
  { letter: "N", color: "#1A2942" },  // N26
  { letter: "B", color: "#EC4899" },  // Bunq
  { letter: "W", color: "#00B9FF" },  // Wise
  { letter: "C", color: "#EA580C" },  // Credit Agricole
  { letter: "V", color: "#7C2D12" },  // VW Bank
  { letter: "I", color: "#0F766E" },  // Inteligo
  { letter: "B", color: "#15803D" },  // BOŚ
  { letter: "A", color: "#1E3A8A" },  // Aion
  { letter: "P", color: "#92400E" },  // Provident
  { letter: "V", color: "#7E22CE" },  // Vivus
  { letter: "P", color: "#831843" },  // Plus Bank
];

/* Generate a single 1024×1024 atlas texture (6×4 grid) with all 24 bank
   monograms drawn from BankLogo colour/letter mapping. Generated once per
   orb mount via OffscreenCanvas + 2D Canvas — no PNG asset shipped. */
function useBankAtlas() {
  const [tex, setTex] = useState(null);

  useEffect(() => {
    const size = 1024;
    const cols = 6;
    const rows = 4;
    const tile = size / cols;
    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(size, size)
        : Object.assign(document.createElement("canvas"), { width: size, height: size });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    BANKS.forEach((bank, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * tile;
      const y = row * tile;
      const pad = tile * 0.10;

      // Rounded-rect tile background — bank brand colour with depth
      const r = tile * 0.16;
      ctx.save();
      const grad = ctx.createLinearGradient(x, y, x + tile, y + tile);
      grad.addColorStop(0, bank.color);
      grad.addColorStop(1, shade(bank.color, -0.35));
      ctx.fillStyle = grad;
      roundRect(ctx, x + pad, y + pad, tile - pad * 2, tile - pad * 2, r);
      ctx.fill();

      // Inner specular highlight strip
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      roundRect(ctx, x + pad + 4, y + pad + 4, tile - pad * 2 - 8, (tile - pad * 2) * 0.5, r * 0.85);
      ctx.fill();

      // Monogram letter (Instrument Serif italic style — fallback to serif italic)
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `italic 600 ${tile * 0.42}px "Instrument Serif", "Times New Roman", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(bank.letter, x + tile / 2, y + tile / 2 + tile * 0.03);
      ctx.restore();
    });

    let texture;
    if (typeof OffscreenCanvas !== "undefined" && canvas.transferToImageBitmap) {
      texture = new THREE.CanvasTexture(canvas);
    } else {
      texture = new THREE.CanvasTexture(canvas);
    }
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    setTex(texture);
    return () => texture.dispose();
  }, []);

  return tex;
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function shade(hex, amt) {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  let r = (num >> 16) + Math.round(255 * amt);
  let g = ((num >> 8) & 0xff) + Math.round(255 * amt);
  let b = (num & 0xff) + Math.round(255 * amt);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `rgb(${r},${g},${b})`;
}

/* ── Orbiting bank rings — 3 rings × 8 logos, instanced ─────────── */
function BankRing({ atlas, radius, count, speed, tilt = 0, yOffset = 0, sizeScale = 1, stride = 1 }) {
  const groupRef = useRef(null);
  const planeRefs = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed * delta;
    }
    // Each plane look-at-origin (camera-from-inside refraction look)
    planeRefs.current.forEach((p) => {
      if (p) p.lookAt(0, 0, 0);
    });
  });

  if (!atlas) return null;

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]} position={[0, yOffset, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const wobble = Math.sin(i * 1.7) * 0.08;
        const cols = 6;
        const rows = 4;
        const tileIdx = (i * stride) % (cols * rows);
        const col = tileIdx % cols;
        const row = Math.floor(tileIdx / cols);
        return (
          <mesh
            key={i}
            ref={(el) => (planeRefs.current[i] = el)}
            position={[x, wobble, z]}
            scale={[0.42 * sizeScale, 0.42 * sizeScale, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              transparent
              toneMapped={false}
              side={THREE.DoubleSide}
            >
              <primitive object={tileTexture(atlas, col, row, cols, rows)} attach="map" />
            </meshBasicMaterial>
          </mesh>
        );
      })}
    </group>
  );
}

/* Clone the atlas texture per-tile with UV offset/repeat. Memo-friendly via
   a cache so we don't allocate 24 textures every render. */
const _tileCache = new WeakMap();
function tileTexture(atlas, col, row, cols, rows) {
  let cache = _tileCache.get(atlas);
  if (!cache) {
    cache = new Map();
    _tileCache.set(atlas, cache);
  }
  const key = `${col},${row},${cols},${rows}`;
  let tex = cache.get(key);
  if (!tex) {
    tex = atlas.clone();
    tex.needsUpdate = true;
    tex.repeat.set(1 / cols, 1 / rows);
    tex.offset.set(col / cols, 1 - (row + 1) / rows);
    cache.set(key, tex);
  }
  return tex;
}

/* ── The glass orb itself + inner rings ──────────────────────────── */
function OrbScene({ parallaxRef }) {
  const orbGroupRef = useRef(null);
  const atlas = useBankAtlas();

  // Read parallax ref every frame, lerp toward target rotation
  const MAX_YAW = (8 * Math.PI) / 180; // 8°
  const MAX_PITCH = (4 * Math.PI) / 180;
  useFrame((state, delta) => {
    const g = orbGroupRef.current;
    if (!g) return;
    const targetX = (parallaxRef?.current?.y ?? 0) * MAX_PITCH;
    const targetY = (parallaxRef?.current?.x ?? 0) * MAX_YAW;
    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
  });

  return (
    <group ref={orbGroupRef}>
      {/* Inner orbiting bank rings (rendered behind the orb's refractive shell) */}
      <BankRing atlas={atlas} radius={0.62} count={8} speed={0.18}  tilt={0.10}  yOffset={0.06}  sizeScale={1.1} stride={1} />
      <BankRing atlas={atlas} radius={0.75} count={8} speed={-0.14} tilt={-0.20} yOffset={-0.04} sizeScale={1.0} stride={3} />
      <BankRing atlas={atlas} radius={0.85} count={8} speed={0.22}  tilt={0.32}  yOffset={0.02}  sizeScale={0.9} stride={2} />

      {/* The glass sphere — backside enabled for genuine refraction depth */}
      <mesh>
        <sphereGeometry args={[1.0, 96, 96]} />
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.0}
          transmission={1}
          ior={1.35}
          chromaticAberration={0.10}
          anisotropicBlur={0.2}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.08}
          color="#1A2942"
          backside
          samples={6}
          resolution={768}
          attenuationDistance={4.0}
          attenuationColor="#2D55FF"
        />
      </mesh>

      {/* Inner rim glow — adds the plasma underbelly to the orb */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          transparent
          opacity={0.10}
          color="#7B5CFF"
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ── Top-level wrapper — handles fallback gating + lazy Canvas mount ─── */
export default function HeroOrb({ enabled = true, parallaxRef }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Mobile + small tablets get the static fallback.
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    setShouldRender(true);
  }, [enabled]);

  if (!shouldRender) return <HeroOrbFallback />;

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.0], fov: 38 }}
        style={{ background: "transparent" }}
      >
        {/* 3-point coloured rig — no HDRI, all brand-palette light */}
        <ambientLight intensity={0.18} color="#0A0C14" />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#4D7CFF" />
        <directionalLight position={[-2, 1, -3]} intensity={0.8} color="#7B5CFF" />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#00E5FF" />

        <OrbScene parallaxRef={parallaxRef} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.5}
            radius={0.7}
          />
          <ChromaticAberration
            offset={[0.0015, 0.0012]}
            radialModulation
            modulationOffset={0.3}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
