const TURKISH_MAP: Record<string, string> = {
  ı: "i",
  ğ: "g",
  ü: "u",
  ş: "s",
  ö: "o",
  ç: "c",
};

function transliterate(value: string) {
  const lower = value.trim().toLowerCase();
  const mapped = lower.replace(/[ığüşöç]/g, (char) => TURKISH_MAP[char] ?? char);
  return mapped.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function slugify(value: string) {
  const normalized = transliterate(value);
  const slug = normalized.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug || "post";
}
