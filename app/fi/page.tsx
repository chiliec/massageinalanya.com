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
  title: t("metadata", "fi").title,
  description: t("metadata", "fi").description,
  alternates: {
    canonical: `${SITE_URL}/fi`,
    languages: {
      en: SITE_URL,
      ru: `${SITE_URL}/ru`,
      fi: `${SITE_URL}/fi`,
    },
  },
};

export default function FiPage() {
  return (
    <main className="flex flex-col">
      <SetLocale locale="fi" />
      <Hero locale="fi" />
      <Marquee variant="cream" locale="fi" />
      <Problems locale="fi" />
      <Marquee variant="cream" locale="fi" />
      <About locale="fi" />
      <Treatments locale="fi" />
      <Standards locale="fi" />
      <CTA locale="fi" />
      <Marquee variant="gold" locale="fi" />
      <Footer locale="fi" />
    </main>
  );
}
