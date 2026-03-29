export type Locale = "en" | "ru" | "fi";

export const locales: Locale[] = ["en", "ru", "fi"];

export const localeNames: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  fi: "FI",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/* ------------------------------------------------------------------ */
/*  Translation dictionary                                             */
/* ------------------------------------------------------------------ */

const translations = {
  /* ---------- Nav / Header ---------- */
  nav: {
    en: {
      treatments: "Treatments",
      about: "About",
      reviews: "Reviews",
      contact: "Contact",
    },
    ru: {
      treatments: "Процедуры",
      about: "О специалисте",
      reviews: "Отзывы",
      contact: "Контакты",
    },
    fi: {
      treatments: "Hoidot",
      about: "Tietoa",
      reviews: "Arvostelut",
      contact: "Yhteystiedot",
    },
  },

  /* ---------- Hero ---------- */
  hero: {
    en: {
      heading: "Professional Pain Relief & Functional Body Restoration",
      headingItalic: "in Alanya",
      description:
        "Clinical Manual Therapy, Applied Kinesiology, and Osteopathic Techniques. Restoring your freedom of movement without drugs or surgery.",
      cta: "Book Now",
    },
    ru: {
      heading:
        "Профессиональное избавление от боли и восстановление функций тела",
      headingItalic: "в Аланье",
      description:
        "Клиническая мануальная терапия, прикладная кинезиология и остеопатические техники. Восстанавливаем свободу движения без лекарств и хирургии.",
      cta: "Записаться",
    },
    fi: {
      heading: "Ammattimainen kivunlievitys ja kehon toiminnallinen palautus",
      headingItalic: "Alanyassa",
      description:
        "Kliininen manuaaliterapia, sovellettu kinesiologia ja osteopaattiset tekniikat. Palautamme liikkumisvapautesi ilman lääkkeitä tai leikkausta.",
      cta: "Varaa aika",
    },
  },

  /* ---------- Marquee ---------- */
  marquee: {
    en: { hours: "Mon–Sat: 10 AM – 6 PM" },
    ru: { hours: "Пн–Сб: 10:00 – 18:00" },
    fi: { hours: "Ma–La: 10–18" },
  },

  /* ---------- Problems ---------- */
  problems: {
    en: {
      tag: "You Are in the Right Place",
      heading: "Tired of treating symptoms",
      headingItalic: "While the pain keeps returning?",
      quote:
        "\u201CYour body is not a collection of spare parts; it is a single, integrated system. If it hurts in one place, we examine everything.\u201D",
      quoteAuthor: "\u2014 Larisa, Clinical Therapist.",
      cards: [
        {
          title: "Neck & Shoulders",
          description:
            "Numbness in the fingers and heavy shoulders are often caused by more than just fatigue; they are signs of nerve plexus compression. We focus on releasing the nerve, not just rubbing the muscle",
        },
        {
          title: "Lower Back & Pelvis",
          description:
            "Lower back pain is almost always a cry for help from the pelvis or the feet. I identify the specific imbalance that is forcing your back to do twice the work.",
        },
        {
          title: "Jaw & Face",
          description:
            "Clenched jaws and tension headaches are deeply linked to the autonomic nervous system. Buccal massage and TMJ therapy restore symmetry and a sense of lightness to the face.",
        },
        {
          title: "Knees & Feet",
          description:
            "The knee is a \u2018hostage\u2019 trapped between the foot and the pelvis. We restore proper walking biomechanics to stop joint degeneration and return fluidity to your movement.",
        },
      ],
    },
    ru: {
      tag: "Вы обратились по адресу",
      heading: "Устали лечить симптомы,",
      headingItalic: "пока боль продолжает возвращаться?",
      quote:
        "\u00ABВаше тело \u2014 не набор запчастей, а единая, интегрированная система. Если болит в одном месте \u2014 мы обследуем всё.\u00BB",
      quoteAuthor: "\u2014 Лариса, клинический терапевт.",
      cards: [
        {
          title: "Шея и плечи",
          description:
            "Онемение пальцев и тяжесть в плечах \u2014 это часто не просто усталость, а признаки компрессии нервного сплетения. Мы освобождаем нерв, а не просто растираем мышцу.",
        },
        {
          title: "Поясница и таз",
          description:
            "Боль в пояснице почти всегда \u2014 крик о помощи от таза или стоп. Я выявляю конкретный дисбаланс, который заставляет вашу спину работать за двоих.",
        },
        {
          title: "Челюсть и лицо",
          description:
            "Сжатые челюсти и головные боли напряжения тесно связаны с вегетативной нервной системой. Буккальный массаж и терапия ВНЧС возвращают симметрию и лёгкость лицу.",
        },
        {
          title: "Колени и стопы",
          description:
            "Колено \u2014 «заложник» между стопой и тазом. Мы восстанавливаем правильную биомеханику ходьбы, чтобы остановить износ суставов и вернуть плавность движений.",
        },
      ],
    },
    fi: {
      tag: "Olet oikeassa paikassa",
      heading: "Kyllästynyt oireiden hoitoon,",
      headingItalic: "kun kipu palaa aina takaisin?",
      quote:
        "\u201CKehosi ei ole kokoelma varaosia, vaan yksi yhtenäinen järjestelmä. Jos kipua on yhdessä paikassa, tutkimme kaiken.\u201D",
      quoteAuthor: "\u2014 Larisa, kliininen terapeutti.",
      cards: [
        {
          title: "Niska ja hartiat",
          description:
            "Sormien puutuminen ja hartioiden raskaus eivät johdu pelkästään väsymyksestä \u2014 ne ovat merkkejä hermopunoksen puristuksesta. Keskitymme hermon vapauttamiseen, emme pelkkään lihaksen hierontaan.",
        },
        {
          title: "Alaselkä ja lantio",
          description:
            "Alaselkäkipu on lähes aina avunhuuto lantiolta tai jaloilta. Selvitän tarkan epätasapainon, joka pakottaa selkäsi tekemään kaksinkertaista työtä.",
        },
        {
          title: "Leuka ja kasvot",
          description:
            "Puristetut leuat ja jännityspäänsärky liittyvät tiiviisti autonomiseen hermostoon. Bukkaalihieronta ja TMJ-terapia palauttavat symmetrian ja keveyden kasvoille.",
        },
        {
          title: "Polvet ja jalat",
          description:
            "Polvi on \u201Cpanttivanki\u201D jalan ja lantion välissä. Palautamme oikean kävelybiomekaniikan pysäyttääksemme nivelten rappeutumisen ja palauttaaksemme liikkeen sujuvuuden.",
        },
      ],
    },
  },

  /* ---------- About ---------- */
  about: {
    en: {
      tag: "about the specialist",
      heading: "My name is Larisa.",
      headingItalic: 'I don\u2019t do \u201CSpa Massage\u201D.',
      headingEnd: "I restore health.",
      body: 'In my practice, there are no standardized \u201Cone-hour rubs\u201D to relaxing music. I bring a solid medical education and over 20 years of continuous clinical experience to every session.',
      diagnosticIntro: "Every treatment begins with a diagnostic assessment ~",
      diagnosticItems: [
        "I review your full medical history",
        "Evaluate your muscular and autonomic nervous systems",
        "Maintain a detailed patient file to track your recovery dynamics",
      ],
      callout:
        "My primary goal is to return your body to its natural balance and biomechanics so you can live pain-free.",
    },
    ru: {
      tag: "о специалисте",
      heading: "Меня зовут Лариса.",
      headingItalic: "Я не делаю \u00ABспа-массаж\u00BB.",
      headingEnd: "Я восстанавливаю здоровье.",
      body: "В моей практике нет стандартных \u00ABчасовых растираний\u00BB под расслабляющую музыку. Каждый сеанс \u2014 это серьёзное медицинское образование и более 20 лет непрерывного клинического опыта.",
      diagnosticIntro: "Каждый приём начинается с диагностики ~",
      diagnosticItems: [
        "Изучаю вашу полную историю болезни",
        "Оцениваю мышечную и вегетативную нервную системы",
        "Веду детальную карту пациента для отслеживания динамики выздоровления",
      ],
      callout:
        "Моя главная цель \u2014 вернуть вашему телу естественный баланс и биомеханику, чтобы вы жили без боли.",
    },
    fi: {
      tag: "asiantuntijasta",
      heading: "Nimeni on Larisa.",
      headingItalic: "En tee \u201Ckylpylähierontaa\u201D.",
      headingEnd: "Palautan terveyttä.",
      body: "Vastaanotollani ei ole standardoituja \u201Ctunnin hierontoja\u201D rentouttavan musiikin tahtiin. Tuon jokaiseen hoitokertaan vankan lääketieteellisen koulutuksen ja yli 20 vuoden yhtäjaksoisen kliinisen kokemuksen.",
      diagnosticIntro: "Jokainen hoitokerta alkaa diagnostisella arvioinnilla ~",
      diagnosticItems: [
        "Käyn läpi koko sairaushistoriasi",
        "Arvioin lihas- ja autonomisen hermostosi",
        "Pidän yksityiskohtaista potilaskorttia toipumisesi seuraamiseksi",
      ],
      callout:
        "Päätavoitteeni on palauttaa kehosi luonnollinen tasapaino ja biomekaniikka, jotta voit elää kivuttomasti.",
    },
  },

  /* ---------- Treatments ---------- */
  treatments: {
    en: {
      heading: "Treatments For",
      headingItalic: "Every Body",
      subtitle: "Explore therapies to guide you to serenity.",
      viewAll: "View All",
      cards: [
        {
          title: "Applied Kinesiology",
          subtitle: "Diagnostic functional muscle testing",
          description:
            'Precisely identifies nerve compression or imbalances in the autonomic nervous system. We don\u2019t guess; we "ask" your body directly.',
        },
        {
          title: "Osteopathic Techniques",
          subtitle:
            "Gentle yet deep work with the body\u2019s structures (bones, ligaments, internal organs).",
          description:
            "Restores natural joint positioning, improves blood flow, and releases craniosacral tension. It corrects posture and dissolves deep-seated structural blocks.",
        },
        {
          title: "Therapeutic & Sports Massage",
          subtitle:
            "Deep tissue work targeting trigger points and myofascial restrictions.",
          description:
            "Ideal for athletes (triathletes, swimmers) and those with chronic tension. Fast-tracks recovery, restores muscle elasticity, and prevents future injury.",
        },
        {
          title: "Specialized Aesthetics",
          subtitle: "Sculptural, Modeling, and Buccal massage.",
          description:
            "Deep work on facial muscles and the TMJ (jaw joint) for tension release and natural lifting without injections.",
        },
      ],
    },
    ru: {
      heading: "Процедуры для",
      headingItalic: "каждого тела",
      subtitle: "Терапии, которые приведут вас к гармонии.",
      viewAll: "Смотреть все",
      cards: [
        {
          title: "Прикладная кинезиология",
          subtitle: "Диагностическое функциональное мышечное тестирование",
          description:
            "Точно определяет компрессию нервов или дисбаланс в вегетативной нервной системе. Мы не гадаем \u2014 мы \u00ABспрашиваем\u00BB ваше тело напрямую.",
        },
        {
          title: "Остеопатические техники",
          subtitle:
            "Мягкая, но глубокая работа со структурами тела (кости, связки, внутренние органы).",
          description:
            "Восстанавливает естественное положение суставов, улучшает кровоток и снимает краниосакральное напряжение. Корректирует осанку и устраняет глубокие структурные блоки.",
        },
        {
          title: "Лечебный и спортивный массаж",
          subtitle:
            "Глубокая работа с тканями, направленная на триггерные точки и миофасциальные ограничения.",
          description:
            "Идеально для спортсменов (триатлонисты, пловцы) и людей с хроническим напряжением. Ускоряет восстановление, возвращает эластичность мышц и предотвращает травмы.",
        },
        {
          title: "Специализированная эстетика",
          subtitle: "Скульптурный, моделирующий и буккальный массаж.",
          description:
            "Глубокая работа с мышцами лица и ВНЧС для снятия напряжения и естественного лифтинга без инъекций.",
        },
      ],
    },
    fi: {
      heading: "Hoitoja",
      headingItalic: "jokaiselle keholle",
      subtitle: "Tutustu terapioihin, jotka johdattavat sinut tasapainoon.",
      viewAll: "Näytä kaikki",
      cards: [
        {
          title: "Sovellettu kinesiologia",
          subtitle: "Diagnostinen toiminnallinen lihastestaus",
          description:
            'Tunnistaa tarkasti hermopuristuksen tai autonomisen hermoston epätasapainon. Emme arvaa \u2014 "kysymme" keholtasi suoraan.',
        },
        {
          title: "Osteopaattiset tekniikat",
          subtitle:
            "Lempeää mutta syvällistä työtä kehon rakenteiden kanssa (luut, nivelsiteet, sisäelimet).",
          description:
            "Palauttaa nivelten luonnollisen asennon, parantaa verenkiertoa ja vapauttaa kraniosakraalisen jännityksen. Korjaa ryhtiä ja purkaa syvälle juurtuneet rakenteelliset tukokset.",
        },
        {
          title: "Terapeuttinen ja urheiluhieronta",
          subtitle:
            "Syväkudostyö kohdistuen triggerpisteihin ja myofaskiaalisiin rajoituksiin.",
          description:
            "Ihanteellinen urheilijoille (triathletit, uimarit) ja kroonisesta jännityksestä kärsiville. Nopeuttaa palautumista, palauttaa lihasten joustavuuden ja ehkäisee tulevia vammoja.",
        },
        {
          title: "Erikoistunut estetiikka",
          subtitle: "Veistoshieronta, mallintava hieronta ja bukkaalihieronta.",
          description:
            "Syvä työ kasvojen lihaksilla ja TMJ-nivelellä jännityksen lievittämiseksi ja luonnollisen kohotuksen saavuttamiseksi ilman pistoksia.",
        },
      ],
    },
  },

  /* ---------- Standards ---------- */
  standards: {
    en: {
      heading: "Clinical Practice",
      headingItalic: "Standards",
      cards: [
        {
          number: "01",
          title: "Individual Protocols",
          description:
            "I record the history of every session and track your recovery progress.",
        },
        {
          number: "02",
          title: "Sterility & Timing",
          description:
            'A mandatory 30-minute buffer is scheduled between patients for full clinical sanitation. No rushing, no "conveyor belt" service.',
        },
        {
          number: "03",
          title: "Respect for Time",
          description:
            "I maintain a strict schedule, seeing only 4\u20136 patients per day to ensure peak quality of care. Cancellations require 24-hour notice.",
        },
        {
          number: "04",
          title: "Flexible Duration",
          description:
            "Standard sessions are 60 minutes, but can be extended by 30 or 60 minutes depending on the complexity of the case.",
        },
      ],
    },
    ru: {
      heading: "Стандарты",
      headingItalic: "клинической практики",
      cards: [
        {
          number: "01",
          title: "Индивидуальные протоколы",
          description:
            "Я фиксирую историю каждого сеанса и отслеживаю динамику вашего выздоровления.",
        },
        {
          number: "02",
          title: "Стерильность и тайминг",
          description:
            "Обязательный 30-минутный перерыв между пациентами для полной клинической санитарии. Без спешки, без \u00ABконвейера\u00BB.",
        },
        {
          number: "03",
          title: "Уважение ко времени",
          description:
            "Я придерживаюсь строгого графика, принимая только 4\u20136 пациентов в день для обеспечения высшего качества помощи. Отмена \u2014 за 24 часа.",
        },
        {
          number: "04",
          title: "Гибкая продолжительность",
          description:
            "Стандартный сеанс \u2014 60 минут, но может быть продлён на 30 или 60 минут в зависимости от сложности случая.",
        },
      ],
    },
    fi: {
      heading: "Kliinisen käytännön",
      headingItalic: "standardit",
      cards: [
        {
          number: "01",
          title: "Yksilölliset protokollat",
          description:
            "Kirjaan jokaisen hoitokerran historian ja seuraan toipumisesi edistymistä.",
        },
        {
          number: "02",
          title: "Steriiliys ja aikataulu",
          description:
            "Pakollinen 30 minuutin tauko potilaiden välillä täydelliseen kliiniseen desinfiointiin. Ei kiirettä, ei \u201Dliukuhihnapalvelua\u201D.",
        },
        {
          number: "03",
          title: "Ajan kunnioitus",
          description:
            "Pidän tiukkaa aikataulua ja otan vastaan vain 4\u20136 potilasta päivässä varmistaakseni huippulaadun. Peruutukset 24 tuntia etukäteen.",
        },
        {
          number: "04",
          title: "Joustava kesto",
          description:
            "Vakiohoito kestää 60 minuuttia, mutta sitä voidaan jatkaa 30 tai 60 minuuttia tapauksen monimutkaisuudesta riippuen.",
        },
      ],
    },
  },

  /* ---------- CTA ---------- */
  cta: {
    en: {
      tag: "let\u2019s get acquainted",
      heading: "Take the first Step",
      headingItalic: "Toward a pain-free Life",
      body: "Due to a busy clinical schedule, I do not use automated booking systems. Every case is unique, and it is important for me to understand your specific needs before you arrive at the clinic.",
      button: "Message on WhatsApp",
      note: "(I respond between patient sessions)",
    },
    ru: {
      tag: "давайте познакомимся",
      heading: "Сделайте первый шаг",
      headingItalic: "к жизни без боли",
      body: "Из-за плотного клинического графика я не использую автоматические системы бронирования. Каждый случай уникален, и мне важно понять ваши конкретные потребности до вашего визита ко мне.",
      button: "Написать в WhatsApp",
      note: "(Отвечаю между приёмами пациентов)",
    },
    fi: {
      tag: "tutustutaan",
      heading: "Ota ensimmäinen askel",
      headingItalic: "kohti kivutonta elämää",
      body: "Kiireisen kliinisen aikataulun vuoksi en käytä automaattisia varausjärjestelmiä. Jokainen tapaus on ainutlaatuinen, ja minulle on tärkeää ymmärtää erityistarpeesi ennen kuin saavut klinikalle.",
      button: "Viesti WhatsAppissa",
      note: "(Vastaan potilaskäyntien välissä)",
    },
  },

  /* ---------- Footer ---------- */
  footer: {
    en: {
      menuLabel: "Menu",
      treatmentsLabel: "treatments",
      infoLabel: "information",
      treatmentLinks: [
        "Applied Kinesiology",
        "Osteopathic Techniques",
        "Therapeutic & Sports Massage",
        "Specialized Aesthetics",
      ],
      copyright: "\u00A9 2026, All Rights Reserved",
      privacy: "privacy policy",
    },
    ru: {
      menuLabel: "Меню",
      treatmentsLabel: "процедуры",
      infoLabel: "информация",
      treatmentLinks: [
        "Прикладная кинезиология",
        "Остеопатические техники",
        "Лечебный и спортивный массаж",
        "Специализированная эстетика",
      ],
      copyright: "\u00A9 2026, Все права защищены",
      privacy: "политика конфиденциальности",
    },
    fi: {
      menuLabel: "Valikko",
      treatmentsLabel: "hoidot",
      infoLabel: "tiedot",
      treatmentLinks: [
        "Sovellettu kinesiologia",
        "Osteopaattiset tekniikat",
        "Terapeuttinen ja urheiluhieronta",
        "Erikoistunut estetiikka",
      ],
      copyright: "\u00A9 2026, Kaikki oikeudet pidätetään",
      privacy: "tietosuojakäytäntö",
    },
  },

  /* ---------- Metadata (SEO) ---------- */
  metadata: {
    en: {
      title: "Massage in Alanya | Larisa — Clinical Manual Therapy",
      description:
        "Professional Pain Relief & Functional Body Restoration in Alanya. Clinical Manual Therapy, Applied Kinesiology, and Osteopathic Techniques.",
    },
    ru: {
      title: "Массаж в Аланье | Лариса — Клиническая мануальная терапия",
      description:
        "Профессиональное избавление от боли и восстановление функций тела в Аланье. Клиническая мануальная терапия, прикладная кинезиология и остеопатические техники.",
    },
    fi: {
      title: "Hieronta Alanyassa | Larisa — Kliininen manuaaliterapia",
      description:
        "Ammattimainen kivunlievitys ja kehon toiminnallinen palautus Alanyassa. Kliininen manuaaliterapia, sovellettu kinesiologia ja osteopaattiset tekniikat.",
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Accessor                                                           */
/* ------------------------------------------------------------------ */

type Translations = typeof translations;
type Section = keyof Translations;

export function t<S extends Section, L extends Locale>(
  section: S,
  locale: L,
): Translations[S][L] {
  return translations[section][locale];
}
