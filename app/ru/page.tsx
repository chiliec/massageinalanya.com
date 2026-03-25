import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Problems from "@/components/Problems";
import About from "@/components/About";
import Treatments from "@/components/Treatments";
import Standards from "@/components/Standards";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SetLocale from "@/components/SetLocale";
import { t } from "@/lib/i18n";

const SITE_URL = "https://massageinalanya.com";

export const metadata: Metadata = {
  title: t("metadata", "ru").title,
  description: t("metadata", "ru").description,
  alternates: {
    canonical: `${SITE_URL}/ru`,
    languages: {
      en: SITE_URL,
      ru: `${SITE_URL}/ru`,
      fi: `${SITE_URL}/fi`,
    },
  },
};

export default function RuPage() {
  return (
    <main className="flex flex-col">
      <SetLocale locale="ru" />
      <Hero locale="ru" />
      <Marquee variant="cream" locale="ru" />
      <Problems locale="ru" />
      <Marquee variant="cream" locale="ru" />
      <About locale="ru" />
      <Treatments locale="ru" />
      <Standards locale="ru" />
      <CTA locale="ru" />
      <Marquee variant="gold" locale="ru" />
      <Footer locale="ru" />
    </main>
  );
}
