import Image from "next/image";
import Star from "./Star";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const cardIcons = [
  "/images/review-avatar-1.webp",
  "/images/review-avatar-2.webp",
  "/images/review-avatar-3.webp",
  "/images/review-avatar-4.webp",
];

const cardOffsets = ["mt-0", "mt-16", "mt-32", "mt-48"];

export default function Problems({ locale = "en" }: { locale?: Locale }) {
  const p = t("problems", locale);

  return (
    <section className="py-20 px-6 lg:px-[150px]">
      {/* Section header */}
      <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
        <div className="max-w-[810px]">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4">
            {p.tag}
          </p>
          <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
            {p.heading}
          </h2>
          <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.2] text-brown mt-2">
            {p.headingItalic}
          </p>
        </div>

        {/* Decorative circle + portrait */}
        <div className="relative hidden lg:block w-[504px] h-[504px] shrink-0">
          <div className="absolute inset-0 rounded-full bg-cream-light" />
          <Star className="absolute -left-2 top-2 w-[150px] h-[150px] text-brown/10" />
          <div className="absolute right-4 top-4 w-[266px] h-[266px] rounded-full border border-brown/10" />
          <div className="absolute left-[90px] top-0 w-[325px] h-[490px] rounded-[45px] overflow-hidden">
            <Image
              src="/images/about-portrait.webp"
              alt="Larisa"
              fill
              sizes="325px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Tilde separator */}
      <p className="font-serif italic text-[64px] text-brown text-center mb-8">~</p>

      {/* Quote */}
      <div className="max-w-[680px] mx-auto text-center mb-16">
        <p className="text-[20px] font-medium tracking-[-0.8px] leading-[1.2] text-brown">
          {p.quote}
        </p>
        <p className="text-[20px] font-medium tracking-[-0.8px] text-brown mt-4">
          {p.quoteAuthor}
        </p>
      </div>

      {/* Condition cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {p.cards.map((c, i) => (
          <div key={i} className={`${cardOffsets[i]} lg:${cardOffsets[i]}`}>
            <div className="bg-cream-light rounded-[20px] p-6 flex flex-col items-center text-center border-t-2 border-brown/10">
              <div className="w-[99px] h-[99px] rounded-full overflow-hidden relative mb-6">
                <Image src={cardIcons[i]} alt={c.title} fill sizes="99px" className="object-cover" />
              </div>
              <h3 className="font-serif text-[32px] leading-tight text-brown mb-4">
                {c.title}
              </h3>
              <p className="text-[18px] font-medium leading-relaxed text-brown">
                {c.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
