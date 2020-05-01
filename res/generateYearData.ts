import * as MeeusSunMoon from 'meeussunmoon';
import * as luxon from 'luxon';
import { equinoxes } from './equinoxes';
import * as fs from 'fs';

const latitudeTihran = 35.68;
const longitudeTihran = 51.42;

const nawRuzEndTihranUTC = (equinox: string): luxon.DateTime => {
    const vernalEquinox = luxon.DateTime.fromISO(equinox, { zone: 'UTC' });
    let nawRuzTihran = MeeusSunMoon.sunset(vernalEquinox, latitudeTihran, longitudeTihran) as luxon.DateTime;
    if (vernalEquinox > nawRuzTihran) {
        nawRuzTihran = MeeusSunMoon.sunset(
            vernalEquinox.plus({ days: 1 }), latitudeTihran, longitudeTihran) as luxon.DateTime;
    }
    return nawRuzTihran;
};

const calculateTwinBirthdays = (nawRuzTihran: luxon.DateTime): number[] => {
    let eighthNewMoon: luxon.DateTime;
    const nawRuzEnd = MeeusSunMoon.sunset(nawRuzTihran, latitudeTihran, longitudeTihran);
    const newMoons = MeeusSunMoon.yearMoonPhases(nawRuzTihran.year, 0);
    let index = 0;
    // Count the new moons since Naw-Rúz and keep the eighth one
    for (let i = 0; i < newMoons.length; i++) {
        if (newMoons[i] > nawRuzEnd) {
            index++;
        }
        if (index === 8) {
            eighthNewMoon = newMoons[i];
            break;
        }
    }
    // Convert to the proper timezone and calculate sunset.
    eighthNewMoon.setZone('Asia/Tehran');
    const newMoonSunset = MeeusSunMoon.sunset(eighthNewMoon, latitudeTihran, longitudeTihran);
    // If sunset is before the new moon, the new moon is on the next Badí' date.
    // Then we add another day because it's the day after the occurence of the
    // eighth new moon.
    if (newMoonSunset < eighthNewMoon) {
        eighthNewMoon = eighthNewMoon.plus({ days: 1 });
    }
    eighthNewMoon = eighthNewMoon.plus({ days: 1 });
    const dayOfBadiYear = eighthNewMoon.ordinal - nawRuzTihran.ordinal + 1;
    const day2OfBadiYear = dayOfBadiYear + 1;
    return [Math.floor((dayOfBadiYear - 1) / 19 + 1), (dayOfBadiYear - 1) % 19 + 1,
        Math.floor((day2OfBadiYear - 1) / 19 + 1), (day2OfBadiYear - 1) % 19 + 1];
};

const yearList = () => {
    let longList = 'const badiYears = {';
    let shortList = 'const badiYears = [\n';
    // Stop at end of 2350 AD / 507 BE as the Naw-Rúz 509 BE is potentially too
    // close to call
    const equinoxesLength = 337;
    for (let i = 0; i < equinoxesLength - 1; i++) {
        const nawRuzTihran = nawRuzEndTihranUTC(equinoxes[i]);
        const nextNawRuzTihran = nawRuzEndTihranUTC(equinoxes[i + 1]);
        const ayyamiHaLength = Math.round(nextNawRuzTihran.diff(nawRuzTihran).as('days') - 361);
        const twinBirthdays = calculateTwinBirthdays(nawRuzTihran);
        longList += `
    ${(i + 172).toString()}: {
        ayyamiHaLength: ${ayyamiHaLength},
        nawRuz: '${nawRuzTihran.toFormat('yyyy-MM-dd')}',
        twinBirthdays: [${twinBirthdays[0]}, ${twinBirthdays[1]}, ${twinBirthdays[2]}, ${twinBirthdays[3]}],
    },`;
        shortList += `${i % 14 === 0 ? '    ' : ''}'${shortListString(
            nawRuzTihran, ayyamiHaLength, twinBirthdays)}',${i % 14 === 13 ? '\n' : ' '}`;
    }
    shortList += '];\n\nexport { badiYears };\n';
    longList += '\n};\n\nexport { badiYears };\n';
    fs.writeFileSync('./res/badiYearsLongFormat.ts', longList, 'utf8');
    fs.writeFileSync('./src/badiYears.ts', shortList, 'utf8');
};

const shortListString = (nawRuz, ayyamiHaLength, twinBirthdays) => `${nawRuz.day.toString(36)}${
    ayyamiHaLength.toString(36)}${twinBirthdays[0].toString(36)}${twinBirthdays[1].toString(36)}`;

yearList();

export { latitudeTihran, longitudeTihran, nawRuzEndTihranUTC, calculateTwinBirthdays, yearList };
