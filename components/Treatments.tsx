import Image from "next/image";
import Star from "./Star";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const cardImages = [
  "/images/about-portrait.webp",
  "/images/service-4.webp",
  "/images/service-2.webp",
  "/images/service-3.webp",
];

export default function Treatments({ locale = "en" }: { locale?: Locale }) {
  const tr = t("treatments", locale);

  return (
    <section id="treatments" className="py-20 px-6 lg:px-[150px]">
      {/* Section header */}
      <div className="text-center mb-16">
        <Star className="w-[45px] h-[45px] text-brown mx-auto mb-6" />
        <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
          {tr.heading}
        </h2>
        <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown mt-2">
          {tr.headingItalic}
        </p>
        <p className="text-[20px] font-medium tracking-[-0.8px] text-brown mt-6">
          {tr.subtitle}
        </p>

        <a
          href="#treatments"
          className="inline-flex items-center gap-3 bg-gold-mid text-brown rounded-full px-8 py-5 text-sm font-medium uppercase hover:opacity-90 transition-opacity mt-8"
        >
          {tr.viewAll}
          <Star className="w-4 h-4" />
        </a>
      </div>

      {/* Treatment cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[700px] gap-y-12">
        {tr.cards.map((card, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center ${
              i % 2 === 1 ? "md:mt-40" : ""
            }`}
          >
            <div className="relative w-[390px] h-[560px] rounded-[190px] overflow-hidden mb-8">
              <Image
                src={cardImages[i]}
                alt={card.title}
                fill
                sizes="390px"
                className="object-cover"
              />
            </div>
            <h3 className="font-serif text-[32px] leading-tight text-brown mb-2">
              {card.title}
            </h3>
            <p className="text-[16px] font-medium text-brown mb-3 max-w-[390px]">
              {card.subtitle}
            </p>
            <p className="text-[18px] font-medium leading-relaxed text-brown max-w-[390px]">
              {card.description}
            </p>
            <Star className="w-5 h-5 text-brown mt-6" />
          </div>
        ))}
      </div>
    </section>
  );
}
