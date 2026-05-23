import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { NebulaRing } from "./quantum/NebulaRing";
import { CoreBlocksRing } from "./quantum/CoreBlocksRing";
import { CoreCamera } from "./quantum/CoreCamera";
import { QuantumCoreFallback } from "./quantum/QuantumCoreFallback";

function useShouldRender3D() {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      const isMobile = window.innerWidth < 768;
      setShouldRender(!isMobile && !mqReduce.matches);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    mqReduce.addEventListener?.("change", check);
    return () => {
      window.removeEventListener("resize", check);
      mqReduce.removeEventListener?.("change", check);
    };
  }, []);

  return shouldRender;
}

export default function QuantumCore() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const shouldRender3D = useShouldRender3D();

  if (!shouldRender3D) {
    return (
      <section className="quantum-section quantum-section--fallback">
        <QuantumCoreFallback />
      </section>
    );
  }

  return (
    <section className="quantum-section" aria-label="Vernex Core">
      <div className="quantum-canvas-wrap">
        <Canvas
          className="quantum-canvas"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0, 14], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor("#00030a", 1);
          }}
        >
          <Suspense fallback={null}>
            <CoreCamera frozen={hoverIndex !== null} />
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 0, 0]} intensity={2.4} color="#00E5A0" distance={20} decay={2} />
            <pointLight position={[0, 6, 6]} intensity={0.6} color="#00E5FF" />
            <NebulaRing frozen={hoverIndex !== null} />
            <CoreBlocksRing hoverIndex={hoverIndex} onHover={setHoverIndex} />
          </Suspense>
        </Canvas>
        <div className="quantum-overlay">
          <span className="quantum-overlay-badge">[ VERNEX // CORE ]</span>
          <h2 className="quantum-overlay-title">Wchodzisz do środka</h2>
          <p className="quantum-overlay-sub">
            Sześć systemów krąży wokół rdzenia. Najedź — wszystko zamiera. Scrolluj — przelatujesz przez nie.
          </p>
        </div>
      </div>
    </section>
  );
}
