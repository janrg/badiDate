/**
 * @license BadiDate v3.0.2
 * (c) 2018 Jan Greis
 * licensed under MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('meeussunmoon'), require('luxon')) :
    typeof define === 'function' && define.amd ? define(['exports', 'meeussunmoon', 'luxon'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.window = global.window || {}, global.MeeusSunMoon, global.luxon));
}(this, (function (exports, MeeusSunMoon, luxon) { 'use strict';

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

    /* eslint-disable dot-notation, line-comment-position, camelcase, sort-imports */
    const badiLocale = { en, default: en };
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

    /* eslint-disable max-len, complexity */
    const clockLocations = {
        Canada: [[[-63.29333, 60], [-138.9386, 60], [-139.1889, 60.08888], [-139.0681, 60.35222], [-139.6767, 60.34055], [-139.9794, 60.18777], [-140.45081, 60.30972], [-140.52139, 60.22221], [-140.9955, 60.30721], [-140.99686, 61.8948], [-141.00005, 65.84028], [-141.00206, 68.42821], [-141.00296, 69.58786], [-141.00477, 69.58884], [-140.99813, 70.12335], [-124.80692, 77.04204], [-117.95462, 78.95431], [-99.46935, 82.3539], [-75.0348, 84.79736], [-59.3117, 83.84122], [-60.98493, 82.07503], [-69.57686, 80.21588], [-71.1173, 79.6183], [-74.13178, 79.24647], [-73.93259, 78.5692], [-75.69878, 77.78571], [-77.43842, 77.49355], [-77.55793, 76.52414], [-78.54063, 76.17887], [-79.31085, 74.25332], [-75.79174, 73.25735], [-73.13581, 72.0489], [-69.1652, 71.09276], [-66.31007, 69.91087], [-66.05776, 68.70243], [-60.73262, 66.89639], [-62.3129, 65.07708], [-63.60102, 64.69197], [-64.19861, 60.84087], [-63.29333, 60.00012]]],
        Finland: [[[31.5848296, 62.9070356], [31.4390606, 62.785375], [31.3454013, 62.64032620000001], [31.2218346, 62.49829550000001], [31.138311, 62.4420838], [30.720412, 62.20890580000002], [30.6564061, 62.2085877], [30.602068, 62.14134890000001], [30.4231749, 62.02237140000001], [30.3061104, 61.964546], [30.1556605, 61.8579888], [30.0752371, 61.8183646], [30.0387281, 61.76500110000001], [29.8185491, 61.6549278], [29.74029919999999, 61.5737044], [29.5030724, 61.461338900000015], [29.3304371, 61.3526198], [29.2330501, 61.268169], [29.0298879, 61.191815300000016], [28.9583837, 61.1514492], [28.818984, 61.1216471], [28.7136921, 61.0443349], [28.6578963, 60.95109439999999], [28.5246697, 60.9571371], [28.1354613, 60.7408695], [27.873414, 60.604559], [27.7736111, 60.53333330000002], [27.725, 60.3913889], [27.4550934, 60.223534], [27.2938862, 60.2003975], [26.8756332, 60.200342100000015], [26.6110136, 60.161753200000014], [26.2947105, 60.0465237], [26.0173046, 59.97679690000001], [25.1693516, 59.9434386], [24.2815873, 59.79155570000002], [23.4566746, 59.67247360000001], [22.9224144, 59.6384411], [22.6345729, 59.6079549], [22.3965563, 59.5130947], [21.4475658, 59.4772985], [20.7608658, 59.5324815], [20.3839584, 59.4576178], [20.2843364, 59.4660819], [19.083209799999988, 60.19169020000001], [19.2202109, 60.61151010000001], [20.0251664, 60.72755450000001], [20.7714495, 61.12690790000001], [20.903203, 61.6462488], [20.1658123, 63.1648577], [20.4010006, 63.3318822], [20.8175143, 63.5011379], [21.4628083, 63.6552312], [21.8845783, 63.70121190000001], [22.9611467, 64.2200974], [23.835799, 64.66547409999997], [24.1545056, 65.29247769999998], [24.131900100000014, 65.5153846], [24.1776819, 65.6603564], [24.1318042, 65.7716089], [24.152978, 65.862572], [24.0536762, 65.95152940000006], [24.0491701, 65.99502970000003], [23.9394784, 66.07568309999998], [23.9170552, 66.16186640000002], [23.7313763, 66.19408560000002], [23.6489848, 66.30377249999997], [23.6880374, 66.3815611], [23.650965700000015, 66.4557476], [23.8605347, 66.5595503], [23.86853209999999, 66.6568254], [23.9078441, 66.72140390000003], [23.880337, 66.76350940000003], [23.99566289999999, 66.822049], [23.8525565, 66.9573479], [23.677678, 67.0620298], [23.5545444, 67.16789390000002], [23.596079, 67.20820560000003], [23.5637833, 67.2606725], [23.7311639, 67.28763560000003], [23.7172209, 67.38530669999997], [23.7639366, 67.42772120000002], [23.408239899999984, 67.46939490000003], [23.4059159, 67.50091320000003], [23.5452477, 67.5838871], [23.492249099999984, 67.6652745], [23.47871239999999, 67.8419848], [23.5171915, 67.88433529999998], [23.6407972, 67.9151784], [23.6525654, 67.9589433], [23.3937061, 68.0452571], [23.3077618, 68.14837649999997], [23.1656349, 68.13315060000002], [23.152641, 68.2333806], [23.0702517, 68.29970360000003], [22.9181313, 68.3335115], [22.8028778, 68.39328420000002], [22.3437523, 68.45688960000003], [22.2960914, 68.4840408], [22.045040799999988, 68.479329], [21.8898693, 68.5844051], [21.7010887, 68.59686950000003], [21.6061629, 68.6678769], [21.4298688, 68.691352], [21.39042, 68.76478960000003], [20.9988391, 68.89612380000003], [20.8441913, 68.93656440000004], [20.9116456, 68.96882420000003], [20.775042799999987, 69.0326073], [20.5523258, 69.0600767], [20.7173208, 69.1197912], [21.057543, 69.03628970000003], [21.1086742, 69.1039291], [20.9875741, 69.19192740000003], [21.0961691, 69.260912], [21.2788202, 69.3118841], [21.6270859, 69.27658829999997], [22.1757622, 68.95632440000003], [22.1918678, 68.9187737], [22.3407806, 68.82722570000003], [22.3745217, 68.71666660000004], [22.5353893, 68.74451260000004], [22.800824, 68.68754809999997], [23.0459522, 68.6893436], [23.1675822, 68.6285189], [23.4406356, 68.6921635], [23.6735202, 68.70552140000002], [23.7753915, 68.81885129999998], [23.983330799999987, 68.82714340000003], [24.0755916, 68.7799668], [24.30226, 68.71735020000003], [24.6083879, 68.6819016], [24.9170187, 68.60529109999997], [25.1193208, 68.6428308], [25.1212144, 68.7458351], [25.1573697, 68.80006390000003], [25.2931271, 68.8600372], [25.47250939999999, 68.90329120000003], [25.6543285, 68.90577049999997], [25.745596499999987, 69.03984729999998], [25.742717799999987, 69.14430209999998], [25.6939225, 69.1957144], [25.7410164, 69.31839509999998], [25.8462009, 69.3929115], [25.8084981, 69.4259367], [25.8768225, 69.5261298], [25.9760403, 69.610225], [25.8925512, 69.66539549999997], [26.0071395, 69.7228555], [26.1255598, 69.7345401], [26.3835888, 69.8541585], [26.4653759, 69.93980490000003], [26.6834067, 69.96301920000003], [26.8407548, 69.9603025], [27.0316081, 69.9107924], [27.3049484, 69.95762760000004], [27.43070959999999, 70.0194461], [27.5206048, 70.02243659999996], [27.614207, 70.074151], [27.9593778, 70.0921111], [27.9842853, 70.0139707], [28.160713, 69.92099370000003], [28.3452694, 69.88083179999997], [28.4042254, 69.818425], [29.1339095, 69.69534039999996], [29.1705369, 69.6390414], [29.3364956, 69.47832269999998], [29.2193395, 69.39763620000002], [28.831539, 69.2243617], [28.80543, 69.1111558], [28.929451, 69.0519407], [28.4953735, 68.9300403], [28.468076, 68.8855137], [28.66118, 68.8864737], [28.8014499, 68.8693665], [28.7072131, 68.732555], [28.4341202, 68.53979460000002], [28.6478382, 68.19591340000002], [29.3271337, 68.0745162], [29.6593888, 67.80297219999996], [30.0173409, 67.67356889999996], [29.9305102, 67.5228214], [29.8567823, 67.48926540000004], [29.6361151, 67.332861], [29.522709499999987, 67.3099172], [29.48660609999999, 67.26011490000003], [29.0732544, 66.99615390000004], [29.0331239, 66.92547219999996], [29.0607529, 66.85269279999997], [29.3507185, 66.6439171], [29.4726751, 66.5434478], [29.6969469, 66.277347], [29.9239353, 66.1262486], [29.997268, 65.97889249999997], [30.0647878, 65.90105890000002], [30.138463, 65.66868749999998], [30.0170916, 65.6965272], [29.722432799999986, 65.637045], [29.8637508, 65.5604702], [29.7331208, 65.472637], [29.7467636, 65.347391], [29.6018471, 65.2599435], [29.893525, 65.19295509999998], [29.8193446, 65.1444587], [29.896916, 65.1051579], [29.7328054, 65.09129760000003], [29.6255535, 65.06020520000003], [29.5993537, 64.99509809999998], [29.6470353, 64.8674467], [29.739663, 64.7897553], [30.0430007, 64.7928625], [30.0416232, 64.74110840000003], [30.1365729, 64.6488835], [29.9894058, 64.58761530000002], [29.9869609, 64.5338998], [30.0583348, 64.4508749], [30.0448933, 64.4020122], [30.482439699999983, 64.2623385], [30.466399899999985, 64.2044319], [30.5534271, 64.1322443], [30.5280169, 64.0488769], [30.320039, 63.9082685], [30.260416, 63.82200320000001], [29.9718903, 63.7571676], [30.24571609999999, 63.60696830000001], [30.385620199999988, 63.54577980000001], [30.4841978, 63.4670887], [30.789711, 63.4050884], [30.9330443, 63.3559208], [30.9798739, 63.3078177], [31.1483116, 63.26151890000002], [31.2416464, 63.2166421], [31.2658547, 63.1154671], [31.46252279999998, 63.02421930000001], [31.5848296, 62.9070356]]],
        // Greenland: [[[-57.44887, 82.28507], [-60.15022, 82.05782], [-61.87928, 81.82771], [-62.2191, 81.7294], [-63.42448, 81.28486], [-65.32658, 80.98138], [-66.57577, 80.83605], [-67.38791, 80.54753], [-67.66468, 80.1436], [-68.73755, 79.10919], [-72.47765, 78.62618], [-72.96065, 78.36972], [-73.1359, 78.13036], [-72.78968, 77.34387], [-73.38382, 76.66424], [-72.79822, 76.5702], [-69.80615, 76.29664], [-68.45971, 75.97179], [-66.32252, 75.80508], [-64.89914, 75.80081], [-63.13809, 76.04018], [-62.31741, 75.9034], [-60.47087, 75.78371], [-60.19731, 75.62983], [-58.94919, 75.49305], [-58.81241, 74.92883], [-58.38497, 74.89464], [-58.21399, 74.63817], [-57.47879, 74.17654], [-57.15394, 73.47554], [-55.83743, 71.40673], [-55.23901, 70.48346], [-55.10223, 69.40632], [-53.87121, 68.825], [-54.21316, 66.80748], [-53.75152, 65.52517], [-52.5034, 63.43926], [-47.39122, 59.6265], [-42.68939, 59.38714], [-41.16771, 61.50723], [-30.05428, 67.67946], [-26.83993, 68.124], [-21.04386, 70.27829], [-21.24903, 72.74034], [-16.78656, 74.91174], [-16.39331, 77.2541], [-17.64144, 78.51933], [-16.82075, 79.78455], [-11.02468, 81.34043], [-11.93085, 82.02433], [-19.48798, 82.45177], [-19.71024, 83.01599], [-27.19898, 83.85377], [-39.64602, 83.80248], [-50.82784, 82.9476], [-57.44887, 82.28507]]],
        Iceland: [[[-25.0, 63.0], [-12.8, 63.0], [-12.8, 66.8], [-25.0, 66.8]]],
        Norway: [[[30.79367, 69.78758], [30.89032, 69.73729], [30.95448, 69.63243], [30.93257, 69.55989], [30.81756, 69.52877], [30.51593, 69.54042], [30.41768, 69.58992], [30.23373, 69.65016], [30.13777, 69.64353], [30.18838, 69.56846], [30.12305, 69.51749], [30.11721, 69.46989], [30.00876, 69.41591], [29.85802, 69.42374], [29.7244, 69.38965], [29.56938, 69.31756], [29.39594, 69.32384], [29.28845, 69.29618], [29.31313, 69.23752], [29.24224, 69.11306], [29.05666, 69.01528], [28.85456, 69.07664], [28.80541, 69.11116], [28.83152, 69.22436], [29.21932, 69.39764], [29.33647, 69.47832], [29.17052, 69.63904], [29.13389, 69.69534], [28.40421, 69.81842], [28.33046, 69.84919], [28.34506, 69.8808], [28.1607, 69.92099], [27.98428, 70.01397], [27.94828, 70.09187], [27.79768, 70.07731], [27.61245, 70.07456], [27.52598, 70.02346], [27.42855, 70.01921], [27.27471, 69.97591], [27.29177, 69.95225], [27.03749, 69.91039], [26.89776, 69.93245], [26.85129, 69.96013], [26.71807, 69.94499], [26.67869, 69.96477], [26.46435, 69.93939], [26.38594, 69.85535], [26.24129, 69.81453], [26.13562, 69.73861], [26.01418, 69.72334], [25.89149, 69.6655], [25.97672, 69.61067], [25.93749, 69.57253], [25.83994, 69.54298], [25.87704, 69.5222], [25.80934, 69.42639], [25.8461, 69.39325], [25.75938, 69.34038], [25.74753, 69.28679], [25.70204, 69.25366], [25.69302, 69.19674], [25.74351, 69.13879], [25.72429, 69.0796], [25.77744, 69.01828], [25.71241, 68.98063], [25.65423, 68.90587], [25.60033, 68.88487], [25.48119, 68.90507], [25.2677, 68.85099], [25.15713, 68.79989], [25.11152, 68.70252], [25.11924, 68.6428], [24.91692, 68.60525], [24.85717, 68.56221], [24.78342, 68.63623], [24.60839, 68.6819], [24.30226, 68.71735], [24.07559, 68.77997], [23.98333, 68.82714], [23.87146, 68.83652], [23.77539, 68.81885], [23.73106, 68.75075], [23.67352, 68.70552], [23.44064, 68.69216], [23.16758, 68.62852], [23.04595, 68.68934], [22.80082, 68.68755], [22.53539, 68.74451], [22.37452, 68.71667], [22.34078, 68.82723], [22.19187, 68.91877], [22.17576, 68.95632], [21.98361, 69.07289], [21.8464, 69.14416], [21.62709, 69.27659], [21.27882, 69.31188], [21.09617, 69.26091], [21.00331, 69.22234], [20.98758, 69.19193], [21.05563, 69.12209], [21.10868, 69.10393], [21.05754, 69.03629], [20.71732, 69.11979], [20.55233, 69.06008], [20.06005, 69.04576], [20.30659, 68.92618], [20.33587, 68.80231], [20.20284, 68.66592], [20.05225, 68.59107], [19.9375, 68.55794], [20.02589, 68.53081], [20.22654, 68.49081], [19.97796, 68.38816], [19.9214, 68.35601], [18.9838, 68.51696], [18.62122, 68.50696], [18.40569, 68.58188], [18.12592, 68.53652], [18.10109, 68.40605], [18.15135, 68.19879], [17.89976, 67.96937], [17.66475, 68.03838], [17.28152, 68.11881], [17.18051, 68.05046], [16.73812, 67.91421], [16.55628, 67.64719], [16.40757, 67.53403], [16.158, 67.51916], [16.08983, 67.43528], [16.4041, 67.20497], [16.38776, 67.04546], [16.19402, 66.98259], [16.03876, 66.91245], [15.99364, 66.87323], [15.62137, 66.59434], [15.37723, 66.4843], [15.48473, 66.28246], [15.03568, 66.15356], [14.51629, 66.13258], [14.58441, 65.90134], [14.62548, 65.81181], [14.54147, 65.70075], [14.49877, 65.5213], [14.50683, 65.30973], [14.3788, 65.24762], [14.32598, 65.11892], [14.12989, 64.97856], [13.70547, 64.63996], [13.65426, 64.58034], [13.89118, 64.50713], [14.08523, 64.47825], [14.11387, 64.46248], [14.15711, 64.19505], [13.96752, 64.00797], [13.7154, 64.04629], [13.21111, 64.09537], [12.92672, 64.05795], [12.68356, 63.97422], [12.48023, 63.81876], [12.33057, 63.71507], [12.29946, 63.67198], [12.14977, 63.59395], [12.21288, 63.47859], [12.08407, 63.35558], [11.97458, 63.26923], [12.21823, 63.00033], [12.07469, 62.90254], [12.13638, 62.74792], [12.05614, 62.61192], [12.29937, 62.26749], [12.13766, 61.72382], [12.41961, 61.56298], [12.56932, 61.56875], [12.87085, 61.3565], [12.83383, 61.25846], [12.79035, 61.19705], [12.70703, 61.14327], [12.68258, 61.06122], [12.61251, 61.04683], [12.44761, 61.05073], [12.22399, 61.01308], [12.33279, 60.89017], [12.33448, 60.85236], [12.39537, 60.73389], [12.51102, 60.64246], [12.51578, 60.60015], [12.60688, 60.51274], [12.60605, 60.40593], [12.49879, 60.32365], [12.54191, 60.19338], [12.50064, 60.09908], [12.44856, 60.03917], [12.34114, 59.96567], [12.23104, 59.92759], [12.17429, 59.88981], [12.05346, 59.88594], [11.98518, 59.90072], [11.84045, 59.84174], [11.92597, 59.794], [11.93988, 59.69458], [11.88922, 59.69321], [11.85571, 59.64829], [11.72056, 59.62549], [11.69113, 59.58955], [11.75993, 59.45818], [11.77987, 59.38646], [11.81625, 59.34474], [11.82979, 59.24223], [11.78393, 59.20838], [11.77539, 59.08659], [11.71051, 59.03368], [11.68908, 58.95685], [11.59063, 58.89072], [11.45623, 58.89021], [11.45853, 58.99597], [11.34184, 59.12041], [11.20498, 59.08311], [11.17718, 59.09736], [11.1, 59], [11.0203, 58.97], [9.67858, 58.87844], [8.51901, 58.15871], [7.92368, 57.95878], [6.62638, 57.9188], [5.34686, 58.63409], [4.70265, 59.35382], [4.57381, 61.1576], [4.78262, 62.0506], [5.46681, 62.55263], [6.79965, 62.99691], [8.29243, 63.77884], [9.92293, 64.11205], [10.71819, 65.0095], [11.4246, 65.12057], [11.79779, 65.84919], [11.95329, 67.64852], [13.20171, 68.29717], [14.5701, 68.89694], [16.08064, 69.41675], [17.91552, 69.8166], [19.1906, 70.36306], [19.81259, 70.33196], [20.19467, 70.19424], [21.78519, 70.50523], [21.89626, 70.73182], [23.70892, 70.96284], [23.91773, 71.1139], [24.46864, 71.07391], [24.71744, 71.21608], [25.89478, 71.26051], [26.77445, 71.08724], [27.79185, 71.22052], [28.65819, 71.06503], [30.03102, 70.78069], [31.23946, 70.43859], [31.19482, 70.34084], [30.79367, 69.78758]], [[4.2, 80.84], [-11.5, 70.1], [19.2, 73.5], [39.2, 81.4]]],
        Sweden: [[[15.4538561, 66.34534869999999], [15.3772302, 66.4843117], [15.625833, 66.605833], [15.80794, 66.735271], [16.0387632, 66.9124213], [16.195223, 66.982232], [16.3877, 67.0455], [16.4040109, 67.2049795], [16.09015, 67.435232], [16.1566, 67.519458], [16.407797, 67.533978], [16.555733, 67.647289], [16.7381292, 67.91418620000002], [17.180003, 68.050508], [17.2818957, 68.1188101], [17.6648128, 68.0384733], [17.8998048, 67.9693359], [18.1514126, 68.198755], [18.1010915, 68.406043], [18.1258499, 68.5364954], [18.4056102, 68.5818554], [18.6211478, 68.5069382], [18.9836971, 68.5169473], [19.921397, 68.3560137], [19.9778586, 68.3881535], [20.2264196, 68.4908071], [19.9375039, 68.5579418], [20.0521233, 68.5910515], [20.2027029, 68.6659076], [20.3358646, 68.8023404], [20.3064282, 68.9261735], [20.0600472, 69.0457578], [20.5486422, 69.05996990000001], [20.7750428, 69.0326073], [20.9137291, 68.9603927], [20.8441913, 68.93656440000002], [20.9156942, 68.8971424], [20.9967921, 68.896741], [21.2340165, 68.8140862], [21.3194271, 68.7592708], [21.3893348, 68.76495460000002], [21.4298688, 68.691352], [21.5651505, 68.6752534], [21.7013706, 68.6305605], [21.7016655, 68.5963461], [21.8898693, 68.5844051], [21.9919125, 68.5339794], [22.0182391, 68.495951], [22.1528153, 68.4701805], [22.2945732, 68.4838241], [22.4661749, 68.4413001], [22.6482126, 68.41604160000001], [22.7362404, 68.3852018], [22.8041064, 68.39294], [22.9181313, 68.3335115], [23.0702517, 68.29970360000002], [23.1528179, 68.2310713], [23.1415318, 68.1543005], [23.2783645, 68.15733889999998], [23.3216014, 68.1347101], [23.3966203, 68.044179], [23.5310194, 68.0067455], [23.6632301, 67.94218640000001], [23.6407972, 67.9151784], [23.5098377, 67.87994509999999], [23.4739757, 67.81714420000002], [23.4946531, 67.7903019], [23.493057, 67.6641861], [23.5588847, 67.6192741], [23.5450496, 67.5829545], [23.4081036, 67.50173829999999], [23.4104738, 67.46759370000002], [23.5365192, 67.4599963], [23.7632859, 67.4262029], [23.7179667, 67.384843], [23.7750768, 67.3393805], [23.7311639, 67.28763560000002], [23.5834506, 67.269308], [23.5535126, 67.2468025], [23.5958386, 67.2071971], [23.5569385, 67.16578719999998], [23.6536532, 67.1042345], [23.6739708, 67.0650834], [23.8564714, 66.9558968], [23.8640579, 66.9221303], [23.9330592, 66.8845665], [23.9945079, 66.82348849999998], [23.9782068, 66.78409040000001], [23.8797209, 66.7620511], [23.9078441, 66.72140390000001], [23.8685321, 66.6568254], [23.8846737, 66.61277119999998], [23.8605347, 66.5595503], [23.7853219, 66.5333886], [23.6509657, 66.4557476], [23.6880374, 66.3815611], [23.6489848, 66.3037725], [23.7263744, 66.1968556], [23.9159179, 66.1621612], [23.936749, 66.0794759], [24.0374327, 66.0090364], [24.0421963, 65.9633925], [24.152978, 65.862572], [24.1318042, 65.7716089], [24.1721721, 65.72528229999999], [24.1776819, 65.6603564], [24.1319001, 65.5153846], [24.1444599, 65.3956667], [23.1299456, 65.2854532], [21.8250561, 64.8363612], [22.0872366, 64.43431070000001], [21.5096176, 64.04121570000002], [21.4570471, 63.7528427], [20.20662871333013, 63.274568586669865], [19.4322896, 63.0737152], [18.2961641, 62.4173632], [17.7755886, 61.1718712], [17.8981165, 60.9377595], [17.7095869, 60.7102649], [17.3865202, 60.6893467], [17.3489744, 60.5862714], [17.3024177, 60.508762], [17.29774, 60.4647038], [17.2565412, 60.4243351], [17.1955585, 60.4105852], [17.1986283, 60.3077815], [17.0585097, 60.2727725], [16.908878, 60.281498], [16.9048859, 60.2394077], [16.7046001, 60.1950497], [16.6294785, 60.2384924], [16.6154023, 60.2786235], [16.5166127, 60.3554293], [16.3927146, 60.3794045], [16.2589904, 60.4931441], [16.1947891, 60.5354328], [16.13651, 60.6103267], [16.2382972, 60.6230491], [16.3769218, 60.7434488], [16.386117, 60.7868], [16.2552139, 60.8636119], [16.1310092, 60.9920575], [15.9216155, 61.00763], [15.7619207, 61.0496869], [15.6803816, 61.11321], [15.6573361, 61.2154788], [15.4760187, 61.3149858], [15.3370007, 61.4016369], [15.20475, 61.503826], [15.1531933, 61.5956892], [14.8564014, 61.7835491], [14.7971, 61.798451], [14.6666465, 61.8918775], [14.5296202, 61.783626], [14.4997464, 61.62599], [14.3947754, 61.5637652], [14.3364964, 61.59913920000001], [14.1822587, 61.6175455], [13.9769516, 61.6213397], [13.8902353, 61.6525473], [13.6131488, 61.6726273], [13.564749, 61.656455], [13.5066718, 61.6929666], [13.5145384, 61.7377738], [13.4160916, 61.8280592], [13.2092287, 61.9365972], [13.0799221, 62.0376119], [13.0423631, 62.0182008], [12.9513736, 62.1334555], [12.9026405, 62.1418727], [12.8059683, 62.2205277], [12.6078489, 62.214806], [12.299389, 62.2659814], [12.056144, 62.6119191], [12.1363845, 62.7479169], [12.074689, 62.9025463], [12.218233, 63.0003345], [11.9745822, 63.2692252], [12.0840901, 63.3555796], [12.2128783, 63.4785906], [12.1497625, 63.593946], [12.2975812, 63.6732169], [12.3399662, 63.7269855], [12.4797773, 63.8196667], [12.6860556, 63.9738931], [12.9268369, 64.05783829999999], [13.2109436, 64.0951725], [13.7151219, 64.045304], [13.981667, 64.013056], [14.1579301, 64.1860759], [14.120556, 64.452778], [14.086006, 64.47814109999999], [13.8924406, 64.507004], [13.6540802, 64.579929], [13.7050997, 64.6396655], [14.1081927, 64.96225790000001], [14.3257603, 65.1190618], [14.3790211, 65.24804960000002], [14.5056577, 65.3099238], [14.4967711, 65.5174317], [14.5295213, 65.682227], [14.6240045, 65.81419090000001], [14.584253, 65.9013501], [14.5162846, 66.132567], [15.035653, 66.1535649], [15.4847146, 66.282458], [15.4538561, 66.34534869999999]]],
        USA: [[[-130.01989, 55.9153], [-130.17038, 55.77749], [-130.13861, 55.55335], [-129.99201, 55.28955], [-130.25933, 54.99635], [-130.66666, 54.71444], [-131.17048, 54.72103], [-132.10046, 54.6269], [-132.86477, 54.63066], [-133.60649, 54.72479], [-134.93933, 56.02375], [-136.80681, 57.75192], [-137.09296, 58.25079], [-139.07716, 59.1017], [-141.32115, 59.76436], [-143.47102, 59.81707], [-146.37014, 59.17701], [-149.21654, 59.54598], [-152.0253, 57.0535], [-155.80544, 55.02035], [-159.93198, 54.32757], [-173.1399, 51.33056], [-179.49537, 50.84863], [-179.28453, 52.29443], [-171.78447, 63.95114], [-169.94709, 63.91437], [-169.09903, 65.86662], [-168.1474, 65.7885], [-164.9772, 66.85025], [-167.15342, 68.37135], [-166.29498, 69.12437], [-161.71663, 70.74335], [-156.23466, 71.55661], [-143.75716, 70.6304], [-141.58847, 70.26895], [-141.56335, 69.73575], [-141.39798, 69.64277], [-141.00304, 69.64616], [-141.00189, 60.6745], [-141.00157, 60.30507], [-140.52034, 60.21906], [-140.44797, 60.30796], [-139.97408, 60.18451], [-139.68007, 60.33572], [-139.05208, 60.35373], [-139.17702, 60.08286], [-138.70578, 59.90624], [-138.60921, 59.76], [-137.60744, 59.24348], [-137.45151, 58.90854], [-136.82468, 59.1598], [-136.58199, 59.16554], [-136.19525, 59.63881], [-135.9476, 59.66343], [-135.47958, 59.7981], [-135.02888, 59.56364], [-135.10063, 59.42776], [-134.95978, 59.28104], [-134.7007, 59.2489], [-134.48273, 59.13097], [-134.258, 58.86087], [-133.84105, 58.72985], [-133.37997, 58.43181], [-133.45987, 58.38848], [-133.17195, 58.15383], [-132.55389, 57.4967], [-132.2478, 57.21112], [-132.36871, 57.09167], [-132.0448, 57.0451], [-132.12311, 56.8739], [-131.87311, 56.80627], [-131.83539, 56.59912], [-131.5813, 56.6123], [-131.08698, 56.40613], [-130.7818, 56.36713], [-130.4682, 56.24329], [-130.42548, 56.14172], [-130.10541, 56.12268], [-130.01989, 55.9153]], [[179.9, 52.2], [172.0, 53.3], [172.0, 52.4], [179.9, 51.0]]],
    };
    /* eslint-enable max-len */
    let usingClockLocations = true;
    const useClockLocations = (useClockLocations) => {
        usingClockLocations = useClockLocations;
    };
    const pointInPolygon = (coords, polygon) => {
        const [x, y] = coords;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            // Check that a) the segment crosses the y coordinate of the point
            //            b) at least one of the two vertices is left of the point
            //            c) at the y coordinate of the point, the segment is left of it
            if ((((yi < y) !== (yj < y)) && (xi <= x || xj <= x)) && ((xi + (y - yi) * (xj - xi) / (yj - yi)) < x)) {
                inside = !inside;
            }
            j = i;
        }
        return inside;
    };
    // The name of a country being returned doesn't just mean that the coordinates are within that country, but that they
    // are within the region of that country where a fixed time rule applies.
    const clockLocationFromPolygons = (latitude, longitude) => {
        if (!usingClockLocations) {
            return undefined;
        }
        // First exclude as large an area as possible from having to check polygons
        if (latitude < 51.0) {
            return undefined;
        }
        if (latitude < 57.0 && longitude > -129.0 && longitude < 172.0) {
            return undefined;
        }
        // Make a list of plausible areas based on longitude, then only check those
        const countries = [];
        const labels = [];
        if (longitude < -129.9 || longitude > 172.4) {
            countries.push(clockLocations.USA);
            labels.push('USA');
        }
        if (longitude > -141.1 && longitude < -61.1) {
            countries.push(clockLocations.Canada);
            labels.push('Canada');
        }
        // Greenland doesn't currently have a rule for this
        // if (longitude > -73.1 && longitude < -11.3) {
        //   countries.push(clockLocations.Greenland);
        //   labels.push('Greenland');
        // }
        if (longitude > -25.0 && longitude < -12.8) {
            countries.push(clockLocations.Iceland);
            labels.push('Iceland');
        }
        if (longitude > -9.2 && longitude < 33.6) {
            countries.push(clockLocations.Norway);
            labels.push('Norway');
        }
        if (longitude > 10.9 && longitude < 24.2) {
            countries.push(clockLocations.Sweden);
            labels.push('Sweden');
        }
        if (longitude > 19.1 && longitude < 31.6) {
            countries.push(clockLocations.Finland);
            labels.push('Finland');
        }
        // Russia currently doesn't have a rule for this
        // if (longitude > 27.3 || longitude < -169.6) {
        //  countries.push(clockLocations.Russia);
        //  labels.push('Russia');
        // }
        for (let i = 0; i < countries.length; i++) {
            for (let j = 0; j < countries[i].length; j++) {
                if (pointInPolygon([longitude, latitude], countries[i][j])) {
                    return labels[i];
                }
            }
        }
        return undefined;
    };

    /* eslint-disable complexity */
    class LocalBadiDate {
        constructor(date, latitude, longitude, timezoneId) {
            this._latitude = latitude;
            this._longitude = longitude;
            this._timezoneId = timezoneId;
            // If a datetime object is being passed, we use date and time, not just the
            // date. For a JS Date object, we can't assume it's in the correct timezone,
            // so in that case we use the date information only.
            this._badiDate = new BadiDate(this._setInputDateToCorrectDay(date, latitude, longitude));
            const gregDate = this._badiDate.gregorianDate.setZone(timezoneId, { keepLocalTime: true });
            this._clockLocation = clockLocationFromPolygons(latitude, longitude);
            if (!this._clockLocation ||
                (this._clockLocation === 'Finland' &&
                    this._badiDate.month === 19)) {
                this._end = MeeusSunMoon.sunset(gregDate, latitude, longitude);
                this._solarNoon = MeeusSunMoon.solarNoon(gregDate, longitude);
                this._sunrise = MeeusSunMoon.sunrise(gregDate, latitude, longitude);
                this._start = MeeusSunMoon.sunset(gregDate.minus({ days: 1 }), latitude, longitude);
            }
            else {
                // First we set times to 18:00, 06:00, 12:00, 18:00, modifications are
                // then made depending on the region.
                this._start = gregDate.minus({ days: 1 }).set({ hour: 18 });
                this._solarNoon = gregDate.set({ hour: 12 });
                this._sunrise = gregDate.set({ hour: 6 });
                this._end = gregDate.set({ hour: 18 });
                if (this._clockLocation === 'Canada') {
                    this._sunrise = this._sunrise.plus({ minutes: 30 });
                }
                else if (this._clockLocation === 'Iceland') {
                    this._solarNoon = this._solarNoon.plus({ hours: 1 });
                }
                else if (this._clockLocation === 'Finland' ||
                    this._clockLocation === 'USA') {
                    if (this._end.isInDST) {
                        this._sunrise = this._sunrise.plus({ hours: 1 });
                        this._solarNoon = this._solarNoon.plus({ hours: 1 });
                        this._end = this._end.plus({ hours: 1 });
                    }
                    if (this._start.isInDST) {
                        this._start = this._start.plus({ hours: 1 });
                    }
                }
            }
            switch (this._badiDate.holyDayNumber) {
                case 2:
                    // First Day of Ridvan: 15:00 local standard time
                    this._holyDayCommemoration = gregDate.set({ hour: gregDate.isInDST ? 16 : 15 });
                    break;
                case 5:
                    // Declaration of the Báb: 2 hours 11 minutes after sunset
                    this._holyDayCommemoration = this._start.plus({ minutes: 131 });
                    break;
                case 6:
                    // Ascension of Bahá'u'lláh: 03:00 local standard time
                    this._holyDayCommemoration = gregDate.set({ hour: gregDate.isInDST ? 4 : 3 });
                    break;
                case 7:
                    // Martyrdom of the Báb: solar noon
                    this._holyDayCommemoration = this._solarNoon;
                    break;
                case 11:
                    // Ascension of 'Abdu'l-Bahá: 01:00 local standard time
                    this._holyDayCommemoration = gregDate.set({ hour: gregDate.isInDST ? 2 : 1 });
                    break;
                // skip default
            }
        }
        _setInputDateToCorrectDay(date, latitude, longitude) {
            if (luxon.DateTime.isDateTime(date)) {
                const sunset = MeeusSunMoon.sunset(date, latitude, longitude);
                return (date > sunset) ? date.plus({ days: 1 }) : date;
            }
            return date;
        }
        get badiDate() {
            return this._badiDate;
        }
        get start() {
            return this._start;
        }
        get sunrise() {
            return this._sunrise;
        }
        get solarNoon() {
            return this._solarNoon;
        }
        get end() {
            return this._end;
        }
        get holyDayCommemoration() {
            return this._holyDayCommemoration;
        }
        get clockLocation() {
            return this._clockLocation;
        }
        get latitude() {
            return this._latitude;
        }
        get longitude() {
            return this._longitude;
        }
        get timezoneId() {
            return this._timezoneId;
        }
        get nextMonth() {
            return new LocalBadiDate(this.badiDate.nextMonth, this._latitude, this._longitude, this._timezoneId);
        }
        get previousMonth() {
            return new LocalBadiDate(this.badiDate.previousMonth, this._latitude, this._longitude, this._timezoneId);
        }
        get nextDay() {
            return new LocalBadiDate(this.badiDate.nextDay, this._latitude, this._longitude, this._timezoneId);
        }
        get previousDay() {
            return new LocalBadiDate(this.badiDate.previousDay, this._latitude, this._longitude, this._timezoneId);
        }
    }
    const badiDateSettings$1 = (settings) => {
        if (typeof settings.defaultLanguage === 'string' ||
            typeof settings.underlineFormat === 'string') {
            badiDateSettings(settings);
        }
        if (typeof settings.useClockLocations === 'boolean') {
            useClockLocations(settings.useClockLocations);
        }
    };
    MeeusSunMoon.settings({ returnTimeForNoEventCase: true, roundToNearestMinute: true });

    exports.BadiDate = BadiDate;
    exports.LocalBadiDate = LocalBadiDate;
    exports.badiDateSettings = badiDateSettings$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
