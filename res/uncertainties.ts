/* eslint-disable */
import * as MeeusSunMoon from 'meeussunmoon';
import * as luxon from 'luxon';
import { latitudeTihran, longitudeTihran, nawRuzEndTihranUTC, calculateTwinBirthdays } from './generateYearData';
import { BadiDate, badiDateSettings } from '../dist/badiDate-locales';
import { equinoxes } from './equinoxes';
import * as fs from 'fs';

const nearestSunset = (datetime: luxon.DateTime): luxon.DateTime => {
    const sunset1 = MeeusSunMoon.sunset(datetime.minus({ days: 1 }), latitudeTihran, longitudeTihran) as luxon.DateTime;
    const sunset2 = MeeusSunMoon.sunset(datetime, latitudeTihran, longitudeTihran) as luxon.DateTime;
    const sunset3 = MeeusSunMoon.sunset(datetime.plus({ days: 1 }), latitudeTihran, longitudeTihran) as luxon.DateTime;

    let sunset = sunset1;
    if (Math.abs(datetime.diff(sunset2).valueOf()) < Math.abs(datetime.diff(sunset).valueOf())) {
        sunset = sunset2;
    }
    if (Math.abs(datetime.diff(sunset3).valueOf()) < Math.abs(datetime.diff(sunset).valueOf())) {
        sunset = sunset3;
    }
    return sunset;
};

const nearestNewMoon = (datetime: luxon.DateTime): luxon.DateTime => {
    const newMoons = MeeusSunMoon.yearMoonPhases(datetime.year, 0);
    let newMoonBefore;
    let newMoonAfter;
    for (let i = 0; ; i++) {
        if (newMoons[i] > datetime) {
            newMoonBefore = newMoons[i - 1];
            newMoonAfter = newMoons[i];
            break;
        }
    }
    if (Math.abs(datetime.diff(newMoonBefore).valueOf()) <
        Math.abs(datetime.diff(newMoonAfter).valueOf())) {
        return newMoonBefore;
    }
    return newMoonAfter;
};

/**
 * Generate a list to determine uncertainties that could lead to incorrect dates
 * in the calculation Columns generated are (all times in UTC, location where
 * applicable Tihran):
 * Gregorian Year,
 * estimated delta T,
 * uncertainty in delta T,
 * time of the March Equinox,
 * time of nearest sunset,
 * difference in seconds,
 * time of end of Naw-Rúz,
 * time of nearest New Moon,
 * difference in seconds,
 * time of eighth New Moon after Naw-Rúz,
 * time of nearest sunset,
 * difference in seconds,
 * Gregorian Date of March Equinox,
 * Badí' date of the Birth of the Báb commemoration,
 * corresponding Gregorian date,
 * length of Ayyám-i-Há in days
 */
const uncertaintyTable = () => {
    badiDateSettings({ underlineFormat: 'none' });
    let output = 'Gregorian Year, Badíʻ Year, ΔT, σ(ΔT), March equinox, nearest sunset in Tihran, difference [s], ' +
        'end of Naw-Rúz in Tihran, nearest new moon, difference [s], eighth new moon after Naw-Rúz, ' +
        'nearest sunset in Tihran, difference [s], date of Naw-Rúz, date of Birth of the Báb (Badíʻ), ' +
        'date of Birth of the Báb (Gregorian), length of Ayyám-i-Há\n';
    for (let i = 0; i < 336; i++) {
        const N = i + 10;
        const errorDeltaT = Math.round(365.25 * N * Math.sqrt((N * 0.058 / 3) * (1 + N / 2500)) / 1000);
        const equinox = luxon.DateTime.fromISO(equinoxes[i], { zone: 'UTC'});
        let deltaT;
        let t;
        if (i < 36) {
            t = i + 15;
            deltaT = Math.round(62.92 + 0.32217 * t + 0.005589 * t * t);
        } else if (i < 136) {
            t = i + 2015;
            deltaT = Math.round(-20 +
                32 * ((t - 1820) / 100) * ((t - 1820) / 100) - 0.5628 * (2150 - t));
        } else {
            t = (i + 195) / 100;
            deltaT = Math.round(-20 + 32 * t * t);
        }
        const sunset = nearestSunset(equinox);
        let nawRuzEnd = nawRuzEndTihranUTC(equinox.toISO());
        const nawRuzNewMoon = nearestNewMoon(nawRuzEnd);
        const newMoons = MeeusSunMoon.yearMoonPhases(nawRuzEnd.year, 0);
        let index = 0;
        // Count the new moons since Naw-Rúz and keep the eighth one
        let eighthNewMoon;
        for (let j = 0; j < newMoons.length; j++) {
            if (newMoons[j] > nawRuzEnd) {
                index++;
            }
            if (index === 8) {
                eighthNewMoon = newMoons[j];
                break;
            }
        }
        const TBSunset = nearestSunset(eighthNewMoon);
        const twinBirth = calculateTwinBirthdays(nawRuzEndTihranUTC(equinox.toISO()));
        const BoB = new BadiDate({ year: i + 172, month: twinBirth[0], day: twinBirth[1] });
        output += `${equinox.year},`;
        output += `${equinox.year - 1843},`;
        output += `${deltaT},`;
        output += `${errorDeltaT},`;
        output += equinox.toFormat(`yyyy-MM-dd'T'HH:mm:ss','`);
        output += sunset.toFormat(`yyyy-MM-dd'T'HH:mm:ss','`);
        if (Math.abs(equinox.diff(sunset).as('seconds')) < 3 * errorDeltaT + 90) {
            output += '#';
        }
        output += `${equinox.diff(sunset).as('seconds')},`;
        output += nawRuzEnd.toFormat(`yyyy-MM-dd'T'HH:mm:ss','`);
        output += nawRuzNewMoon.toFormat(`yyyy-MM-dd'T'HH:mm:ss','`);
        if (Math.abs(nawRuzEnd.diff(nawRuzNewMoon).as('seconds')) <
            3 * errorDeltaT + 60) {
            output += '#';
        }
        output += `${nawRuzEnd.diff(nawRuzNewMoon).as('seconds')},`;
        output += eighthNewMoon.toFormat(`yyyy-MM-dd'T'HH:mm:ss','`);
        output += TBSunset.toFormat(`yyyy-MM-dd'T'HH:mm:ss','`);
        if (Math.abs(eighthNewMoon.diff(TBSunset).as('seconds')) <
            3 * errorDeltaT + 60) {
            output += '#';
        }
        output += `${eighthNewMoon.diff(TBSunset).as('seconds')},`;
        output += nawRuzEnd.toFormat(`dd MMM','`);
        output += BoB.format('d MM,');
        output += BoB.gregorianDate.toFormat(`dd MMM','`);
        output += BoB.ayyamiHaLength;
        output += '\n';
    }
    fs.writeFileSync('./res/uncertainties.csv', output, 'utf8');
};

uncertaintyTable();
