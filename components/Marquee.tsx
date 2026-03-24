import Star from "./Star";

interface MarqueeProps {
  variant?: "cream" | "gold";
}

export default function Marquee({ variant = "cream" }: MarqueeProps) {
  const bg = variant === "gold" ? "bg-gold" : "bg-cream-light";

  const items = (
    <>
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Yanyol Sokak Metroport No:14
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Mon-Sat: 10 AM - 6 PM
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Yanyol Sokak Metroport No:14
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Mon-Sat: 10 AM - 6 PM
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Yanyol Sokak Metroport No:14
      </span>
      <Star className="w-5 h-5 shrink-0" />
      <span className="whitespace-nowrap text-2xl font-medium tracking-tight">
        Mon-Sat: 10 AM - 6 PM
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
