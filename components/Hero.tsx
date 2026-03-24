import { getWhatsAppLink } from "@/lib/whatsapp";
import Image from "next/image";

export default function Hero() {
  const link = getWhatsAppLink();

  return (
    <section className="relative h-[900px] w-full overflow-hidden text-white">
      {/* Background image */}
      <Image
        src="/massage.jpeg"
        alt="massage"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
        <div className="flex flex-col items-center max-w-3xl">
          <h1 className="text-[56px] leading-[64px] font-semibold">
            Relax Your Body & Mind
          </h1>

          <p className="mt-6 text-lg opacity-90 max-w-xl">
            Professional Pain Relief & Functional Body Restoration <em>in Alanya</em>
          </p>

          {/* ↓ deliberate spacing */}
          <a
            href={link}
            target="_blank"
            className="mt-10 px-6 py-3 bg-white text-black rounded-xl hover:scale-105 transition"
          >
            Book Now
          </a>
        </div>
      </div>
    </section>
  );
}
