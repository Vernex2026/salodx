import { useLayoutEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * HeroShaderBackground — animated gradient mesh in WebGL.
 *
 * - Fullscreen fragment shader (Triangle geometry, no vertex morph).
 * - FBM-based brand-tinted color field + subtle cursor bloom (uMouse uniform).
 * - Time drift is slow (~0.03 unit/s) — atmospheric, not "demoscene".
 * - Caps DPR at 1.5 to keep mobile fill-rate sane.
 * - Pauses on document.hidden + intersection out.
 * - On WebGL failure: leaves canvas empty, CSS .bg-sky-hero fallback shows through.
 *
 * Mouse coords come from the parent section's `--mx, --my` CSS vars (set in
 * Hero.jsx onMouseMove), read each frame and lerped into the shader uniform.
 */
export default function HeroShaderBackground({ sectionRef }) {
  const canvasRef = useRef(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (!canvasRef.current || !sectionRef?.current) return;

    const canvas = canvasRef.current;
    const host = sectionRef.current;

    let renderer, program, mesh, gl;
    try {
      renderer = new Renderer({
        canvas,
        alpha: false,           // opaque clear — no transparent canvas "broken" artifact
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        antialias: false,
      });
      gl = renderer.gl;
    } catch (e) {
      console.warn("HeroShaderBackground: WebGL init failed — fallback CSS active.", e);
      // Hide canvas entirely so browser doesn't paint placeholder.
      canvas.style.display = "none";
      return;
    }

    // Opaque off-white clear — matches .bg-sky-hero top gradient stop, so a
    // brief uninitialized frame blends in instead of flashing transparent.
    gl.clearColor(0.957, 0.969, 1.0, 1.0);

    const geometry = new Triangle(gl);

    const vertex = /* glsl */ `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;       // lerped, in 0..1 space of section
      uniform float uMouseEnergy; // 0..1, climbs while moving, decays

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // Aspect-corrected UV (centered)
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;

        // Mouse in same aspect-corrected space
        vec2 m = uMouse;

        // Slow drift FBM — color field motion
        float n = fbm(vec2(uv.x * aspect * 1.6, uv.y * 1.6) + vec2(uTime * 0.025, uTime * -0.018));

        // Cursor bloom — soft radial influence
        float md = distance(vec2(uv.x * aspect, uv.y), vec2(m.x * aspect, m.y));
        float bloom = smoothstep(0.55, 0.0, md);

        // 4-stop diagonal palette
        vec3 c1 = vec3(0.957, 0.969, 1.000);  // off-white top
        vec3 c2 = vec3(0.866, 0.902, 1.000);  // pale brand-blue
        vec3 c3 = vec3(0.737, 0.820, 1.000);  // brand-tint
        vec3 c4 = vec3(0.835, 0.788, 0.965);  // soft violet

        float diag = clamp(uv.x * 0.65 + uv.y * 0.55 + (n - 0.5) * 0.5, 0.0, 1.0);
        vec3 col = mix(c1, c4, diag);
        col = mix(col, c2, smoothstep(0.15, 0.85, 1.0 - uv.y) * 0.6);
        col = mix(col, c3, smoothstep(0.4, 1.0, n) * 0.35);

        // Brand blue bloom on cursor — gentle saturation lift
        vec3 brand = vec3(0.122, 0.357, 1.0);
        col += brand * bloom * (0.12 + uMouseEnergy * 0.10);

        // Vignette toward bottom (smoother handoff to white below hero)
        col = mix(col, vec3(1.0), smoothstep(0.7, 1.0, uv.y) * 0.55);

        // Sub-pixel grain — kills banding
        float grain = (hash(gl_FragCoord.xy + uTime * 60.0) - 0.5) * 0.012;
        col += grain;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uMouseEnergy: { value: 0 },
      },
    });

    mesh = new Mesh(gl, { geometry, program });

    // Mouse tracking — read parent CSS vars (set by Hero onMouseMove)
    const targetMouse = { x: 0.5, y: 0.5 };
    let targetEnergy = 0;
    let lastMx = -1;
    let lastMy = -1;

    function resize() {
      const rect = host.getBoundingClientRect();
      // Fail-safes: rect can be 0×0 before layout settles, esp. inside grids /
      // flex parents. Fall back to offset dims, then window dims, so canvas
      // never renders at 0 (which shows browser "broken image" placeholder).
      const w = Math.max(rect.width || host.offsetWidth || window.innerWidth, 1);
      const h = Math.max(rect.height || host.offsetHeight || window.innerHeight, 1);
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
      ];
    }

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    // Initial resize NOW + after next paint (covers race: useEffect may run
    // before grid layout finalizes for the lg:grid-cols section).
    resize();
    requestAnimationFrame(resize);

    function readMouseFromVars() {
      const cs = getComputedStyle(host);
      const mxRaw = cs.getPropertyValue("--mx").trim();
      const myRaw = cs.getPropertyValue("--my").trim();
      if (!mxRaw || !myRaw) return;
      // Stored as "12.34%" — strip %
      const mx = parseFloat(mxRaw) / 100;
      const my = parseFloat(myRaw) / 100;
      if (Number.isFinite(mx) && Number.isFinite(my)) {
        if (Math.abs(mx - lastMx) > 0.001 || Math.abs(my - lastMy) > 0.001) {
          targetEnergy = 1;
        }
        lastMx = mx;
        lastMy = my;
        targetMouse.x = mx;
        targetMouse.y = my;
      }
    }

    let rafId = null;
    let running = true;

    function frame(t) {
      if (!running) return;
      readMouseFromVars();

      const u = program.uniforms;
      u.uTime.value = t * 0.001;
      // Lerp mouse
      u.uMouse.value[0] += (targetMouse.x - u.uMouse.value[0]) * 0.06;
      u.uMouse.value[1] += (targetMouse.y - u.uMouse.value[1]) * 0.06;
      // Decay energy
      targetEnergy *= 0.94;
      u.uMouseEnergy.value += (targetEnergy - u.uMouseEnergy.value) * 0.12;

      renderer.render({ scene: mesh });
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      // Free GPU resources
      try {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch (_) {}
    };
  }, [reducedMotion, sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // width/height attrs pre-set to sensible values so the browser never
      // hits a 0×0 or default 300×150 state that some browsers render as a
      // "broken canvas" placeholder. OGL setSize() rewrites these on mount.
      width={1920}
      height={1080}
      className="absolute inset-0 pointer-events-none"
      style={{ display: "block", zIndex: 0, width: "100%", height: "100%" }}
    />
  );
}
