const standards = [
  {
    number: "01",
    title: "Individual Protocols",
    description:
      "I record the history of every session and track your recovery progress.",
  },
  {
    number: "02",
    title: "Sterility & Timing",
    description:
      'A mandatory 30-minute buffer is scheduled between patients for full clinical sanitation. No rushing, no "conveyor belt" service.',
  },
  {
    number: "03",
    title: "Respect for Time",
    description:
      "I maintain a strict schedule, seeing only 4\u20136 patients per day to ensure peak quality of care. Cancellations require 24-hour notice.",
  },
  {
    number: "04",
    title: "Flexible Duration",
    description:
      "Standard sessions are 60 minutes, but can be extended by 30 or 60 minutes depending on the complexity of the case.",
  },
];

export default function Standards() {
  return (
    <section className="bg-cream-light py-20 px-6 lg:px-[150px] overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute -left-16 top-32 w-[266px] h-[266px] rounded-full border border-brown/5 hidden lg:block" />
      <div className="absolute -right-16 bottom-16 w-[266px] h-[266px] rounded-full border border-brown/5 hidden lg:block" />

      {/* Section header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-[64px] md:leading-[1.0] font-medium tracking-tight text-brown">
          Clinical Practice
        </h2>
        <p className="font-serif italic text-3xl md:text-[64px] md:leading-[1.0] text-brown mt-2">
          Standards
        </p>
      </div>

      {/* Standards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {standards.map((s) => (
          <div key={s.number} className="flex flex-col gap-4">
            <span className="font-serif text-[96px] leading-none text-brown">
              {s.number}
            </span>
            <h3 className="text-[36px] font-medium leading-tight tracking-tight text-brown">
              {s.title}
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brown">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
