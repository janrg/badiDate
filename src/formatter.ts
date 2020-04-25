import { badiLocale, underlineFormat } from './badiLocale';
import { BadiDate } from './badiDate';

const formatTokens = [
    ['DDL', 'DD+', 'MML', 'MM+', 'WWL', 'yyv', 'KiS'],
    ['dd', 'DD', 'mm', 'MM', 'ww', 'WW', 'yv', 'YV', 'vv', 'kk', 'yy', 'BE', 'BC', 'Va'],
    ['d', 'D', 'm', 'M', 'W', 'v', 'k', 'y']];

// eslint-disable-next-line complexity
const formatBadiDate = (badiDate: BadiDate, formatString?: string, language?: string): string => {
    if (!badiDate.isValid) {
        return 'Not a valid Badí‘ date';
    }
    if (typeof language === 'string' && badiLocale[language] === undefined && language.includes('-')) {
        language = language.split('-')[0];
    }
    if (language === undefined || badiLocale[language] === undefined) {
        language = 'default';
    }
    formatString = formatString ?? formatItemFallback(language, 'defaultFormat');
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
        } else {
            const next1 = formatString[i];
            const next2 = next1 + formatString[i + 1];
            const next3 = next2 + formatString[i + 2];
            if (formatTokens[0].includes(next3)) {
                formattedDate += getFormatItem(badiDate, next3, language);
                i += 2;
            } else if (formatTokens[1].includes(next2)) {
                formattedDate += getFormatItem(badiDate, next2, language);
                i += 1;
            } else if (formatTokens[2].includes(next1)) {
                formattedDate += getFormatItem(badiDate, next1, language);
            } else {
                formattedDate += next1;
            }
        }
    }
    return formattedDate;
};

// eslint-disable-next-line complexity
const getFormatItem = (badiDate: BadiDate, token: string, language: string): string => {
    switch (token) {
        // Single character tokens
        case 'd':
            return digitRewrite(badiDate.badiDay, language);
        case 'D':
            return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.badiDay), 3);
        case 'm':
            return digitRewrite(badiDate.badiMonth, language);
        case 'M':
            return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.badiMonth), 3);
        case 'W':
            return formatItemFallback(language, 'weekdayAbbr3', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
        case 'y':
            return digitRewrite(badiDate.badiYear, language);
        case 'v':
            return digitRewrite((Math.floor((badiDate.badiYear - 1) / 19) % 19) + 1, language);
        case 'k':
            return digitRewrite(Math.floor((badiDate.badiYear - 1) / 361) + 1, language);
        // Two character tokens
        case 'dd':
            return digitRewrite((`0${String(badiDate.badiDay)}`).slice(-2), language);
        case 'DD':
            return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.badiDay));
        case 'mm':
            return digitRewrite((`0${String(badiDate.badiMonth)}`).slice(-2), language);
        case 'MM':
            return postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.badiMonth));
        case 'ww':
            return formatItemFallback(language, 'weekdayAbbr2', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
        case 'WW':
            return formatItemFallback(language, 'weekday', (badiDate.gregorianDate.weekday + 1) % 7 + 1);
        case 'yy':
            return digitRewrite((`00${String(badiDate.badiYear)}`).slice(-3), language);
        case 'yv':
            return digitRewrite((badiDate.badiYear - 1) % 19 + 1, language);
        case 'YV':
            return formatItemFallback(language, 'yearInVahid', (badiDate.badiYear - 1) % 19 + 1);
        case 'vv':
            return digitRewrite(
                (`0${String((Math.floor((badiDate.badiYear - 1) / 19) + 2) % 19 - 1)}`).slice(-2), language);
        case 'kk':
            return digitRewrite((`0${String(Math.floor((badiDate.badiYear - 1) / 361) + 1)}`).slice(-2), language);
        case 'Va':
            return formatItemFallback(language, 'vahid');
        case 'BE':
            return formatItemFallback(language, 'BE');
        case 'BC':
            return formatItemFallback(language, 'badiCalendar');
        // Three character tokens
        case 'DDL':
            return formatItemFallback(language, 'monthL', badiDate.badiDay);
        case 'DD+': {
            const day = postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.badiDay));
            const dayL = formatItemFallback(language, 'monthL', badiDate.badiDay);
            if (day === dayL) {
                return day;
            }
            if (badiLocale[language] === badiLocale.fa) {
                return `<span dir="rtl">${day} (${dayL})</span>`;
            }
            return `${day} (${dayL})`;
        }
        case 'MML':
            return formatItemFallback(language, 'monthL', badiDate.badiMonth);
        case 'MM+': {
            const month = postProcessLocaleItem(formatItemFallback(language, 'month', badiDate.badiMonth));
            const monthL = formatItemFallback(language, 'monthL', badiDate.badiMonth);
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
            return digitRewrite((`0${String((badiDate.badiYear - 1) % 19 + 1)}`).slice(-2), language);
        case 'KiS':
            return postProcessLocaleItem(formatItemFallback(language, 'kulliShay'));
        // istanbul ignore next
        default:
            return '';
    }
};

const postProcessLocaleItem = (item: string, crop?: number): string => {
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

const underlineString = (str: string): string => {
    switch (underlineFormat) {
        case 'css': {
            return `<span style="text-decoration:underline">${str}</span>`;
        }
        case 'diacritic': {
            return str.split('').map(char => `${char}\u0332`).join('');
        }
        case 'u': {
            return `<u>${str}</u>`;
        }
        // istanbul ignore next
        default:
            throw new TypeError('Unexpected underlineFormat');
    }
};

const digitRewrite = (number: number | string, language: string): string => {
    number = String(number);
    const unicodeOffset = formatItemFallback(language, 'unicodeCharForZero').charCodeAt(0) - '0'.charCodeAt(0);
    if (unicodeOffset === 0) {
        return number;
    }
    const codePoints = [...number].map(num => num.charCodeAt(0) + unicodeOffset);
    return String.fromCharCode(...codePoints);
};

const formatItemFallback = (language: string, category: string, index?: number): string => {
    if (index === undefined) {
        while (badiLocale[language][category] === undefined) {
            language = languageFallback(language);
        }
        return badiLocale[language][category];
    }
    while (badiLocale[language][category]?.[index] === undefined) {
        language = languageFallback(language);
    }
    return badiLocale[language][category][index];
};

const languageFallback = (languageCode: string): string => {
    if (languageCode.includes('-')) {
        return languageCode.split('-')[0];
        // eslint-disable-next-line no-negated-condition
    } else if (languageCode !== 'default') {
        return 'default';
    }
    return 'en';
};

export { formatBadiDate, formatItemFallback };
