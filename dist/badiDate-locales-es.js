/**
 * @license BadiDate v2.0.0
 * (c) 2018 Jan Greis
 * licensed under MIT
 */

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
  11: 'Ma<u>sh</u>íyyat',
  12: '‘Ilm',
  13: 'Qudrat',
  14: 'Qawl',
  15: 'Masá’il',
  16: '<u>Sh</u>araf',
  17: 'Sulṭán',
  18: 'Mulk',
  19: '‘Alá’',
  20: 'Ayyám-i-Há'
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
  20: 'Ayyám-i-Há'
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
  11: 'Ascension of ‘Abdu’l-Bahá'
};

// CAREFUL: Numbering corresponds to Badí' week, i.e. 1 is Jalál (-> Saturday)
const weekday = {
  1: 'Jalál',
  2: 'Jamál',
  3: 'Kamál',
  4: 'Fiḍál',
  5: '‘Idál',
  6: 'Istijlál',
  7: 'Istiqlál'
};

const weekdayAbbr3 = {
  1: 'Jal',
  2: 'Jam',
  3: 'Kam',
  4: 'Fiḍ',
  5: '‘Idá',
  6: 'Isj',
  7: 'Isq'
};

const weekdayAbbr2 = {
  1: 'Jl',
  2: 'Jm',
  3: 'Ka',
  4: 'Fi',
  5: '‘Id',
  6: 'Ij',
  7: 'Iq'
};

const weekdayL = {
  1: 'Glory',
  2: 'Beauty',
  3: 'Perfection',
  4: 'Grace',
  5: 'Justice',
  6: 'Majesty',
  7: 'Independence'
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
  19: 'Váḥid'
};

const BE = 'BE';
const badiCalendar = 'Badí‘ Calendar';

var en = /*#__PURE__*/Object.freeze({
  month: month,
  monthL: monthL,
  holyDay: holyDay,
  weekday: weekday,
  weekdayAbbr3: weekdayAbbr3,
  weekdayAbbr2: weekdayAbbr2,
  weekdayL: weekdayL,
  yearInVahid: yearInVahid,
  BE: BE,
  badiCalendar: badiCalendar
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
  20: 'ايام الهاء'
};

const monthL$1 = {
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
  20: 'ايام الهاء'
};

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
  11: 'يوم صعود حضرة عبد البهاء'
};

const weekday$1 = {
  1: 'الجلال',
  2: 'الجمال',
  3: 'الكمال',
  4: 'الفضّال',
  5: 'العدّال',
  6: 'الأستجلال',
  7: 'الاستقلال'
};

const weekdayAbbr3$1 = {
  1: 'جلا',
  2: 'جما',
  3: 'كما',
  4: 'فضّا',
  5: 'عدّا',
  6: 'اسج',
  7: 'اسق'
};

const weekdayAbbr2$1 = {
  1: 'جل',
  2: 'جم',
  3: 'كم',
  4: 'فض',
  5: 'عد',
  6: 'اج',
  7: 'اق'
};

const weekdayL$1 = {
  1: 'الجلال',
  2: 'الجمال',
  3: 'الكمال',
  4: 'الفضّال',
  5: 'العدّال',
  6: 'الأستجلال',
  7: 'أستقلال'
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
  19: 'واحد'
};

const BE$1 = 'بديع';
const badiCalendar$1 = 'تقويم بديع';

var ar = /*#__PURE__*/Object.freeze({
  month: month$1,
  monthL: monthL$1,
  holyDay: holyDay$1,
  weekday: weekday$1,
  weekdayAbbr3: weekdayAbbr3$1,
  weekdayAbbr2: weekdayAbbr2$1,
  weekdayL: weekdayL$1,
  yearInVahid: yearInVahid$1,
  BE: BE$1,
  badiCalendar: badiCalendar$1
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
  20: 'Ayyám-i-Há'
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
  11: 'Hinscheiden ‘Abdu’l-Bahás'
};

const weekdayL$2 = {
  1: 'Ruhm',
  2: 'Schönheit',
  3: 'Vollkommenheit',
  4: 'Gnade',
  5: 'Gerechtigkeit',
  6: 'Majestät',
  7: 'Unabhängigkeit'
};

const BE$2 = 'B.E.';
const badiCalendar$2 = 'Badí‘ Kalender';

var de = /*#__PURE__*/Object.freeze({
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
  20: 'Ayyám-i-Há'
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
  11: 'Fallecimiento de ‘Abdu’l-Bahá'
};

const weekdayL$3 = {
  1: 'Gloria',
  2: 'Belleza',
  3: 'Perfección',
  4: 'Gracia',
  5: 'Justicia',
  6: 'Majestuosidad',
  7: 'Independencia'
};

const BE$3 = 'E.B.';
const badiCalendar$3 = 'Calendario Badí‘';

var es = /*#__PURE__*/Object.freeze({
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
  20: 'ايام الهاء'
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
  20: 'ايام ها'
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
  11: 'صعود حضرت عبدالبها'
};

const weekday$2 = {
  1: 'یوم الجلال',
  2: 'یوم الجمال',
  3: 'یوم الكمال',
  4: 'یوم الفضّال',
  5: 'یوم العدّال',
  6: 'یوم الأستجلال',
  7: 'یوم الاستقلال'
};

const weekdayAbbr3$2 = {
  1: 'جلا',
  2: 'جما',
  3: 'كما',
  4: 'فضّا',
  5: 'عدّا',
  6: 'اسج',
  7: 'اسق'
};

const weekdayAbbr2$2 = {
  1: 'جل',
  2: 'جم',
  3: 'كم',
  4: 'فض',
  5: 'عد',
  6: 'اج',
  7: 'اق'
};

const weekdayL$4 = {
  1: 'جلال',
  2: 'جمال',
  3: 'كمال',
  4: 'فضّال',
  5: 'عدّال',
  6: 'استجلال',
  7: 'استقلال'
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
  19: 'واحد'
};

const BE$4 = 'بديع';
const badiCalendar$4 = 'تقويم بديع';

var fa = /*#__PURE__*/Object.freeze({
  month: month$2,
  monthL: monthL$4,
  holyDay: holyDay$4,
  weekday: weekday$2,
  weekdayAbbr3: weekdayAbbr3$2,
  weekdayAbbr2: weekdayAbbr2$2,
  weekdayL: weekdayL$4,
  yearInVahid: yearInVahid$2,
  BE: BE$4,
  badiCalendar: badiCalendar$4
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
  20: 'Ayyám-i-Há'
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
  11: 'Ascension de ‘Abdu’l-Bahá'
};

const weekdayL$5 = {
  1: 'Gloire',
  2: 'Beauté',
  3: 'Perfection',
  4: 'Grâce',
  5: 'Justice',
  6: 'Majesté',
  7: 'Indépendance'
};

const BE$5 = 'E.B.';
const badiCalendar$5 = 'Calendrier Badí‘';

var fr = /*#__PURE__*/Object.freeze({
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
  20: 'Ayyám-i-Há'
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
  11: '‘Abdu’l-Bahá Debessbraukšana'
};

const weekdayL$6 = {
  1: 'Slava',
  2: 'Skaistums',
  3: 'Pilnība',
  4: 'Žēlastība',
  5: 'Taisnīgums',
  6: 'Majestātiskums',
  7: 'Neatkarība'
};

const BE$6 = 'B.Ē.';
const badiCalendar$6 = 'Badí‘ kalendārs';

var lv = /*#__PURE__*/Object.freeze({
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
  20: 'Ayyám-i-Há'
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
  11: 'Heengaan van ‘Abdu’l-Bahá'
};

const weekdayL$7 = {
  1: 'Heerlijkheid',
  2: 'Schoonheid',
  3: 'Volmaaktheid',
  4: 'Genade',
  5: 'Gerechtigheid',
  6: 'Majesteit',
  7: 'Onafhankelijkheid'
};

const BE$7 = 'B.E.';
const badiCalendar$7 = 'Badí‘-Kalender';

var nl = /*#__PURE__*/Object.freeze({
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
  20: 'Ayyám-i-Há'
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
  11: 'Ascensão de ‘Abdu’l-Bahá'
};

const weekdayL$8 = {
  1: 'Glória',
  2: 'Beleza',
  3: 'Perfeição',
  4: 'Graça',
  5: 'Justiça',
  6: 'Majestade',
  7: 'Independência'
};

const BE$8 = 'E.B.';
const badiCalendar$8 = 'Calendário Badí‘';

var pt = /*#__PURE__*/Object.freeze({
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
  20: 'Аййāм-и Хā'
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
  20: 'Аййāм-и Хā'
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
  11: 'Вознесение Абдул-Баха'
};

const weekday$3 = {
  1: 'Джалāл',
  2: 'Джамāл',
  3: 'Камāл',
  4: 'Фид̣āл',
  5: '‘Идāл',
  6: 'Истиджлāл',
  7: 'Истик̣лāл'
};

const weekdayAbbr3$3 = {
  1: 'Джл',
  2: 'Джм',
  3: 'Кам',
  4: 'Фид̣',
  5: '‘Идā',
  6: 'Исд',
  7: 'Иск̣'
};

const weekdayAbbr2$3 = {
  1: 'Дл',
  2: 'Дм',
  3: 'Ка',
  4: 'Фи',
  5: '‘Ид',
  6: 'Ид',
  7: 'Ик̣'
};

const weekdayL$9 = {
  1: 'Слава',
  2: 'Красота',
  3: 'Совершенство',
  4: 'Благодать',
  5: 'Справедливость',
  6: 'Величие',
  7: 'Независимость'
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
  19: 'Вāх̣ид'
};

const BE$9 = 'Э.Б.';
const badiCalendar$9 = 'Календарь Бадӣ‘';

var ru = /*#__PURE__*/Object.freeze({
  month: month$3,
  monthL: monthL$9,
  holyDay: holyDay$9,
  weekday: weekday$3,
  weekdayAbbr3: weekdayAbbr3$3,
  weekdayAbbr2: weekdayAbbr2$3,
  weekdayL: weekdayL$9,
  yearInVahid: yearInVahid$3,
  BE: BE$9,
  badiCalendar: badiCalendar$9
});

const monthL$10 = {
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
  20: 'Ayyám-i-Há'
};

const holyDay$10 = {
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
  11: '‘Abdu’l-Bahás Bortgång'
};

const weekdayL$10 = {
  1: 'Härlighet',
  2: 'Skönhet',
  3: 'Fullkomlighet',
  4: 'Nåd',
  5: 'Rättvisa',
  6: 'Majestät',
  7: 'Oberoende'
};

const BE$10 = 'B.E.';
const badiCalendar$10 = 'Badí‘ kalendern';

var sv = /*#__PURE__*/Object.freeze({
  monthL: monthL$10,
  holyDay: holyDay$10,
  weekdayL: weekdayL$10,
  BE: BE$10,
  badiCalendar: badiCalendar$10
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
  20: '阿亚米哈'
};

const monthL$11 = {
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
  20: '哈之日'
};

const holyDay$11 = {
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
  11: '阿博都-巴哈升天日'
};

const weekday$4 = {
  1: '贾拉勒',
  2: '贾迈勒',
  3: '卡迈勒',
  4: '菲达勒',
  5: '伊达勒',
  6: '伊斯提杰拉勒',
  7: '伊斯提格拉勒'
};

const weekdayAbbr3$4 = {
  1: '贾拉勒',
  2: '贾迈勒',
  3: '卡迈勒',
  4: '菲达勒',
  5: '伊达勒',
  6: '伊斯杰',
  7: '伊斯格'
};

const weekdayAbbr2$4 = {
  1: '贾拉',
  2: '贾迈',
  3: '卡迈',
  4: '菲达',
  5: '伊达',
  6: '伊杰',
  7: '伊格'
};

const weekdayL$11 = {
  1: '辉日',
  2: '美日',
  3: '完日',
  4: '恩日',
  5: '正日',
  6: '威日',
  7: '独日'
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
  19: '瓦希德'
};

const BE$11 = 'BE';
const badiCalendar$11 = '巴迪历';

var zh = /*#__PURE__*/Object.freeze({
  month: month$4,
  monthL: monthL$11,
  holyDay: holyDay$11,
  weekday: weekday$4,
  weekdayAbbr3: weekdayAbbr3$4,
  weekdayAbbr2: weekdayAbbr2$4,
  weekdayL: weekdayL$11,
  yearInVahid: yearInVahid$4,
  BE: BE$11,
  badiCalendar: badiCalendar$11
});

const monthL$12 = {
  1: 'Splendor',
  16: 'Honor'
};

var en_us = /*#__PURE__*/Object.freeze({
  monthL: monthL$12
});

/* eslint-disable dot-notation, line-comment-position, camelcase, sort-imports */

const badiLocale = {};
badiLocale['en'] = en;
badiLocale['ar'] = ar;
badiLocale['de'] = de;
badiLocale['es'] = es;
badiLocale['fa'] = fa;
badiLocale['fr'] = fr;
badiLocale['lv'] = lv;
badiLocale['nl'] = nl;
badiLocale['pt'] = pt;
badiLocale['ru'] = ru;
badiLocale['sv'] = sv;
badiLocale['zh'] = zh;
badiLocale['en-us'] = en_us;

/**
 * Set default language for localization. If the language doesn't exist,
 * nothing is changed.
 * @param {string} language that should be set as default
 */
const setDefaultLanguage = function (language) {
  if (typeof badiLocale[language] === 'undefined') {
    // eslint-disable-next-line no-console
    console.log('Chosen language does not exist. Setting has not been changed');
  } else {
    badiLocale['default'] = badiLocale[language];
  }
};

const badiYears = [
  'l4da', 'k4ci', 'k5c7', 'l4d6', 'l4ce', 'k4c4', 'k5d4', 'l4cb', 'l4c1',
  'k4cj', 'k5c8', 'l4d7', 'l4cf', 'k4c5', 'k4d5', 'k5ce', 'l4c2', 'k4d2',
  'k4ca', 'k5da', 'l4ch', 'k4c6', 'k4d6', 'k5cf', 'l4c4', 'k4d4', 'k4cc',
  'k5c1', 'l4cj', 'k4c8', 'k4d8', 'k5cg', 'l4c5', 'k4d5', 'k4ce', 'k5c3',
  'l4d2', 'k4ca', 'k4d9', 'k5ci', 'l4c6', 'k4d6', 'k4cf', 'k4c4', 'k5d4',
  'k4cb', 'k4bj', 'k4cj', 'k5c9', 'k4d8', 'k4cg', 'k4c6', 'k5d6', 'k4cd',
  'k4c2', 'k4d2', 'k5ca', 'k4d9', 'k4ci', 'k4c7', 'k5d7', 'k4cf', 'k4c4',
  'k4d4', 'k5cc', 'k4bj', 'k4cj', 'k4c9', 'k5d9', 'k4cg', 'k4c6', 'k4d5',
  'k5cd', 'k4c2', 'k4d1', 'k4ca', 'k4da', 'j5cj', 'k4c7', 'k4d7', 'k4cf',
  'j5c4', 'k4d3', 'k4cb', 'k4c1', 'k5d1', 'l4c9', 'l4d9', 'l4ch', 'k5c6',
  'l4d5', 'l4cd', 'l4c2', 'k5d2', 'l4ca', 'l4da', 'l4cj', 'k5c8', 'l4d7',
  'l4cf', 'l4c4', 'k5d4', 'l4cb', 'l4c1', 'l4d1', 'k5c9', 'l4d8', 'l4cg',
  'l4c5', 'k4d5', 'k5ce', 'l4c2', 'l4d2', 'k4cb', 'k5db', 'l4ci', 'l4c7',
  'k4d7', 'k5cf', 'l4c4', 'l4d4', 'k4cc', 'k5c2', 'l4d1', 'l4c9', 'k4d9',
  'k5ch', 'l4c5', 'l4d5', 'k4ce', 'k5c3', 'l4d2', 'l4cb', 'k4da', 'k5ci',
  'l4c6', 'l4d6', 'k4cf', 'k5c5', 'l4d4', 'l4cc', 'k4c1', 'k4d1', 'k5c9',
  'l4d8', 'k4cg', 'k4c6', 'k5d6', 'l4ce', 'k4c3', 'k4d3', 'k5cb', 'l4da',
  'k4ci', 'k4c7', 'k5d7', 'l4cf', 'k4c5', 'k4d5', 'k5cd', 'l4c1', 'k4cj',
  'k4c9', 'k5d9', 'l4cg', 'k4c6', 'k4d6', 'k5ce', 'l4c3', 'k4d2', 'k4ca',
  'k5bj', 'l4ci', 'k4c7', 'k4d7', 'k4cg', 'k5c5', 'k4d4', 'k4cc', 'k4c1',
  'k5d1', 'k4c9', 'k4d9', 'k4ch', 'k5c7', 'l4d6', 'l4ce', 'l4c3', 'l5d3',
  'l4ca', 'l4da', 'l4cj', 'l5c8', 'l4d7', 'l4cg', 'l4c5', 'l5d4', 'l4cb',
  'l4c1', 'l4d1', 'l5ca', 'l4d9', 'l4ch', 'l4c6', 'l5d6', 'l4cd', 'l4c2',
  'l4d2', 'l4cb', 'k5c1', 'l4cj', 'l4c8', 'l4d8', 'k5cg', 'l4c4', 'l4d4',
  'l4cc', 'k5c2', 'l4d1', 'l4ca', 'l4da', 'k5ci', 'l4c6', 'l4d5', 'l4ce',
  'k5c3', 'l4d2', 'l4cb', 'l4db', 'k5cj', 'l4c8', 'l4d7', 'l4cf', 'k5c5',
  'l4d4', 'l4cc', 'l4c2', 'k5d2', 'l4c9', 'l4d9', 'l4ch', 'k4c6', 'k5d6',
  'l4ce', 'l4c3', 'k4d3', 'k5cc', 'l4db', 'l4cj', 'k4c8', 'k5d8', 'l4cf',
  'l4c4', 'k4d5', 'k5cd', 'l4c2', 'l4d2', 'k4ca', 'k5d9', 'l4cg', 'l4c6',
  'k4d6', 'k5cf', 'l4c3', 'l4d3', 'k4cb', 'k5bj', 'l4ci', 'l4c7', 'k4d7',
  'k5cg', 'l4c5', 'l4d5', 'k4cd', 'k4c2', 'k5d2', 'l4c9', 'k4d9', 'k4ch',
  'k5c7', 'l4d6', 'k4cf', 'k4c4', 'k5d4', 'l4cb', 'l4bj', 'l4cj', 'l5c8',
  'm4d7', 'l4cg', 'l4c5', 'l5d5', 'm4cc', 'l4c1', 'l4d1', 'l5ca', 'm4d9',
  'l4ch', 'l4c7', 'l5d7', 'm4ce', 'l4c3', 'l4d3', 'l5cb', 'm4bi', 'l4ci',
  'l4c8', 'l4d8', 'l5ch', 'l4c5', 'l4d5', 'l4cd', 'l5c2', 'l4d1', 'l4c9',
  'l4da', 'l5ci', 'l4c7', 'l4d7', 'l4cf', 'l5c4', 'l4d2', 'l4cb', 'l4bj',
  'l5d1', 'l4c8', 'l4d8', 'l4cg', 'l5c5', 'l4d4', 'l4cc', 'l4c2', 'l5d2',
  'l4c9', 'l4da', 'l4ci'];

/**
 * A date in the Badí' calendar.
 */
class BadiDate {
  /**
   * Accepts a number of different sets of arguments for instantiation: JS Date
   * object, moment object, ISO 8601 date string, Badí' date string in the
   * format 'year-month-day' or 'year-holyDayNumber' and array in the format
   * [year, month, day] or [year, holyDayNumber] where holyDayNumber is a number
   * between 1 (Naw-Rúz) and 11 (Ascension of 'Abdu'l-Bahá).
   * @param {(Date|moment|string|Array)} date input date
   */
  constructor(date) { // eslint-disable-line complexity
    this._gregDate = 0;
    this._badiYear = 0;
    this._badiMonth = 0;
    this._badiDate = 0;
    this._nawRuz = 0;
    this._ayyamiHaLength = 0;
    this._yearTB = [];
    this._holyDay = false;
    this._valid = true;

    if (date instanceof Date) {
      this.gregDate = moment.utc(
        [date.getFullYear(), date.getMonth(), date.getDate(), 12]);
    } else if (date instanceof moment) {
      this._gregDate = moment.utc([date.year(), date.month(), date.date(), 12]);
    } else if (typeof date === 'string') {
      const dateArray = this._parseBadiDateString(date);
      if (dateArray) {
        this._setFromBadiDate(dateArray);
      // Looks like the input was a Gregorian datestring
      } else {
        // Attempt to handle a malformed string which moment complains about but
        // Date makes a best guess at.
        const tempDate = new Date(date);
        this._gregDate = moment.utc([tempDate.getFullYear(),
          tempDate.getMonth(), tempDate.getDate(), 12]);
        // Check if it's before 1 BE or after 356 BE (which we can't handle)
        if (this._notInValidGregRange(this._gregDate)) {
          this._setInvalid();
        }
      }
    } else if (date.constructor === Array) {
      if (date.length !== 3 && date.length !== 2) {
        this._setInvalid();
      } else {
        this._setFromBadiDate(date);
      }
    }
    if (this._badiYear === 0) {
      // We haven't set the Badí' date yet
      this._setFromGregorianDate();
    }
    if (this._valid) {
      this._setHolyDay();
    }
  }

  /**
   * Formats the output as defined by the given format string
   * The following tokens are accepted:
   * d - day of month without leading zeroes
   * dd - day of month with leading zeroes
   * D - day of month as 3-letter (+ apostrophes) abbreviation of translit.
   * DD - full day of month transliteration
   * DDL - full day of month translation
   * DD+ - full day of month transliteration (translation)
   * m, mm, M, MM, MML, MM+ - same as days
   * ww - day of week, two letter abbreviation (Jl, Jm, Ka, Fi, 'Id, Ij, Iq)
   * W - day of week, 3 letter abbreviation (Jal, Jam, Kam, Fiḍ, 'Idá, Isj, Isq)
   * WW - day of week, full name
   * WWL - day of week, full name translation
   * yv - year in vahid without leading zeroes
   * yyv - year in vahid with leading zeroes
   * YV - year in vahid full transliteration
   * v - vahid without leading zeroes
   * vv - vahid with leading zeroes
   * k - Kull-i-Shay without leading zeroes
   * kk - Kull-i-Shay with leading zeroes
   * y - year without leading zeroes
   * yy - 3 digit year with leading zeroes
   * Anything in between {} will be printed as is.
   * @param {string} formatString gives the output format (see reference above)
   * @param {string} language output language (subject to fallbacks)
   * @returns {string} date formatted according to inputs
   */
  format(formatString, language) { // eslint-disable-line complexity
    if (!this.isValid()) {
      return 'Not a valid date';
    }
    const formatTokens = [
      ['DDL', 'DD+', 'MML', 'MM+', 'WWL', 'yyv'],
      ['dd', 'DD', 'mm', 'MM', 'ww', 'WW', 'yv', 'YV', 'vv', 'kk', 'yy', 'BE'],
      ['d', 'D', 'm', 'M', 'W', 'v', 'k', 'y']];
    if (typeof language === 'undefined' ||
        typeof badiLocale[language] === 'undefined') {
      // eslint-disable-next-line dot-notation
      if (typeof badiLocale['default'] === 'undefined') {
        language = 'en';
      } else {
        language = 'default';
      }
    }
    if (typeof formatString === 'undefined') {
      formatString = 'd MM+ y BE';
    } else if (typeof formatString !== 'string') {
      return 'Invalid formatting string.';
    }
    let returnString = '';
    const length = formatString.length;
    for (let i = 0; i < length; i++) {
      // Text wrapped in {} is output as-is. A '{' without a matching '}'
      // results in invalid input
      if (formatString.charAt(i) === '{' && i < length - 1) {
        for (let j = i + 1; j <= length; j++) {
          if (j === length) {
            return 'Invalid formatting string.';
          }
          if (formatString.charAt(j) === '}') {
            i = j;
            break;
          }
          returnString += formatString.charAt(j);
        }
      } else {
        const next1 = formatString.charAt(i);
        const next2 = next1 + formatString.charAt(i + 1);
        const next3 = next2 + formatString.charAt(i + 2);
        // First check for match to 3-symbol token, then 2, then 1
        // (Tokens are not uniquely decodable)
        if (formatTokens[0].indexOf(next3) > -1) {
          returnString += this._getFormatItem(next3, language);
          i += 2;
        } else if (formatTokens[1].indexOf(next2) > -1) {
          returnString += this._getFormatItem(next2, language);
          i += 1;
        } else if (formatTokens[2].indexOf(next1) > -1) {
          returnString += this._getFormatItem(next1, language);
        } else {
          returnString += next1;
        }
      }
    }
    return returnString;
  }

  /**
   * Retrieve the appropriate output for a given formatting token and language.
   * @param {string} token identifying the date component for output
   * @param {string} language output language
   * @returns {string} localized output string in desired language (or fallback)
   */
  _getFormatItem(token, language) { // eslint-disable-line complexity
    // ES6 is a bit funny with the scope of let in a switch
    let day, month, monthL;
    switch (token) {
      // Single character tokens
      case 'd':
        return String(this._badiDay);
      case 'D':
        day = this._formatItemFallback(language, 'month', this._badiDay);
        if (day.substring(4, 5) === '’' && day.substring(0, 1) === '‘') {
          return day.substring(0, 5);
        } else if (day.substring(0, 1) === '‘') {
          return day.replace(/<(?:.|\n)*?>/gm, '').substring(0, 4);
        }
        return day.replace(/<(?:.|\n)*?>/gm, '').substring(0, 3);
      case 'm':
        return String(this._badiMonth);
      case 'M':
        month = this._formatItemFallback(
          language, 'month', this._badiMonth);
        if (month.substring(4, 5) === '’' && month.substring(0, 1) === '‘') {
          return month.substring(0, 5);
        } else if (month.substring(0, 1) === '‘') {
          return month.replace(/<(?:.|\n)*?>/gm, '').substring(0, 4);
        }
        return month.replace(/<(?:.|\n)*?>/gm, '').substring(0, 3);
      case 'W':
        return this._formatItemFallback(
          language, 'weekdayAbbbr3', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'y':
        return String(this._badiYear);
      case 'v':
        return String((Math.floor((this._badiYear - 1) / 19) % 19) + 1);
      case 'k':
        return String(Math.floor((this._badiYear - 1) / 361) + 1);
      // Two character tokens
      case 'dd':
        return ('0' + String(this._badiDay)).slice(-2);
      case 'DD':
        return this._formatItemFallback(language, 'month', this._badiDay);
      case 'mm':
        return ('0' + String(this._badiMonth)).slice(-2);
      case 'MM':
        return this._formatItemFallback(language, 'month', this._badiMonth);
      case 'ww':
        return this._formatItemFallback(
          language, 'weekdayAbbr2', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'WW':
        return this._formatItemFallback(
          language, 'weekday', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'yy':
        return ('00' + String(this._badiYear)).slice(-3);
      case 'yv':
        return String((this._badiYear - 1) % 19 + 1);
      case 'YV':
        return this._formatItemFallback(
          language, 'yearInVahid', (this._badiYear - 1) % 19 + 1);
      case 'vv':
        return ('0' + String((Math.floor(
          (this._badiYear - 1) / 19) + 2) % 19 - 1)).slice(-2);
      case 'kk':
        return ('0' + String(Math.floor(
          (this._badiYear - 1) / 361) + 1)).slice(-2);
      case 'BE':
        return this._formatItemFallback(language, 'BE');
      // Three character tokens
      case 'DDL':
        return this._formatItemFallback(language, 'monthL', this._badiDay);
      case 'DD+':
        return this._formatItemFallback(language, 'month', this._badiDay) +
          ' (' + this._formatItemFallback(language, 'monthL', this._badiDay) +
          ')';
      case 'MML':
        return this._formatItemFallback(language, 'monthL', this._badiMonth);
      case 'MM+':
        month = this._formatItemFallback(
          language, 'month', this._badiMonth);
        monthL = this._formatItemFallback(
          language, 'monthL', this._badiMonth);
        if (month === monthL) {
          return month;
        }
        return month + ' (' + monthL + ')';
      case 'WWL':
        return this._formatItemFallback(
          language, 'weekdayL', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'yyv':
        return ('0' + String((this._badiYear - 1) % 19 + 1)).slice(-2);
      default:
        return '';
    }
  }

  /**
   * Determine the next language in the fallback order:
   * regional variant -> primary language -> default language -> English
   * @param {string} languageCode of the language for which fallback is needed
   * @returns {string} next item in fallback order
   */
  _languageFallback(languageCode) {
    if (languageCode.indexOf('-') > -1) {
      return languageCode.split('-')[0];
    // eslint-disable-next-line no-negated-condition
    } else if (languageCode !== 'default') {
      return 'default';
    }
    return 'en';
  }

  /**
   * Retrieve element from localization with fallback
   * @param {string} language output language (subject to fallbacks)
   * @param {string} category group of localization elements (e.g. 'holyDay')
   *                 or label for single items such as 'BE'
   * @param {int} index of desired item in category, always 1-indexed
   * @returns {string} localized output string
   */
  _formatItemFallback(language, category, index) {
    if (typeof index === 'undefined') {
      while (typeof badiLocale[language] === 'undefined' ||
             typeof badiLocale[language][category] === 'undefined') {
        language = this._languageFallback(language);
      }
      return badiLocale[language][category];
    }
    while (typeof badiLocale[language] === 'undefined' ||
           typeof badiLocale[language][category] === 'undefined' ||
           typeof badiLocale[language][category][index] === 'undefined') {
      language = this._languageFallback(language);
    }
    return badiLocale[language][category][index];
  }

  /**
   * Check whether a string supplied to the constructor describes a valid Badí'
   * date, either as year-month-day or year-holyDay and if yes, return an array
   * of date components.
   * @param {string} dateString Badí' date in string format
   * @returns {(array|false)} array consisting of the Badí' date components
   *                          (either [year, month, day] or
   *                          [year, holyDayNumber]) or false
   */
  _parseBadiDateString(dateString) { // eslint-disable-line complexity
    const dateComponents = dateString.split('-');
    // Are all components numerical
    for (let i = 0; i < dateComponents.length; i++) {
      if (!(/^\d+$/.test(dateComponents[i]))) {
        return false;
      }
      dateComponents[i] = parseInt(dateComponents[i], 10);
    }
    // If only two numbers are supplied, the second designates a Holy Day and
    // must be between 1 and 11
    if (dateComponents.length !== 3) {
      if (dateComponents.length === 2 && dateComponents[1] > 0 &&
          dateComponents[1] < 12) {
        return dateComponents;
      }
      return false;
    }
    // Are the month and day numbers in sensible ranges?
    // We call Ayyám-i-Há month 20
    if (dateComponents[1] > 20 || dateComponents[1] < 1) {
      return false;
    }
    if (dateComponents[2] > 19 || dateComponents[2] < 1) {
      return false;
    }
    return dateComponents;
  }

  /**
   * Check whether a moment object is within the valid range of dates.
   * @param {moment} datetime date to be checked
   * @returns {bool} whether the provided datetime is within the valid range
   */
  _notInValidGregRange(datetime) {
    if (datetime.isBefore(moment.utc('1844-03-21')) ||
        datetime.isAfter(moment.utc('2351-03-20'))) {
      return true;
    }
    return false;
  }

  /**
   * Generate date from input corresponding to a Gregorian date.
   */
  _setFromGregorianDate() {
    if (this._notInValidGregRange(this._gregDate)) {
      this._setInvalid();
      return;
    }
    const gregYear = this._gregDate.year();
    if (this._gregDate.isBefore(moment.utc('2015-03-21'))) {
      // Old implementation for day before Naw-Rúz 172
      if (this._gregDate.isBefore(gregYear + '-03-21')) {
        this._nawRuz = moment.utc((gregYear - 1).toString() + '-03-21');
        this._badiYear = gregYear - 1844;
      } else {
        this._nawRuz = moment.utc(gregYear.toString() + '-03-21');
        this._badiYear = gregYear - 1843;
      }
      this._setOldAyyamiHaLength();
      this._yearTB = [12, 5, 13, 9];
    } else {
      // New implementation
      this._badiYear = gregYear - 1843;
      this._setBadiYearInfo(true);
    }
    // Now need to set Badí' month and date from the gregorian date
    this._setBadiMonthDay();
  }

  /**
   * Set Badí' month and day from Gregorian date
   */
  _setBadiMonthDay() {
    const dayOfBadiYear = this._dayOfYear(this._gregDate);
    if (dayOfBadiYear < 343) {
      this._badiMonth = Math.floor((dayOfBadiYear - 1) / 19 + 1);
      this._badiDay = (dayOfBadiYear - 1) % 19 + 1;
    } else if (dayOfBadiYear < 343 + this._ayyamiHaLength) {
      this._badiMonth = 20;
      this._badiDay = dayOfBadiYear - 342;
    } else {
      this._badiMonth = 19;
      this._badiDay = dayOfBadiYear - (342 + this._ayyamiHaLength);
    }
  }

  /**
   * Generate date from input that supplied the Badí' year and either Badí'
   * month and day or a Holy Day number.
   * @param {array} dateArray Badí' date either given in the form
   *                          [year, month, day] or [year, holyDayNumber]
   */
  _setFromBadiDate(dateArray) { // eslint-disable-line complexity
    this._badiYear = parseInt(dateArray[0], 10);
    // Are we in the valid range?
    if (this._badiYear < 1 || this._badiYear > 507) {
      this._setInvalid();
      return;
    } else if (this._badiYear < 172) {
      // Old implementation for dates before Naw-Rúz 172
      this._nawRuz = moment.utc([1843 + this._badiYear, 2, 21]);
      this._setOldAyyamiHaLength();
      this._yearTB = [12, 5, 13, 9];
    } else {
      // New implementation
      this._setBadiYearInfo();
    }
    // If all three components exist, we have a year, month, and day
    // eslint-disable-next-line no-negated-condition
    if (typeof dateArray[2] !== 'undefined') {
      this._badiMonth = parseInt(dateArray[1], 10);
      this._badiDay = parseInt(dateArray[2], 10);
      if (this._badiMonth === 20 && this._badiDay > this._ayyamiHaLength) {
        // If only off by one day, we'll bubble up so that 5th Ayyám-i-Há in a
        // year with only 4 days of Ayyám-i-Há can be salvaged
        if (this._badiDay - this._ayyamiHaLength === 1) {
          this._badiMonth = 19;
          this._badiDay = 1;
        } else {
          this._setInvalid();
        }
      }
    // Otherwise input designated a Holy Day
    } else {
      const holyDayNum = parseInt(dateArray[1], 10);
      switch (holyDayNum) {
        case 1:
          // Naw-Rúz
          this._badiMonth = 1;
          this._badiDay = 1;
          break;
        case 2:
          // First Day of Ridván
          this._badiMonth = 2;
          this._badiDay = 13;
          break;
        case 3:
          // Ninth Day of Ridván
          this._badiMonth = 3;
          this._badiDay = 2;
          break;
        case 4:
          // Twelfth Day of Ridván
          this._badiMonth = 3;
          this._badiDay = 5;
          break;
        case 5:
          // Declaration of the Báb
          this._badiMonth = 4;
          this._badiDay = 8;
          if (this._badiYear < 172) {
            // Date was different in old implementation
            this._badiDay = 7;
          }
          break;
        case 6:
          // Ascension of Bahá'u'lláh
          this._badiMonth = 4;
          this._badiDay = 13;
          break;
        case 7:
          // Martyrdom of the Báb
          this._badiMonth = 6;
          this._badiDay = 17;
          if (this._badiYear < 172) {
            // Date was different in old implementation
            this._badiDay = 16;
          }
          break;
        case 8:
          // Birth of the Báb
          this._badiMonth = this._yearTB[0];
          this._badiDay = this._yearTB[1];
          break;
        case 9:
          // Birth of Bahá'u'lláh
          this._badiMonth = this._yearTB[2];
          this._badiDay = this._yearTB[3];
          break;
        case 10:
          // Day of the Covenant
          this._badiMonth = 14;
          this._badiDay = 4;
          break;
        case 11:
          // Ascension of 'Abdu'l-Bahá
          this._badiMonth = 14;
          this._badiDay = 6;
          break;
        default:
          this._setInvalid();
          return;
      }
    }
    // Finally we set the Gregorian date for this Badí' date
    const dayOfGregYear = this._nawRuz.diff(
      moment.utc([this._badiYear + 1843]), 'days') +
      this._dayOfYear([this._badiYear, this._badiMonth, this._badiDay]);
    this._gregDate = moment.utc([this._badiYear + 1843]);
    // Bubbles up to next year if necessary
    this._gregDate.dayOfYear(dayOfGregYear);
    this._gregDate.hour(12);
  }

  /**
   * Set the length of Ayyám-i-Há for dates before the new implementation.
   */
  _setOldAyyamiHaLength() {
    if (moment([this._nawRuz.year() + 1]).isLeapYear()) {
      this._ayyamiHaLength = 5;
    } else {
      this._ayyamiHaLength = 4;
    }
  }

  /**
   * Set year parameters for the given year.
   * @param {bool} fromGregDate whether we are generating the date object from
   *                            a Gregorian date
   */
  _setBadiYearInfo(fromGregDate) {
    let yearData = this._extractBadiYearInfo();
    if (fromGregDate === true &&
        this._gregDate.isBefore(moment.utc(yearData.NR))) {
      this._badiYear -= 1;
      yearData = this._extractBadiYearInfo();
    }
    this._nawRuz = moment.utc(yearData.NR);
    this._ayyamiHaLength = yearData.aHL;
    this._yearTB = yearData.TB;
  }

  /**
   * Unpack the info for the Badí' year from the base36 encoded version.
   * @returns {object} Object containing the date of Naw-Rúz, the length of
   *                   Ayyám-i-Há, and an array containing month, day, month,
   *                   day of the Twin Holy Days
   */
  _extractBadiYearInfo() {
    let yearData = {};
    // Check whether data needs to be unpacked or exists in the verbose version
    if (badiYears[0] === 'l4da') {
      const components = badiYears[this._badiYear - 172].split('');
      yearData.NR = String(this._badiYear - 172 + 2015) + '-03-' +
                    String(parseInt(components[0], 36));
      yearData.aHL = parseInt(components[1], 36);
      const TB1 = [parseInt(components[2], 36), parseInt(components[3], 36)];
      const TB2 = TB1[1] < 19 ? [TB1[0], TB1[1] + 1] : [TB1[0] + 1, 1];
      yearData.TB = [TB1[0], TB1[1], TB2[0], TB2[1]];
    } else {
      yearData = badiYears[this._badiYear];
    }
    return yearData;
  }

  /**
   * Get the days since Naw-Rúz (NR itself is '1') of the Badí' or Gregorian
   * date provided.
   * @param {(array|moment)} date Badí' date in the form [year, month, day]
   *                         or moment
   * @returns {int} 1-indexed number of the day in the Badí' year
   */
  _dayOfYear(date) {
    let numDays = 0;
    if (date.constructor === Array) {
      // We have a Badí' date
      if (date[1] < 19) {
        numDays = 19 * (date[1] - 1) + date[2];
      } else if (date[1] === 20) {
        numDays = 342 + date[2];
      } else if (date[1] === 19) {
        numDays = 342 + this._ayyamiHaLength + date[2];
      }
    } else {
      numDays = date.diff(this._nawRuz, 'days') + 1;
    }
    return numDays;
  }

  /**
   * Set the member variables to invalid values.
   */
  _setInvalid() {
    this._gregDate = moment.utc('0000-00-00');
    this._badiYear = -1;
    this._badiMonth = -1;
    this._badiDay = -1;
    this._ayyamiHaLength = -1;
    this._nawRuz = moment.utc('0000-00-00');
    this._valid = false;
  }

  /**
   * If the date is a Holy Day, assign it
   */
  _setHolyDay() { // eslint-disable-line complexity
    // First the dates that haven't changed with the new implementation
    if (this._badiMonth === 1 && this._badiDay === 1) {
      // Naw-Rúz
      this._holyDay = 1;
    } else if (this._badiMonth === 2 && this._badiDay === 13) {
      // First Day of Ridván
      this._holyDay = 2;
    } else if (this._badiMonth === 3 && this._badiDay === 2) {
      // Ninth Day of Ridván
      this._holyDay = 3;
    } else if (this._badiMonth === 3 && this._badiDay === 5) {
      // Twelfth Day of Ridván
      this._holyDay = 4;
    } else if (this._badiMonth === 4 && this._badiDay === 13) {
      // Ascension of Bahá'u'lláh
      this._holyDay = 6;
    } else if (this._badiMonth === 14 && this._badiDay === 4) {
      // Day of the Covenant
      this._holyDay = 10;
    } else if (this._badiMonth === 14 && this._badiDay === 6) {
      // Ascension of 'Abdu'l-Bahá
      this._holyDay = 11;
    }
    // Twin birthdays are set in the instance at this point regardless of
    // implementation
    if (this._badiMonth === this._yearTB[0] &&
        this._badiDay === this._yearTB[1]) {
      // Birth of the Báb
      this._holyDay = 8;
    } else if (this._badiMonth === this._yearTB[2] &&
               this._badiDay === this._yearTB[3]) {
      // Birth of Bahá'u'lláh
      this._holyDay = 9;
    }
    // Finally the two dates that have changed by one day
    if (this._badiYear < 172) {
      if (this._badiMonth === 4 && this._badiDay === 7) {
        // Declaration of the Báb
        this._holyDay = 5;
      } else if (this._badiMonth === 6 && this._badiDay === 16) {
        // Martyrdom of the Báb
        this._holyDay = 7;
      }
    } else if (this._badiMonth === 4 && this._badiDay === 8) {
      // Declaration of the Báb
      this._holyDay = 5;
    } else if (this._badiMonth === 6 && this._badiDay === 17) {
      // Martyrdom of the Báb
      this._holyDay = 7;
    }
  }

  /**
   * Get the name of the Holy Day (if any) in the given language (using
   * localization fallbacks as necessary).
   * @param {string} language Optional language for the return string
   *                 (subject to language fallback)
   * @returns {(string|false)} Name of the Holy Day in the given (or fallback)
   *                           language, or false.
   */
  holyDay(language) {
    if (!this._holyDay) {
      return false;
    }
    return this._formatItemFallback(language, 'holyDay', this._holyDay);
  }

  /**
   * Check whether this is a valid date (i.e. created from valid input).
   * @returns {bool} whether this is a valid date.
   */
  isValid() {
    return this._valid;
  }

  /**
   * Get the Badí' day as a number.
   * @returns {int} number of the day in the Badí' month (between 1 and 19)
   */
  badiDay() {
    return this._badiDay;
  }

  /**
   * Get the Badí' month as a number.
   * @returns {int} number of the Badí' month (between 1 and 20 where 20 is
   *                Ayyám-i-Há
   */
  badiMonth() {
    return this._badiMonth;
  }

  /**
   * Get the Badí' year.
   * @returns {int} number of the Badí' year.
   */
  badiYear() {
    return this._badiYear;
  }

  /**
   * Get number of the Badí' weekday between 1 (Jalál ~> Saturday) and
   * 7 (Istiqlál ~> Friday).
   * @returns {int} number of Badí' weekday
   */
  badiWeekday() {
    return (this._gregDate.isoWeekday() + 1) % 7 + 1;
  }

  /**
   * Get number of the year in the Váḥid the current date is in.
   * @returns {int} number of year in Váḥid (between 1 and 19)
   */
  yearInVahid() {
    return (this._badiYear - 1) % 19 + 1;
  }

  /**
   * Get number of the Váḥid (19 year period) the current date is in.
   * @returns {int} number of Váḥid (between 1 and 19)
   */
  vahid() {
    return (Math.floor((this._badiYear - 1) / 19) % 19) + 1;
  }

  /**
   * Get number of the Kull-i-Shay' (361 year period) the current date is in.
   * @returns {int} number of Kull-i-Shay' (1 for most supported dates)
   */
  kullIShay() {
    return Math.floor((this._badiYear - 1) / 361) + 1;
  }

  /**
   * Get the Gregorian date on whose sunset the Badí' date ends.
   * @returns {moment} Gregorian date, with time set to 12:00:00
   */
  gregorianDate() {
    return this._gregDate;
  }

  /**
   * Get the length of Ayyám-i-Há for the year this date is in.
   * @returns {int} Number of days of Ayyám-i-Há
   */
  ayyamiHaLength() {
    return this._ayyamiHaLength;
  }

  /**
   * Get the number (between 1 and 11) of the Holy Day.
   * @returns {(int|false)} number of Holy Day or false if none.
   */
  holyDayNumber() {
    return this._holyDay;
  }
}

/**
 * Sets option (defaultLanguage) for the
 * module.
 * @param {object} options Options to be set.
 */
const badiDateOptions = function (options) {
  if (typeof options.defaultLanguage === 'string') {
    setDefaultLanguage(options.defaultLanguage);
  }
};

export { BadiDate, badiDateOptions };
