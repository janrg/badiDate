import * as luxon from 'luxon';
import { badiLocale, setDefaultLanguage, setUnderlineFormat } from './badiLocale';
import { formatBadiDate, formatItemFallback } from './formatter';
import { BadiDateOptions, BadiYearInfo, HolyDay, InputDate } from './types';
import { badiYears } from './badiYears';

class BadiDate {
    private _gregorianDate: luxon.DateTime;
    private _badiYear: number;
    private _badiMonth: number;
    private _badiDay: number;
    private _nawRuz: luxon.DateTime;
    private _ayyamiHaLength: number;
    private _yearTwinBirthdays: Array<number>;
    private _holyDay?: HolyDay = undefined;
    private _valid: boolean = true;
    private _invalidReason: string = undefined;

    constructor(date: InputDate) {
        try {
            if (date instanceof Date) {
                this._gregorianDate = luxon.DateTime.fromObject(
                    { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), zone: 'UTC' });
            } else if (date instanceof luxon.DateTime) {
                this._gregorianDate = luxon.DateTime.fromObject(
                    { year: date.year, month: date.month, day: date.day, zone: 'UTC' });
            } else if (Array.isArray(date)) {
                if (date.length !== 3 && date.length !== 2) {
                    throw 'Unexpected length of input array';
                }
                this._setFromBadiDate(date);
            } else {
                throw 'Unrecognized input format';
            }
            if (this._badiYear === undefined) {
                // We haven't set the Badí' date yet
                this._setFromGregorianDate();
            }
            this._setHolyDay();
        } catch (err) {
            this._setInvalid(err);
        }
    }

    format(formatString?: string, language?: string): string {
        return formatBadiDate(this, formatString, language);
    }

    _notInValidGregorianDateRange(datetime: luxon.DateTime): boolean {
        const lowerBound = luxon.DateTime.fromObject({ year: 1844, month: 3, day: 21, zone: 'UTC' });
        const upperBound = luxon.DateTime.fromObject({ year: 2351, month: 3, day: 20, zone: 'UTC' });
        return datetime < lowerBound || datetime > upperBound;
    }

    _setFromGregorianDate() {
        if (this._notInValidGregorianDateRange(this._gregorianDate)) {
            throw 'Input date outside of valid range (1844-03-21 - 2351-03-20)';
        }
        const gregorianYear = this._gregorianDate.year;
        const oldImplementationCutoff = luxon.DateTime.fromObject({ year: 2015, month: 3, day: 21, zone: 'UTC' });
        if (this._gregorianDate < oldImplementationCutoff) {
            const { month, day } = this._gregorianDate;
            if (month < 3 || (month === 3 && day < 21)) {
                this._nawRuz = luxon.DateTime.fromObject({ year: gregorianYear - 1, month: 3, day: 21, zone: 'UTC' });
                this._badiYear = gregorianYear - 1844;
            } else {
                this._nawRuz = luxon.DateTime.fromObject({ year: gregorianYear, month: 3, day: 21, zone: 'UTC' });
                this._badiYear = gregorianYear - 1843;
            }
            this._setOldAyyamiHaLength();
            this._yearTwinBirthdays = [12, 5, 13, 9];
        } else {
            this._badiYear = gregorianYear - 1843;
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

    _setFromBadiDate(dateArray: [number, number, number] | [number, number]) { // eslint-disable-line complexity
        this._badiYear = dateArray[0];
        if (this._badiYear < 1 || this._badiYear > 507) {
            throw 'Input date outside of valid range (1 - 507 B.E.)';
        } else if (this._badiYear < 172) {
            this._nawRuz = luxon.DateTime.fromObject({ year: 1843 + this._badiYear, month: 3, day: 21, zone: 'UTC' });
            this._setOldAyyamiHaLength();
            this._yearTwinBirthdays = [12, 5, 13, 9];
        } else {
            this._setBadiYearInfo();
        }
        // If all three components exist, we have a year, month, and day
        if (dateArray.length === 3) {
            this._badiMonth = dateArray[1];
            this._badiDay = dateArray[2];
            if (this._badiMonth === 20 && this._badiDay > this._ayyamiHaLength) {
                // If only off by one day, we'll bubble up so that 5th Ayyám-i-Há in a year with only 4 days of
                // Ayyám-i-Há can be salvaged
                if (this._badiDay - this._ayyamiHaLength === 1) {
                    this._badiMonth = 19;
                    this._badiDay = 1;
                } else {
                    throw 'Input numbers do not designate a valid date';
                }
            }
            if (this._badiMonth < 1 || this._badiMonth > 20 || this._badiDay < 1 || this.badiDay > 19) {
                throw 'Input numbers do not designate a valid date';
            }
        // Otherwise input designated a Holy Day
        } else {
            if (dateArray[1] < 1 || dateArray[1] > 11) {
                throw 'Input numbers do not designate a valid Holy Day';
            }
            this._holyDay = dateArray[1];
            [this._badiMonth, this._badiDay] = this._holyDayMapping()[this._holyDay];
        }
        this._gregorianDate = this._nawRuz.plus(luxon.Duration.fromObject(
            { days: this._dayOfYear([this._badiYear, this._badiMonth, this._badiDay]) - 1 }));
    }

    _setOldAyyamiHaLength() {
        if (luxon.DateTime.fromObject({ year: this._nawRuz.year + 1 }).isInLeapYear) {
            this._ayyamiHaLength = 5;
        } else {
            this._ayyamiHaLength = 4;
        }
    }

    _setBadiYearInfo(fromGregorianDate: boolean = false) {
        let yearData = this._extractBadiYearInfo();
        if (fromGregorianDate && this._gregorianDate < yearData.nawRuz) {
            this._badiYear -= 1;
            yearData = this._extractBadiYearInfo();
        }
        this._nawRuz = yearData.nawRuz;
        this._ayyamiHaLength = yearData.ayyamiHaLength;
        this._yearTwinBirthdays = yearData.twinBirthdays;
    }

    _extractBadiYearInfo(): BadiYearInfo {
        let nawRuz, ayyamiHaLength, twinBirthdays;
        // Check whether data needs to be unpacked or exists in the verbose version
        // istanbul ignore else
        if (badiYears[0] === 'l4da') {
            const components = badiYears[this._badiYear - 172].split('');
            nawRuz = luxon.DateTime.fromObject(
                { year: this._badiYear - 172 + 2015, month: 3, day: parseInt(components[0], 36), zone: 'UTC' });
            ayyamiHaLength = parseInt(components[1], 36);
            const TB1 = [parseInt(components[2], 36), parseInt(components[3], 36)];
            const TB2 = TB1[1] < 19 ? [TB1[0], TB1[1] + 1] : [TB1[0] + 1, 1];
            twinBirthdays = [TB1[0], TB1[1], TB2[0], TB2[1]];
        } else {
            ({ nawRuz, ayyamiHaLength, twinBirthdays } = badiYears[this._badiYear] as any);
            nawRuz = luxon.DateTime.fromISO(nawRuz, { zone: 'UTC' });
        }
        return { nawRuz, ayyamiHaLength, twinBirthdays };
    }

    _dayOfYear(date: Array<number> | luxon.DateTime): number {
        // Naw-Rúz is day 1
        if (Array.isArray(date)) {
            // We have a Badí' date
            if (date[1] < 19) {
                return 19 * (date[1] - 1) + date[2];
            } else if (date[1] === 20) {
                return 342 + date[2];
            }
            // date[1] === 19
            return 342 + this._ayyamiHaLength + date[2];
        }
        return (date as luxon.DateTime).diff(this._nawRuz).as('days') + 1;
    }

    _setInvalid(invalidReason: string) {
        this._gregorianDate = luxon.DateTime.invalid('Not a valid Badí‘ date');
        this._badiYear = NaN;
        this._badiMonth = NaN;
        this._badiDay = NaN;
        this._ayyamiHaLength = NaN;
        this._nawRuz = luxon.DateTime.invalid('Not a valid Badí‘ date');
        this._valid = false;
        this._invalidReason = invalidReason;
    }

    _setHolyDay() {
        const mapping = this._holyDayMapping();
        this._holyDay = parseInt(Object.keys(mapping)
            .find(key => mapping[key][0] === this._badiMonth && mapping[key][1] === this._badiDay), 10);
    }

    _holyDayMapping(): object {
        return {
            [HolyDay.NawRuz]: [1, 1],
            [HolyDay.FirstRidvan]: [2, 13],
            [HolyDay.NinthRidvan]: [3, 2],
            [HolyDay.TwelfthRidvan]: [3, 5],
            [HolyDay.DeclarationOfTheBab]: [4, this._badiYear < 172 ? 7 : 8],
            [HolyDay.AscensionOfBahaullah]: [4, 13],
            [HolyDay.MartyrdomOfTheBab]: [6, this._badiYear < 172 ? 16 : 17],
            [HolyDay.BirthOfTheBab]: [this._yearTwinBirthdays[0], this._yearTwinBirthdays[1]],
            [HolyDay.BirthOfBahaullah]: [this._yearTwinBirthdays[2], this._yearTwinBirthdays[3]],
            [HolyDay.DayOfTheCovenant]: [14, 4],
            [HolyDay.AscensionOfAbdulBaha]: [14, 6],
        };
    }

    holyDay(language: string = undefined): string {
        if (!this._holyDay) {
            return '';
        }
        if (language === undefined || badiLocale[language] === undefined) {
            language = 'default';
        }
        return formatItemFallback(language, 'holyDay', this._holyDay);
    }

    get isValid(): boolean {
        return this._valid;
    }

    get invalidReason(): string | undefined {
        return this._invalidReason;
    }

    get badiDay(): number {
        return this._badiDay;
    }

    get badiMonth(): number {
        return this._badiMonth;
    }

    get badiYear(): number {
        return this._badiYear;
    }

    // number of the Badí' weekday between 1 (Jalál ~> Saturday) and 7 (Istiqlál ~> Friday).
    get badiWeekday(): number {
        return (this._gregorianDate.weekday + 1) % 7 + 1;
    }

    get yearInVahid(): number {
        return (this._badiYear - 1) % 19 + 1;
    }

    get vahid(): number {
        return (Math.floor((this._badiYear - 1) / 19) % 19) + 1;
    }

    get kullIShay(): number {
        return Math.floor((this._badiYear - 1) / 361) + 1;
    }

    // Gregorian date on whose sunset the Badí' date ends.
    get gregorianDate(): luxon.DateTime {
        return this._gregorianDate;
    }

    get ayyamiHaLength(): number {
        return this._ayyamiHaLength;
    }

    get holyDayNumber(): number | undefined {
        return this._holyDay ? this._holyDay : undefined;
    }
}

const badiDateOptions = (options: BadiDateOptions) => {
    if (options.defaultLanguage) {
        setDefaultLanguage(options.defaultLanguage);
    }
    if (options.underlineFormat) {
        setUnderlineFormat(options.underlineFormat);
    }
};

export { BadiDate, badiDateOptions };
