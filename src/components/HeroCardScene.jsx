import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  PerspectiveCamera,
} from "@react-three/drei";
import BankCard3D from "./BankCard3D";

/* ──────────────────────────────────────────────────────────
   HeroCardScene — R3F Canvas with three floating bank cards.

   Lighting is a classic three-point product-shot rig:
     • ambient fill (cool, low intensity)
     • key directional from upper right (warm)
     • fill directional from left (cool tint)
     • rim point light from below for premium edge highlight

   No HDRI environment (would require an external CDN fetch that
   is blocked in the offline sandbox and at strict CSP setups);
   the four-light rig + clearcoat material already produce a clean
   premium read. ContactShadows below the cards anchors the
   composition to a soft floor — without it the cards feel like
   stickers.
   ────────────────────────────────────────────────────────── */

export default function HeroCardScene() {
  return (
    <div className="hero-scene">
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows="soft"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5.4]} fov={34} />

        {/* Three-point rig — bumped up because we have no HDRI env */}
        <ambientLight intensity={0.95} color="#FFFFFF" />
        <directionalLight
          position={[3.5, 4, 5]}
          intensity={2.4}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-3.5, 2, 3]}
          intensity={1.2}
          color="#B8C5FF"
        />
        <pointLight position={[0, -2.2, 3]} intensity={0.95} color="#FFFFFF" />
        <pointLight position={[2, 1, -1.5]} intensity={0.6} color="#FFB07A" />

        {/* Procedural environment — Lightformers act as virtual area
            lights that bake into the cubemap for material reflections.
            No external HDRI fetch, so works in any sandbox / strict CSP. */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#FFFFFF"
            position={[2.5, 2.2, 2.0]}
            scale={[3, 1.4, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={1.4}
            color="#B8C5FF"
            position={[-3, 1.5, 1.8]}
            scale={[2.4, 1.2, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={0.8}
            color="#FFB07A"
            position={[0, -1.6, 1.8]}
            scale={[3, 1, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="ring"
            intensity={0.6}
            color="#FFFFFF"
            position={[0, 2.6, -1.0]}
            scale={2}
            target={[0, 0, 0]}
          />
        </Environment>

        {/* Three bank cards — gentle fan spread. Rotation is slow +
            every card has a different rotationOffset so they always
            read as facing the camera with subtle tilt. Spread is
            tuned to fit inside the right-column canvas without
            mutual occlusion. */}
        <BankCard3D
          bank="Santander"
          position={[-1.20, 0.45, -0.10]}
          rotation={[-0.10, 0, -0.07]}
          scale={0.92}
          floatSpeed={0.95}
          rotateSpeed={0.05}
          rotationOffset={-0.42}
        />
        <BankCard3D
          bank="mBank"
          position={[0.05, -0.15, 0.50]}
          rotation={[-0.04, 0, 0.02]}
          scale={1.05}
          floatSpeed={1.20}
          rotateSpeed={0.04}
          rotationOffset={0.04}
        />
        <BankCard3D
          bank="ING"
          position={[1.25, 0.35, -0.05]}
          rotation={[-0.08, 0, 0.06]}
          scale={0.92}
          floatSpeed={1.40}
          rotateSpeed={0.06}
          rotationOffset={0.40}
        />

        {/* Soft ground shadow */}
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.55}
          scale={6}
          blur={2.4}
          far={1.8}
          resolution={512}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
