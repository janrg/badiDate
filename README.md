# Badí' Date

[![MIT License][license-image]][license-url]

A JavaScript module for dates in the Badí' calendar. Badí' date objects can be created from Gregorian or Badí' dates in
a variety of input formats. The currently handled range of dates is from 1 Bahá 1 BE (21 March 1844) to 19 'Alá' 556 BE
(19 Mach 2400). Badí' dates are treated as if corresponding exactly to Gregorian dates (i.e. starting at midnight), but
with the provided `LocalBadiDate` class, local information can be generated incl. the start and end date
and time of the Badí' date, the times for sunrise and solar noon, as well as - if applicable - the time for a Holy Day
commemoration.

## Dependencies

badiDate requires [Luxon](https://moment.github.io/luxon/). In order to use the `LocalBadiDate` class,
[MeeusSunMoon](https://github.com/janrg/MeeusSunMoon) (v3.0.0+) is also required. Versions that bundle MeeusSunMoon are
included.

## [Documentation](DOCUMENTATION.md)

## Accuracy

Accuracies of solar and lunar calculations are given by [MeeusSunMoon](https://github.com/janrg/MeeusSunMoon).

The accuracy of the calculation of the date of Naw-Rúz and the dates of the Twin Birthdays depend on those as well as that
of the equinox calculations, which are immensely complex. Equinox dates until 2200 are calculated with an algorithm using
the [JPL DE405 Ephemeris](https://en.wikipedia.org/wiki/Jet_Propulsion_Laboratory_Development_Ephemeris), and from 2200 onwards
with an algorithm using the [VSOP87 Ephemeris](https://en.wikipedia.org/wiki/VSOP_(planets)#VSOP87), which is slightly less
accurate, but only on the order of a few seconds.

The main source of uncertainty for far future dates comes from the uncertainty on [ΔT](https://en.wikipedia.org/wiki/%CE%94T).
A detailed analysis of uncertainties is included in the code. The range of dates is limited to until 20 March 2351, as the
uncertainty in ΔT means the date of Naw-Rúz 2352 AD produced by the algorithm may not be correct.

## Changelog

### 3.0.0

- Switched to using Luxon instead of moment-timezone.
- Changed all accessors to `get()` attributes
- Added the properties `invalidReason`, `nextDay`, `nextMonth`, `previousDay`, `previousMonth` to the BadiDate class
- Added the `equals()` method to the `BadiDate` class
- Added the properties `clockLocation`, `latitude`, `longitude`, `nextDay`, `nextMonth`, `previousDay`, `previousMonth`,
`timezoneId` to the `LocalBadiDate` class
- Some bugfixes

###### Breaking Changes:
- Inputs and outputs are now Luxon DateTime objects instead of moment objects
- Arrays and date strings can no longer be used in the constructors.
- Browser support for browsers not supported by Luxon dropped. Any reasonably modern
  browser will work. No version of IE is supported.
- Changed all accessors to `get()` attributes


### 2.1.0

*   Added several new tokens to `BadiDate.format()`
*   More robust handling of locale entries with underlined letters
*   Improvements to handling of Arabic and Farsi locales

### 2.0.0

Refactored into ES6 modules and distributed via node. **This version is incompatible with previous versions of the module.**

### 1.1.0

Fixed some output formatting, added uncertainty analysis for far future dates and based on this reduced the range of dates slightly
(now ends in 507 BE), added Persian localization (thanks to arminhaghi).

### 1.0.0

Initial release

## License

badiDate is freely distributable under the terms of the [MIT license](LICENSE).

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
