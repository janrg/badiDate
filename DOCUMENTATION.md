# badiDate - Documentation

## Dependencies

badiDate requires [Luxon](https://moment.github.io/luxon/). In order to use the `LocalBadiDate` class,
[MeeusSunMoon](https://github.com/janrg/MeeusSunMoon) (v3.0.0+) is also required. Versions that bundle MeeusSunMoon are
included.

## Installation

### Bundles

A variety of different bundles are provided depending on the exact requirements:

`badiDate*.js` files include the `BadiDate` class and the function `badiDateOptions`.  
`localBadiDate*.js` files include all of the above as well as the `LocalBadiDate` class.

Files with `-msm` in the name have the MeeusSunMoon module bundled in. For usage of `LocalBadiDate` without a bundled
version of MeeusSunMoon see below.

Files with `-locales` in the name include all currently available locales, files without only include the english locale.
Creating bundles with a custom set of bundled locales is also possible (see `rollup.config.js`)

Files ending in `.mjs` ES6 modules, files without are packed as UMD modules.

### Script Include

Compiled versions (both minified and not) are located in `dist/`.

Include for example as:

```html
<script src="{yourjspath}/localBadiDate-msm-locales.min.js"></script>
```

If a non`-msm` file is used, MeeusSunMoon needs to be included separately.

Luxon can be included from a CDN, such as CDNJS:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/luxon/1.24.1/luxon.min.js"></script>
```

### NPM

`npm install badidate`

For bundling (e.g. with rollup) you can then import the ES6 module via

```js
import { adiDate, LocalBadiDate, badiDateSettings } from 'badidate';
```

or directly use it in the browser via

```js
import { BadiDate, LocalBadiDate, badiDateSettings } from './node_modules/badidate/dist/localBadiDate-msm-locales.m.js';
```

If the version of `localBadiDate*.js` without bundled  MeeusSunMoon is used, the module has to be loaded globally
via its UMD bundle in order for it to be available inside of the LocalBadiDate class.

## Configuration

There are three configuration options that can be set as

```js
badiDateSettings({
  useClockLocations: false, // default: true
  defaultLanguage: 'en', // default: 'en'
  underlineFormat: 'diacritic' // default: 'css'
});
```

(Note that two of the options for MeeusSunMoon, `roundToNearestMinute` and `returnTimeForPNMS`, default to `true`
when using the badiDate module.)

`useClockLocations` will use the appropriate times for regions in which fixed times are used rather than the actual
times for sunrise, sunset etc.. Setting it to `false` will disable this behaviour. For a list of currently implemented
regions, see below. This option is only available if the `LocalBadiDate` class is used.

`defaultLanguage` sets the default language for output of Badí' dates. (Alternatively this can be overwritten on each
call to `format()`, see below.) For a list of available languages see `src/locale/`.

`underlineFormat` sets how terms that include underlined letters should be rendered. The technically most correct
choice is `'diacritic'`, where each underlined letter is combined with the symbol U+0332 ("Combining Low Line"),
as the underlining is not styling but belongs to the letter. This is also the only way in which the underlining
will remain when copied as plain text. Unfortunately, some fonts will not display this correctly and not connect
the lines under adjacent characters. The default, and typically most robust option is `'css'`, where the letters
are wrapped in `<span style="text-decoration:underline;">|</span>`. `'u'`, which will wrap the letters in `<u>|</u>`,
should only be used if for some reason neither of the others can be used for your situation, as the `<u>` tag has
been deprecated for many years. `'none'` will result in no uderlining at all.

## The BadiDate Class

The BadiDate object represents a Badí' date with some simplifications in order to make it independent of location
(for local Badí' dates, a wrapper class, `LocalBadiDate()` exists, see below), namely

*   Badí' dates are taken to correspond to Gregorian dates 1-1, i.e. to start at midnight
*   No other times (e.g. for Holy Day commemorations) are stored

For dates in 172 B.E. and after (21 March 2015 and after), the new implementation is used to calculate the beginning
of the year, all Holy Days, and the length of Ayyám-i-Há, for earlier dates the earlier implementation, where for the
Twin Birthdays, the earlier implementation as customary in countries predominantly using the Gregorian calendar (i.e.
5 'Ilm and 9 Qudrat) is used.

### Creating a badiDate Object

There are a number of different ways, in which a badiDate object can be created:

#### From a luxon.DateTime or Date object

```js
const datetime = luxon.DateTime.fromISO('2015-03-21');
const myBadiDate1 = new BadiDate(datetime);

const date = new Date('2015-03-21');
const myBadiDate2 = new BadiDate(date);
```

sets the Badí' date from the Gregorian date given by the luxon.DateTime or Date object. Any time or timezone information
is ignored.

#### From an object representing a Badí' date

```js
const myBadiDate1 = new BadiDate({ year: 172, month: 1, day: 1 });
const myBadiDate2 = new BadiDate({ year: 172, holyDayNumber: 1 });
```

Sets the Badí' date from the given object. Arguments can either be in the format `{ year, month, day }`, or
`{ year, holyDayNumber }` where year, month, day, and holyDayNumber are integers and stand for
Badí' year, Badí' month, Badí' day, and Holy Day respectively. Badí' year can range from 1 to currently 507, Badí'
month from 1 to 20 (20 is used to represent Ayyám-i-Há throughout this module), Badí' day from 1 to 19 (except if
the month is 20 in which case it is from 1 to 5, a value of 5 in a year with 365 days bubbles up to 1 'Alá' automatically),
and Holy Day from 1 to 11 (corresponding to Naw-Rúz, First Day of Riḍván, Ninth Day of Riḍván, Twelfth Day of Riḍván,
Declaration of the Báb, Ascension of Bahá'u'lláh, Martyrdom of the Báb, Birth of the Báb, Birth of Bahá'u'lláh, Day of
the Covenant, Ascension of 'Abdu'l-Bahá).

### Properties and Methods

| Property | Type | Description |
| --- | --- | --- |
| `ayyamiHaLength` | number         | The length of Ayyám-i-Há in days for the given year (4 or 5) |
| `day`            | number         | The day in the Badí' month (1-19) |
| `gregorianDate`  | luxon.DateTime | The gregorian date corresponding to the end of the Badí' date |
| `holyDayNumber`  | number?        | The number of the Holy Day (1-11) or undefined if not a Holy Day |
| `invalidReason`  | string?        | If the date is invalid, this gives the reason, otherwise undefined |
| `isValid`        | boolean        | Whether this is a valid Badí' date |
| `kullIShay`      | number         | The Kull-i-Shay' of the Badí' date 1 for all dates between 1 B.E and 361 B.E. |
| `month`          | number         | The month in the Badí' year (1-20, 20 representing Ayyam-i-Há) |
| `nextDay`        | BadiDate       | The Badí' date immediately following this one |
| `nextMonth`      | BadiDate       | The first day of the Badí' month following this one |
| `previousDay`    | BadiDate       | The Badí' date immediately preceding this one |
| `previousMonth`  | BadiDate       | The first day of the Badí' month preceding this one |
| `vahid`          | number         | The Vaḥid in the current Kull-i-Shay' (1-19)|
| `weekday`        | number         | The number of the weekday (1-7, with one representing Jalál |
| `workSuspended`  | boolean?       | If this is a Holy Day, whether work is suspended, otherwise undefined |
| `year`           | number         | The Badí' year |
| `yearInVahid`    | number         | The year in the current Vaḥid |

| Method | Return Type | Description |
| --- | --- | --- |
| `format(formatString?: string, language?: string)` | string | The date in the format as given by `formatString` (see below ) |
| `holyDay(language?: string)` | string | The name of the Holy Day in the given language or an empty string if not a Holy Day |
| `equals(other: BadiDate)` | boolean | Returns `true` if both dates are valid and correspond to the same day, month, and year |

#### Formatting Tokens

|                   | Token | Output
|-------------------|-------|--------
| **Day**           | d     | Day of the month, without leading zeroes
|                   | dd    | Day of the month, with leading zeroes
|                   | D     | Day of the month as 3-letter (+ apostrophes) abbreviation of transliteration
|                   | DD    | Full day of month transliteration
|                   | DDL   | Full day of month translation
|                   | DD+   | Full day of month transliteration followed by translation in brackets
| **Month**         | m     | Badí' month, without leading zeroes, Ayyám-i-Há is 20
|                   | mm    | Badí' month, with leading zeroes, Ayyám-i-Há is 20
|                   | M     | Badí' month as 3-letter (+ apostrophes) abbreviation of transliteration
|                   | MM    | Badí' month transliteration
|                   | MML   | Badí' month translation
|                   | MM+   | Badí' month transliteration followed by translation in brackets
| **Year**          | y     | Badí' year without leading zeros
|                   | yy    | 3 digit Badí' year with leading zeroes
| **Weekday**       | ww    | Badí' weekday, 2 letter abbreviation of transliteration
|                   | W     | Badí' weekday, 3 letter abbreviation of transliteration
|                   | WW    | Badí' weekday, transliteration
|                   | WWL   | Badí' weekday, translation
| **Year in Váḥid** | yv    | Year in Váḥid, without leading zeroes
|                   | yyv   | Year in Váḥid, with leading zeroes
|                   | YV    | Year in Váḥid, transliteration
| **Váḥid**         | v     | Váḥid without leading zeroes
|                   | vv    | Váḥid with leading zeroes
| **Kull-i-Shay’**  | k     | Kull-i-Shay’ without leading zeroes
|                   | kk    | Kull-i-Shay’ with leading zeroes
| **Labels**        | BE    | localized version of B.E. to indicate a Badí' year
|                   | BC    | localized version of the term "Badí' Calendar"
|                   | Va    | localized version of the term "Váḥid"
|                   | KiS   | localized version of the term "Kull-i-Shay'"

If no formatting string is given, `format()` defaults to `'d MM+ y BE'` (With some exceptions. The default format can be set in the
respective locale file.) E.g.

```js
const myBadiDate = new BadiDate({ year: 172, month: 1, day: 1 });
console.log(myBadiDate.format());
```

will print

```
1 Bahá (Splendour) 172 B.E.
```

(assuming that the default language is English)

Any text in the formatting string wrapped in `{}` will not be parsed and output as-is.
A `{` without matching `}` will result in a return value of `"Invalid formatting string."`.

Note that for right-to-left languages such as Arabic, it may be necessary to wrap the formatting string in `U+200F` (Right-To-Left Mark,
HTML token: `&#8207;`) to achieve the correct display order.

## The LocalBadiDate Class

`LocalBadiDate` is a wrapper object for a `BadiDate` that is valid for a specific location.
This object contains the BadiDate object, as well as datetime objects for the start and end of the Badí' date as well as
sunrise, solar noon, and - if applicable - the time for commemoration of the Holy Day.

It requires the module [MeeusSunMoon](https://github.com/janrg/MeeusSunMoon), which is included in some of the bundles.


### Creating Badí' Dates

A local Badí' date object is created with

```js
const date1 = new LocalBadiDate(date, latitude, longitude, timezoneId);
```

where `date` accepts the same input formats as `BadiDate()`, `latitude` and `longitude` are the geographic latitude and longitude
(-90 to 90, -180 to 180, north and east are positive) and `timezoneId` is an IANA timezone string, e.g. `"Europe/London"`.

All input formats for `date` **except for luxon.DateTime object** are treated the same as in the `BadiDate()`
constructor. For a luxon.DateTime object, the time of day is taken into consideration and if appropriate, the Badí' day shifted forward
by a day. If this is not desired, make sure to assign an early time that will definitely not be after sunset, to the moment
object before invoking `LocalBadiDate()`.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `badiDate`             | BadiDate        | The corresponding BadiDate object |
| `clockLocation`        | string?         | The name of the region which causes this date to use fixed times for sunrise, noon and sunset if applicable, else undefined |
| `end`                  | luxon.DateTime  | The datetime corresponding to the end of this date |
| `holyDayCommemoration` | luxon.DateTime? | The commemoration time if this is a Holy Day with a set commemoration time, else undefined |
| `latitude`             | number          | The latitude for which this local Badí' date was calculated |
| `longitude`            | number          | The longitude for which this local Badí' date was calculated |
| `nextDay`              | LocalBadiDate   | The Badí' date immediately following this one as a LocalBadiDate |
| `nextMonth      `      | LocalBadiDate   | The first day of the Badí' month following this one as a LocalBadiDate |
| `previousDay`          | LocalBadiDate   | The Badí' date immediately preceding this one as a LocalBadiDate |
| `previousMonth`        | LocalBadiDate   | The first day of the Badí' month preceding this one as a LocalBadiDate |
| `solarNoon`            | luxon.DateTime  | The datetime corresponding to solar noon on this date |
| `start`                | luxon.DateTime  | The datetime corresponding to the start of this date |
| `sunrise`              | luxon.DateTime  | The datetime corresponding to sunrise on this date |
| `timezoneId`           | string          | The IANA timezone id for the timezone of this date |

## Localization

The output of Badí' dates fully supports localization and a number of different localizations are provided.
Data is stored in `src/locale/`.

Note that entries with letters that should be underlined will be stored in the respective locale file by wrapping the letters
in question in underscores, like e.g. `Ma_sh_íyyat` or `_Sh_araf`.

### Language Fallbacks

Date formatting is subject to a series of language fallbacks if a given component is not available in the selected language.
The maximum possible fallback sequence is

```
IETF language tag (regional variant) -> IETF language tag (primary language) -> configured default language -> English
```

Hence if e.g. French was set as the default language and a BadiDate was formatted using the language tag 'pt-br' (Portuguese
(Brazil)), for each date component in the output, the formatter will attempt to use the Brazilian Portuguese entry; if this
is not available, the Portuguese entry; if this is not available the French entry; and if this is not available the English entry.

### Contributing a Locale

Follow these steps if you wish to add a locale to the module:
1. Copy the file `src/locale/en.ts` to `src/locale/{languagecode}.js` where `{languagecode}` is the IETF language code of the
language you wish to contribute.
2. Replace all the strings that differ from the English version, **delete all that do not**, these will be taken care of
by the fallback. Don't forget to also remove entries that no longer exist above from the export statement.
3. Add the appropriate lines for your language to `src/badiLocale.ts`. Note that for regional variants, the variable names
need to use an underscore instead of a hyphen.
4. Add the appropriate entr(y/ies) to `localeRegex` in `rollup.config.js`. Note that for regional variants, entries with
both hyphen and underscore are required.

### Bundles With Custom Locale Sets

`rollup.config.js` is set up to allow bundling custom sets of languages if desired. For this, simply pass an array of
locale strings to `rollupConfig()` and set the filename with the optional `filename` parameter. Note that for regional
variants, entries with both hyphen and underscore are required.

## Locations for Which Fixed Times are Used

The following locations use fixed times rather than actual sunrise, sunset, etc. for purposes of the Badí' calendar. The module determines
the appropriate region by checking whether the given coordinates lie within polygons that are included in the code. Slight inaccuracies
near borders are possible since the polygons had to be simplified for performance and size reasons. Over water, boundaries are drawn very
roughly to reduce vertex count and no attempt was made to capture to boundary to international waters.

The groups of three times given below correspond to sunrise, solar noon, and sunset.

*   **Canada**: 06:30, 12:00, 18:00 above 60°N latitude.
*   **Finland**: 06:00, 12:00, 18:00 local standard time (i.e. 07:00, 13:00, 19:00 in local time when DST is in effect), **except** for the
month of \`Alá´, where the actual times for sunrise, solar noon, and sunset are used.
*   **Iceland**: 06:00, 13:00, 18:00.
*   **Norway**: 06:00, 12:00, 18:00.
*   **Sweden**: 06:00, 12:00, 18:00 in Norrland (i.e. Lapland, Norrbotten, Västerbotten, Jämtland, Ångermanland, Medelpad, Härjedalen,
Hälsingland, and Gästriksland)
*   **USA**: 06:00, 12:00, 18:00 local standard time (i.e. 07:00, 13:00, 19:00 in local time when DST is in effect) **in Alaska**.

## The Source Data

The list of equinox times used can be found in `res/equinoxes.ts`. The BadiDate class itself contains data for every year from 172 to
the end of the range, specifically the date of Naw-Rúz, the length of Ayyám-i-Há, and the dates of the Twin Birthdays.
The data can be generated in two formats via `npm run generateYearData`, long and short format The short format is the one used by default
in the BadiDate class. Every year is represented by a 4 character string in base36 encoding where the first character indicates the day
in March on which the end of Naw-Rúz falls, the second character the length of Ayyám-i-Há, and the third and fourth character the Badí'
month and day respectively on which the Birth of the Báb falls. This data is then internally unpacked into the long format as needed,
though it is also possible to replace the short format data in `badiDate.ts` with the long format without any additional changes (though
this appears to make the handling of the object slightly slower (and of course increases the file size significantly.
An item in the long format looks as follows:

```js
172: {
    ayyamiHaLength: 4,
    nawRuz: '2015-03-21',
    twinBirthdays: [13, 10, 13, 11],
},
```
