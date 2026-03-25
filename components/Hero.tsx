import { getWhatsAppLink } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
import Star from "./Star";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function Hero({ locale = "en" }: { locale?: Locale }) {
  const link = getWhatsAppLink();
  const nav = t("nav", locale);
  const hero = t("hero", locale);

  return (
    <section className="bg-gold">
      {/* Navigation — full width, always above the image */}
      <nav className="flex items-center justify-between px-6 sm:px-10 lg:px-[150px] py-6 lg:py-8">
        <Link href="/" className="font-logo text-[22px] sm:text-[26px] text-brown">
          LARISA.
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden text-brown" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-12 xl:gap-16">
          <div className="flex items-center gap-6 lg:gap-12 xl:gap-16 text-sm font-medium uppercase tracking-wide text-brown">
            <a href="#treatments" className="hover:opacity-70 transition-opacity">
              {nav.treatments}
            </a>
            <a href="#about" className="hover:opacity-70 transition-opacity">
              {nav.about}
            </a>
            <a href="#reviews" className="hover:opacity-70 transition-opacity">
              {nav.reviews}
            </a>
            <a href="#contact" className="hover:opacity-70 transition-opacity">
              {nav.contact}
            </a>
          </div>

          <LanguageSwitcher locale={locale} />
        </div>
      </nav>

      {/* Hero body — two-column grid, no overlap */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left column — text on gold */}
        <div className="flex flex-col gap-6 sm:gap-8 px-6 sm:px-10 lg:px-[150px] py-10 lg:py-16 xl:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[70px] leading-[1.05] font-medium tracking-tight lg:tracking-[-2.8px] text-brown break-words">
            {hero.heading}
          </h1>

          <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[70px] leading-[1.05] text-brown">
            {hero.headingItalic}
          </p>

          <p className="text-base sm:text-lg lg:text-[20px] leading-[1.3] font-medium tracking-[-0.4px] lg:tracking-[-0.8px] text-brown max-w-[663px]">
            {hero.description}
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brown text-cream-light rounded-full px-6 sm:px-8 py-4 sm:py-5 w-fit text-sm font-medium uppercase hover:opacity-90 transition-opacity"
          >
            {hero.cta}
            <Star className="w-4 h-4" />
          </a>
        </div>

        {/* Right column — image */}
        <div className="relative w-full aspect-[960/905] lg:aspect-auto lg:min-h-[500px] xl:min-h-[600px]">
          <Image
            src="/images/hero-therapist.webp"
            alt="Larisa — Clinical Therapist performing treatment"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1023px) 100vw, 50vw"
            priority
          />

          {/* Image navigation arrows */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <button
              className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
              aria-label="Previous image"
            >
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
                <path d="M7 1L1 7.5L7 14" stroke="#5f471d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
              aria-label="Next image"
            >
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
                <path d="M1 1L7 7.5L1 14" stroke="#5f471d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
