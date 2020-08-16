import { BadiDate } from '../src/badiDate';
import { ayyamiHaLengths, UHJListDates } from './testData';
import * as luxon from 'luxon';
import { badiDateSettings } from '../src/localBadiDate';
import { HolyDay } from '../src/types';

describe('Dates for Naw-Rúz and the Twin Holy Days should agree with the UHJ List 172-221', () => {
    for (let i = 0; i < 50; i++) {
        it(`should produce the correct dates for ${172 + i} B.E.`, () => {
            const nawRuz = new BadiDate({ year: i + 172, holyDayNumber: 1 });
            const birthOfTheBab = new BadiDate({ year: i + 172, holyDayNumber: 8 });
            const birthOfBahaullah = new BadiDate({ year: i + 172, holyDayNumber: 9 });

            expect(nawRuz.gregorianDate.toFormat('yyyy-MM-dd')).toEqual(UHJListDates[i][0]);
            expect([birthOfTheBab.month, birthOfTheBab.day])
                .toEqual((UHJListDates[i][2] as number[]).slice(0, 2));
            expect([birthOfBahaullah.month, birthOfBahaullah.day])
                .toEqual((UHJListDates[i][2] as number[]).slice(2, 4));
        });
    }
});

describe('BadiDate conversions', () => {
    for (let i = 0; i < 1000; i++) {
        const dayOfYear = Math.floor((Math.random() * 365) + 1);
        const year = Math.floor((Math.random() * 506) + 1845);
        const initDate = luxon.DateTime.fromObject({ year, ordinal: dayOfYear, zone: 'UTC' });
        it(`should be stable when re-creating with diff. constructors: ${initDate.toFormat('yyyy-MM-dd')}`, () => {
            const badiDate1 = new BadiDate(initDate);
            const badiDate2 = new BadiDate({ year: badiDate1.year, month: badiDate1.month, day: badiDate1.day });
            const badiDate3 = new BadiDate(badiDate2.gregorianDate.toJSDate());
            const badiDate4 = new BadiDate(badiDate3.gregorianDate);
            expect(badiDate4.isValid).toEqual(true);
            expect(badiDate4.gregorianDate.toISO()).toEqual(initDate.toISO());
        });
    }
});

it('the date should bubble up if set to 5 Ayyám-i-Há for year with only 4', () => {
    const badiDate = new BadiDate({ year: 173, month: 20, day: 5 });

    expect(badiDate.month).toEqual(19);
    expect(badiDate.day).toEqual(1);
});

describe('the date component getters', () => {
    for (let badiYear = 1; badiYear < 508; badiYear++) {
        const badiMonth = Math.floor((Math.random() * 19) + 1);
        const badiDay = Math.floor((Math.random() * 19) + 1);
        const badiDate = new BadiDate({ year: badiYear, month: badiMonth, day: badiDay });

        it(`should return the correct day for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.day).toEqual(badiDay);
        });

        it(`should return the correct month for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.month).toEqual(badiMonth);
        });

        it(`should return the correct year for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.year).toEqual(badiYear);
        });

        it(`should return the correct year in Vahid for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.yearInVahid).toEqual(((badiYear - 1) % 19) + 1);
        });

        it(`should return the correct Vahid for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.vahid).toEqual((Math.floor((badiYear - 1) / 19) % 19) + 1);
        });

        it(`should return the correct Kull-i-Shay for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.kullIShay).toEqual((badiYear < 362) ? 1 : 2);
        });

        it(`should return the correct Ayyam-i-Há length for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.ayyamiHaLength).toEqual(ayyamiHaLengths[badiYear]);
        });

        it(`should return the correct weekday for [${badiYear}, ${badiMonth}, ${badiDay}]`, () => {
            expect(badiDate.weekday).toEqual((badiDate.gregorianDate.weekday + 1) % 7 + 1);
        });
    }
});

describe('`equals`', () => {
    it('should compare dates', () => {
        const invalidBadiDate1 = new BadiDate('someString' as any);
        const invalidBadiDate2 = new BadiDate('someString' as any);
        const validBadiDate1 = new BadiDate({ year: 172, holyDayNumber: 10 });
        const validBadiDate2 = new BadiDate({ year: 172, holyDayNumber: 10 });
        const validBadiDate3 = new BadiDate({ year: 172, holyDayNumber: 11 });
        const validBadiDate4 = new BadiDate({ year: 173, holyDayNumber: 10 });
        const validBadiDate5 = new BadiDate({ year: 173, holyDayNumber: 10 });

        expect(invalidBadiDate1.equals(invalidBadiDate2)).toEqual(false);
        expect(validBadiDate1.equals(invalidBadiDate2)).toEqual(false);
        expect(validBadiDate1.equals(validBadiDate2)).toEqual(true);
        expect(validBadiDate1.equals(validBadiDate3)).toEqual(false);
        expect(validBadiDate4.equals(validBadiDate5)).toEqual(true);
    });
});

describe('Holy Days', () => {
    afterEach(() => {
        badiDateSettings({ defaultLanguage: 'en' });
    });

    const holyDays = [
        { date: { year: 172, holyDayNumber: HolyDay.NawRuz },
            expectedOutput: 'Naw-Rúz',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.FirstRidvan },
            expectedOutput: 'First day of Riḍván',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.NinthRidvan },
            expectedOutput: 'Ninth day of Riḍván',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.TwelfthRidvan },
            expectedOutput: 'Twelfth day of Riḍván',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.DeclarationOfTheBab },
            expectedOutput: 'Declaration of the Báb',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.AscensionOfBahaullah },
            expectedOutput: 'Ascension of Bahá’u’lláh',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.MartyrdomOfTheBab },
            expectedOutput: 'Martyrdom of the Báb',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.BirthOfTheBab },
            expectedOutput: 'Birth of the Báb',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.BirthOfBahaullah },
            expectedOutput: 'Birth of Bahá’u’lláh',
            workSuspended: true,
        },
        { date: { year: 172, holyDayNumber: HolyDay.DayOfTheCovenant },
            expectedOutput: 'Day of the Covenant',
            workSuspended: false,
        },
        { date: { year: 172, holyDayNumber: HolyDay.AscensionOfAbdulBaha },
            expectedOutput: 'Ascension of ‘Abdu’l-Bahá',
            workSuspended: false,
        },
        { date: { year: 172, month: 1, day: 2 },
            expectedOutput: '',
            workSuspended: undefined,
        },
    ];

    holyDays.forEach(({ date, expectedOutput }) => {
        it('should output Holy Days correctly', () => {
            const badiDate = new BadiDate(date);

            expect(badiDate.holyDay()).toEqual(expectedOutput);
        });
    });

    holyDays.forEach(({ date, workSuspended }) => {
        it('should get work suspended info for Holy Days or not correctly', () => {
            const badiDate = new BadiDate(date);

            expect(badiDate.workSuspended).toEqual(workSuspended);
        });
    });

    it('should be shown in the default language', () => {
        badiDateSettings({ defaultLanguage: 'es' });
        const badiDate = new BadiDate({ year: 172, holyDayNumber: 10 });

        expect(badiDate.holyDay()).toEqual('Día de la Alianza');
    });

    it('should be shown in the selected language', () => {
        const badiDate = new BadiDate({ year: 172, holyDayNumber: 10 });

        expect(badiDate.holyDay('fr')).toEqual('Jour de l’Alliance');
    });

    it('should fall back', () => {
        const badiDate = new BadiDate({ year: 172, holyDayNumber: 10 });

        expect(badiDate.holyDay('xyz')).toEqual('Day of the Covenant');
    });
});

describe('Invalid input', () => {
    const invalidInputDates = [
        'someString',
        luxon.DateTime.fromISO('2360-01-01', { zone: 'UTC' }),
        { year: 508, month: 10, day: 10 },
        { year: 172, month: 20, day: 6 },
        { year: 172, month: 10, day: 25 },
        { year: 172, holyDayNumber: 12 },
    ];

    invalidInputDates.forEach(inputDate => {
        it('should produce an invalid Badí date', () => {
            const badiDate = new BadiDate(inputDate as any);

            expect(badiDate.isValid).toEqual(false);
            expect(badiDate.year).toBeNaN();
            expect(badiDate.month).toBeNaN();
            expect(badiDate.day).toBeNaN();
            expect(badiDate.ayyamiHaLength).toBeNaN();
            expect(badiDate.gregorianDate.isValid).toEqual(false);
            expect(badiDate.invalidReason).toBeDefined();
            expect(badiDate.format()).toEqual('Not a valid Badí‘ date');
        });
    });
});

describe('the string formatter', () => {
    afterAll(() => {
        badiDateSettings({ underlineFormat: 'css' });
    });

    it('should use a default format if no format string is defined', () => {
        const badiDate = new BadiDate({ year: 172, month: 1, day: 1 });

        expect(badiDate.format()).toEqual('1 Bahá (Splendour) 172 B.E.');
    });

    it('should parse all tokens in the format string', () => {
        badiDateSettings({ underlineFormat: 'diacritic' });
        const badiDate = new BadiDate({ year: 50, month: 1, day: 16 });
        const formatStr = 'd dd D DD DDL DD+ m mm M MM MML MM+ y yy ww W WW WWL yv yyv YV v vv Va k kk KiS BE BC';
        const expectedResult = '16 16 S̲h̲a S̲h̲araf Honour S̲h̲araf (Honour) 1 01 Bah Bahá Splendour ' +
            'Bahá (Splendour) 50 050 ‘Id ‘Idá ‘Idál Justice 12 12 Javáb 3 03 Váḥid 1 01 Kull-i-S̲h̲ay’ B.E. ' +
            'Badí‘ Calendar';

        expect(badiDate.format(formatStr)).toEqual(expectedResult);
    });

    it('should include non-tokens as is in the output', () => {
        const badiDate = new BadiDate({ year: 172, month: 1, day: 1 });

        expect(badiDate.format('d XYZMML yy BE')).toEqual('1 XYZSplendour 172 B.E.');
    });

    it('should include everything in curly braces as is in the output', () => {
        const badiDate = new BadiDate({ year: 172, month: 1, day: 1 });

        expect(badiDate.format('d { MML M}M yy BE')).toEqual('1  MML MBah 172 B.E.');
    });

    const croppedFormatData = [
        { month: 4, croppedCss: '‘Aẓa', croppedUTag: '‘Aẓa', croppedDiacritic: '‘Aẓa' },
        { month: 10, croppedCss: '‘Izz', croppedUTag: '‘Izz', croppedDiacritic: '‘Izz' },
        {
            month: 11,
            croppedCss: 'Ma<span style="text-decoration:underline">s</span>',
            croppedUTag: 'Ma<u>s</u>',
            croppedDiacritic: 'Mas̲',
        },
        { month: 12, croppedCss: '‘Ilm', croppedUTag: '‘Ilm', croppedDiacritic: '‘Ilm' },
        {
            month: 16,
            croppedCss: '<span style="text-decoration:underline">Sh</span>a',
            croppedUTag: '<u>Sh</u>a',
            croppedDiacritic: 'S̲h̲a',
        },
        { month: 19, croppedCss: '‘Alá’', croppedUTag: '‘Alá’', croppedDiacritic: '‘Alá’' },
    ];

    croppedFormatData.forEach(({ month, croppedCss }) => {
        it('should crop the output appropriately with css underlining', () => {
            badiDateSettings({ underlineFormat: 'css' });
            const badiDate = new BadiDate({ year: 172, month, day: 1 });

            expect(badiDate.format('M')).toEqual(croppedCss);
        });
    });

    croppedFormatData.forEach(({ month, croppedUTag }) => {
        it('should crop the output appropriately with u-tag underlining', () => {
            badiDateSettings({ underlineFormat: 'u' });
            const badiDate = new BadiDate({ year: 172, month, day: 1 });

            expect(badiDate.format('M')).toEqual(croppedUTag);
        });
    });

    croppedFormatData.forEach(({ month, croppedDiacritic }) => {
        it('should crop the output appropriately with diacritic underlining', () => {
            badiDateSettings({ underlineFormat: 'diacritic' });
            const badiDate = new BadiDate({ year: 172, month, day: 1 });

            expect(badiDate.format('M')).toEqual(croppedDiacritic);
        });
    });

    it('should omit underlining if underlineFormat is "none"', () => {
        badiDateSettings({ underlineFormat: 'none' });
        const badiDate = new BadiDate({ year: 172, month: 16, day: 1 });

        expect(badiDate.format('MM')).toEqual('Sharaf');
    });

    it('should not change the underlineFormat if new setting is invalid', () => {
        badiDateSettings({ underlineFormat: 'diacritic' });
        badiDateSettings({ underlineFormat: 'invalid' } as any);
        const badiDate = new BadiDate({ year: 172, month: 16, day: 1 });

        expect(badiDate.format('MM')).toEqual('S̲h̲araf');
    });

    it('should output an error if the formatting string has non-matching braces', () => {
        const badiDate = new BadiDate({ year: 172, month: 16, day: 1 });

        expect(badiDate.format('MM {XYZ')).toEqual('Invalid formatting string.');
    });

    it('should only render one item each for DD+ and MM+ if both items would be identical', () => {
        const badiDate = new BadiDate({ year: 172, month: 1, day: 2 });
        const expectedOutput = 'الجلال البهاء';

        expect(badiDate.format('DD+ MM+', 'ar')).toEqual(expectedOutput);
    });

    it('should render the DD+ and MM+ tokens appropriately in rtl languages', () => {
        const badiDate = new BadiDate({ year: 172, month: 1, day: 2 });
        const expectedOutput = '<span dir="rtl">الجلال (جلال)</span> <span dir="rtl">البهاء (بهاء)</span>';

        expect(badiDate.format('DD+ MM+', 'fa')).toEqual(expectedOutput);
    });

    it('should render digits as different unicode characters where appropriate', () => {
        const badiDate = new BadiDate({ year: 172, month: 17, day: 5 });

        expect(badiDate.format('dd mm', 'ar')).toEqual('٠٥ ١٧');
    });
});

describe('the language selection', () => {
    afterEach(() => {
        badiDateSettings({ defaultLanguage: 'en' });
    });

    const badiDate = new BadiDate({ year: 172, month: 1, day: 2 });

    it('should format the date in the given language if passed as parameter', () => {
        expect(badiDate.format('MML', 'es')).toEqual('Esplendor');
    });

    it('should format the date in the given language if set as default', () => {
        badiDateSettings({ defaultLanguage: 'es' });

        expect(badiDate.format('MML')).toEqual('Esplendor');
    });

    it('should fall back to English if given an invalid language code', () => {
        expect(badiDate.format('MML', 'invalidLanguage')).toEqual('Splendour');
    });

    it('should keep the current default language if set to an invalid language', () => {
        badiDateSettings({ defaultLanguage: 'es' });
        badiDateSettings({ defaultLanguage: 'invalidLanguage' });

        expect(badiDate.format('MML')).toEqual('Esplendor');
    });

    it('should fall back to the primary language if an unknown extended language subtag is present', () => {
        expect(badiDate.format('MML', 'fr-ch')).toEqual('Splendeur');
    });

    it('should fall back to the primary language on a per-token basis', () => {
        expect(badiDate.format('MML BE', 'en-us')).toEqual('Splendor B.E.');
    });

    it('should use a fallback if the given key is not present in the locale file', () => {
        expect(badiDate.format('MM BE', 'sv')).toEqual('Bahá B.E.');
    });
});
