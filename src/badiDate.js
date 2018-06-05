import {badiLocale, setDefaultLanguage, setUnderlineFormat,
  underlineFormat} from './badiLocale.js';
import {badiYears} from './badiYears.js';

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
   * BE - localized variant of "B.E."
   * BC - localized variant of "Badí' Calendar"
   * Va - localized variant of "Váḥid"
   * KiS - localized variant of "Kull-i-Shay’"
   * Anything in between {} will be printed as is.
   * @param {string} formatString gives the output format (see reference above)
   * @param {string} language output language (subject to fallbacks)
   * @returns {string} date formatted according to inputs
   */
  format(formatString, language) { /* eslint-disable-line complexity */
    if (!this.isValid()) {
      return 'Not a valid date';
    }
    const formatTokens = [
      ['DDL', 'DD+', 'MML', 'MM+', 'WWL', 'yyv', 'KiS'],
      ['dd', 'DD', 'mm', 'MM', 'ww', 'WW', 'yv', 'YV', 'vv', 'kk', 'yy', 'BE',
        'BC', 'Va'],
      ['d', 'D', 'm', 'M', 'W', 'v', 'k', 'y']];
    if (language === undefined ||
        typeof badiLocale[language] === 'undefined') {
      // eslint-disable-next-line dot-notation
      if (typeof badiLocale['default'] === 'undefined') {
        language = 'en';
      } else {
        language = 'default';
      }
    }
    if (typeof formatString !== 'string') {
      formatString = this._formatItemFallback(language, 'defaultFormat');
    }
    let returnString = '';
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
          returnString += formatString[j];
        }
      } else {
        const next1 = formatString[i];
        const next2 = next1 + formatString[i + 1];
        const next3 = next2 + formatString[i + 2];
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
   * Perform post-processing for locale items that contain underlined
   * characters. These are written in locale files as e.g. '_Sh_araf'.
   * Depending on the setting, designated characters are wrapped in a <u> tag
   * or a CSS style or have the underline combining diacritic added to them.
   * @param {string} string the locale item that should be processed
   * @param {undefined|int} crop whether the item should be cropped at a
   *                             specific number of characters (excluding
   *                             diacritical marks and punctuation).
   * @returns {string} processed string
   */
  _postProcessLocaleItem(string, crop = undefined) { /* eslint-disable-line complexity, class-methods-use-this */
    if (crop && crop < string.length) {
      let char = 0;
      let counter = 0;
      while (counter < crop) {
        if (!'_’‘'.indexOf(string[char]) > -1) {
          counter++;
        }
        char++;
      }
      if ('_’‘'.indexOf(string[char]) > -1) {
        char++;
      }
      string = string.slice(0, char);
      if (string.split('_').length % 2 === 0) {
        string += '_';
      }
    }
    const stringComponents = string.split('_');
    for (let comp = 1; comp < stringComponents.length; comp += 2) {
      if (underlineFormat === 'css') {
        stringComponents[comp] = '<span style="text-decoration:underline">' +
          stringComponents[comp] + '</span>';
      } else if (underlineFormat === 'diacritic') {
        let newstring = '';
        for (let i = 0; i < stringComponents[comp].length; i++) {
          newstring += stringComponents[comp][i] + '\u0332';
        }
        stringComponents[comp] = newstring;
      } else if (underlineFormat === 'u') {
        stringComponents[comp] = '<u>' + stringComponents[comp] + '</u>';
      }
    }
    return stringComponents.join('');
  }

  /**
   * Retrieve the appropriate output for a given formatting token and language.
   * @param {string} token identifying the date component for output
   * @param {string} language output language
   * @returns {string} localized output string in desired language (or fallback)
   */
  _getFormatItem(token, language) { // eslint-disable-line complexity
    switch (token) {
      // Single character tokens
      case 'd':
        return this._digitRewrite(this._badiDay, language);
      case 'D': {
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiDay), 3);
      } case 'm':
        return this._digitRewrite(this._badiMonth, language);
      case 'M': {
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiMonth), 3);
      } case 'W':
        return this._formatItemFallback(
          language, 'weekdayAbbbr3', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'y':
        return this._digitRewrite(this._badiYear, language);
      case 'v':
        return this._digitRewrite(
          (Math.floor((this._badiYear - 1) / 19) % 19) + 1, language);
      case 'k':
        return this._digitRewrite(
          Math.floor((this._badiYear - 1) / 361) + 1, language);
      // Two character tokens
      case 'dd':
        return this._digitRewrite(
          ('0' + String(this._badiDay)).slice(-2), language);
      case 'DD':
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiDay));
      case 'mm':
        return this._digitRewrite(
          ('0' + String(this._badiMonth)).slice(-2), language);
      case 'MM':
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiMonth));
      case 'ww':
        return this._formatItemFallback(
          language, 'weekdayAbbr2', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'WW':
        return this._formatItemFallback(
          language, 'weekday', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'yy':
        return this._digitRewrite(
          ('00' + String(this._badiYear)).slice(-3), language);
      case 'yv':
        return this._digitRewrite((this._badiYear - 1) % 19 + 1, language);
      case 'YV':
        return this._formatItemFallback(
          language, 'yearInVahid', (this._badiYear - 1) % 19 + 1);
      case 'vv':
        return this._digitRewrite(('0' + String((Math.floor(
          (this._badiYear - 1) / 19) + 2) % 19 - 1)).slice(-2), language);
      case 'kk':
        return this._digitRewrite(('0' + String(Math.floor(
          (this._badiYear - 1) / 361) + 1)).slice(-2), language);
      case 'Va':
        return this._formatItemFallback(language, 'vahid');
      case 'BE':
        return this._formatItemFallback(language, 'BE');
      case 'BC':
        return this._formatItemFallback(language, 'badiCalendar');
      // Three character tokens
      case 'DDL':
        return this._formatItemFallback(language, 'monthL', this._badiDay);
      case 'DD+': {
        const day = this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiDay));
        const dayL = this._formatItemFallback(
          language, 'monthL', this._badiDay);
        if (day === dayL) {
          return day;
        }
        if (badiLocale[language] === badiLocale.fa) {
          return `<span dir="rtl">${day} (${dayL})</span>`;
        }
        return `${day} (${dayL})`;
      }
      case 'MML':
        return this._formatItemFallback(language, 'monthL', this._badiMonth);
      case 'MM+': {
        const month = this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiMonth));
        const monthL = this._formatItemFallback(
          language, 'monthL', this._badiMonth);
        if (month === monthL) {
          return month;
        }
        if (badiLocale[language] === badiLocale.fa) {
          return `<span dir="rtl">${month} (${monthL})</span>`;
        }
        return `${month} (${monthL})`;
      }
      case 'WWL':
        return this._formatItemFallback(
          language, 'weekdayL', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'yyv':
        return this._digitRewrite(
          ('0' + String((this._badiYear - 1) % 19 + 1)).slice(-2), language);
      case 'KiS':
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'kulliShay'));
      default:
        return '';
    }
  }

  /**
   * For languages that don't use Western Arabic numerals, rewrite digits into
   * the proper unicode characters.
   * @param {int|string} number that should be rewritten
   * @param {string} language code into which the number should be rewritten
   * @returns {string} string of digits using the correct glyphs.
   */
  _digitRewrite(number, language) {
    number = String(number);
    const unicodeOffset = this._formatItemFallback(
      language, 'digitUnicodeOffset') - '0'.charCodeAt(0);
    if (unicodeOffset === 0) {
      return number;
    }
    const codePoints = [];
    for (let i = 0; i < number.length; i++) {
      codePoints.push(number[i].charCodeAt(0) + unicodeOffset);
    }
    return String.fromCharCode(...codePoints);
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
    if (index === undefined) {
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
    return datetime.isBefore(moment.utc('1844-03-21')) ||
        datetime.isAfter(moment.utc('2351-03-20'));
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
    if (language === undefined ||
        typeof badiLocale[language] === 'undefined') {
      // eslint-disable-next-line dot-notation
      if (typeof badiLocale['default'] === 'undefined') {
        language = 'en';
      } else {
        language = 'default';
      }
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
  if (typeof options.underlineFormat === 'string') {
    setUnderlineFormat(options.underlineFormat);
  }
};

export {BadiDate, badiDateOptions};
