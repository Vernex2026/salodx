import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { getBankCardTextures } from "../lib/cardTextures";

/* ──────────────────────────────────────────────────────────
   BankCard3D — single floating credit card.

   Geometry layering:
     • A RoundedBox at ISO 7810 ID-1 ratio (1.586 × 1.0 × 0.045)
       provides the physical thickness — its 6 faces all use a
       solid dark material so the edge reads cleanly when seen
       from an angle.
     • A thin front plane sits ~0.001 unit above the +Z face
       with the brand canvas texture. This guarantees full-range
       UV mapping (RoundedBox UVs are not 0-1 over the front).
     • A thin back plane sits below the -Z face, rotated 180°
       around Y so its texture reads upright when the card flips.

   Material: meshPhysicalMaterial for plane faces (low metalness,
   high clearcoat) — premium plastic with a protective gloss.

   Motion: drei <Float> for organic drift, plus a manual Y-spin in
   useFrame at a speed unique to each card so the trio never feels
   synced. Window flag `__pauseR3F` halts the spin (used by
   screenshot tooling to capture a stable frame).
   ────────────────────────────────────────────────────────── */

const EDGE_COLOR = "#0E1118";
const HALF_DEPTH = 0.0225; // half of box depth (0.045)
const PLANE_OFFSET = 0.0008; // tiny lift above each face

export default function BankCard3D({
  bank = "mBank",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatSpeed = 1.2,
  rotateSpeed = 0.06,
  rotationOffset = 0,
}) {
  const groupRef = useRef(null);
  const { front, back } = useMemo(() => getBankCardTextures(bank), [bank]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (typeof window !== "undefined" && window.__pauseR3F) return;
    groupRef.current.rotation.y += delta * rotateSpeed;
  });

  return (
    <Float
      floatIntensity={0.32}
      rotationIntensity={0.10}
      speed={floatSpeed}
      position={position}
    >
      <group
        ref={groupRef}
        rotation={[rotation[0], rotation[1] + rotationOffset, rotation[2]]}
        scale={scale}
      >
        {/* Thickness shell — edges only */}
        <RoundedBox
          args={[1.586, 1.0, HALF_DEPTH * 2]}
          radius={0.05}
          smoothness={5}
          creaseAngle={0.4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={EDGE_COLOR} metalness={0.18} roughness={0.55} />
        </RoundedBox>

        {/* Front face — bank brand, with subtle iridescence for an
            Apple-like holographic refleks on rotation */}
        <mesh position={[0, 0, HALF_DEPTH + PLANE_OFFSET]} castShadow>
          <planeGeometry args={[1.586, 1.0]} />
          <meshPhysicalMaterial
            map={front}
            metalness={0.10}
            roughness={0.28}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            iridescence={0.18}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[120, 480]}
            envMapIntensity={0.85}
          />
        </mesh>

        {/* Back face — Saldox brand, rotated 180° so its content reads
            upright when the card flips toward the camera */}
        <mesh
          position={[0, 0, -(HALF_DEPTH + PLANE_OFFSET)]}
          rotation={[0, Math.PI, 0]}
          castShadow
        >
          <planeGeometry args={[1.586, 1.0]} />
          <meshPhysicalMaterial
            map={back}
            metalness={0.08}
            roughness={0.40}
            clearcoat={0.70}
            clearcoatRoughness={0.15}
            envMapIntensity={0.70}
          />
        </mesh>
      </group>
    </Float>
  );
}
