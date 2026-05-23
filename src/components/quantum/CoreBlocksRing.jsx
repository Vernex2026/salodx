import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CoreBlock } from "./CoreBlock";
import { BLOCKS_DATA } from "./blocksData";

const RING_RADIUS = 4.6;

export function CoreBlocksRing({ hoverIndex, onHover }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    if (hoverIndex !== null) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {BLOCKS_DATA.map((data, i) => {
        const angle = (i / BLOCKS_DATA.length) * Math.PI * 2;
        const position = [
          RING_RADIUS * Math.cos(angle),
          0,
          RING_RADIUS * Math.sin(angle),
        ];
        const rotation = [0, -angle + Math.PI / 2, 0];
        return (
          <CoreBlock
            key={i}
            position={position}
            rotation={rotation}
            data={data}
            isHovered={hoverIndex === i}
            onHover={() => onHover(i)}
            onLeave={() => onHover(null)}
          />
        );
      })}
    </group>
  );
}
