import Image from "next/image";
import Star from "./Star";

const treatments = [
  {
    title: "Applied Kinesiology",
    subtitle: "Diagnostic functional muscle testing",
    description:
      "Precisely identifies nerve compression or imbalances in the autonomic nervous system. We don\u2019t guess; we \"ask\" your body directly.",
    image: "/images/about-portrait.webp",
  },
  {
    title: "Osteopathic Techniques",
    subtitle:
      "Gentle yet deep work with the body\u2019s structures (bones, ligaments, internal organs).",
    description:
      "Restores natural joint positioning, improves blood flow, and releases craniosacral tension. It corrects posture and dissolves deep-seated structural blocks.",
    image: "/images/service-4.webp",
  },
  {
    title: "Therapeutic & Sports Massage",
    subtitle:
      "Deep tissue work targeting trigger points and myofascial restrictions.",
    description:
      "Ideal for athletes (triathletes, swimmers) and those with chronic tension. Fast-tracks recovery, restores muscle elasticity, and prevents future injury.",
    image: "/images/service-2.webp",
  },
  {
    title: "Specialized Aesthetics",
    subtitle: "Sculptural, Modeling, and Buccal massage.",
    description:
      "Deep work on facial muscles and the TMJ (jaw joint) for tension release and natural lifting without injections.",
    image: "/images/service-3.webp",
  },
];

export default function Treatments() {
  return (
    <section id="treatments" className="py-20 px-6 lg:px-[150px]">
      {/* Section header */}
      <div className="text-center mb-16">
        <Star className="w-[45px] h-[45px] text-brown mx-auto mb-6" />
        <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
          Treatments For
        </h2>
        <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown mt-2">
          Every Body
        </p>
        <p className="text-[20px] font-medium tracking-[-0.8px] text-brown mt-6">
          Explore therapies to guide you to serenity.
        </p>

        <a
          href="#treatments"
          className="inline-flex items-center gap-3 bg-gold-mid text-brown rounded-full px-8 py-5 text-sm font-medium uppercase hover:opacity-90 transition-opacity mt-8"
        >
          View All
          <Star className="w-4 h-4" />
        </a>
      </div>

      {/* Treatment cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[700px] gap-y-12">
        {treatments.map((t, i) => (
          <div
            key={t.title}
            className={`flex flex-col items-center text-center ${
              i % 2 === 1 ? "md:mt-40" : ""
            }`}
          >
            <div className="relative w-[390px] h-[560px] rounded-[190px] overflow-hidden mb-8">
              <Image
                src={t.image}
                alt={t.title}
                fill
                sizes="390px"
                className="object-cover"
              />
            </div>
            <h3 className="font-serif text-[32px] leading-tight text-brown mb-2">
              {t.title}
            </h3>
            <p className="text-[16px] font-medium text-brown mb-3 max-w-[390px]">
              {t.subtitle}
            </p>
            <p className="text-[18px] font-medium leading-relaxed text-brown max-w-[390px]">
              {t.description}
            </p>
            <Star className="w-5 h-5 text-brown mt-6" />
          </div>
        ))}
      </div>
    </section>
  );
}
