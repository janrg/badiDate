Badí' Date
============

[![MIT License][license-image]][license-url]

A JavaScript module for dates in the Badí' calendar. Badí' date objects can be created from Gregorian or Badí' dates in
a variety of input formats. The currently handled range of dates is from 1 Bahá 1 BE (21 March 1844) to 19 'Alá' 556 BE
(19 Mach 2400). Badí' dates are treated as if corresponding exactly to Gregorian dates (i.e. starting at midnight), but
with the provided wrapper <code>localBadiDate()</code>, local information can be generated incl. the start and end date
and time of the Badí' date, the times for sunrise and solar noon, as well as - if applicable - the time for a Holy Day
commemoration.

## Dependencies

badiDate requires [Moment.js](http://momentjs.com/). In order to use the <code>localBadiDate()</code> wrapper function,
[Moment Timezone](http://momentjs.com/timezone/) and [MeeusSunMoon](https://github.com/janrg/MeeusSunMoon) are also required

## [Documentation](DOCUMENTATION.md)

## Files

The following files make up the badiDate module:

* **badiLocale.js** - localization data
* **badiDate.js** - the main badiDate class
* **localBadiDate.js** - the wrapper function for local Badí' dates

Minified versions are also provided in <code>min/</code>

## Accuracy

Accuracies of solar and lunar calculations are given by [MeeusSunMoon](https://github.com/janrg/MeeusSunMoon).

The accuracy of the calculation of the date of Naw-Rúz and the dates of the Twin Birthdays depend on those as well as that
of the equinox calculations, which are immensely complex. Equinox dates until 2200 are calculated with an algorithm using
the [JPL DE405 Ephemeris](https://en.wikipedia.org/wiki/Jet_Propulsion_Laboratory_Development_Ephemeris), and from 2200 to
2400 with an algorithm using the [VSOP87 Ephemeris](https://en.wikipedia.org/wiki/VSOP_(planets)#VSOP87), which is slightly
less accurate, but only on the order of a few seconds.

There are 3 years between 2015 and 2400 where the northward equinox is such, that the date of Naw-Rúz is somewhat uncertain:
* In 2026, the difference between the equinox and sunset in Tehran is only about 20 seconds, but an override has been inserted
  to ensure conformity with the list of dates for the next 50 years published by the Bahá'í World Center
* In 2059 and 2385, the differences are 2 and 3 minutes respectively, which should be well above the uncertainty of the algorithms

There are no years in the next 1000 years where a new moon is close enough to the end of the day of Naw-Rúz to question the count
of eight new moons after Naw-Rúz

There are 5 years between 2015 and 2400 where the eighth new moon after Naw-Rúz is closer than 5 minutes to the time of sunset in
Tehran on the date (2176, 2245, 2267, 2339, 2372), but in no case is the difference less than 2.5 minutes, which again should be
well above the uncertainty of the algorithms.

## Changelog

### 1.0.0

Initial release

### 1.0.1

Added Persian(Farsi) Localization

## License

badiDate is freely distributable under the terms of the [MIT license](LICENSE).

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
