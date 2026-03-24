import Image from "next/image";
import Star from "./Star";

const conditions = [
  {
    title: "Neck & Shoulders",
    description:
      "Numbness in the fingers and heavy shoulders are often caused by more than just fatigue; they are signs of nerve plexus compression. We focus on releasing the nerve, not just rubbing the muscle",
    icon: "/images/review-avatar-1.webp",
    offset: "mt-0",
  },
  {
    title: "Lower Back & Pelvis",
    description:
      "Lower back pain is almost always a cry for help from the pelvis or the feet. I identify the specific imbalance that is forcing your back to do twice the work.",
    icon: "/images/review-avatar-2.webp",
    offset: "mt-16",
  },
  {
    title: "Jaw & Face",
    description:
      "Clenched jaws and tension headaches are deeply linked to the autonomic nervous system. Buccal massage and TMJ therapy restore symmetry and a sense of lightness to the face.",
    icon: "/images/review-avatar-3.webp",
    offset: "mt-32",
  },
  {
    title: "Knees & Feet",
    description:
      "The knee is a \u2018hostage\u2019 trapped between the foot and the pelvis. We restore proper walking biomechanics to stop joint degeneration and return fluidity to your movement.",
    icon: "/images/review-avatar-4.webp",
    offset: "mt-48",
  },
];

export default function Problems() {
  return (
    <section className="py-20 px-6 lg:px-[150px]">
      {/* Section header */}
      <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
        <div className="max-w-[810px]">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4">
            You Are in the Right Place
          </p>
          <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
            Tired of treating symptoms
          </h2>
          <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.2] text-brown mt-2">
            While the pain keeps returning?
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
          &ldquo;Your body is not a collection of spare parts; it is a single,
          integrated system. If it hurts in one place, we examine everything.&rdquo;
        </p>
        <p className="text-[20px] font-medium tracking-[-0.8px] text-brown mt-4">
          &mdash; Larisa, Clinical Therapist.
        </p>
      </div>

      {/* Condition cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {conditions.map((c) => (
          <div key={c.title} className={`${c.offset} lg:${c.offset}`}>
            <div className="bg-cream-light rounded-[20px] p-6 flex flex-col items-center text-center border-t-2 border-brown/10">
              <div className="w-[99px] h-[99px] rounded-full overflow-hidden relative mb-6">
                <Image src={c.icon} alt={c.title} fill sizes="99px" className="object-cover" />
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
