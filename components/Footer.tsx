import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const nav = t("nav", locale);
  const f = t("footer", locale);

  const menuLinks = [
    { label: nav.treatments, href: "#treatments" },
    { label: nav.about, href: "#about" },
    { label: nav.reviews, href: "#reviews" },
    { label: nav.contact, href: "#contact" },
  ];

  return (
    <footer className="bg-brown text-gold px-6 lg:px-[150px] pt-20 pb-10 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        {/* Menu column */}
        <div>
          <p className="text-sm font-medium uppercase text-cream mb-4">{f.menuLabel}</p>
          <ul className="flex flex-col gap-2">
            {menuLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-2xl font-medium hover:opacity-70 transition-opacity"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatments column */}
        <div>
          <p className="text-sm font-medium uppercase text-cream mb-4">
            {f.treatmentsLabel}
          </p>
          <ul className="flex flex-col gap-2">
            {f.treatmentLinks.map((label) => (
              <li key={label}>
                <a
                  href="#treatments"
                  className="text-2xl font-medium hover:opacity-70 transition-opacity"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Information column */}
        <div>
          <p className="text-sm font-medium uppercase text-cream mb-4">
            {f.infoLabel}
          </p>
          <ul className="flex flex-col gap-2">
            <li className="text-2xl font-medium">
              Yanyol Sokak<br />Metroport No:14
            </li>
            <li className="flex items-center gap-2 mt-2">
              {/* WhatsApp icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <span className="text-2xl font-medium">+1(234) 567 89 01</span>
            </li>
            <li className="flex items-center gap-2">
              {/* Email icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              <span className="text-2xl font-medium">info@massageinalanya</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Large logo */}
      <div className="relative">
        <p className="font-logo text-[clamp(80px,21vw,400px)] leading-none text-gold select-none text-center whitespace-nowrap w-fit mx-auto">
          LARISA.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 text-sm font-medium text-cream">
        <span>{f.copyright}</span>
        <a href="/privacy" className="hover:opacity-70 transition-opacity">
          {f.privacy}
        </a>
      </div>
    </footer>
  );
}
