"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales, localeNames } from "@/lib/i18n";

const localePaths: Record<Locale, string> = {
  en: "/",
  ru: "/ru",
  fi: "/fi",
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function switchLocale(target: Locale) {
    setOpen(false);
    if (target !== locale) {
      router.push(localePaths[target]);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-brown/20 rounded-full px-4 py-2 hover:bg-brown/5 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-sm font-medium text-brown">
          {localeNames[locale]}
        </span>
        <svg
          width="15"
          height="8"
          viewBox="0 0 15 8"
          fill="none"
          className={`text-brown transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L7.5 7L14 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 bg-cream border border-brown/20 rounded-2xl overflow-hidden shadow-lg z-50 min-w-[80px]"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                onClick={() => switchLocale(l)}
                className={`w-full px-4 py-2.5 text-sm font-medium text-brown text-left hover:bg-brown/5 transition-colors ${
                  l === locale ? "bg-brown/10" : ""
                }`}
              >
                {localeNames[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
