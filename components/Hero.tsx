import { getWhatsAppLink } from "@/lib/whatsapp";
import Image from "next/image";
import Star from "./Star";

export default function Hero() {
  const link = getWhatsAppLink();

  return (
    <section className="bg-gold relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-[150px] py-8">
        <span className="font-logo text-[26px] text-brown">LARISA.</span>

        <div className="hidden md:flex items-center gap-8 lg:gap-16">
          <div className="flex items-center gap-8 lg:gap-16 text-sm font-medium uppercase tracking-wide text-brown">
            <a href="#treatments" className="hover:opacity-70 transition-opacity">
              Treatments
            </a>
            <a href="#about" className="hover:opacity-70 transition-opacity">
              About
            </a>
            <a href="#reviews" className="hover:opacity-70 transition-opacity">
              Reviews
            </a>
            <a href="#contact" className="hover:opacity-70 transition-opacity">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2 border border-brown/20 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-brown">EN</span>
            <svg width="15" height="8" viewBox="0 0 15 8" fill="none" className="text-brown">
              <path d="M1 1L7.5 7L14 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col lg:flex-row px-6 lg:px-[150px] pb-20 pt-8">
        {/* Left column */}
        <div className="flex flex-col max-w-[725px] gap-8">
          <h1 className="text-4xl md:text-[70px] md:leading-[1.0] font-medium tracking-[-2.8px] text-brown">
            Professional Pain Relief & Functional Body Restoration
          </h1>

          <p className="font-serif italic text-4xl md:text-[70px] md:leading-[1.0] text-brown">
            in Alanya
          </p>

          <p className="text-base md:text-[20px] leading-[1.2] font-medium tracking-[-0.8px] text-brown max-w-[663px]">
            Clinical Manual Therapy, Applied Kinesiology, and Osteopathic
            Techniques. Restoring your freedom of movement without drugs or
            surgery.
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brown text-cream-light rounded-full px-8 py-5 w-fit text-sm font-medium uppercase hover:opacity-90 transition-opacity"
          >
            Book Now
            <Star className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Right column - hero image (desktop only) */}
      <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
        <Image
          src="/images/hero-therapist.webp"
          alt="Larisa — Clinical Therapist performing treatment"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute bottom-8 left-8 flex gap-2">
          <button
            className="w-[50px] h-[50px] rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
            aria-label="Previous image"
          >
            <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
              <path d="M7 1L1 7.5L7 14" stroke="#5f471d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="w-[50px] h-[50px] rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
            aria-label="Next image"
          >
            <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
              <path d="M1 1L7 7.5L1 14" stroke="#5f471d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile hero image */}
      <div className="lg:hidden relative w-full h-[400px]">
        <Image
          src="/images/hero-therapist.webp"
          alt="Larisa — Clinical Therapist performing treatment"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </section>
  );
}
