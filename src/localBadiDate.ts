import * as MeeusSunMoon from '../node_modules/meeussunmoon/dist/meeussunmoon-es';
import * as luxon from 'luxon';
import { BadiDate, badiDateOptions as badiDateBaseOptions } from './badiDate';
import { clockLocationFromPolygons, useClockLocations } from './clockLocations';
import { BadiDateOptions, InputDate } from './types';

/* eslint-disable complexity */

class LocalBadiDate {
    badiDate: BadiDate;
    clockLocation: boolean | any;
    end: any;
    solarNoon: any;
    sunrise: any;
    start: any;
    holyDayCommemoration: any;

    constructor(date: InputDate, latitude: number, longitude: number, timezoneId: string) {
        // If a moment object is being passed, we use date and time, not just the
        // date. For a JS Date object, we can't assume it's in the correct timezone,
        // so in that case we use the date information only.
        this.badiDate = new BadiDate(this._setInputDateToCorrectDay(date, latitude, longitude));
        const gregDate = this.badiDate.gregorianDate.setZone(timezoneId, { keepLocalTime: true });
        this.clockLocation = clockLocationFromPolygons(latitude, longitude);
        if (!this.clockLocation ||
            (this.clockLocation === 'Finland' &&
                this.badiDate.badiMonth === 19)) {
            this.end = MeeusSunMoon.sunset(gregDate, latitude, longitude);
            this.solarNoon = MeeusSunMoon.solarNoon(gregDate, longitude);
            this.sunrise = MeeusSunMoon.sunrise(gregDate, latitude, longitude);
            this.start = MeeusSunMoon.sunset(gregDate.minus({ days: 1 }), latitude, longitude);
        } else {
            // First we set times to 18:00, 06:00, 12:00, 18:00, modifications are
            // then made depending on the region.
            this.start = gregDate.minus({ days: 1 }).set({ hour: 18 });
            this.solarNoon = gregDate.set({ hour: 12 });
            this.sunrise = gregDate.set({ hour: 6 });
            this.end = gregDate.set({ hour: 18 });
            if (this.clockLocation === 'Canada') {
                this.sunrise = this.sunrise.plus({ minutes: 30 });
            } else if (this.clockLocation === 'Iceland') {
                this.solarNoon = this.solarNoon.plus({ hours: 1 });
            } else if (this.clockLocation === 'Finland' ||
                this.clockLocation === 'USA') {
                if (this.end.isInDST) {
                    this.sunrise = this.sunrise.plus({ hours: 1 });
                    this.solarNoon = this.solarNoon.plus({ hours: 1 });
                    this.end = this.end.plus({ hours: 1 });
                }
                if (this.start.isInDST) {
                    this.start = this.start.plus({ hours: 1 });
                }
            }
        }
        this.holyDayCommemoration = false;
        switch (this.badiDate.holyDayNumber) {
            case 2:
                // First Day of Ridvan: 15:00 local standard time
                this.holyDayCommemoration = gregDate.set({ hour: gregDate.isInDST ? 16 : 15 });
                break;
            case 5:
                // Declaration of the Báb: 2 hours 11 minutes after sunset
                this.holyDayCommemoration = this.start.plus({ minutes: 131 });
                break;
            case 6:
                // Ascension of Bahá'u'lláh: 03:00 local standard time
                this.holyDayCommemoration = gregDate.set({ hour: gregDate.isInDST ? 4 : 3 });
                break;
            case 7:
                // Martyrdom of the Báb: solar noon
                this.holyDayCommemoration = this.solarNoon;
                break;
            case 11:
                // Ascension of 'Abdu'l-Bahá: 01:00 local standard time
                this.holyDayCommemoration = gregDate.set({ hour: gregDate.isInDST ? 2 : 1 });
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
}

const badiDateOptions = (options: BadiDateOptions) => {
    if (typeof options.defaultLanguage === 'string' ||
        typeof options.underlineFormat === 'string') {
        badiDateBaseOptions(options);
    }
    if (typeof options.useClockLocations === 'boolean') {
        useClockLocations(options.useClockLocations);
    }
};

MeeusSunMoon.options({ returnTimeForPNMS: true, roundToNearestMinute: true });

export { BadiDate, LocalBadiDate, badiDateOptions };
