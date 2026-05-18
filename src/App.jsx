import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TopPromos from "./components/TopPromos";
import HowItWorks from "./components/HowItWorks";
import TrustBlock from "./components/TrustBlock";
import Footer from "./components/Footer";
import MobileStickyCTA from "./components/MobileStickyCTA";
import CursorBlob from "./components/CursorBlob";

export default function App() {
  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Przejdź do treści
      </a>

      {/* Apple Vision Pro signature ambient light follower */}
      <CursorBlob />

      <Nav />

      <main>
        <Hero />
        <TopPromos />
        <HowItWorks />
        <TrustBlock />
      </main>

      <Footer />

      <MobileStickyCTA />
    </>
  );
}
