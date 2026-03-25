import Image from "next/image";
import Star from "./Star";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function About({ locale = "en" }: { locale?: Locale }) {
  const a = t("about", locale);

  return (
    <section id="about" className="bg-cream-light py-20 px-6 lg:px-[150px] overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-16 relative">
        {/* Left - Large image with decorative elements */}
        <div className="relative shrink-0">
          <Star className="absolute -left-24 bottom-0 w-[400px] h-[400px] text-brown/5 hidden lg:block" />
          <div className="absolute -right-8 -top-8 w-[266px] h-[266px] rounded-full border border-brown/10 hidden lg:block" />
          <div className="relative w-full lg:w-[564px] h-[600px] lg:h-[850px] overflow-hidden">
            <Image
              src="/images/about-large.webp"
              alt="Larisa performing clinical therapy"
              fill
              sizes="(max-width: 1023px) 100vw, 564px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right - Text content */}
        <div className="flex flex-col gap-8 max-w-[700px]">
          <p className="text-xs font-semibold uppercase tracking-wide">
            {a.tag}
          </p>

          <div>
            <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
              {a.heading}
            </h2>
            <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown mt-3">
              {a.headingItalic}
            </p>
            <p className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown mt-3">
              {a.headingEnd}
            </p>
          </div>

          <p className="text-lg md:text-2xl font-medium tracking-tight leading-relaxed text-brown">
            {a.body}
          </p>

          <div>
            <p className="text-lg md:text-2xl font-medium tracking-tight text-brown mb-6">
              {a.diagnosticIntro}
            </p>

            <ul className="flex flex-col gap-4">
              {a.diagnosticItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-brown shrink-0 mt-0.5" />
                  <span className="text-[20px] font-medium tracking-[-0.8px] text-brown">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Callout box */}
          <div className="bg-cream-light border border-brown/10 rounded-[30px] p-6 flex items-start gap-4">
            <span className="font-serif italic text-[64px] leading-none text-brown shrink-0">
              !
            </span>
            <p className="text-lg md:text-2xl font-medium tracking-tight leading-relaxed text-brown pt-2">
              {a.callout}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
