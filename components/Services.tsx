const services = [
  {
    title: "Applied Kinesiology",
    desc: "Diagnostic functional muscle testing",
  },
  {
    title: "Therapeutic & Sports Massage",
    desc: "Deep tissue work targeting trigger points and myofascial restrictions.",
  },
  {
    title: "Osteopathic Techniques",
    desc: "Gentle yet deep work with the body’s structures (bones, ligaments, internal organs).",
  },
];

export default function Services() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <h2 className="text-3xl font-semibold text-center">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="p-6 rounded-2xl border hover:shadow-lg transition flex flex-col gap-3"
            >
              <h3 className="text-xl font-medium">{s.title}</h3>
              <p className="opacity-70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
