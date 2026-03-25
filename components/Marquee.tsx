import Star from "./Star";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface MarqueeProps {
  variant?: "cream" | "gold";
  locale?: Locale;
}

export default function Marquee({ variant = "cream", locale = "en" }: MarqueeProps) {
  const bg = variant === "gold" ? "bg-gold" : "bg-cream-light";
  const marquee = t("marquee", locale);

  const items = (
    <>
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Yanyol Sokak Metroport No:14
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        {marquee.hours}
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Yanyol Sokak Metroport No:14
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        {marquee.hours}
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Yanyol Sokak Metroport No:14
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        {marquee.hours}
      </span>
      <Star className="w-5 h-5 shrink-0" />
    </>
  );

  return (
    <div className={`${bg} py-5 overflow-hidden`}>
      <div className="animate-marquee flex items-center gap-8 w-max">
        {items}
        {items}
      </div>
    </div>
  );
}
