/* global $ */
import * as MeeusSunMoon from '../node_modules/meeussunmoon/src/index.js';
import {equinoxes} from './equinoxes.js';

const latitudeTihran = 35.68;
const longitudeTihran = 51.42;

/**
 * Calculate the time of of the beginning of the year in Tihran in UTC
 * @param {string} equinox Datetime of equinox as ISO 8601
 * @returns {moment} Time of sunset in Tihran in UTC that starts the year
 */
const nawRuzTihranUTC = function (equinox) {
  const vernalEquinox = moment.tz(equinox, 'UTC');
  let nawRuzTihran = MeeusSunMoon.sunset(vernalEquinox, latitudeTihran,
    longitudeTihran);
  if (vernalEquinox.isBefore(nawRuzTihran)) {
    nawRuzTihran = MeeusSunMoon.sunset(vernalEquinox.subtract(1, 'day'),
      latitudeTihran, longitudeTihran);
  }
  return nawRuzTihran;
};

/**
 * Calculate the Badí' dates for the Twin Birthdays
 * @param {moment} nawRuzTihran datetime of sunset in Tihran in UTC that starts
 *                 the year
 * @returns {array} pairs of Badi' days and months for the Twin Birthdays
 */
const twinBirthdays = function (nawRuzTihran) {
  let eighthNewMoon;
  // Want to get the end of Naw-Rúz as it is the eighth new moon after the day
  // of Naw-Rúz. Note we modify nawRuzTihran here, but we want the day on which
  // Naw-Rúz ends for the list anyway
  const nawRuzEnd = MeeusSunMoon.sunset(nawRuzTihran.add(1, 'day'),
    latitudeTihran, longitudeTihran);
  const newMoons = MeeusSunMoon.yearMoonPhases(nawRuzTihran.year(), 0);
  let index = 0;
  // Count the new moons since Naw-Rúz and keep the eighth one
  for (let i = 0; i < newMoons.length; i++) {
    if (newMoons[i].isAfter(nawRuzEnd)) {
      index++;
    }
    if (index === 8) {
      eighthNewMoon = newMoons[i];
      break;
    }
  }
  // Convert to the proper timezone and calculate sunset.
  eighthNewMoon.tz('Asia/Tehran');
  const newMoonSunset = MeeusSunMoon.sunset(eighthNewMoon, latitudeTihran,
    longitudeTihran);
  // If sunset is before the new moon, the new moon is on the next Badí' date.
  // Then we add another day because it's the day after the occurence of the
  // eighth new moon.
  if (newMoonSunset.isBefore(eighthNewMoon)) {
    eighthNewMoon.add(1, 'day');
  }
  eighthNewMoon.add(1, 'day');
  const monthDay = badiMonthDayTB(eighthNewMoon, nawRuzTihran);
  return monthDay;
};

/**
 * Calculate the Badí' dates for the Twin Birthdays from the Gregorian date of
 * the eighth new moon after Naw-Rúz and the date of Naw-Rúz
 * @param {moment} gregDate datetime of the eighth new moon after Naw-Rúz
 * @param {moment} nawRuzTihran datetime of sunset in Tihran in UTC that starts
 *                 the year
 * @returns {array} pairs of Badi' days and months for the Twin Birthdays
 */
const badiMonthDayTB = function (gregDate, nawRuzTihran) {
  const dayOfBadiYear = gregDate.dayOfYear() - nawRuzTihran.dayOfYear() + 1;
  const day2OfBadiYear = dayOfBadiYear + 1;
  return [Math.floor((dayOfBadiYear - 1) / 19 + 1),
    (dayOfBadiYear - 1) % 19 + 1, Math.floor((day2OfBadiYear - 1) / 19 + 1),
    (day2OfBadiYear - 1) % 19 + 1];
};

/**
 * Generate the long and short list of dates for use in the badiDate class
 */
const yearList = function () {
  let ayyamiHaLength, nawRuzTihran, nextNawRuzTihran, TB;
  let longList = 'const badiYears = {\n';
  let shortList = 'const badiYears = [\n  ';
  // Stop at end of 2350 AD / 507 BE as the Naw-Rúz 509 BE is potentially too
  // close to call
  const equinoxesLength = 337;
  for (let i = 0; i < equinoxesLength - 1; i++) {
    nawRuzTihran = nawRuzTihranUTC(equinoxes[i]);
    nextNawRuzTihran = nawRuzTihranUTC(equinoxes[i + 1]);
    ayyamiHaLength = Math.round(nextNawRuzTihran.diff(
      nawRuzTihran, 'day', true) - 361);
    TB = twinBirthdays(nawRuzTihran);
    longList += '  ' + (i + 172).toString() + ': {\n' +
            '    aHL: ' + ayyamiHaLength + ',\n' +
            '    NR: \'' + nawRuzTihran.format('YYYY-MM-DD') + '\',\n' +
            '    TB: [' + TB[0] + ', ' + TB[1] + ', ' + TB[2] + ', ' + TB[3] +
            ']\n  }';
    shortList += '\'' + nawRuzTihran.date().toString(36) +
      ayyamiHaLength.toString(36) + TB[0].toString(36) +
      TB[1].toString(36) + '\'';
    if (i === equinoxesLength - 2) {
      longList += '\n};';
      shortList += '];';
    } else if (i % 9 === 8) {
      longList += ',\n';
      shortList += ',\n  ';
    } else {
      longList += ',\n';
      shortList += ', ';
    }
  }
  shortList += '\n\nexport {badiYears};';
  longList += '\n\nexport {badiYears};';
  $('#long').html('<pre>' + longList + '</pre>');
  $('#short').html('<pre>' + shortList + '</pre>');
};

yearList();

export {latitudeTihran, longitudeTihran, nawRuzTihranUTC, twinBirthdays};
