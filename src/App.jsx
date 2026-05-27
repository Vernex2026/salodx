import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Pipeline from "./components/Pipeline";
import InfiniteCloud from "./components/InfiniteCloud";
import Manifesto from "./components/Manifesto";
import Terminal from "./components/Terminal";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { ParticleCloud } from "./components/decorative/ParticleCloud";

// Below-the-fold + on-demand surfaces — defer load so initial paint
// (Hero) ships less JS. CommandPalette only mounts a pill after
// 800ms anyway; AIPanel is the 4th section.
const AIPanel = lazy(() => import("./components/AIPanel"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));

export default function App() {
  return (
    <ErrorBoundary>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Przejdź do treści
      </a>

      {/* v15 — Global Big Bang ParticleCloud: scroll-aware narrator.
          Implosion → explosion → river → coalescence into V logo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "#00030a" }}
      >
        <ParticleCloud className="absolute inset-0" />
      </div>

      <Nav />

      <main className="relative z-10 h-screen w-screen overflow-y-scroll snap-y snap-proximity overscroll-y-none">
        <Hero />
        <Pipeline />
        <InfiniteCloud />
        <Suspense fallback={null}>
          <AIPanel />
        </Suspense>
        <Manifesto />
        <Terminal />
      </main>

      <Footer />

      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>

      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}
