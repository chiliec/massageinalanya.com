const PHONE = "905069058115";

const messages: Record<string, string> = {
    en: "I want to book a massage appointment",
    ru: "Я хочу записаться на массаж",
    fi: "Haluan varata hieronta-ajan",
};

function getLang(): keyof typeof messages {
    if (typeof navigator === "undefined") return "en";

    const lang = navigator.language.toLowerCase();

    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("fi")) return "fi";

    return "en";
}

export function getWhatsAppLink(customText?: string) {
    const lang = getLang();
    const text = customText ?? messages[lang];

    return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}
