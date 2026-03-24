import Image from "next/image";
import { getWhatsAppLink } from "@/lib/whatsapp";
import Star from "./Star";

export default function CTA() {
  const link = getWhatsAppLink();

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
            let&apos;s get acquainted
          </p>

          <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
            Take the first Step
          </h2>
          <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown">
            Toward a pain-free Life
          </p>

          <p className="text-[18px] font-medium leading-relaxed text-brown max-w-[514px]">
            Due to a busy clinical schedule, I do not use automated booking
            systems. Every case is unique, and it is important for me to
            understand your specific needs before you arrive at the clinic.
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gold-mid text-brown rounded-full px-8 py-5 text-sm font-medium uppercase hover:opacity-90 transition-opacity"
          >
            Message on WhatsApp
            <Star className="w-4 h-4" />
          </a>

          <p className="text-sm font-medium text-brown">
            (I respond between patient sessions)
          </p>
        </div>
      </div>
    </section>
  );
}
