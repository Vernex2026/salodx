import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const PARTICLE_COUNT = 6000;
const RING_RADIUS = 7.8;
const RING_THICKNESS = 0.7;

export function NebulaRing({ frozen }) {
  const meshRef = useRef();
  const noise = useMemo(() => createNoise3D(), []);

  const baseAngles = useMemo(() => {
    const a = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      a[i] = Math.random() * Math.PI * 2;
    }
    return a;
  }, []);

  const baseOffsets = useMemo(() => {
    const o = new Float32Array(PARTICLE_COUNT * 2);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      o[i * 2] = (Math.random() - 0.5) * RING_THICKNESS;
      o[i * 2 + 1] = (Math.random() - 0.5) * RING_THICKNESS * 0.4;
    }
    return o;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (frozen) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = baseAngles[i] + t * 0.04;
      const noiseVal = noise(
        Math.cos(theta) * 0.5,
        Math.sin(theta) * 0.5,
        t * 0.25
      );
      const r = RING_RADIUS + baseOffsets[i * 2] + noiseVal * RING_THICKNESS * 0.6;
      const y = baseOffsets[i * 2 + 1] + noiseVal * RING_THICKNESS * 0.4;
      dummy.position.set(r * Math.cos(theta), y, r * Math.sin(theta));
      const s = 0.022 + Math.abs(noiseVal) * 0.025;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#00E5FF" toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}
