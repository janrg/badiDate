/**
 * @license BadiDate v3.0.2
 * (c) 2018 Jan Greis
 * licensed under MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('luxon')) :
    typeof define === 'function' && define.amd ? define(['exports', 'luxon'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.window = global.window || {}, global.luxon));
}(this, (function (exports, luxon) { 'use strict';

    const month = {
        1: 'Bahá',
        2: 'Jalál',
        3: 'Jamál',
        4: '‘Aẓamat',
        5: 'Núr',
        6: 'Raḥmat',
        7: 'Kalimát',
        8: 'Kamál',
        9: 'Asmá’',
        10: '‘Izzat',
        11: 'Ma_sh_íyyat',
        12: '‘Ilm',
        13: 'Qudrat',
        14: 'Qawl',
        15: 'Masá’il',
        16: '_Sh_araf',
        17: 'Sulṭán',
        18: 'Mulk',
        19: '‘Alá’',
        20: 'Ayyám-i-Há',
    };
    const monthL = {
        1: 'Splendour',
        2: 'Glory',
        3: 'Beauty',
        4: 'Grandeur',
        5: 'Light',
        6: 'Mercy',
        7: 'Words',
        8: 'Perfection',
        9: 'Names',
        10: 'Might',
        11: 'Will',
        12: 'Knowledge',
        13: 'Power',
        14: 'Speech',
        15: 'Questions',
        16: 'Honour',
        17: 'Sovereignty',
        18: 'Dominion',
        19: 'Loftiness',
        20: 'Ayyám-i-Há',
    };
    const holyDay = {
        1: 'Naw-Rúz',
        2: 'First day of Riḍván',
        3: 'Ninth day of Riḍván',
        4: 'Twelfth day of Riḍván',
        5: 'Declaration of the Báb',
        6: 'Ascension of Bahá’u’lláh',
        7: 'Martyrdom of the Báb',
        8: 'Birth of the Báb',
        9: 'Birth of Bahá’u’lláh',
        10: 'Day of the Covenant',
        11: 'Ascension of ‘Abdu’l-Bahá',
    };
    // CAREFUL: Numbering corresponds to Badí' week, i.e. 1 is Jalál (-> Saturday)
    const weekday = {
        1: 'Jalál',
        2: 'Jamál',
        3: 'Kamál',
        4: 'Fiḍál',
        5: '‘Idál',
        6: 'Istijlál',
        7: 'Istiqlál',
    };
    const weekdayAbbr3 = {
        1: 'Jal',
        2: 'Jam',
        3: 'Kam',
        4: 'Fiḍ',
        5: '‘Idá',
        6: 'Isj',
        7: 'Isq',
    };
    const weekdayAbbr2 = {
        1: 'Jl',
        2: 'Jm',
        3: 'Ka',
        4: 'Fi',
        5: '‘Id',
        6: 'Ij',
        7: 'Iq',
    };
    const weekdayL = {
        1: 'Glory',
        2: 'Beauty',
        3: 'Perfection',
        4: 'Grace',
        5: 'Justice',
        6: 'Majesty',
        7: 'Independence',
    };
    const yearInVahid = {
        1: 'Alif',
        2: 'Bá’',
        3: 'Ab',
        4: 'Dál',
        5: 'Báb',
        6: 'Váv',
        7: 'Abad',
        8: 'Jád',
        9: 'Bahá',
        10: 'Ḥubb',
        11: 'Bahháj',
        12: 'Javáb',
        13: 'Aḥad',
        14: 'Vahháb',
        15: 'Vidád',
        16: 'Badí‘',
        17: 'Bahí',
        18: 'Abhá',
        19: 'Váḥid',
    };
    const vahid = 'Váḥid';
    const kulliShay = 'Kull-i-_Sh_ay’';
    const BE = 'B.E.';
    const badiCalendar = 'Badí‘ Calendar';
    const unicodeCharForZero = '0';
    const defaultFormat = 'd MM+ y BE';

    var en = /*#__PURE__*/Object.freeze({
        __proto__: null,
        month: month,
        monthL: monthL,
        holyDay: holyDay,
        weekday: weekday,
        weekdayAbbr3: weekdayAbbr3,
        weekdayAbbr2: weekdayAbbr2,
        weekdayL: weekdayL,
        yearInVahid: yearInVahid,
        vahid: vahid,
        kulliShay: kulliShay,
        BE: BE,
        badiCalendar: badiCalendar,
        unicodeCharForZero: unicodeCharForZero,
        defaultFormat: defaultFormat
    });

    const month$1 = {
        1: 'البهاء',
        2: 'الجلال',
        3: 'الجمال',
        4: 'العظمة',
        5: 'النور',
        6: 'الرحمة',
        7: 'الكلمات',
        8: 'الكمال',
        9: 'الأسماء',
        10: 'العزّة',
        11: 'المشية',
        12: 'العلم',
        13: 'القدرة',
        14: 'القول',
        15: 'المسائل',
        16: 'الشرف',
        17: 'السلطان',
        18: 'الملك',
        19: 'العلاء',
        20: 'ايام الهاء',
    };
    const monthL$1 = month$1;
    const holyDay$1 = {
        1: 'عيد النَّيروز',
        2: 'اليوم الأول من عيد الرِّضوان',
        3: 'اليوم التاسع من عيد الرِّضوان',
        4: 'اليوم الثاني عشر من عيد الرِّضوان',
        5: 'يوم إعلان دعوة حضرة الباب',
        6: 'يوم صعود حضرة بهاء الله',
        7: 'يوم استشهاد حضرة الباب',
        8: 'يوم ولادة حضرة الباب',
        9: 'يوم ولادة حضرة بهاء الله',
        10: 'يوم الميثاق',
        11: 'يوم صعود حضرة عبد البهاء',
    };
    const weekday$1 = {
        1: 'الجلال',
        2: 'الجمال',
        3: 'الكمال',
        4: 'الفضّال',
        5: 'العدّال',
        6: 'الأستجلال',
        7: 'الاستقلال',
    };
    const weekdayAbbr3$1 = {
        1: 'جلا',
        2: 'جما',
        3: 'كما',
        4: 'فضّا',
        5: 'عدّا',
        6: 'اسج',
        7: 'اسق',
    };
    const weekdayAbbr2$1 = {
        1: 'جل',
        2: 'جم',
        3: 'كم',
        4: 'فض',
        5: 'عد',
        6: 'اج',
        7: 'اق',
    };
    const weekdayL$1 = {
        1: 'الجلال',
        2: 'الجمال',
        3: 'الكمال',
        4: 'الفضّال',
        5: 'العدّال',
        6: 'الأستجلال',
        7: 'أستقلال',
    };
    const yearInVahid$1 = {
        1: 'ألف',
        2: 'باء',
        3: 'أب',
        4: 'دﺍﻝ',
        5: 'باب',
        6: 'وﺍو',
        7: 'أبد',
        8: 'جاد',
        9: 'بهاء',
        10: 'حب',
        11: 'بهاج',
        12: 'جواب',
        13: 'احد',
        14: 'وﻫﺎب',
        15: 'وداد',
        16: 'بدیع',
        17: 'بهي',
        18: 'ابهى',
        19: 'واحد',
    };
    const vahid$1 = 'واحد';
    const kulliShay$1 = 'كل شيء';
    const BE$1 = 'بديع';
    const badiCalendar$1 = 'تقويم بديع';
    const unicodeCharForZero$1 = '٠';
    const defaultFormat$1 = '&#8207;d MM y BE&#8207;';

    var ar = /*#__PURE__*/Object.freeze({
        __proto__: null,
        month: month$1,
        monthL: monthL$1,
        holyDay: holyDay$1,
        weekday: weekday$1,
        weekdayAbbr3: weekdayAbbr3$1,
        weekdayAbbr2: weekdayAbbr2$1,
        weekdayL: weekdayL$1,
        yearInVahid: yearInVahid$1,
        vahid: vahid$1,
        kulliShay: kulliShay$1,
        BE: BE$1,
        badiCalendar: badiCalendar$1,
        unicodeCharForZero: unicodeCharForZero$1,
        defaultFormat: defaultFormat$1
    });

    const monthL$2 = {
        1: 'Herrlichkeit',
        2: 'Ruhm',
        3: 'Schönheit',
        4: 'Größe',
        5: 'Licht',
        6: 'Barmherzigkeit',
        7: 'Worte',
        8: 'Vollkommenheit',
        9: 'Namen',
        10: 'Macht',
        11: 'Wille',
        12: 'Wissen',
        13: 'Kraft',
        14: 'Sprache',
        15: 'Fragen',
        16: 'Ehre',
        17: 'Souveränität',
        18: 'Herrschaft',
        19: 'Erhabenheit',
        20: 'Ayyám-i-Há',
    };
    const holyDay$2 = {
        1: 'Naw-Rúz',
        2: 'Erster Riḍván-Tag',
        3: 'Neunter Riḍván-Tag',
        4: 'Zwölfter Riḍván-Tag',
        5: 'Erklärung des Báb',
        6: 'Hinscheiden Bahá’u’lláhs',
        7: 'Märtyrertod des Báb',
        8: 'Geburt des Báb',
        9: 'Geburt Bahá’u’lláhs',
        10: 'Tag des Bundes',
        11: 'Hinscheiden ‘Abdu’l-Bahás',
    };
    const weekdayL$2 = {
        1: 'Ruhm',
        2: 'Schönheit',
        3: 'Vollkommenheit',
        4: 'Gnade',
        5: 'Gerechtigkeit',
        6: 'Majestät',
        7: 'Unabhängigkeit',
    };
    const BE$2 = 'B.E.';
    const badiCalendar$2 = 'Badí‘ Kalender';

    var de = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$2,
        holyDay: holyDay$2,
        weekdayL: weekdayL$2,
        BE: BE$2,
        badiCalendar: badiCalendar$2
    });

    const monthL$3 = {
        1: 'Esplendor',
        2: 'Gloria',
        3: 'Belleza',
        4: 'Grandeza',
        5: 'Luz',
        6: 'Misericordia',
        7: 'Palabras',
        8: 'Perfección',
        9: 'Nombres',
        10: 'Fuerza',
        11: 'Voluntad',
        12: 'Conocimiento',
        13: 'Poder',
        14: 'Discurso',
        15: 'Preguntas',
        16: 'Honor',
        17: 'Soberanía',
        18: 'Dominio',
        19: 'Sublimidad',
        20: 'Ayyám-i-Há',
    };
    const holyDay$3 = {
        1: 'Naw-Rúz',
        2: 'Primer día de Riḍván',
        3: 'Noveno día de Riḍván',
        4: 'Duodécimo día de Riḍván',
        5: 'Declaración del Báb',
        6: 'Ascensión de Bahá’u’lláh',
        7: 'Martirio del Báb',
        8: 'Nacimiento del Báb',
        9: 'Nacimiento de Bahá’u’lláh',
        10: 'Día de la Alianza',
        11: 'Fallecimiento de ‘Abdu’l-Bahá',
    };
    const weekdayL$3 = {
        1: 'Gloria',
        2: 'Belleza',
        3: 'Perfección',
        4: 'Gracia',
        5: 'Justicia',
        6: 'Majestuosidad',
        7: 'Independencia',
    };
    const BE$3 = 'E.B.';
    const badiCalendar$3 = 'Calendario Badí‘';

    var es = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$3,
        holyDay: holyDay$3,
        weekdayL: weekdayL$3,
        BE: BE$3,
        badiCalendar: badiCalendar$3
    });

    const month$2 = {
        1: 'البهاء',
        2: 'الجلال',
        3: 'الجمال',
        4: 'العظمة',
        5: 'النور',
        6: 'الرحمة',
        7: 'الكلمات',
        8: 'الكمال',
        9: 'الأسماء',
        10: 'العزّة',
        11: 'المشية',
        12: 'العلم',
        13: 'القدرة',
        14: 'القول',
        15: 'المسائل',
        16: 'الشرف',
        17: 'السلطان',
        18: 'الملك',
        19: 'العلاء',
        20: 'ايام الهاء',
    };
    const monthL$4 = {
        1: 'بهاء',
        2: 'جلال',
        3: 'جمال',
        4: 'عظمت',
        5: 'نور',
        6: 'رحمت',
        7: 'كلمات',
        8: 'كمال',
        9: 'أسماء',
        10: 'عزّت',
        11: 'مشيت',
        12: 'علم',
        13: 'قدرت',
        14: 'قول',
        15: 'مسائل',
        16: 'شرف',
        17: 'سلطان',
        18: 'ملك',
        19: 'علاء',
        20: 'ايام ها',
    };
    const holyDay$4 = {
        1: 'عید نوروز',
        2: 'روز اوّل عید رضوان',
        3: 'روز نهم عید رضوان',
        4: 'روز دوازدهم عید رضوان',
        5: 'بعثت حضرت باب',
        6: 'صعود حضرت بهاالله',
        7: 'شهادت حضرت اعلی',
        8: 'تولّد حضرت اعلی',
        9: 'تولّد حضرت بهالله',
        10: 'روز عهد و میثاق',
        11: 'صعود حضرت عبدالبها',
    };
    const weekday$2 = {
        1: 'یوم الجلال',
        2: 'یوم الجمال',
        3: 'یوم الكمال',
        4: 'یوم الفضّال',
        5: 'یوم العدّال',
        6: 'یوم الأستجلال',
        7: 'یوم الاستقلال',
    };
    const weekdayAbbr3$2 = {
        1: 'جلا',
        2: 'جما',
        3: 'كما',
        4: 'فضّا',
        5: 'عدّا',
        6: 'اسج',
        7: 'اسق',
    };
    const weekdayAbbr2$2 = {
        1: 'جل',
        2: 'جم',
        3: 'كم',
        4: 'فض',
        5: 'عد',
        6: 'اج',
        7: 'اق',
    };
    const weekdayL$4 = {
        1: 'جلال',
        2: 'جمال',
        3: 'كمال',
        4: 'فضّال',
        5: 'عدّال',
        6: 'استجلال',
        7: 'استقلال',
    };
    const yearInVahid$2 = {
        1: 'ألف',
        2: 'باء',
        3: 'أب',
        4: 'دﺍﻝ',
        5: 'باب',
        6: 'وﺍو',
        7: 'أبد',
        8: 'جاد',
        9: 'بهاء',
        10: 'حب',
        11: 'بهاج',
        12: 'جواب',
        13: 'احد',
        14: 'وﻫﺎب',
        15: 'وداد',
        16: 'بدیع',
        17: 'بهي',
        18: 'ابهى',
        19: 'واحد',
    };
    const vahid$2 = 'واحد';
    const kulliShay$2 = 'كل شيء';
    const BE$4 = 'بديع';
    const badiCalendar$4 = 'تقويم بديع';
    const unicodeCharForZero$2 = '۰';
    const defaultFormat$2 = '&#8207;d MML y BE&#8207;';

    var fa = /*#__PURE__*/Object.freeze({
        __proto__: null,
        month: month$2,
        monthL: monthL$4,
        holyDay: holyDay$4,
        weekday: weekday$2,
        weekdayAbbr3: weekdayAbbr3$2,
        weekdayAbbr2: weekdayAbbr2$2,
        weekdayL: weekdayL$4,
        yearInVahid: yearInVahid$2,
        vahid: vahid$2,
        kulliShay: kulliShay$2,
        BE: BE$4,
        badiCalendar: badiCalendar$4,
        unicodeCharForZero: unicodeCharForZero$2,
        defaultFormat: defaultFormat$2
    });

    const monthL$5 = {
        1: 'Splendeur',
        2: 'Gloire',
        3: 'Beauté',
        4: 'Grandeur',
        5: 'Lumière',
        6: 'Miséricorde',
        7: 'Paroles',
        8: 'Perfection',
        9: 'Noms',
        10: 'Puissance',
        11: 'Volonté',
        12: 'Connaissance',
        13: 'Pouvoir',
        14: 'Discours',
        15: 'Questions',
        16: 'Honneur',
        17: 'Souveraineté',
        18: 'Empire',
        19: 'Élévation',
        20: 'Ayyám-i-Há',
    };
    const holyDay$5 = {
        1: 'Naw-Rúz',
        2: 'Premier jour de Riḍván',
        3: 'Neuvième jour de Riḍván',
        4: 'Douzième jour de Riḍván',
        5: 'Déclaration du Báb',
        6: 'Ascension de Bahá’u’lláh',
        7: 'Martyre du Báb',
        8: 'Naissance du Báb',
        9: 'Naissance de Bahá’u’lláh',
        10: 'Jour de l’Alliance',
        11: 'Ascension de ‘Abdu’l-Bahá',
    };
    const weekdayL$5 = {
        1: 'Gloire',
        2: 'Beauté',
        3: 'Perfection',
        4: 'Grâce',
        5: 'Justice',
        6: 'Majesté',
        7: 'Indépendance',
    };
    const BE$5 = 'E.B.';
    const badiCalendar$5 = 'Calendrier Badí‘';

    var fr = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$5,
        holyDay: holyDay$5,
        weekdayL: weekdayL$5,
        BE: BE$5,
        badiCalendar: badiCalendar$5
    });

    const monthL$6 = {
        1: 'Spožums',
        2: 'Slava',
        3: 'Skaistums',
        4: 'Dižums',
        5: 'Gaisma',
        6: 'Žēlastība',
        7: 'Vārdi',
        8: 'Pilnība',
        9: 'Nosaukumi',
        10: 'Varenība',
        11: 'Griba',
        12: 'Zināšanas',
        13: 'Vara',
        14: 'Runa',
        15: 'Jautājumi',
        16: 'Gods',
        17: 'Suverenitāte',
        18: 'Valdīšana',
        19: 'Cēlums',
        20: 'Ayyám-i-Há',
    };
    const holyDay$6 = {
        1: 'Naw-Rúz',
        2: 'Riḍván pirmā diena',
        3: 'Riḍván devītā diena',
        4: 'Riḍván divpadsmitā diena',
        5: 'Bába paziņojums',
        6: 'Bahá’u’lláh Debessbraukšana',
        7: 'Bába mocekļa nāve',
        8: 'Bába dzimšanas diena',
        9: 'Bahá’u’lláh dzimšanas diena',
        10: 'Derības diena',
        11: '‘Abdu’l-Bahá Debessbraukšana',
    };
    const weekdayL$6 = {
        1: 'Slava',
        2: 'Skaistums',
        3: 'Pilnība',
        4: 'Žēlastība',
        5: 'Taisnīgums',
        6: 'Majestātiskums',
        7: 'Neatkarība',
    };
    const BE$6 = 'B.Ē.';
    const badiCalendar$6 = 'Badí‘ kalendārs';

    var lv = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$6,
        holyDay: holyDay$6,
        weekdayL: weekdayL$6,
        BE: BE$6,
        badiCalendar: badiCalendar$6
    });

    const monthL$7 = {
        1: 'Pracht',
        2: 'Heerlijkheid',
        3: 'Schoonheid',
        4: 'Grootheid',
        5: 'Licht',
        6: 'Barmhartigheid',
        7: 'Woorden',
        8: 'Volmaaktheid',
        9: 'Namen',
        10: 'Macht',
        11: 'Wil',
        12: 'Kennis',
        13: 'Kracht',
        14: 'Spraak',
        15: 'Vragen',
        16: 'Eer',
        17: 'Soevereiniteit',
        18: 'Heerschappij',
        19: 'Verhevenheid',
        20: 'Ayyám-i-Há',
    };
    const holyDay$7 = {
        1: 'Naw-Rúz',
        2: 'Eerste dag van Riḍván',
        3: 'Negende dag van Riḍván',
        4: 'Twaalfde dag van Riḍván',
        5: 'Verkondiging van de Báb',
        6: 'Heengaan van Bahá’u’lláh',
        7: 'Marteldood van de Báb',
        8: 'Geboortedag van de Báb',
        9: 'Geboortedag van Bahá’u’lláh',
        10: 'Dag van het Verbond',
        11: 'Heengaan van ‘Abdu’l-Bahá',
    };
    const weekdayL$7 = {
        1: 'Heerlijkheid',
        2: 'Schoonheid',
        3: 'Volmaaktheid',
        4: 'Genade',
        5: 'Gerechtigheid',
        6: 'Majesteit',
        7: 'Onafhankelijkheid',
    };
    const BE$7 = 'B.E.';
    const badiCalendar$7 = 'Badí‘-Kalender';

    var nl = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$7,
        holyDay: holyDay$7,
        weekdayL: weekdayL$7,
        BE: BE$7,
        badiCalendar: badiCalendar$7
    });

    const monthL$8 = {
        1: 'Esplendor',
        2: 'Glória',
        3: 'Beleza',
        4: 'Grandeza',
        5: 'Luz',
        6: 'Miséricórdia',
        7: 'Palavras',
        8: 'Perfeição',
        9: 'Nomes',
        10: 'Potência',
        11: 'Vontade',
        12: 'Conhecimento',
        13: 'Poder',
        14: 'Discurso',
        15: 'Perguntas',
        16: 'Honra',
        17: 'Soberania',
        18: 'Domínio',
        19: 'Sublimidade',
        20: 'Ayyám-i-Há',
    };
    const holyDay$8 = {
        1: 'Naw-Rúz',
        2: '1º dia do Riḍván',
        3: '9º dia do Riḍván',
        4: '12º dia do Riḍván',
        5: 'Declaração do Báb',
        6: 'Ascensão de Bahá’u’lláh',
        7: 'Martírio do Báb',
        8: 'Aniversário do Báb',
        9: 'Aniversário de Bahá’u’lláh',
        10: 'Dia do Convênio',
        11: 'Ascensão de ‘Abdu’l-Bahá',
    };
    const weekdayL$8 = {
        1: 'Glória',
        2: 'Beleza',
        3: 'Perfeição',
        4: 'Graça',
        5: 'Justiça',
        6: 'Majestade',
        7: 'Independência',
    };
    const BE$8 = 'E.B.';
    const badiCalendar$8 = 'Calendário Badí‘';

    var pt = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$8,
        holyDay: holyDay$8,
        weekdayL: weekdayL$8,
        BE: BE$8,
        badiCalendar: badiCalendar$8
    });

    const month$3 = {
        1: 'Бахā',
        2: 'Джалāл',
        3: 'Джамāл',
        4: '‘Аз̣амат',
        5: 'Нӯр',
        6: 'Рах̣мат',
        7: 'Калимāт',
        8: 'Камāл',
        9: 'Асмā’',
        10: '‘Иззат',
        11: 'Машӣййат',
        12: '‘Илм',
        13: 'К̣удрат',
        14: 'К̣аул',
        15: 'Масā’ил',
        16: 'Шараф',
        17: 'Султ̣ан',
        18: 'Мулк',
        19: '‘Алā’',
        20: 'Аййāм-и Хā',
    };
    const monthL$9 = {
        1: 'Великолепие',
        2: 'Слава',
        3: 'Красота',
        4: 'Величие',
        5: 'Свет',
        6: 'Милость',
        7: 'Слова',
        8: 'Совершенство',
        9: 'Имена',
        10: 'Мощь',
        11: 'Воля',
        12: 'Знание',
        13: 'Могущество',
        14: 'Речь',
        15: 'Вопросы',
        16: 'Честь',
        17: 'Владычество',
        18: 'Господство',
        19: 'Возвышенность',
        20: 'Аййāм-и Хā',
    };
    const holyDay$9 = {
        1: 'Нау-Рӯз',
        2: '1-й день Рид̣вāна',
        3: '9-й день Рид̣вāна',
        4: '12-й день Рид̣вāна',
        5: 'Возвещение Баба',
        6: 'Вознесение Бахауллы',
        7: 'Мученическая Баба',
        8: 'рождения Баба',
        9: 'рождения Бахауллы',
        10: 'День Завета',
        11: 'Вознесение Абдул-Баха',
    };
    const weekday$3 = {
        1: 'Джалāл',
        2: 'Джамāл',
        3: 'Камāл',
        4: 'Фид̣āл',
        5: '‘Идāл',
        6: 'Истиджлāл',
        7: 'Истик̣лāл',
    };
    const weekdayAbbr3$3 = {
        1: 'Джл',
        2: 'Джм',
        3: 'Кам',
        4: 'Фид̣',
        5: '‘Идā',
        6: 'Исд',
        7: 'Иск̣',
    };
    const weekdayAbbr2$3 = {
        1: 'Дл',
        2: 'Дм',
        3: 'Ка',
        4: 'Фи',
        5: '‘Ид',
        6: 'Ид',
        7: 'Ик̣',
    };
    const weekdayL$9 = {
        1: 'Слава',
        2: 'Красота',
        3: 'Совершенство',
        4: 'Благодать',
        5: 'Справедливость',
        6: 'Величие',
        7: 'Независимость',
    };
    const yearInVahid$3 = {
        1: 'Алиф',
        2: 'Бā’',
        3: 'Аб',
        4: 'Дāл',
        5: 'Бāб',
        6: 'Вāв',
        7: 'Абад',
        8: 'Джāд',
        9: 'Бахā',
        10: 'Х̣убб',
        11: 'Баххāдж',
        12: 'Джавāб',
        13: 'Ах̣ад',
        14: 'Ваххāб',
        15: 'Видāд',
        16: 'Бадӣ‘',
        17: 'Бахӣ',
        18: 'Абхā',
        19: 'Вāх̣ид',
    };
    const vahid$3 = 'Вāх̣ид';
    const kulliShay$3 = 'кулл-и шай’';
    const BE$9 = 'Э.Б.';
    const badiCalendar$9 = 'Календарь Бадӣ‘';

    var ru = /*#__PURE__*/Object.freeze({
        __proto__: null,
        month: month$3,
        monthL: monthL$9,
        holyDay: holyDay$9,
        weekday: weekday$3,
        weekdayAbbr3: weekdayAbbr3$3,
        weekdayAbbr2: weekdayAbbr2$3,
        weekdayL: weekdayL$9,
        yearInVahid: yearInVahid$3,
        vahid: vahid$3,
        kulliShay: kulliShay$3,
        BE: BE$9,
        badiCalendar: badiCalendar$9
    });

    const monthL$a = {
        1: 'Praktfullhet',
        2: 'Härlighet',
        3: 'Skönhet',
        4: 'Storhet',
        5: 'Ljus',
        6: 'Barmhärtighet',
        7: 'Ord',
        8: 'Fullkomlighet',
        9: 'Namn',
        10: 'Makt',
        11: 'Vilja',
        12: 'Kunskap',
        13: 'Kraft',
        14: 'Tal',
        15: 'Frågor',
        16: 'Ära',
        17: 'Överhöghet',
        18: 'Herravälde',
        19: 'Upphöjdhet',
        20: 'Ayyám-i-Há',
    };
    const holyDay$a = {
        1: 'Naw-Rúz',
        2: 'Första Riḍván',
        3: 'Nionde Riḍván',
        4: 'Tolfte Riḍván',
        5: 'Bábs Deklaration',
        6: 'Bahá’u’lláhs Bortgång',
        7: 'Bábs Martyrskap',
        8: 'Bábs Födelse',
        9: 'Bahá’u’lláhs Födelse',
        10: 'Förbundets dag',
        11: '‘Abdu’l-Bahás Bortgång',
    };
    const weekdayL$a = {
        1: 'Härlighet',
        2: 'Skönhet',
        3: 'Fullkomlighet',
        4: 'Nåd',
        5: 'Rättvisa',
        6: 'Majestät',
        7: 'Oberoende',
    };
    const BE$a = 'B.E.';
    const badiCalendar$a = 'Badí‘kalendern';

    var sv = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$a,
        holyDay: holyDay$a,
        weekdayL: weekdayL$a,
        BE: BE$a,
        badiCalendar: badiCalendar$a
    });

    const month$4 = {
        1: '巴哈',
        2: '贾拉勒',
        3: '贾迈勒',
        4: '阿泽迈特',
        5: '努尔',
        6: '拉赫迈特',
        7: '凯利马特',
        8: '卡迈勒',
        9: '艾斯玛',
        10: '伊扎特',
        11: '迈希耶特',
        12: '伊勒姆',
        13: '古德雷特',
        14: '高勒',
        15: '迈萨伊勒',
        16: '谢拉夫',
        17: '苏丹',
        18: '穆勒克',
        19: '阿拉',
        20: '阿亚米哈',
    };
    const monthL$b = {
        1: '耀',
        2: '辉',
        3: '美',
        4: '宏',
        5: '光',
        6: '仁',
        7: '言',
        8: '完',
        9: '名',
        10: '能',
        11: '意',
        12: '知',
        13: '力',
        14: '语',
        15: '问',
        16: '尊',
        17: '权',
        18: '统',
        19: '崇',
        20: '哈之日',
    };
    const holyDay$b = {
        1: '诺鲁孜节',
        2: '里兹万节第一日',
        3: '里兹万节第九日',
        4: '里兹万节第十二日',
        5: '巴孛宣示日',
        6: '巴哈欧拉升天日',
        7: '巴孛殉道日',
        8: '巴孛诞辰',
        9: '巴哈欧拉诞辰',
        10: '圣约日',
        11: '阿博都-巴哈升天日',
    };
    const weekday$4 = {
        1: '贾拉勒',
        2: '贾迈勒',
        3: '卡迈勒',
        4: '菲达勒',
        5: '伊达勒',
        6: '伊斯提杰拉勒',
        7: '伊斯提格拉勒',
    };
    const weekdayAbbr3$4 = {
        1: '贾拉勒',
        2: '贾迈勒',
        3: '卡迈勒',
        4: '菲达勒',
        5: '伊达勒',
        6: '伊斯杰',
        7: '伊斯格',
    };
    const weekdayAbbr2$4 = {
        1: '贾拉',
        2: '贾迈',
        3: '卡迈',
        4: '菲达',
        5: '伊达',
        6: '伊杰',
        7: '伊格',
    };
    const weekdayL$b = {
        1: '辉日',
        2: '美日',
        3: '完日',
        4: '恩日',
        5: '正日',
        6: '威日',
        7: '独日',
    };
    const yearInVahid$4 = {
        1: '艾利夫',
        2: '巴',
        3: '艾卜',
        4: '达勒',
        5: '巴卜',
        6: '瓦乌',
        7: '阿巴德',
        8: '贾德',
        9: '巴哈',
        10: '胡卜',
        11: '巴哈杰',
        12: '贾瓦卜',
        13: '阿哈德',
        14: '瓦哈卜',
        15: '维达德',
        16: '巴迪',
        17: '巴希',
        18: '阿卜哈',
        19: '瓦希德',
    };
    const vahid$4 = '瓦希德';
    const kulliShay$4 = '库里沙伊';
    const BE$b = 'BE';
    const badiCalendar$b = '巴迪历';

    var zh = /*#__PURE__*/Object.freeze({
        __proto__: null,
        month: month$4,
        monthL: monthL$b,
        holyDay: holyDay$b,
        weekday: weekday$4,
        weekdayAbbr3: weekdayAbbr3$4,
        weekdayAbbr2: weekdayAbbr2$4,
        weekdayL: weekdayL$b,
        yearInVahid: yearInVahid$4,
        vahid: vahid$4,
        kulliShay: kulliShay$4,
        BE: BE$b,
        badiCalendar: badiCalendar$b
    });

    const monthL$c = {
        1: 'Splendor',
        16: 'Honor',
    };

    var en_us = /*#__PURE__*/Object.freeze({
        __proto__: null,
        monthL: monthL$c
    });

    /* eslint-disable dot-notation, line-comment-position, camelcase, sort-imports */
    const badiLocale = { en, ar, de, es, fa, fr, lv, nl, pt, ru, sv, zh, 'en-us': en_us, default: en };
    const setDefaultLanguage = (language) => {
        if (badiLocale[language] === undefined) {
            // eslint-disable-next-line no-console
            console.log('Chosen language does not exist. Setting has not been changed.');
        }
        else {
            badiLocale['default'] = badiLocale[language];
        }
    };
    let underlineFormat = 'css';
    const setUnderlineFormat = (format) => {
        if (['css', 'u', 'diacritic', 'none'].includes(format)) {
            underlineFormat = format;
        }
        else {
            // eslint-disable-next-line no-console
            console.log('Invalid underline format. Choose one of ["css", "u", "diacritic", "none"]. ' +
                'Setting has not been changed.');
        }
    };

    const formatTokens = [
        ['DDL', 'DD+', 'MML', 'MM+', 'WWL', 'yyv', 'KiS'],
        ['dd', 'DD', 'mm', 'MM', 'ww', 'WW', 'yv', 'YV', 'vv', 'kk', 'yy', 'BE', 'BC', 'Va'],
        ['d', 'D', 'm', 'M', 'W', 'v', 'k', 'y']
    ];
    // eslint-disable-next-line complexity
    const formatBadiDate = (badiDate, formatString, language) => {
        if (!badiDate.isValid) {
            return 'Not a valid Badí‘ date';
        }
        if (typeof language === 'string' && badiLocale[language] === undefined && language.includes('-')) {
            language = language.split('-')[0];
        }
        if (language === undefined || badiLocale[language] === undefined) {
            language = 'default';
        }
        formatString = formatString !== null && formatString !== void 0 ? formatString : formatItemFallback(language, 'defaultFormat');
        let formattedDate = '';
        const length = formatString.length;
        for (let i = 0; i < length; i++) {
            // Text wrapped in {} is output as-is. A '{' without a matching '}'
            // results in invalid input
            if (formatString[i] === '{' && i < length - 1) {
                for (let j = i + 1; j <= length; j++) {
                    if (j === length) {
                        return 'Invalid formatting string.';
                    }
                    if (formatString[j] === '}') {
                        i = j;
                        break;
                    }
                    formattedDate += formatString[j];
                }
            }
            else {
                const next1 = formatString[i];
                const next2 = next1 + formatString[i + 1];
                const next3 = next2 + formatString[i + 2];
                if (formatTokens[0].includes(next3)) {
                    formattedDate += getFormatItem(badiDate, next3, language);
                    i += 2;
                }
                else if (formatTokens[1].includes(next2)) {
                    formattedDate += getFormatItem(badiDate, next2, language);
                    i += 1;
                }
                else if (formatTokens[2].includes(next1)) {
                    formattedDate += getFormatItem(badiDate, next1, language);
                }
                else {
                    formattedDate += next1;
                }
            }
        }
        return formattedDate;
    };
    // eslint-disable-next-line complexity
    const getFormatItem = (badiDate, token, language) => {
        switch (token) {
            // Single character tokens
            case 'd':
                return digitRewrite(badiDate.day, language);
            case 'D':
                return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.day), 3);
            case 'm':
                return digitRewrite(badiDate.month, language);
            case 'M':
                return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.month), 3);
            case 'W':
                return formatItemFallback(language, 'weekdayAbbr3', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
            case 'y':
                return digitRewrite(badiDate.year, language);
            case 'v':
                return digitRewrite((Math.floor((badiDate.year - 1) / 19) % 19) + 1, language);
            case 'k':
                return digitRewrite(Math.floor((badiDate.year - 1) / 361) + 1, language);
            // Two character tokens
            case 'dd':
                return digitRewrite((`0${String(badiDate.day)}`).slice(-2), language);
            case 'DD':
                return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.day));
            case 'mm':
                return digitRewrite((`0${String(badiDate.month)}`).slice(-2), language);
            case 'MM':
                return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.month));
            case 'ww':
                return formatItemFallback(language, 'weekdayAbbr2', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
            case 'WW':
                return formatItemFallback(language, 'weekday', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
            case 'yy':
                return digitRewrite((`00${String(badiDate.year)}`).slice(-3), language);
            case 'yv':
                return digitRewrite((badiDate.year - 1) % 19 + 1, language);
            case 'YV':
                return formatItemFallback(language, 'yearInVahid', (badiDate.year - 1) % 19 + 1);
            case 'vv':
                return digitRewrite((`0${String((Math.floor((badiDate.year - 1) / 19) + 2) % 19 - 1)}`).slice(-2), language);
            case 'kk':
                return digitRewrite((`0${String(Math.floor((badiDate.year - 1) / 361) + 1)}`).slice(-2), language);
            case 'Va':
                return formatItemFallback(language, 'vahid');
            case 'BE':
                return formatItemFallback(language, 'BE');
            case 'BC':
                return formatItemFallback(language, 'badiCalendar');
            // Three character tokens
            case 'DDL':
                return formatItemFallback(language, 'monthL', badiDate.day);
            case 'DD+': {
                const day = postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.day));
                const dayL = formatItemFallback(language, 'monthL', badiDate.day);
                if (day === dayL) {
                    return day;
                }
                if (badiLocale[language] === badiLocale.fa) {
                    return `<span dir="rtl">${day} (${dayL})</span>`;
                }
                return `${day} (${dayL})`;
            }
            case 'MML':
                return formatItemFallback(language, 'monthL', badiDate.month);
            case 'MM+': {
                const month = postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.month));
                const monthL = formatItemFallback(language, 'monthL', badiDate.month);
                if (month === monthL) {
                    return month;
                }
                if (badiLocale[language] === badiLocale.fa) {
                    return `<span dir="rtl">${month} (${monthL})</span>`;
                }
                return `${month} (${monthL})`;
            }
            case 'WWL':
                return formatItemFallback(language, 'weekdayL', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
            case 'yyv':
                return digitRewrite((`0${String((badiDate.year - 1) % 19 + 1)}`).slice(-2), language);
            case 'KiS':
                return postProcessLocaleItem(formatItemFallback(language, 'kulliShay'));
            // istanbul ignore next
            default:
                return '';
        }
    };
    const postProcessLocaleItem = (item, crop) => {
        if (crop && crop < item.length) {
            let char = 0;
            let counter = 0;
            while (counter < crop) {
                if (!'_’‘'.includes(item[char])) {
                    counter++;
                }
                char++;
            }
            if ('_’‘'.includes(item[char])) {
                char++;
            }
            item = item.slice(0, char);
            if (item.split('_').length % 2 === 0) {
                item += '_';
            }
        }
        const stringComponents = item.split('_');
        for (let i = 1; i < stringComponents.length; i += 2) {
            stringComponents[i] = underlineString(stringComponents[i]);
        }
        return stringComponents.join('');
    };
    const underlineString = (str) => {
        switch (underlineFormat) {
            case 'css':
                return `<span style="text-decoration:underline">${str}</span>`;
            case 'diacritic':
                return str.split('').map(char => `${char}\u0332`).join('');
            case 'u':
                return `<u>${str}</u>`;
            case 'none':
                return str;
            // istanbul ignore next
            default:
                throw new TypeError('Unexpected underlineFormat');
        }
    };
    const digitRewrite = (number, language) => {
        number = String(number);
        const unicodeOffset = formatItemFallback(language, 'unicodeCharForZero').charCodeAt(0) - '0'.charCodeAt(0);
        if (unicodeOffset === 0) {
            return number;
        }
        const codePoints = [...number].map(num => num.charCodeAt(0) + unicodeOffset);
        return String.fromCharCode(...codePoints);
    };
    const formatItemFallback = (language, category, index) => {
        var _a;
        if (index === undefined) {
            while (badiLocale[language][category] === undefined) {
                language = languageFallback(language);
            }
            return badiLocale[language][category];
        }
        while (((_a = badiLocale[language][category]) === null || _a === void 0 ? void 0 : _a[index]) === undefined) {
            language = languageFallback(language);
        }
        return badiLocale[language][category][index];
    };
    const languageFallback = (languageCode) => {
        if (languageCode.includes('-')) {
            return languageCode.split('-')[0];
            // eslint-disable-next-line no-negated-condition
        }
        else if (languageCode !== 'default') {
            return 'default';
        }
        return 'en';
    };

    const badiYears = [
        'l4da', 'k4ci', 'k5c7', 'l4d6', 'l4ce', 'k4c4', 'k5d4', 'l4cb', 'l4c1', 'k4cj', 'k5c8', 'l4d7', 'l4cf', 'k4c5',
        'k4d5', 'k5ce', 'l4c2', 'k4d2', 'k4ca', 'k5da', 'l4ch', 'k4c6', 'k4d6', 'k5cf', 'l4c4', 'k4d4', 'k4cc', 'k5c1',
        'l4cj', 'k4c8', 'k4d8', 'k5cg', 'l4c5', 'k4d5', 'k4ce', 'k5c3', 'l4d2', 'k4ca', 'k4d9', 'k5ci', 'l4c6', 'k4d6',
        'k4cf', 'k4c4', 'k5d4', 'k4cb', 'k4bj', 'k4cj', 'k5c9', 'k4d8', 'k4cg', 'k4c6', 'k5d6', 'k4cd', 'k4c2', 'k4d2',
        'k5ca', 'k4d9', 'k4ci', 'k4c7', 'k5d7', 'k4cf', 'k4c4', 'k4d4', 'k5cc', 'k4bj', 'k4cj', 'k4c9', 'k5d9', 'k4cg',
        'k4c6', 'k4d5', 'k5cd', 'k4c2', 'k4d1', 'k4ca', 'k4da', 'j5cj', 'k4c7', 'k4d7', 'k4cf', 'j5c4', 'k4d3', 'k4cb',
        'k4c1', 'k5d1', 'l4c9', 'l4d9', 'l4ch', 'k5c6', 'l4d5', 'l4cd', 'l4c2', 'k5d2', 'l4ca', 'l4da', 'l4cj', 'k5c8',
        'l4d7', 'l4cf', 'l4c4', 'k5d4', 'l4cb', 'l4c1', 'l4d1', 'k5c9', 'l4d8', 'l4cg', 'l4c5', 'k4d5', 'k5ce', 'l4c2',
        'l4d2', 'k4cb', 'k5db', 'l4ci', 'l4c7', 'k4d7', 'k5cf', 'l4c4', 'l4d4', 'k4cc', 'k5c2', 'l4d1', 'l4c9', 'k4d9',
        'k5ch', 'l4c5', 'l4d5', 'k4ce', 'k5c3', 'l4d2', 'l4cb', 'k4da', 'k5ci', 'l4c6', 'l4d6', 'k4cf', 'k5c5', 'l4d4',
        'l4cc', 'k4c1', 'k4d1', 'k5c9', 'l4d8', 'k4cg', 'k4c6', 'k5d6', 'l4ce', 'k4c3', 'k4d3', 'k5cb', 'l4da', 'k4ci',
        'k4c7', 'k5d7', 'l4cf', 'k4c5', 'k4d5', 'k5cd', 'l4c1', 'k4cj', 'k4c9', 'k5d9', 'l4cg', 'k4c6', 'k4d6', 'k5ce',
        'l4c3', 'k4d2', 'k4ca', 'k5bj', 'l4ci', 'k4c7', 'k4d7', 'k4cg', 'k5c5', 'k4d4', 'k4cc', 'k4c1', 'k5d1', 'k4c9',
        'k4d9', 'k4ch', 'k5c7', 'l4d6', 'l4ce', 'l4c3', 'l5d3', 'l4ca', 'l4da', 'l4cj', 'l5c8', 'l4d7', 'l4cg', 'l4c5',
        'l5d4', 'l4cb', 'l4c1', 'l4d1', 'l5ca', 'l4d9', 'l4ch', 'l4c6', 'l5d6', 'l4cd', 'l4c2', 'l4d2', 'l4cb', 'k5c1',
        'l4cj', 'l4c8', 'l4d8', 'k5cg', 'l4c4', 'l4d4', 'l4cc', 'k5c2', 'l4d1', 'l4ca', 'l4da', 'k5ci', 'l4c6', 'l4d5',
        'l4ce', 'k5c3', 'l4d2', 'l4cb', 'l4db', 'k5cj', 'l4c8', 'l4d7', 'l4cf', 'k5c5', 'l4d4', 'l4cc', 'l4c2', 'k5d2',
        'l4c9', 'l4d9', 'l4ch', 'k4c6', 'k5d6', 'l4ce', 'l4c3', 'k4d3', 'k5cc', 'l4db', 'l4cj', 'k4c8', 'k5d8', 'l4cf',
        'l4c4', 'k4d5', 'k5cd', 'l4c2', 'l4d2', 'k4ca', 'k5d9', 'l4cg', 'l4c6', 'k4d6', 'k5cf', 'l4c3', 'l4d3', 'k4cb',
        'k5bj', 'l4ci', 'l4c7', 'k4d7', 'k5cg', 'l4c5', 'l4d5', 'k4cd', 'k4c2', 'k5d2', 'l4c9', 'k4d9', 'k4ch', 'k5c7',
        'l4d6', 'k4cf', 'k4c4', 'k5d4', 'l4cb', 'l4bj', 'l4cj', 'l5c8', 'm4d7', 'l4cg', 'l4c5', 'l5d5', 'm4cc', 'l4c1',
        'l4d1', 'l5ca', 'm4d9', 'l4ch', 'l4c7', 'l5d7', 'm4ce', 'l4c3', 'l4d3', 'l5cb', 'm4bi', 'l4ci', 'l4c8', 'l4d8',
        'l5ch', 'l4c5', 'l4d5', 'l4cd', 'l5c2', 'l4d1', 'l4c9', 'l4da', 'l5ci', 'l4c7', 'l4d7', 'l4cf', 'l5c4', 'l4d2',
        'l4cb', 'l4bj', 'l5d1', 'l4c8', 'l4d8', 'l4cg', 'l5c5', 'l4d4', 'l4cc', 'l4c2', 'l5d2', 'l4c9', 'l4da', 'l4ci',
    ];

    class BadiDate {
        constructor(date) {
            this._holyDay = undefined;
            this._valid = true;
            this._invalidReason = undefined;
            try {
                if (this._isDateObject(date)) {
                    this._gregorianDate = luxon.DateTime.fromObject({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), zone: 'UTC' });
                }
                else if (luxon.DateTime.isDateTime(date)) {
                    this._gregorianDate = luxon.DateTime.fromObject({ year: date.year, month: date.month, day: date.day, zone: 'UTC' });
                }
                else if (this._isYearMonthDay(date) || this._isYearHolyDayNumber(date)) {
                    this._setFromBadiDate(date);
                }
                else {
                    throw new TypeError('Unrecognized input format');
                }
                if (this._year === undefined) {
                    // We haven't set the Badí' date yet
                    this._setFromGregorianDate();
                }
                this._setHolyDay();
            }
            catch (err) {
                this._setInvalid(err);
            }
            Object.freeze(this);
        }
        format(formatString, language) {
            return formatBadiDate(this, formatString, language);
        }
        _isDateObject(arg) {
            return Object.prototype.toString.call(arg) === '[object Date]';
        }
        _isYearMonthDay(arg) {
            return typeof arg.year === 'number' && typeof arg.month === 'number' &&
                typeof arg.day === 'number';
        }
        _isYearHolyDayNumber(arg) {
            return typeof arg.year === 'number' && arg.month === undefined &&
                arg.day === undefined && typeof arg.holyDayNumber === 'number';
        }
        _notInValidGregorianDateRange(datetime) {
            const lowerBound = luxon.DateTime.fromObject({ year: 1844, month: 3, day: 21, zone: 'UTC' });
            const upperBound = luxon.DateTime.fromObject({ year: 2351, month: 3, day: 20, zone: 'UTC' });
            return datetime < lowerBound || datetime > upperBound;
        }
        _setFromGregorianDate() {
            if (this._notInValidGregorianDateRange(this._gregorianDate)) {
                throw new RangeError('Input date outside of valid range (1844-03-21 - 2351-03-20)');
            }
            const gregorianYear = this._gregorianDate.year;
            const oldImplementationCutoff = luxon.DateTime.fromObject({ year: 2015, month: 3, day: 21, zone: 'UTC' });
            if (this._gregorianDate < oldImplementationCutoff) {
                const { month, day } = this._gregorianDate;
                if (month < 3 || (month === 3 && day < 21)) {
                    this._nawRuz = luxon.DateTime.fromObject({ year: gregorianYear - 1, month: 3, day: 21, zone: 'UTC' });
                    this._year = gregorianYear - 1844;
                }
                else {
                    this._nawRuz = luxon.DateTime.fromObject({ year: gregorianYear, month: 3, day: 21, zone: 'UTC' });
                    this._year = gregorianYear - 1843;
                }
                this._setOldAyyamiHaLength();
                this._yearTwinBirthdays = [12, 5, 13, 9];
            }
            else {
                this._year = gregorianYear - 1843;
                this._setBadiYearInfo(true);
            }
            this._setBadiMonthAndDay();
        }
        /**
         * Set Badí' month and day from Gregorian date
         */
        _setBadiMonthAndDay() {
            const dayOfBadiYear = this._dayOfYear(this._gregorianDate);
            if (dayOfBadiYear < 343) {
                this._month = Math.floor((dayOfBadiYear - 1) / 19 + 1);
                this._day = (dayOfBadiYear - 1) % 19 + 1;
            }
            else if (dayOfBadiYear < 343 + this._ayyamiHaLength) {
                this._month = 20;
                this._day = dayOfBadiYear - 342;
            }
            else {
                this._month = 19;
                this._day = dayOfBadiYear - (342 + this._ayyamiHaLength);
            }
        }
        _setFromBadiDate(date) {
            this._year = date.year;
            if (this._year < 1 || this._year > 507) {
                throw new RangeError('Input date outside of valid range (1 - 507 B.E.)');
            }
            else if (this._year < 172) {
                this._nawRuz = luxon.DateTime.fromObject({ year: 1843 + this._year, month: 3, day: 21, zone: 'UTC' });
                this._setOldAyyamiHaLength();
                this._yearTwinBirthdays = [12, 5, 13, 9];
            }
            else {
                this._setBadiYearInfo();
            }
            if (this._isYearMonthDay(date)) {
                this._month = date.month;
                this._day = date.day;
                if (this._month === 20 && this._day > this._ayyamiHaLength) {
                    // If only off by one day, we'll bubble up so that 5th Ayyám-i-Há in a year with only 4 days of
                    // Ayyám-i-Há can be salvaged
                    if (this._day - this._ayyamiHaLength === 1) {
                        this._month = 19;
                        this._day = 1;
                    }
                    else {
                        throw new TypeError('Input numbers do not designate a valid date');
                    }
                }
                if (this._month < 1 || this._month > 20 || this._day < 1 || this.day > 19) {
                    throw new TypeError('Input numbers do not designate a valid date');
                }
            }
            else {
                if (date.holyDayNumber < 1 || date.holyDayNumber > 11) {
                    throw new TypeError('Input numbers do not designate a valid Holy Day');
                }
                this._holyDay = date.holyDayNumber;
                [this._month, this._day] = this._holyDayMapping()[this._holyDay];
            }
            this._gregorianDate = this._nawRuz.plus(luxon.Duration.fromObject({ days: this._dayOfYear([this._year, this._month, this._day]) - 1 }));
        }
        _setOldAyyamiHaLength() {
            if (luxon.DateTime.fromObject({ year: this._nawRuz.year + 1 }).isInLeapYear) {
                this._ayyamiHaLength = 5;
            }
            else {
                this._ayyamiHaLength = 4;
            }
        }
        _setBadiYearInfo(fromGregorianDate = false) {
            let yearData = this._extractBadiYearInfo();
            if (fromGregorianDate && this._gregorianDate < yearData.nawRuz) {
                this._year -= 1;
                yearData = this._extractBadiYearInfo();
            }
            this._nawRuz = yearData.nawRuz;
            this._ayyamiHaLength = yearData.ayyamiHaLength;
            this._yearTwinBirthdays = yearData.twinBirthdays;
        }
        _extractBadiYearInfo() {
            let nawRuz, ayyamiHaLength, twinBirthdays;
            // Check whether data needs to be unpacked or exists in the verbose version
            // istanbul ignore else
            if (badiYears[0] === 'l4da') {
                const components = badiYears[this._year - 172].split('');
                nawRuz = luxon.DateTime.fromObject({ year: this._year - 172 + 2015, month: 3, day: parseInt(components[0], 36), zone: 'UTC' });
                ayyamiHaLength = parseInt(components[1], 36);
                const TB1 = [parseInt(components[2], 36), parseInt(components[3], 36)];
                const TB2 = TB1[1] < 19 ? [TB1[0], TB1[1] + 1] : [TB1[0] + 1, 1];
                twinBirthdays = [TB1[0], TB1[1], TB2[0], TB2[1]];
            }
            else {
                ({ nawRuz, ayyamiHaLength, twinBirthdays } = badiYears[this._year]);
                nawRuz = luxon.DateTime.fromISO(nawRuz, { zone: 'UTC' });
            }
            return { nawRuz, ayyamiHaLength, twinBirthdays };
        }
        _dayOfYear(date) {
            // Naw-Rúz is day 1
            if (Array.isArray(date)) {
                // We have a Badí' date
                if (date[1] < 19) {
                    return 19 * (date[1] - 1) + date[2];
                }
                else if (date[1] === 20) {
                    return 342 + date[2];
                }
                // date[1] === 19
                return 342 + this._ayyamiHaLength + date[2];
            }
            return date.diff(this._nawRuz).as('days') + 1;
        }
        _setInvalid(invalidReason) {
            this._gregorianDate = luxon.DateTime.invalid('Not a valid Badí‘ date');
            this._year = NaN;
            this._month = NaN;
            this._day = NaN;
            this._ayyamiHaLength = NaN;
            this._nawRuz = luxon.DateTime.invalid('Not a valid Badí‘ date');
            this._valid = false;
            this._invalidReason = invalidReason;
        }
        _setHolyDay() {
            const mapping = this._holyDayMapping();
            this._holyDay = parseInt(Object.keys(mapping)
                .find(key => mapping[key][0] === this._month && mapping[key][1] === this._day), 10);
        }
        _holyDayMapping() {
            return {
                [1 /* NawRuz */]: [1, 1],
                [2 /* FirstRidvan */]: [2, 13],
                [3 /* NinthRidvan */]: [3, 2],
                [4 /* TwelfthRidvan */]: [3, 5],
                [5 /* DeclarationOfTheBab */]: [4, this._year < 172 ? 7 : 8],
                [6 /* AscensionOfBahaullah */]: [4, 13],
                [7 /* MartyrdomOfTheBab */]: [6, this._year < 172 ? 16 : 17],
                [8 /* BirthOfTheBab */]: [this._yearTwinBirthdays[0], this._yearTwinBirthdays[1]],
                [9 /* BirthOfBahaullah */]: [this._yearTwinBirthdays[2], this._yearTwinBirthdays[3]],
                [10 /* DayOfTheCovenant */]: [14, 4],
                [11 /* AscensionOfAbdulBaha */]: [14, 6],
            };
        }
        _leapYearsBefore() {
            let leapYearsBefore = Math.floor(Math.min(this.year - 1, 171) / 4);
            if (this.year > 172) {
                // istanbul ignore else
                if (badiYears[0] === 'l4da') {
                    leapYearsBefore += badiYears.slice(0, this.year - 172).filter(entry => entry[1] === '5').length;
                }
                else {
                    leapYearsBefore += Object.entries(badiYears)
                        .filter(([year, data]) => parseInt(year, 10) < this.year &&
                        data.ayyamiHaLength === 5).length;
                }
            }
            return leapYearsBefore;
        }
        holyDay(language = undefined) {
            if (!this._holyDay) {
                return '';
            }
            if (language === undefined || badiLocale[language] === undefined) {
                language = 'default';
            }
            return formatItemFallback(language, 'holyDay', this._holyDay);
        }
        valueOf() {
            return this._dayOfYear([this.year, this.month, this.day]) + this._leapYearsBefore() + (this.year - 1) * 365;
        }
        equals(other) {
            return this.isValid && other.isValid && this.valueOf() === other.valueOf();
        }
        get isValid() {
            return this._valid;
        }
        get invalidReason() {
            return this._invalidReason;
        }
        get day() {
            return this._day;
        }
        get month() {
            return this._month;
        }
        get year() {
            return this._year;
        }
        // number of the Badí' weekday between 1 (Jalál ~> Saturday) and 7 (Istiqlál ~> Friday).
        get weekday() {
            return (this._gregorianDate.weekday + 1) % 7 + 1;
        }
        get yearInVahid() {
            return (this._year - 1) % 19 + 1;
        }
        get vahid() {
            return (Math.floor((this._year - 1) / 19) % 19) + 1;
        }
        get kullIShay() {
            return Math.floor((this._year - 1) / 361) + 1;
        }
        // Gregorian date on whose sunset the Badí' date ends.
        get gregorianDate() {
            return this._gregorianDate;
        }
        get ayyamiHaLength() {
            return this._ayyamiHaLength;
        }
        get holyDayNumber() {
            return this._holyDay ? this._holyDay : undefined;
        }
        get workSuspended() {
            return this._holyDay ? this.holyDayNumber < 10 : undefined;
        }
        get nextMonth() {
            let { year, month } = this;
            switch (month) {
                case 18:
                    month = 20;
                    break;
                case 19:
                    month = 1;
                    year += 1;
                    break;
                case 20:
                    month = 19;
                    break;
                default:
                    month += 1;
            }
            return new BadiDate({ year, month, day: 1 });
        }
        get previousMonth() {
            let { year, month } = this;
            switch (month) {
                case 1:
                    month = 19;
                    year -= 1;
                    break;
                case 19:
                    month = 20;
                    break;
                case 20:
                    month = 18;
                    break;
                default:
                    month -= 1;
            }
            return new BadiDate({ year, month, day: 1 });
        }
        get nextDay() {
            if (this._day === 19 || (this._month === 20 && this._day === this._ayyamiHaLength)) {
                return this.nextMonth;
            }
            return new BadiDate({ year: this._year, month: this._month, day: this._day + 1 });
        }
        get previousDay() {
            if (this._day === 1) {
                const { previousMonth } = this;
                let day = 19;
                if (this._month === 19) {
                    day = this._ayyamiHaLength;
                }
                return new BadiDate({
                    year: previousMonth.year,
                    month: previousMonth.month,
                    day,
                });
            }
            return new BadiDate({ year: this._year, month: this._month, day: this._day - 1 });
        }
    }
    const badiDateSettings = (settings) => {
        if (settings.defaultLanguage) {
            setDefaultLanguage(settings.defaultLanguage);
        }
        if (settings.underlineFormat) {
            setUnderlineFormat(settings.underlineFormat);
        }
    };

    exports.BadiDate = BadiDate;
    exports.badiDateSettings = badiDateSettings;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
