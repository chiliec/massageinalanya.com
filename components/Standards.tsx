import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function Standards({ locale = "en" }: { locale?: Locale }) {
  const s = t("standards", locale);

  return (
    <section className="bg-cream-light py-20 px-6 lg:px-[150px] overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute -left-16 top-32 w-[266px] h-[266px] rounded-full border border-brown/5 hidden lg:block" />
      <div className="absolute -right-16 bottom-16 w-[266px] h-[266px] rounded-full border border-brown/5 hidden lg:block" />

      {/* Section header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
          {s.heading}
        </h2>
        <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown mt-2">
          {s.headingItalic}
        </p>
      </div>

      {/* Standards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {s.cards.map((card) => (
          <div key={card.number} className="flex flex-col gap-4">
            <span className="font-serif text-[96px] leading-none text-brown">
              {card.number}
            </span>
            <h3 className="text-[36px] font-medium leading-tight tracking-tight text-brown">
              {card.title}
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brown">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
