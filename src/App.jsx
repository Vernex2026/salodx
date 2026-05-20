import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TopPromos from "./components/TopPromos";
import HowItWorks from "./components/HowItWorks";
import TrustBlock from "./components/TrustBlock";
import GeminiFeatureBlock from "./components/GeminiFeatureBlock";
import Footer from "./components/Footer";
import MobileStickyCTA from "./components/MobileStickyCTA";

export default function App() {
  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Przejdź do treści
      </a>

      <Nav />

      <main>
        <Hero />
        <HowItWorks />
        <TopPromos />
        <TrustBlock />
        <GeminiFeatureBlock />
      </main>

      <Footer />

      <MobileStickyCTA />
    </>
  );
}
