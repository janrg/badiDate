/* eslint-env qunit */
import {ayyamiHaLengths, clockMap, UHJListDates} from './testData.js';
import {badiDateOptions, LocalBadiDate} from '../src/localBadiDate.js';
import {BadiDate} from '../src/badiDate.js';
import {clockLocationFromPolygons} from '../src/clockLocations.js';

QUnit.config.hidepassed = true;

QUnit.test('Compare with UHJ List 172-221', function (assert) {
  for (let i = 0; i < 50; i++) {
    const nawRuz = new BadiDate([i + 172, 1]);
    const birthOfTheBab = new BadiDate([i + 172, 8]);
    const birthOfBahaullah = new BadiDate([i + 172, 9]);
    assert.strictEqual(nawRuz.gregorianDate().format('YYYY-MM-DD'),
      UHJListDates[i][0], 'Naw-Rúz ' + (i + 172) + ': ' +
      nawRuz.gregorianDate().date() + '/' + UHJListDates[i][0].slice(8) +
      ' March');
    assert.strictEqual(nawRuz.ayyamiHaLength(), UHJListDates[i][1],
      'Length of Ayyám-i-Há ' + (i + 172) + ': ' + nawRuz.ayyamiHaLength() +
      '/' + UHJListDates[i][1]);
    assert.strictEqual(birthOfTheBab.badiMonth(), UHJListDates[i][2][0],
      'Birth of the Báb ' + (i + 172) + ', Month: ' +
      birthOfTheBab.badiMonth() + '/' + UHJListDates[i][2][0]);
    assert.strictEqual(birthOfTheBab.badiDay(), UHJListDates[i][2][1],
      'Birth of the Báb ' + (i + 172) + ', Day: ' + birthOfTheBab.badiDay() +
      '/' + UHJListDates[i][2][1]);
    assert.strictEqual(birthOfBahaullah.badiMonth(), UHJListDates[i][2][2],
      'Birth of Bahá\'u\'lláh ' + (i + 172) + ', Month: ' +
      birthOfBahaullah.badiMonth() + '/' + UHJListDates[i][2][2]);
    assert.strictEqual(birthOfBahaullah.badiDay(), UHJListDates[i][2][3],
      'Birth of Bahá\'u\'lláh ' + (i + 172) + ', Day: ' +
      birthOfBahaullah.badiDay() + '/' + UHJListDates[i][2][3]);
  }
});

QUnit.test('Random badiDate Conversions', function (assert) {
  for (let i = 0; i < 1000; i++) {
    const dayOfMonth = Math.floor((Math.random() * 28) + 1);
    const month = Math.floor((Math.random() * 12) + 1);
    const year = Math.floor((Math.random() * 506) + 1845);
    const initDate = moment.utc(year + '-' + ('0' + month).slice(-2) + '-' +
      ('0' + dayOfMonth).slice(-2));
    const badiDate1 = new BadiDate(initDate);
    const badiDate2 = new BadiDate([badiDate1.badiYear(), badiDate1.badiMonth(),
      badiDate1.badiDay()]);
    const badiDate3 = new BadiDate(badiDate2.gregorianDate());
    const badiDate4 = new BadiDate(String(badiDate3.badiYear()) + '-' +
      String(badiDate3.badiMonth()) + '-' + String(badiDate3.badiDay()));
    assert.strictEqual(initDate.format('YYYY-MM-DD'),
      badiDate4.gregorianDate().format('YYYY-MM-DD'),
      'Multiple Date Conversions: ' + initDate.format('YYYY-MM-DD') +
      '/' + badiDate4.gregorianDate().format('YYYY-MM-DD'));
    assert.strictEqual(badiDate4.isValid(), true,
      'Test that isValid() returns true: ' + true + '/' + badiDate4.isValid());
  }
});

QUnit.test('Getters', function (assert) {
  for (let badiYear = 1; badiYear < 508; badiYear++) {
    const badiMonth = Math.floor((Math.random() * 19) + 1);
    const badiDay = Math.floor((Math.random() * 19) + 1);
    const badiDate1 = new BadiDate([badiYear, badiMonth, badiDay]);
    assert.strictEqual(badiDate1.badiDay(), badiDay, 'Badí\' Day (getter): ' +
      badiDay + '/' + badiDate1.badiDay());
    assert.strictEqual(parseInt(badiDate1.format('d'), 10), badiDay,
      'Badí\' Day (format): ' + badiDay + '/' +
      parseInt(badiDate1.format('d'), 10));
    assert.strictEqual(badiDate1.badiMonth(), badiMonth,
      'Badí\' Month (getter): ' + badiMonth + '/' + badiDate1.badiMonth());
    assert.strictEqual(parseInt(badiDate1.format('m'), 10), badiMonth,
      'Badí\' Month (format): ' + badiMonth + '/' +
      parseInt(badiDate1.format('m'), 10));
    assert.strictEqual(badiDate1.badiYear(), badiYear,
      'Badí\' Year (getter): ' + badiYear + '/' + badiDate1.badiYear());
    assert.strictEqual(parseInt(badiDate1.format('y'), 10), badiYear,
      'Badí\' Year (format): ' + badiYear + '/' +
      parseInt(badiDate1.format('y'), 10));
    const yearInVahid = ((badiYear - 1) % 19) + 1;
    assert.strictEqual(badiDate1.yearInVahid(), yearInVahid,
      'Year in Váḥid (getter): ' + yearInVahid + '/' + badiDate1.yearInVahid());
    assert.strictEqual(parseInt(badiDate1.format('yv'), 10), yearInVahid,
      'Year in Váḥid (format): ' + yearInVahid + '/' +
      parseInt(badiDate1.format('yv'), 10));
    const vahid = (Math.floor((badiYear - 1) / 19) % 19) + 1;
    assert.strictEqual(badiDate1.vahid(), vahid,
      'Váḥid in Kull-i-Shay\' (getter): ' + vahid + '/' + badiDate1.vahid());
    assert.strictEqual(parseInt(badiDate1.format('v'), 10), vahid,
      'Váḥid in Kull-i-Shay\' (format): ' + vahid + '/' +
      badiDate1.format('v'));
    const kullIShay = (badiYear < 362) ? 1 : 2;
    assert.strictEqual(badiDate1.kullIShay(), kullIShay,
      'Kull-i-Shay\' (getter): ' + kullIShay + '/' + badiDate1.kullIShay());
    assert.strictEqual(parseInt(badiDate1.format('k'), 10), kullIShay,
      'Kull-i-Shay\' (format): ' + kullIShay + '/' + badiDate1.format('k'));
    assert.strictEqual(badiDate1.ayyamiHaLength(), ayyamiHaLengths[badiYear],
      'Length of Ayyám-i-Há (getter): ' + ayyamiHaLengths[badiYear] + '/' +
      badiDate1.ayyamiHaLength());
  }
});

QUnit.test('Badí\' Weekdays', function (assert) {
  for (let badiDay = 1; badiDay < 8; badiDay++) {
    const badiDate1 = new BadiDate([172, 1, badiDay]);
    // In this range of dates, weekday numbers happen to correspond to day
    // numbers
    assert.strictEqual(badiDate1.badiWeekday(), badiDay,
      'Badí\' Weekday (getter): ' + badiDay + '/' + badiDate1.badiWeekday());
  }
});

QUnit.test('Invalid Dates', function (assert) {
  const badiDate1 = new BadiDate([172, 20, 6]);
  const badiDate2 = new BadiDate([508, 1, 1]);
  const badiDate3 = new BadiDate(moment.utc('1844-01-01'));
  const badiDate4 = new BadiDate(moment.utc('2400-01-01'));
  assert.strictEqual(badiDate1.isValid(), false,
    'Test that isValid() Returns false: ' + false + '/' + badiDate1.isValid());
  assert.strictEqual(badiDate1.format(), 'Not a valid date',
    'Formatting an Invalid Date: Not a valid date/' + badiDate1.format());
  assert.strictEqual(badiDate2.isValid(), false,
    'Test that isValid() Returns false: ' + false + '/' + badiDate2.isValid());
  assert.strictEqual(badiDate2.format(), 'Not a valid date',
    'Formatting an Invalid Date: Not a valid date/' + badiDate2.format());
  assert.strictEqual(badiDate3.isValid(), false,
    'Test that isValid() Returns false: ' + false + '/' + badiDate3.isValid());
  assert.strictEqual(badiDate3.format(), 'Not a valid date',
    'Formatting an Invalid Date: Not a valid date/' + badiDate3.format());
  assert.strictEqual(badiDate4.isValid(), false,
    'Test that isValid() Returns false: ' + false + '/' + badiDate4.isValid());
  assert.strictEqual(badiDate4.format(), 'Not a valid date',
    'Formatting an Invalid Date: Not a valid date/' + badiDate4.format());
});

QUnit.test('Local Badí Date', function (assert) {
  const localBadiDate1 = new LocalBadiDate([172, 1, 1], 32.943, 35.092,
    'Asia/Jerusalem');
  const localBadiDate2 = new LocalBadiDate(moment.tz('2015-03-20T18:00:00',
    'Asia/Jerusalem'), 32.943, 35.092, 'Asia/Jerusalem');
  assert.ok(
    localBadiDate1.start.format() === localBadiDate2.start.format() &&
    localBadiDate1.start.format() === '2015-03-20T17:51:00+02:00',
    'Correct start datetime');
  assert.ok(localBadiDate1.sunrise.format() ===
    localBadiDate2.sunrise.format() && localBadiDate1.sunrise.format() ===
    '2015-03-21T05:43:00+02:00', 'Correct sunrise datetime');
  assert.ok(localBadiDate1.solarNoon.format() ===
    localBadiDate2.solarNoon.format() && localBadiDate1.solarNoon.format() ===
    '2015-03-21T11:47:00+02:00', 'Correct solar noon datetime');
  assert.ok(
    localBadiDate1.end.format() === localBadiDate2.end.format() &&
    localBadiDate1.end.format() === '2015-03-21T17:52:00+02:00',
    'Correct end datetime');
  /**
   * Concatenate the string HH:mm:ss output from start, sunrise, solar Noon and
   * end times of the LocalBadiDate object.
   * @param {LocalBadiDate} localBadiDate input object
   * @returns {string} concatenated string
   */
  const timesString = function (localBadiDate) {
    return (localBadiDate.start.format('HH:mm:ss') + '|' +
            localBadiDate.sunrise.format('HH:mm:ss') + '|' +
            localBadiDate.solarNoon.format('HH:mm:ss') + '|' +
            localBadiDate.end.format('HH:mm:ss'));
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
  assert.strictEqual(timesString(dateAlaska),
    '19:00:00|07:00:00|13:00:00|19:00:00', 'Clock time Alaska');
  assert.strictEqual(timesString(dateCanada),
    '18:00:00|06:30:00|12:00:00|18:00:00', 'Clock time Canada');
  assert.strictEqual(timesString(dateIceland),
    '18:00:00|06:00:00|13:00:00|18:00:00', 'Clock time Iceland');
  assert.strictEqual(timesString(dateNorway),
    '18:00:00|06:00:00|12:00:00|18:00:00', 'Clock time Norway');
  assert.strictEqual(timesString(dateSweden),
    '18:00:00|06:00:00|12:00:00|18:00:00', 'Clock time Sweden');
  assert.strictEqual(timesString(dateFinland),
    '18:00:00|06:00:00|12:00:00|18:00:00', 'Clock time Finland');
  assert.notStrictEqual(timesString(dateFinland2),
    '18:00:00|06:00:00|12:00:00|18:00:00',
    'Not clock time Finland during the Fast');
  badiDateOptions({useClockLocations: false});
  const dateAlaska2 = new LocalBadiDate([172, 1, 1], 65.0, -150.0,
    'America/Anchorage');
  assert.notStrictEqual(timesString(dateAlaska2),
    '19:00:00|07:00:00|13:00:00|19:00:00',
    'Clock time Alaska - clock location turned off');
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
  assert.strictEqual(holyDay2.holyDayCommemoration.format('HH:mm:ss'),
    '16:00:00');
  assert.strictEqual(holyDay5.holyDayCommemoration.format('HH:mm:ss'),
    '21:48:00');
  assert.strictEqual(holyDay6.holyDayCommemoration.format('HH:mm:ss'),
    '04:00:00');
  assert.strictEqual(holyDay7.holyDayCommemoration.format('HH:mm:ss'),
    '12:45:00');
  assert.strictEqual(holyDay11.holyDayCommemoration.format('HH:mm:ss'),
    '01:00:00');
  // Reset for other tests
  badiDateOptions({useClockLocations: true});
});

QUnit.test('Localization Fallback', function (assert) {
  const badiDate1 = new BadiDate([172, 1, 2]);
  assert.strictEqual(badiDate1.format('MML'), 'Splendour',
    'English as default');
  assert.strictEqual(badiDate1.format('MML', 'en-us'), 'Splendor',
    'en-us override');
  assert.strictEqual(badiDate1.format('DDL', 'en-us'), 'Glory',
    'en-us fallback');
  assert.strictEqual(badiDate1.format('MML', 'invalidlang'), 'Splendour',
    'Fallback for invalid language override');
  badiDateOptions({defaultLanguage: 'ar'});
  assert.strictEqual(badiDate1.format('MML'), 'البهاء',
    'Set default to Arabic');
  badiDateOptions({defaultLanguage: 'invalidlang'});
  assert.strictEqual(badiDate1.format('MML'), 'البهاء',
    'Changing default to invalid language shouldn\'t do anything');
  badiDateOptions({defaultLanguage: 'en'});
  assert.strictEqual(badiDate1.format('MML'), 'Splendour',
    'Default back to English');
});

QUnit.test('Clock Locations', function (assert) {
  const valueMapping = [false, 'USA', 'Canada', 'Iceland', 'Norway', 'Sweden',
    'Finland'];
  for (let i = 0; i < 40; i++) {
    const lat = 90 - i;
    for (let j = 0; j < 360; j++) {
      const lng = -180 + j;
      assert.strictEqual(clockLocationFromPolygons(lat, lng),
        valueMapping[clockMap[i][j]]);
    }
  }
});
