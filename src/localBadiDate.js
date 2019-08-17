import * as MeeusSunMoon from '../node_modules/meeussunmoon/src/index.js';
import * as momentNs from 'moment-timezone';
import {BadiDate,
  badiDateOptions as badiDateBaseOptions} from './badiDate.js';
import {clockLocationFromPolygons,
  useClockLocations} from './clockLocations.js';

const moment = momentNs;

/* eslint-disable complexity */

/**
 * Wrapper class for Badí' date which takes care of all the location dependent
 * things: times for start, end, sunrise, and solar noon of the date as well as
 * the times for Holy Day commemorations.
 */
class LocalBadiDate {
  /**
   * Creates a Badí' date with location dependent information.
   * @param {(Date|moment|string|Array)} date input date, same formats as for
   *   badiDate are accepted. For a moment object, the time (before or after
   *   sunset) is taken into consideration, otherwise only the date.
   * @param {number} latitude of target location
   * @param {number} longitude of target location
   * @param {string} timezoneId as per IANA time zone database
   */
  constructor(date, latitude, longitude, timezoneId) {
    // If a moment object is being passed, we use date and time, not just the
    // date. For a JS Date object, we can't assume it's in the correct timezone,
    // so in that case we use the date information only.
    if (date instanceof moment) {
      const sunset = MeeusSunMoon.sunset(date, latitude, longitude);
      if (date.isAfter(sunset)) {
        date.add(1, 'day');
      }
    }
    this.badiDate = new BadiDate(date);
    const gregDate = moment.tz(
      this.badiDate.gregorianDate().format('YYYY-MM-DDTHH:mm:ss'), timezoneId);
    this.clockLocation = clockLocationFromPolygons(latitude, longitude);
    if (!this.clockLocation ||
        (this.clockLocation === 'Finland' &&
         this.badiDate.badiMonth() === 19)) {
      this.end = MeeusSunMoon.sunset(gregDate, latitude, longitude);
      this.solarNoon = MeeusSunMoon.solarNoon(gregDate, longitude);
      this.sunrise = MeeusSunMoon.sunrise(gregDate, latitude, longitude);
      this.start = MeeusSunMoon.sunset(
        gregDate.subtract(1, 'day'), latitude, longitude);
      // add() and subtract() mutate the object, so we have to undo it
      gregDate.add(1, 'day');
    } else {
      // First we set times to 18:00, 06:00, 12:00, 18:00, modifications are
      // then made depending on the region.
      this.end = moment.tz(
        gregDate.format('YYYY-MM-DDT') + '18:00:00', timezoneId);
      this.solarNoon = moment.tz(
        gregDate.format('YYYY-MM-DDT') + '12:00:00', timezoneId);
      this.sunrise = moment.tz(
        gregDate.format('YYYY-MM-DDT') + '06:00:00', timezoneId);
      this.start = moment.tz(gregDate.subtract(
        1, 'day').format('YYYY-MM-DDT') + '18:00:00', timezoneId);
      // add() and subtract() mutate the object, so we have to undo it
      gregDate.add(1, 'day');
      if (this.clockLocation === 'Canada') {
        this.sunrise.add(30, 'minutes');
      } else if (this.clockLocation === 'Iceland') {
        this.solarNoon.add(1, 'hour');
      } else if (this.clockLocation === 'Finland' ||
                 this.clockLocation === 'USA') {
        if (this.end.isDST()) {
          this.end.add(1, 'hour');
          this.solarNoon.add(1, 'hour');
          this.sunrise.add(1, 'hour');
        }
        if (this.start.isDST()) {
          this.start.add(1, 'hour');
        }
      }
    }
    this.holyDayCommemoration = false;
    switch (this.badiDate.holyDayNumber()) {
      case 2:
        // First Day of Ridvan: 15:00 local standard time
        this.holyDayCommemoration = gregDate;
        this.holyDayCommemoration.hour(gregDate.isDST() ? 16 : 15);
        break;
      case 5:
        // Declaration of the Báb: 2 hours 11 minutes after sunset
        this.holyDayCommemoration = moment.tz(this.start, timezoneId);
        this.holyDayCommemoration.add(131, 'minutes');
        break;
      case 6:
        // Ascension of Bahá'u'lláh: 03:00 local standard time
        this.holyDayCommemoration = gregDate;
        this.holyDayCommemoration.hour(gregDate.isDST() ? 4 : 3);
        break;
      case 7:
        // Martyrdom of the Báb: solar noon
        this.holyDayCommemoration = this.solarNoon;
        break;
      case 11:
        // Ascension of 'Abdu'l-Bahá: 01:00 local standard time
        this.holyDayCommemoration = gregDate;
        this.holyDayCommemoration.hour(gregDate.isDST() ? 2 : 1);
        break;
      // skip default
    }
  }
}

/**
 * Sets options (defaultLanguage, useClockLocations) for the
 * module.
 * @param {object} options Options to be set.
 */
const badiDateOptions = function (options) {
  if (typeof options.defaultLanguage === 'string' ||
      typeof options.underlineFormat === 'string') {
    badiDateBaseOptions(options);
  }
  if (typeof options.useClockLocations === 'boolean') {
    useClockLocations(options.useClockLocations);
  }
};

MeeusSunMoon.options({returnTimeForPNMS: true, roundToNearestMinute: true});

export {BadiDate, LocalBadiDate, badiDateOptions};
