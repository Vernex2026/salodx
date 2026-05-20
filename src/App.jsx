import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Bento from "./components/Bento";
import Process from "./components/Process";
import Footer from "./components/Footer";

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
        <Bento />
        <Process />
      </main>

      <Footer />
    </>
  );
}
