import * as luxon from 'luxon';

export interface BadiYearInfo {
    nawRuz: luxon.DateTime;
    ayyamiHaLength: 4 | 5;
    twinBirthdays: [number, number, number, number];
}

export interface BadiDateSettings {
    defaultLanguage?: string;
    underlineFormat?: UnderlineFormat;
    useClockLocations?: boolean;
}

export interface YearMonthDay {
    year: number;
    month: number;
    day: number;
}

export interface YearHolyDayNumber {
    year: number;
    holyDayNumber: number;
}

export type UnderlineFormat = 'css' | 'u' | 'diacritic' | 'none';

export type InputDate = luxon.DateTime | Date | YearMonthDay | YearHolyDayNumber;

export const enum HolyDay {
    NawRuz = 1,
    FirstRidvan = 2,
    NinthRidvan = 3,
    TwelfthRidvan = 4,
    DeclarationOfTheBab = 5,
    AscensionOfBahaullah = 6,
    MartyrdomOfTheBab = 7,
    BirthOfTheBab = 8,
    BirthOfBahaullah = 9,
    DayOfTheCovenant = 10,
    AscensionOfAbdulBaha = 11,
}
