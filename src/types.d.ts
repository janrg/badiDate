import * as luxon from 'luxon';

export interface BadiYearInfo {
    nawRuz: luxon.DateTime;
    ayyamiHaLength: 4 | 5;
    twinBirthdays: [number, number, number, number];
}

export interface BadiDateOptions {
    defaultLanguage?: string;
    underlineFormat?: UnderlineFormat;
    useClockLocations?: boolean;
}

export type UnderlineFormat = 'css' | 'u' | 'diacritic';

export type InputDate = luxon.DateTime | Date | [number, number, number] | [number, number];

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
