import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function CoreBlock({ position, rotation, isHovered, onHover, onLeave, data }) {
  const meshRef = useRef();
  const targetZ = isHovered ? 1.4 : 0;

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      0.12
    );
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
      >
        <boxGeometry args={[2.4, 3.0, 0.18]} />
        <meshPhysicalMaterial
          color="#0a0f1a"
          transmission={0.55}
          roughness={0.18}
          thickness={0.35}
          ior={1.5}
          clearcoat={0.9}
          clearcoatRoughness={0.08}
          envMapIntensity={1.2}
          emissive={data.accent}
          emissiveIntensity={isHovered ? 0.35 : 0.04}
        />
      </mesh>
      <Html
        transform
        distanceFactor={5.5}
        position={[0, 0, 0.12]}
        style={{
          width: "200px",
          opacity: isHovered ? 1 : 0.88,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <div className="core-block-content">
          <div className="core-block-badge" style={{ color: data.accent }}>
            {data.stack}
          </div>
          <div className="core-block-title">{data.title}</div>
          {isHovered && (
            <div className="core-block-detail">{data.detail}</div>
          )}
        </div>
      </Html>
    </group>
  );
}
