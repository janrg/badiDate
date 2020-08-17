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

    exports.BadiDate = BadiDate;
    exports.badiDateSettings = badiDateSettings;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
