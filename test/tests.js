import {ayyamiHaLengths, clockMap, UHJListDates} from './testData.js';
import * as luxon from 'luxon';
import {BadiDate, badiDateOptions, LocalBadiDate} from '../src/localBadiDate.js';
import {clockLocationFromPolygons} from '../src/clockLocations.js';

it('Compare with UHJ List 172-221', function () {
  for (let i = 0; i < 50; i++) {
    const nawRuz = new BadiDate([i + 172, 1]);
    const birthOfTheBab = new BadiDate([i + 172, 8]);
    const birthOfBahaullah = new BadiDate([i + 172, 9]);
    expect(nawRuz.gregorianDate().toFormat('yyyy-MM-dd')).toEqual(UHJListDates[i][0]);
    expect(birthOfTheBab.badiMonth()).toEqual(UHJListDates[i][2][0]);
    expect(birthOfTheBab.badiDay()).toEqual(UHJListDates[i][2][1]);
    expect(birthOfBahaullah.badiMonth()).toEqual(UHJListDates[i][2][2]);
    expect(birthOfBahaullah.badiDay()).toEqual(UHJListDates[i][2][3]);
  }
});

it('Random badiDate Conversions', function () {
  for (let i = 0; i < 1000; i++) {
    const dayOfYear = Math.floor((Math.random() * 365) + 1);
    const year = Math.floor((Math.random() * 506) + 1845);
    const initDate = luxon.DateTime.fromObject({ year, ordinal: dayOfYear, zone: 'UTC' });
    const badiDate1 = new BadiDate(initDate);
    const badiDate2 = new BadiDate([badiDate1.badiYear(), badiDate1.badiMonth(), badiDate1.badiDay()]);
    const badiDate3 = new BadiDate(badiDate2.gregorianDate());
    expect(initDate.toISO()).toEqual(badiDate3.gregorianDate().toISO());
    expect(badiDate3.isValid()).toBeTruthy();
  }
});


it('Getters', function () {
  for (let badiYear = 1; badiYear < 508; badiYear++) {
    const badiMonth = Math.floor((Math.random() * 19) + 1);
    const badiDay = Math.floor((Math.random() * 19) + 1);
    const badiDate1 = new BadiDate([badiYear, badiMonth, badiDay]);
    expect(badiDate1.badiDay()).toEqual(badiDay);
    expect(parseInt(badiDate1.format('d'), 10)).toEqual(badiDay);
    expect(badiDate1.badiMonth()).toEqual(badiMonth);
    expect(parseInt(badiDate1.format('m'), 10)).toEqual(badiMonth);
    expect(badiDate1.badiYear()).toEqual(badiYear);
    expect(parseInt(badiDate1.format('y'), 10)).toEqual(badiYear);
    const yearInVahid = ((badiYear - 1) % 19) + 1;
    expect(badiDate1.yearInVahid()).toEqual(yearInVahid);
    expect(parseInt(badiDate1.format('yv'), 10)).toEqual(yearInVahid);
    const vahid = (Math.floor((badiYear - 1) / 19) % 19) + 1;
    expect(badiDate1.vahid()).toEqual(vahid);
    expect(parseInt(badiDate1.format('v'), 10)).toEqual(vahid);
    const kullIShay = (badiYear < 362) ? 1 : 2;
    expect(badiDate1.kullIShay()).toEqual(kullIShay);
    expect(parseInt(badiDate1.format('k'), 10)).toEqual(kullIShay);
    expect(badiDate1.ayyamiHaLength()).toEqual(ayyamiHaLengths[badiYear]);
  }
});

it('Badí\' Weekdays', function () {
  for (let badiDay = 1; badiDay < 8; badiDay++) {
    const badiDate1 = new BadiDate([172, 1, badiDay]);
    // In this range of dates, weekday numbers happen to correspond to day
    // numbers
    expect(badiDate1.badiWeekday()).toEqual(badiDay);
  }
});

it('Invalid Dates', function () {
  const badiDate1 = new BadiDate([172, 20, 6]);
  const badiDate2 = new BadiDate([508, 1, 1]);
  const badiDate3 = new BadiDate(luxon.DateTime.fromISO('1844-01-01', { zone: 'UTC' }));
  const badiDate4 = new BadiDate(luxon.DateTime.fromISO('2400-01-01', { zone: 'UTC' }));
  expect(badiDate1.isValid()).toBeFalsy();
  expect(badiDate1.format()).toEqual('Not a valid Badí‘ date');
  expect(badiDate2.isValid()).toBeFalsy();
  expect(badiDate2.format()).toEqual('Not a valid Badí‘ date');
  expect(badiDate3.isValid()).toBeFalsy();
  expect(badiDate3.format()).toEqual('Not a valid Badí‘ date');
  expect(badiDate4.isValid()).toBeFalsy();
  expect(badiDate4.format()).toEqual('Not a valid Badí‘ date');
});

it('Local Badí Date', function () {
  const localBadiDate1 = new LocalBadiDate([172, 1, 1], 32.943, 35.092,
    'Asia/Jerusalem');
  const localBadiDate2 = new LocalBadiDate(luxon.DateTime.fromISO('2015-03-20T18:00:00',
    { zone: 'Asia/Jerusalem' }), 32.943, 35.092, 'Asia/Jerusalem');
  expect(localBadiDate1.start.toISO()).toEqual(localBadiDate2.start.toISO());
  expect(localBadiDate1.start.toISO()).toEqual('2015-03-20T17:51:00.000+02:00');
  expect(localBadiDate1.sunrise.toISO()).toEqual(localBadiDate2.sunrise.toISO());
  expect(localBadiDate1.sunrise.toISO()).toEqual('2015-03-21T05:43:00.000+02:00');
  expect(localBadiDate1.solarNoon.toISO()).toEqual(localBadiDate2.solarNoon.toISO());
  expect(localBadiDate1.solarNoon.toISO()).toEqual('2015-03-21T11:47:00.000+02:00');
  expect(localBadiDate1.end.toISO()).toEqual(localBadiDate2.end.toISO());
  expect(localBadiDate1.end.toISO()).toEqual('2015-03-21T17:52:00.000+02:00');
  /**
   * Concatenate the string HH:mm:ss output from start, sunrise, solar Noon and
   * end times of the LocalBadiDate object.
   * @param {LocalBadiDate} localBadiDate input object
   * @returns {string} concatenated string
   */
  const timesString = function (localBadiDate) {
    return (localBadiDate.start.toFormat('HH:mm:ss') + '|' +
            localBadiDate.sunrise.toFormat('HH:mm:ss') + '|' +
            localBadiDate.solarNoon.toFormat('HH:mm:ss') + '|' +
            localBadiDate.end.toFormat('HH:mm:ss'));
  };
  const dateAlaska = new LocalBadiDate([172, 1, 1], 65.0, -150.0,
    'America/Anchorage');
  const dateCanada = new LocalBadiDate([172, 1, 1], 62.0, -120.0,
    'America/Edmonton');
  const dateIceland = new LocalBadiDate([172, 1, 1], 65.0, -19.0,
    'Atlantic/Reykjavik');
  const dateNorway = new LocalBadiDate([172, 1, 1], 60.0, 10.0,
    'Europe/Oslo');
  const dateSweden = new LocalBadiDate([172, 1, 1], 65.0, 17.0,
    'Europe/Stockholm');
  const dateFinland = new LocalBadiDate([172, 1, 1], 65.0, 28.0,
    'Europe/Helsinki');
  const dateFinland2 = new LocalBadiDate([172, 19, 19], 65.0, 28.0,
    'Europe/Helsinki');
  expect(timesString(dateAlaska)).toEqual('19:00:00|07:00:00|13:00:00|19:00:00');
  expect(timesString(dateCanada)).toEqual('18:00:00|06:30:00|12:00:00|18:00:00');
  expect(timesString(dateIceland)).toEqual('18:00:00|06:00:00|13:00:00|18:00:00');
  expect(timesString(dateNorway)).toEqual('18:00:00|06:00:00|12:00:00|18:00:00');
  expect(timesString(dateSweden)).toEqual('18:00:00|06:00:00|12:00:00|18:00:00');
  expect(timesString(dateFinland)).toEqual('18:00:00|06:00:00|12:00:00|18:00:00');
  expect(timesString(dateFinland2)).toEqual('18:19:00|06:11:00|12:16:00|18:22:00');
  badiDateOptions({useClockLocations: false});
  const dateAlaska2 = new LocalBadiDate([172, 1, 1], 65.0, -150.0,
    'America/Anchorage');
  expect(timesString(dateAlaska2)).toEqual('20:16:00|07:57:00|14:07:00|20:19:00');
  const holyDay2 = new LocalBadiDate([172, 2], 32.943, 35.092,
    'Asia/Jerusalem');
  const holyDay5 = new LocalBadiDate([172, 5], 32.943, 35.092,
    'Asia/Jerusalem');
  const holyDay6 = new LocalBadiDate([172, 6], 32.943, 35.092,
    'Asia/Jerusalem');
  const holyDay7 = new LocalBadiDate([172, 7], 32.943, 35.092,
    'Asia/Jerusalem');
  const holyDay11 = new LocalBadiDate([172, 11], 32.943, 35.092,
    'Asia/Jerusalem');
  expect(holyDay2.holyDayCommemoration.toFormat('HH:mm:ss')).toEqual('16:00:00');
  expect(holyDay5.holyDayCommemoration.toFormat('HH:mm:ss')).toEqual('21:48:00');
  expect(holyDay6.holyDayCommemoration.toFormat('HH:mm:ss')).toEqual('04:00:00');
  expect(holyDay7.holyDayCommemoration.toFormat('HH:mm:ss')).toEqual('12:45:00');
  expect(holyDay11.holyDayCommemoration.toFormat('HH:mm:ss')).toEqual('01:00:00');
  badiDateOptions({useClockLocations: true});
});

it('Localization Fallback', function () {
  const badiDate1 = new BadiDate([172, 1, 2]);
  expect(badiDate1.format('MML')).toEqual('Splendour');
  expect(badiDate1.format('MML', 'en-us')).toEqual('Splendor');
  expect(badiDate1.format('MML', 'invalidlang')).toEqual('Splendour');

  badiDateOptions({defaultLanguage: 'ar'});
  expect(badiDate1.format('MML')).toEqual('البهاء');

  badiDateOptions({defaultLanguage: 'invalidlang'});
  expect(badiDate1.format('MML')).toEqual('البهاء');

  badiDateOptions({defaultLanguage: 'en'});
  expect(badiDate1.format('MML')).toEqual('Splendour');
});

it('Clock Locations', function () {
  const valueMapping = [false, 'USA', 'Canada', 'Iceland', 'Norway', 'Sweden',
    'Finland'];
  for (let i = 0; i < 40; i++) {
    const lat = 90 - i;
    for (let j = 0; j < 360; j++) {
      const lng = -180 + j;
      expect(clockLocationFromPolygons(lat, lng)).toEqual(valueMapping[clockMap[i][j]]);
    }
  }
});

it('Format Cropping', function () {
  const expectedResults = {
    4: '‘Aẓa',
    10: '‘Izz',
    11: 'Ma<span style="text-decoration:underline">s</span>',
    12: '‘Ilm',
    16: '<span style="text-decoration:underline">Sh</span>a',
    19: '‘Alá’'
  };
  for (const [month, string] of Object.entries(expectedResults)) {
    const badiDate1 = new BadiDate([172, month, 1]);
    expect(badiDate1.format('M')).toEqual(string);
  }
});
