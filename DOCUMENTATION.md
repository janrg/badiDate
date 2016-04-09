badiDate - Documentation
============================

## Dependencies

badiDate requires [Moment.js](http://momentjs.com/). In order to use the <code>localBadiDate()</code> wrapper function,
[Moment Timezone](http://momentjs.com/timezone/) and [MeeusSunMoon](https://github.com/jan-r-g/MeeusSunMoon) are also required

## How it works

The badiDate object represents a Badí' date with some simplifications in order to make it independent of location
(for local Badí' dates, a wrapper function, <code>localBadiDate()</code> exists, see below), namely

* Badí' dates are taken to correspond to Gregorian dates 1-1, i.e. to start at midnight
* No other times (e.g. for Holy Day commemorations) are stored

For dates in 172 BE and after (21 March 2015 and after), the new implementation is used to calculate the beginning
of the year, all Holy Days, and the length of Ayyám-i-Há, for earlier dates the earlier implementation, where for the
Twin Birthdays, the earlier implementation as customary in countries predominantly using the Gregorian calendar (i.e.
5 'Ilm and 9 Qudrat) is used.

## Creating a badiDate Object

There are a number of different ways, in which a badiDate object can be created:

### From a moment or Date object

    var myMoment = moment("2015-03-21");
    var myBadiDate1 = new badiDate(myMoment);
    
    var myDate = new Date("2015-03-21");
    var myBadiDate2 = new badiDate(myDate);

Sets the Badí' date from the Gregorian date given by the moment or Date object. Any time or timezone information
is ignored.

### From an ISO 8601 string

    var myBadiDate = new badiDate("2015-03-21");

Sets the Badí' date from the Gregorian date given by the string. Handling of malformed strings is attempted by
passing them through the JS Date object, but can lead to unpredictable results. Any time or timezone information
is ignored.

### From a Badí' date string or array

    var myBadiDate1 = new badiDate("172-1-1")
    var myBadiDate2 = new badiDate("172-1");
    var myBadiDate3 = new badiDate([172, 1, 1]);
    var myBadiDate4 = new badiDate([172, 1]);

Sets the Badí' date from the given string or array. Arguments can either be in the format <code>"Y-M-D"</code>,
<code>[Y, M, D]</code> or <code>"Y-HD"</code>, <code>[Y, HD]</code> where Y, M, D, and HD are integers and stand for
Badí' year, Badí' month, Badí' day, and Holy Day respectively. Badí' year can range from 1 to currently 556, Badí
month from 1 to 20 (20 is used to represent Ayyám-i-Há throughout this module), Badí' day from 1 to 19 (except if
the month is 20 in which case it is from 1 to 5, a value of 5 in a year with 365 days bubbles up to 1 'Alá' automatically),
and Holy Day from 1 to 11 (corresponding to Naw-Rúz, First Day of Riḍván, Ninth Day of Riḍván, Twelfth Day of Riḍván,
Declaration of the Báb, Ascension of Bahá'u'lláh, Martyrdom of the Báb, Birth of the Báb, Birth of Bahá'u'lláh, Day of
the Covenant, Ascension of 'Abdu'l-Bahá).

## Localization

The output of Badí' dates fully supports localization and a number of different localizations are provided (this will increase
in the future). Data is stored in <code>badiLocale.js</code> and at least the English localization is **required** if output in
anything other than numbers is desired. All other localizations inherit from English, so even if you don't wish to use the English
output, including the data is necessary.
To add additional languages, a dummy datastructure is provided in <code>res/badiLocaleTemplate</code>. Any segments that don't differ
from English (e.g. <code>month</code> data in all languages using roman letters) should be removed and will inherit from English.

## Getters

The following getters exist (note that badiDate objects are immutable, so there are no setters):

    badiDate.isValid()

<code>true</code> if the Badí' date is valid, <code>false</code> if not (e.g. if the date was out of the range which can be
handled or if a malformed string was used to create it).

    badiDate.badiDay()

The day of the Badí' month, 1-19

    badiDate.badiMonth()

The Badí' month, 1-20, 20 stands for Ayyám-i-Há

    badiDate.badiYear()

The Badí' Year

    badiDate.badiWeekday()

The Badí' Weekday, 1-7, corresponding to Jalál (Saturday) to Istiqlál (Friday)

    badiDate.yearInVahid()

Number of the Badí' Year in the Váḥid, 1-19

    badiDate.vahid()

Number of the Váḥid in the Kull-i-Shay’

    badiDate.killIShay()

Number of the Kull-i-Shay', starts at 1

    badiDate.ayyamiHaLength()

Length of Ayyám-i-Há in the Badí' year the date is in, 4/5

    badiDate.gregDate()

Corresponding Gregorian date as a moment object

    badiDate.holyDayNumber()

Number corresponding to a Holy Day (see above), 1-11 or false

    badiDate.getHolyDay(language)

The name of the Holy Day in the language given, or false. If the the language parameter is omitted or the given
language does not exist in <code>badiLocale</code>, this defaults to English. 

    badiDate.format(formatString, language)

Outputs the date in the format as given by formatString and in the given language. Defaults to English as above.
The following tokens are replaced in <code>formatString</code>:

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
| **BE**            | BE    | localized version of BE to indicate a Badí' year

If no formatting string is given, <code>format()</code> defaults to <code>"d MM+ y BE</code>. E.g.

    var myBadiDate = new badiDate([172, 1, 1]);
    console.log(myBadiDate.format());

will print

    1 Bahá (Splendour) 172 BE

Any text in the formatting string wrapped in <code>{}</code> will not be parsed and output as-is.
A <code>{</code> without matching <code>}</code> will result in a return value of <code>"Invalid input"</code>.

## Local Badí' Dates

<code>localBadiDate()</code> creates a wrapper object for a <code>badiDate</code> that is valid for a specific location.
This object contains the badiDate object, as well as moment objects for the start and end of the Badí' date as well as
sunrise, solar noon, and - if applicable - the time for commemoration of the Holy Day.

It requires the modules [Moment Timezone](http://momentjs.com/timezone/) and [MeeusSunMoon](https://github.com/jan-r-g/MeeusSunMoon).

A local Badí' date object is created with

    localBadiDate(date, latitude, longitude, timezoneId)

where <code>date</code> accepts the same input formats as <code>badiDate()</code>, <code>latitude</code> and <code>longitude</code>
are the geographic latitude and longitude (-90 to 90, -180 to 180, north and east are positive) and <code>timezoneId</code>
is an IANA timezone string, e.g. <code>"Europe/London"</code>

All input formats for <code>date</code> **except for a moment object** are treated the same as in the <code>badiDate()</code>
constructor. For a moment object, the time of day is taken into consideration and if appropriate, the Badí' day shifted forward
by a day. If this is not desired, make sure to assign an early time, that will definitely not be after sunset, to the moment
object before invoking <code>localBadiDate()</code>.

The properties of the object created by <code>localBadiDate()</code> can be retrieved via

    localBadiDate.badiDate
    localBadiDate.dateStart
    localBadiDate.dateEnd
    localBadiDate.dateSunrise
    localBadiDate.dateSolarNoon
    localBadiDate.holyDayCommemoration

## The Source Data

The list of equinox times used can be found in <code>res/equinoxes.js</code>. The badiDate class itself contains data for every
year from 172 to the end of the range, specifically the date of Naw-Rúz, the length of Ayyám-i-Há, and the dates of the Twin Birthdays.
The data can be generated in two formats on <code>res/generateYears.html</code>, long and short format. The short format is the one
used by default in the badiDate class. Every year is represented by a 4 character string in base36 encoding where the first character
indicates the day in March on which the end of Naw-Rúz falls, the second character the length of Ayyám-i-Há, and the third and fourth
character the Badí' month and day respectively on which the Birth of the Báb falls. This data is then internally unpacked into the long
format as needed, though it is also possible to replace the short format data in badiDate.js with the long format without any additional
changes (though this appears to make the handling of the object slightly slower (and of course increases the file size significantly.
An item in the long format looks as follows:

    172: {
      NR: "2015-03-21",
      aHL: 4,
      TB: [13,10,13,11]
    },

## Tests

QUnit tests exist for the core functionality of badiDate, and can be found in <code>test/</code> The first set of tests compares the Naw-Rúz
dates, lengths of Ayyám-i-Há, and dates of the Twin Birthdays for years 172-221 with those in the list published by the Bahá'í World Center.
The second set checks internal consistency by running 1000 random dates through various constructor formats supported by badiDate and verifying
that the dates before and after are identical.
