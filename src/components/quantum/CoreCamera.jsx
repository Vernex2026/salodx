import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CoreCamera({ frozen }) {
  const { camera } = useThree();
  const scrollProgress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const section = document.querySelector(".quantum-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      const scrolled = -rect.top;
      scrollProgress.current = THREE.MathUtils.clamp(
        scrolled / Math.max(total, 1),
        0,
        1
      );
    };
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useFrame(() => {
    if (frozen) return;
    const targetZ = 14 - scrollProgress.current * 22;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    const targetRotX = pointer.current.y * 0.12;
    const targetRotY = pointer.current.x * 0.12;
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX, 0.05);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotY, 0.05);
  });

  return null;
}
