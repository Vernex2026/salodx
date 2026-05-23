import Nav from "./components/Nav";
import Hero from "./components/Hero";
import InfiniteCloud from "./components/InfiniteCloud";
import Manifesto from "./components/Manifesto";
import Terminal from "./components/Terminal";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import { ParticleCloud } from "./components/decorative/ParticleCloud";

export default function App() {
  return (
    <>
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

      <main className="relative z-10">
        <Hero />
        <InfiniteCloud />
        <Manifesto />
        <Terminal />
      </main>

      <Footer />

      <CommandPalette />
    </>
  );
}
