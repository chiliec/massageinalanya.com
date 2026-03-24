export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-6">
      <div className="max-w-4xl text-center flex flex-col gap-6">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Relax Your Body & Mind
        </h1>

        <p className="text-lg opacity-80">
          Professional massage therapy in Alanya
        </p>

        <button className="self-center px-6 py-3 bg-white text-black rounded-xl hover:scale-105 transition">
          Book now
        </button>
      </div>
    </section>
  );
}
