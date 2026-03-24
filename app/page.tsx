import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Problems from "@/components/Problems";
import About from "@/components/About";
import Treatments from "@/components/Treatments";
import Standards from "@/components/Standards";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Marquee variant="cream" />
      <Problems />
      <Marquee variant="cream" />
      <About />
      <Treatments />
      <Standards />
      <CTA />
      <Marquee variant="gold" />
      <Footer />
    </main>
  );
}
