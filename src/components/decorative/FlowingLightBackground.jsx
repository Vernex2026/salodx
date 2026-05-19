import { useEffect, useRef } from "react";

/* FlowingLightBackground — section-wide iridescent video ribbon.
   Sits absolutely behind the section's content (-z-10), autoplay +
   muted + loop + playsInline + IntersectionObserver pause-when-hidden.
   `prefers-reduced-motion` swaps the video for a static CSS gradient
   so vestibular-sensitive users still see the same color story but
   without motion. */

export default function FlowingLightBackground({
  className = "",
  opacity = 0.85,
  blendMode = "screen",
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;
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
    return () => observer.disconnect();
  }, []);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        preload="metadata"
        className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{
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
