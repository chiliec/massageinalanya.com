import Image from "next/image";
import Star from "./Star";

export default function About() {
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
            about the specialist
          </p>

          <div>
            <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
              My name is Larisa.
            </h2>
            <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown mt-3">
              I don&apos;t do &ldquo;Spa Massage&rdquo;.
            </p>
            <p className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown mt-3">
              I restore health.
            </p>
          </div>

          <p className="text-lg md:text-2xl font-medium tracking-tight leading-relaxed text-brown">
            In my practice, there are no standardized &ldquo;one-hour rubs&rdquo; to
            relaxing music. I bring a solid medical education and over 20 years
            of continuous clinical experience to every session.
          </p>

          <div>
            <p className="text-lg md:text-2xl font-medium tracking-tight text-brown mb-6">
              Every treatment begins with a diagnostic assessment ~
            </p>

            <ul className="flex flex-col gap-4">
              {[
                "I review your full medical history",
                "Evaluate your muscular and autonomic nervous systems",
                "Maintain a detailed patient file to track your recovery dynamics",
              ].map((item) => (
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
              My primary goal is to return your body to its natural balance and
              biomechanics so you can live pain-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
