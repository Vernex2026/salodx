import { useEffect, useState } from "react";

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? y / docH : 0;
      // Show after 30% scroll, hide near footer (>92%)
      const show = pct > 0.3 && pct < 0.92;
      // Hide on scroll-up if already shown
      if (y < lastY - 4) setVisible(false);
      else if (show) setVisible(true);
      else if (!show) setVisible(false);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <div className="mobile-cta md:hidden" data-visible={visible} aria-hidden={!visible}>
      <a
        href="#promocje"
        className="cta-primary cta-primary--light flex w-full items-center justify-center text-[14.5px]"
        style={{ padding: "14px 24px" }}
      >
        Zobacz dzisiejsze oferty
        <svg
          className="arrow"
          aria-hidden="true"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
