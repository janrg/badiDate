import * as MeeusSunMoon from 'meeussunmoon';
import * as luxon from 'luxon';
import { BadiDate, badiDateSettings as badiDateBaseOptions } from './badiDate';
import { clockLocationFromPolygons, useClockLocations } from './clockLocations';
import { BadiDateSettings, InputDate } from './types';

/* eslint-disable complexity */

class LocalBadiDate {
    private _badiDate: BadiDate;
    private _start: luxon.DateTime;
    private _sunrise: luxon.DateTime;
    private _solarNoon: luxon.DateTime;
    private _end: luxon.DateTime;
    private _clockLocation: string | undefined;
    private _holyDayCommemoration: luxon.DateTime | undefined;

    constructor(date: InputDate, latitude: number, longitude: number, timezoneId: string) {
        // If a moment object is being passed, we use date and time, not just the
        // date. For a JS Date object, we can't assume it's in the correct timezone,
        // so in that case we use the date information only.
        this._badiDate = new BadiDate(this._setInputDateToCorrectDay(date, latitude, longitude));
        const gregDate = this._badiDate.gregorianDate.setZone(timezoneId, { keepLocalTime: true });
        this._clockLocation = clockLocationFromPolygons(latitude, longitude);
        if (!this._clockLocation ||
            (this._clockLocation === 'Finland' &&
                this._badiDate.month === 19)) {
            this._end = MeeusSunMoon.sunset(gregDate, latitude, longitude) as luxon.DateTime;
            this._solarNoon = MeeusSunMoon.solarNoon(gregDate, longitude);
            this._sunrise = MeeusSunMoon.sunrise(gregDate, latitude, longitude) as luxon.DateTime;
            this._start = MeeusSunMoon.sunset(gregDate.minus({ days: 1 }), latitude, longitude) as luxon.DateTime;
        } else {
            // First we set times to 18:00, 06:00, 12:00, 18:00, modifications are
            // then made depending on the region.
            this._start = gregDate.minus({ days: 1 }).set({ hour: 18 });
            this._solarNoon = gregDate.set({ hour: 12 });
            this._sunrise = gregDate.set({ hour: 6 });
            this._end = gregDate.set({ hour: 18 });
            if (this._clockLocation === 'Canada') {
                this._sunrise = this._sunrise.plus({ minutes: 30 });
            } else if (this._clockLocation === 'Iceland') {
                this._solarNoon = this._solarNoon.plus({ hours: 1 });
            } else if (this._clockLocation === 'Finland' ||
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

    _setInputDateToCorrectDay(date: InputDate, latitude, longitude): InputDate {
        if (date instanceof luxon.DateTime) {
            const sunset = MeeusSunMoon.sunset(date, latitude, longitude);
            return (date > sunset) ? date.plus({ days: 1 }) : date;
        }
        return date;
    }

    get badiDate(): BadiDate {
        return this._badiDate;
    }

    get start(): luxon.DateTime {
        return this._start;
    }

    get sunrise(): luxon.DateTime {
        return this._sunrise;
    }

    get solarNoon(): luxon.DateTime {
        return this._solarNoon;
    }

    get end(): luxon.DateTime {
        return this._end;
    }

    get holyDayCommemoration(): luxon.DateTime {
        return this._holyDayCommemoration;
    }

    get clockLocation(): string {
        return this._clockLocation;
    }
}

const badiDateSettings = (settings: BadiDateSettings) => {
    if (typeof settings.defaultLanguage === 'string' ||
        typeof settings.underlineFormat === 'string') {
        badiDateBaseOptions(settings);
    }
    if (typeof settings.useClockLocations === 'boolean') {
        useClockLocations(settings.useClockLocations);
    }
};

MeeusSunMoon.settings({ returnTimeForNoEventCase: true, roundToNearestMinute: true });

export { BadiDate, LocalBadiDate, badiDateSettings };
