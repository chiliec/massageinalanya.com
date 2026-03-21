import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/massage.jpeg"
            alt="Relaxing massage"
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
            Site Status
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            UNDER DEVELOPMENT
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
            We are preparing a calm, welcoming experience. Please check back
            soon.
          </p>
        </div>
      </main>
    </div>
  );
}
