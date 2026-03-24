import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import CTA from "@/components/CTA";

export default function Page() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Services />
      <About />
      <CTA />
    </main>
  );
}
