import Image from "next/image";
import { getWhatsAppLink } from "@/lib/whatsapp";
import Star from "./Star";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function CTA({ locale = "en" }: { locale?: Locale }) {
  const link = getWhatsAppLink();
  const c = t("cta", locale);

  return (
    <section id="contact" className="relative h-[900px] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/cta-background.webp"
        alt="Massage therapy environment"
        fill
        sizes="100vw"
        className="object-cover"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-cream/95 rounded-[260px] px-12 py-16 md:px-24 md:py-20 max-w-[850px] w-full flex flex-col items-center text-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brown">
            {c.tag}
          </p>

          <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
            {c.heading}
          </h2>
          <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown">
            {c.headingItalic}
          </p>

          <p className="text-[18px] font-medium leading-relaxed text-brown max-w-[514px]">
            {c.body}
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gold-mid text-brown rounded-full px-8 py-5 text-sm font-medium uppercase hover:opacity-90 transition-opacity"
          >
            {c.button}
            <Star className="w-4 h-4" />
          </a>

          <p className="text-sm font-medium text-brown">
            {c.note}
          </p>
        </div>
      </div>
    </section>
  );
}
