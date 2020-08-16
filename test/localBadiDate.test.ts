import { badiDateSettings, LocalBadiDate } from '../src/localBadiDate';
import { clockLocationFromPolygons } from '../src/clockLocations';
import * as luxon from 'luxon';
import { clockMap } from './testData';
import { BadiDateSettings } from '../src/types';

const timesString = localBadiDate => (
    `${localBadiDate.start.toFormat('HH:mm:ss')}|${
        localBadiDate.sunrise.toFormat('HH:mm:ss')}|${
        localBadiDate.solarNoon.toFormat('HH:mm:ss')}|${
        localBadiDate.end.toFormat('HH:mm:ss')}`);

const bahjiLat = 32.943;
const bahjiLng = 35.092;

describe('timestamps for start, sunrise, solar noon, and sunrise', () => {
    const badiDate = new LocalBadiDate({ year: 172, month: 1, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');

    it('should have the correct timestamp for start', () => {
        expect(badiDate.start.toISO()).toEqual('2015-03-20T17:51:00.000+02:00');
    });

    it('should have the correct timestamp for sunrise', () => {
        expect(badiDate.sunrise.toISO()).toEqual('2015-03-21T05:43:00.000+02:00');
    });

    it('should have the correct timestamp for solar noon', () => {
        expect(badiDate.solarNoon.toISO()).toEqual('2015-03-21T11:47:00.000+02:00');
    });

    it('should have the correct timestamp for end', () => {
        expect(badiDate.end.toISO()).toEqual('2015-03-21T17:52:00.000+02:00');
    });
});

describe('Getters', () => {
    it('should return values from geographic getters', () => {
        const badiDate = new LocalBadiDate({ year: 172, month: 1, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate.latitude).toEqual(bahjiLat);
        expect(badiDate.longitude).toEqual(bahjiLng);
        expect(badiDate.timezoneId).toEqual('Asia/Jerusalem');
    });

    it('should return appropriate relative `LocalBadiDate` instances', () => {
        const badiDate1 = new LocalBadiDate({ year: 172, month: 1, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate1.nextMonth.badiDate.month).toEqual(2);
        expect(badiDate1.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate1.previousMonth.badiDate.month).toEqual(19);
        expect(badiDate1.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate1.nextDay.badiDate.month).toEqual(1);
        expect(badiDate1.nextDay.badiDate.day).toEqual(2);
        expect(badiDate1.previousDay.badiDate.month).toEqual(19);
        expect(badiDate1.previousDay.badiDate.day).toEqual(19);

        const badiDate2 = new LocalBadiDate({ year: 172, month: 9, day: 5 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate2.nextMonth.badiDate.month).toEqual(10);
        expect(badiDate2.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate2.previousMonth.badiDate.month).toEqual(8);
        expect(badiDate2.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate2.nextDay.badiDate.month).toEqual(9);
        expect(badiDate2.nextDay.badiDate.day).toEqual(6);
        expect(badiDate2.previousDay.badiDate.month).toEqual(9);
        expect(badiDate2.previousDay.badiDate.day).toEqual(4);

        const badiDate3 = new LocalBadiDate({ year: 172, month: 19, day: 19 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate3.nextMonth.badiDate.month).toEqual(1);
        expect(badiDate3.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate3.previousMonth.badiDate.month).toEqual(20);
        expect(badiDate3.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate3.nextDay.badiDate.month).toEqual(1);
        expect(badiDate3.nextDay.badiDate.day).toEqual(1);
        expect(badiDate3.previousDay.badiDate.month).toEqual(19);
        expect(badiDate3.previousDay.badiDate.day).toEqual(18);

        const badiDate4 = new LocalBadiDate({ year: 172, month: 19, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate4.nextMonth.badiDate.month).toEqual(1);
        expect(badiDate4.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate4.previousMonth.badiDate.month).toEqual(20);
        expect(badiDate4.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate4.nextDay.badiDate.month).toEqual(19);
        expect(badiDate4.nextDay.badiDate.day).toEqual(2);
        expect(badiDate4.previousDay.badiDate.month).toEqual(20);
        expect(badiDate4.previousDay.badiDate.day).toEqual(4);

        const badiDate5 = new LocalBadiDate({ year: 178, month: 19, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate5.nextMonth.badiDate.month).toEqual(1);
        expect(badiDate5.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate5.previousMonth.badiDate.month).toEqual(20);
        expect(badiDate5.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate5.nextDay.badiDate.month).toEqual(19);
        expect(badiDate5.nextDay.badiDate.day).toEqual(2);
        expect(badiDate5.previousDay.badiDate.month).toEqual(20);
        expect(badiDate5.previousDay.badiDate.day).toEqual(5);

        const badiDate6 = new LocalBadiDate({ year: 172, month: 20, day: 4 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate6.nextMonth.badiDate.month).toEqual(19);
        expect(badiDate6.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate6.previousMonth.badiDate.month).toEqual(18);
        expect(badiDate6.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate6.nextDay.badiDate.month).toEqual(19);
        expect(badiDate6.nextDay.badiDate.day).toEqual(1);
        expect(badiDate6.previousDay.badiDate.month).toEqual(20);
        expect(badiDate6.previousDay.badiDate.day).toEqual(3);

        const badiDate7 = new LocalBadiDate({ year: 172, month: 18, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');
        expect(badiDate7.nextMonth.badiDate.month).toEqual(20);
        expect(badiDate7.nextMonth.badiDate.day).toEqual(1);
        expect(badiDate7.previousMonth.badiDate.month).toEqual(17);
        expect(badiDate7.previousMonth.badiDate.day).toEqual(1);
        expect(badiDate7.nextDay.badiDate.month).toEqual(18);
        expect(badiDate7.nextDay.badiDate.day).toEqual(2);
        expect(badiDate7.previousDay.badiDate.month).toEqual(17);
        expect(badiDate7.previousDay.badiDate.day).toEqual(19);
    });
});

it('should use the following day as input for the BadiDate if the input datetime is after sunset', () => {
    const badiDate1 = new LocalBadiDate(luxon.DateTime.fromISO('2015-03-21T12:00:00', { zone: 'Asia/Jerusalem' }),
        bahjiLat, bahjiLng, 'Asia/Jerusalem');
    const badiDate2 = new LocalBadiDate(luxon.DateTime.fromISO('2015-03-21T20:00:00', { zone: 'Asia/Jerusalem' }),
        bahjiLat, bahjiLng, 'Asia/Jerusalem');

    expect(badiDate1.badiDate.gregorianDate.day).toEqual(21);
    expect(badiDate2.badiDate.gregorianDate.day).toEqual(22);
});

describe('the BadiDate settings', () => {
    const settingsData = [
        {
            settings: { defaultLanguage: 'en', underlineFormat: 'css' },
            expectedOutput: 'Ma<span style="text-decoration:underline">sh</span>íyyat (Will)',
        }, {
            settings: { defaultLanguage: 'es', underlineFormat: 'css' },
            expectedOutput: 'Ma<span style="text-decoration:underline">sh</span>íyyat (Voluntad)',
        }, {
            settings: { defaultLanguage: 'en', underlineFormat: 'diacritic' },
            expectedOutput: 'Mas̲h̲íyyat (Will)',
        }, {
            settings: { defaultLanguage: 'es', underlineFormat: 'diacritic' },
            expectedOutput: 'Mas̲h̲íyyat (Voluntad)',
        },
    ];
    const badiDate = new LocalBadiDate({ year: 172, month: 11, day: 1 }, bahjiLat, bahjiLng, 'Asia/Jerusalem');

    settingsData.forEach(({ settings, expectedOutput }) => {
        it('should pass on the settings to the BadiDate class', () => {
            badiDateSettings(settings as BadiDateSettings);

            expect(badiDate.badiDate.format('MM+')).toEqual(expectedOutput);
        });
    });
});

describe('the useClockLocationSettings', () => {
    afterAll(() => {
        badiDateSettings({ useClockLocations: true });
    });

    const clockLocationDates = [
        {
            date: { year: 172, month: 1, day: 1 },
            latitude: 65.0,
            longitude: -150.0,
            timezone: 'America/Anchorage',
            fixedTimes: '19:00:00|07:00:00|13:00:00|19:00:00',
            solarTimes: '20:16:00|07:57:00|14:07:00|20:19:00',
            clockLocation: 'USA',
        }, {
            date: { year: 172, month: 1, day: 1 },
            latitude: 62.0,
            longitude: -120.0,
            timezone: 'America/Edmonton',
            fixedTimes: '18:00:00|06:30:00|12:00:00|18:00:00',
            solarTimes: '20:15:00|07:58:00|14:07:00|20:18:00',
            clockLocation: 'Canada',
        }, {
            date: { year: 172, month: 1, day: 1 },
            latitude: 65.0,
            longitude: -19.0,
            timezone: 'Atlantic/Reykjavik',
            fixedTimes: '18:00:00|06:00:00|13:00:00|18:00:00',
            solarTimes: '19:31:00|07:14:00|13:23:00|19:34:00',
            clockLocation: 'Iceland',
        }, {
            date: { year: 172, month: 1, day: 1 },
            latitude: 60.0,
            longitude: 10.0,
            timezone: 'Europe/Oslo',
            fixedTimes: '18:00:00|06:00:00|12:00:00|18:00:00',
            solarTimes: '18:34:00|06:20:00|12:27:00|18:36:00',
            clockLocation: 'Norway',
        }, {
            date: { year: 172, month: 1, day: 1 },
            latitude: 65.0,
            longitude: 17.0,
            timezone: 'Europe/Stockholm',
            fixedTimes: '18:00:00|06:00:00|12:00:00|18:00:00',
            solarTimes: '18:07:00|05:51:00|11:59:00|18:10:00',
            clockLocation: 'Sweden',
        }, {
            date: { year: 172, month: 1, day: 1 },
            latitude: 65.0,
            longitude: 28.0,
            timezone: 'Europe/Helsinki',
            fixedTimes: '18:00:00|06:00:00|12:00:00|18:00:00',
            solarTimes: '18:23:00|06:07:00|12:15:00|18:26:00',
            clockLocation: 'Finland',
        }, {
            date: { year: 172, month: 19, day: 19 },
            latitude: 65.0,
            longitude: 28.0,
            timezone: 'Europe/Helsinki',
            fixedTimes: '18:19:00|06:11:00|12:16:00|18:22:00',
            solarTimes: '18:19:00|06:11:00|12:16:00|18:22:00',
            clockLocation: 'Finland',
        },
    ];

    clockLocationDates.forEach(({ date, latitude, longitude, timezone, fixedTimes, clockLocation }) => {
        it('should output the appropriate time for areas where fixed times are used', () => {
            const badiDate = new LocalBadiDate(date, latitude, longitude, timezone);

            expect(timesString(badiDate)).toEqual(fixedTimes);
            expect(badiDate.clockLocation).toEqual(clockLocation);
        });
    });

    clockLocationDates.forEach(({ date, latitude, longitude, timezone, solarTimes }) => {
        it('should not output fixed times if useClockLocations if false', () => {
            badiDateSettings({ useClockLocations: false });
            const badiDate = new LocalBadiDate(date, latitude, longitude, timezone);

            expect(timesString(badiDate)).toEqual(solarTimes);
            expect(badiDate.clockLocation).toBeUndefined();
        });
    });

    describe('should determine the correct region for the given coordinates', () => {
        beforeEach(() => {
            badiDateSettings({ useClockLocations: true });
        });

        const valueMapping = [undefined, 'USA', 'Canada', 'Iceland', 'Norway', 'Sweden', 'Finland'];
        for (let i = 0; i < 40; i++) {
            const lat = 90 - i;
            for (let j = 0; j < 360; j++) {
                const lng = -180 + j;
                it(`latitude: ${lat}, longitude: ${lng}`, () => {
                    expect(clockLocationFromPolygons(lat, lng)).toEqual(valueMapping[clockMap[i][j]]);
                });
            }
        }
    });
});

describe('the Holy Day commemoration times', () => {
    const holyDayDates = [
        { date: { year: 172, holyDayNumber: 1 }, commemorationTime: undefined },
        { date: { year: 172, holyDayNumber: 2 }, commemorationTime: '16:00:00' },
        { date: { year: 172, holyDayNumber: 3 }, commemorationTime: undefined },
        { date: { year: 172, holyDayNumber: 4 }, commemorationTime: undefined },
        { date: { year: 172, holyDayNumber: 5 }, commemorationTime: '21:48:00' },
        { date: { year: 172, holyDayNumber: 6 }, commemorationTime: '04:00:00' },
        { date: { year: 172, holyDayNumber: 7 }, commemorationTime: '12:45:00' },
        { date: { year: 172, holyDayNumber: 8 }, commemorationTime: undefined },
        { date: { year: 172, holyDayNumber: 9 }, commemorationTime: undefined },
        { date: { year: 172, holyDayNumber: 10 }, commemorationTime: undefined },
        { date: { year: 172, holyDayNumber: 11 }, commemorationTime: '01:00:00' },
    ];

    holyDayDates.forEach(({ date, commemorationTime }) => {
        it('should show the correct comemmoration time where appropriate', () => {
            const badiDate = new LocalBadiDate(date, bahjiLat, bahjiLng, 'Asia/Jerusalem');

            expect(badiDate.holyDayCommemoration?.toFormat?.('HH:mm:ss')).toEqual(commemorationTime);
        });
    });

    const southernHemisphereCommemorationTimes = [
        { date: { year: 172, holyDayNumber: 2 }, commemorationTime: '15:00:00' },
        { date: { year: 172, holyDayNumber: 6 }, commemorationTime: '03:00:00' },
        { date: { year: 172, holyDayNumber: 11 }, commemorationTime: '02:00:00' },
    ];

    southernHemisphereCommemorationTimes.forEach(({ date, commemorationTime }) => {
        it('should show the correct commemoration time in the southern hemisphere with DST', () => {
            const badiDate = new LocalBadiDate(date, 33.8, 151.2, 'Australia/Sydney');

            expect(badiDate.holyDayCommemoration.toFormat?.('HH:mm:ss')).toEqual(commemorationTime);
        });
    });
});
