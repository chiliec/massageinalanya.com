import { getWhatsAppLink } from "@/lib/whatsapp";

export default function CTA() {
  const link = getWhatsAppLink();
  return (
    <section className="py-20 px-6 bg-black text-white text-center">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h2 className="text-3xl font-semibold">Ready to relax?</h2>

        <a
          href={link}
          target="_blank"
          className="px-5 py-2 border border-white rounded-lg text-sm hover:bg-white hover:text-black transition"
        >
          Book Now
        </a>
      </div>
    </section>
  );
}
