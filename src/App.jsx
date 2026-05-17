import Nav from "./components/Nav";
import PromoTicker from "./components/PromoTicker";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import TopPromos from "./components/TopPromos";
import Stats from "./components/Stats";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import NewsletterCTA from "./components/NewsletterCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      {/* Skip link — a11y */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-ink)] focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Przejdź do treści
      </a>

      <Nav />
      <PromoTicker />

      <main>
        <Hero />
        <TrustStrip />
        <TopPromos />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <NewsletterCTA />
      </main>

      <Footer />
    </>
  );
}
