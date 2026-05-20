import { useEffect, useRef } from "react";

/* FlowingLightBackground — section-wide iridescent video ribbon.
   Sits absolutely behind the section's content (-z-10), autoplay +
   muted + loop + playsInline + IntersectionObserver pause-when-hidden.
   `prefers-reduced-motion` swaps the video for a static CSS gradient
   so vestibular-sensitive users still see the same color story but
   without motion.

   v13 added scale / position / speed / preload props so the same
   asset can run different intensities in different sections (hero
   gets bigger + slower + priority preload; section 1 keeps default
   + lazy preload). */

export default function FlowingLightBackground({
  className = "",
  opacity = 0.85,
  blendMode = "screen",
  scale = 1.1,
  position = "center",
  speed = 1.0,
  preload = "metadata",
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;
    const applySpeed = () => {
      if (Number.isFinite(speed) && speed > 0) {
        video.playbackRate = speed;
      }
    };
    if (video.readyState >= 1) applySpeed();
    else video.addEventListener("loadedmetadata", applySpeed, { once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", applySpeed);
    };
  }, [speed]);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sizePct = `${scale * 100}%`;

  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            opacity,
            mixBlendMode: blendMode,
            background: `
              radial-gradient(60% 50% at 30% 50%, rgba(123, 92, 255, 0.55) 0%, transparent 60%),
              radial-gradient(50% 40% at 65% 55%, rgba(0, 229, 255, 0.45) 0%, transparent 55%),
              radial-gradient(40% 35% at 80% 45%, rgba(255, 30, 200, 0.30) 0%, transparent 55%)
            `,
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{
          width: sizePct,
          height: sizePct,
          objectPosition: position,
          opacity,
          mixBlendMode: blendMode,
          filter: "saturate(115%) brightness(95%)",
        }}
      >
        <source src="/decorative/flowing-light.webm" type="video/webm" />
        <source src="/decorative/flowing-light.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
