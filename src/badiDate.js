/**
 * @license badiDate v1.0.0
 * (c) 2016 Jan Greis
 * licensed under MIT
 */
 
function badiDate(date) {
  if (!(this instanceof badiDate)) {
    return new badiDate(date);
  }
  var gregDate;
  var badiYear = 0;
  var badiMonth = 0;
  var badiDay = 0;
  var nawRuz;
  var yearData;
  var ayyamiHaLength = 0;
  var holyDay = false;
  var valid = true;
  // Encodes the day of Naw-Rúz, the length of Ayyám-i-Há, and the Badí' month and
  // day of the Birth of the Báb in base36. A more verbose version can be substituted
  // in from badiYearsLongFormat.js without any additional changes required (though
  // this does apparently slow down the object creation by about a factor of 2)
  var badiYears = [
    "l4da", "k4ci", "k5c7", "l4d6", "l4ce", "k4c4", "k5d4", "l4cb", "l4c1", "k4cj",
    "k5c8", "l4d7", "l4cf", "k4c5", "k4d5", "k5ce", "l4c2", "k4d2", "k4ca", "k5da",
    "l4ch", "k4c6", "k4d6", "k5cf", "l4c4", "k4d4", "k4cc", "k5c1", "l4cj", "k4c8",
    "k4d8", "k5cg", "l4c5", "k4d5", "k4ce", "k5c3", "l4d2", "k4ca", "k4d9", "k5ci",
    "l4c6", "k4d6", "k4cf", "k4c4", "k5d4", "k4cb", "k4bj", "k4cj", "k5c9", "k4d8",
    "k4cg", "k4c6", "k5d6", "k4cd", "k4c2", "k4d2", "k5ca", "k4d9", "k4ci", "k4c7",
    "k5d7", "k4cf", "k4c4", "k4d4", "k5cc", "k4bj", "k4cj", "k4c9", "k5d9", "k4cg",
    "k4c6", "k4d5", "k5cd", "k4c2", "k4d1", "k4ca", "k4da", "j5cj", "k4c7", "k4d7",
    "k4cf", "j5c4", "k4d3", "k4cb", "k4c1", "k5d1", "l4c9", "l4d9", "l4ch", "k5c6",
    "l4d5", "l4cd", "l4c2", "k5d2", "l4ca", "l4da", "l4cj", "k5c8", "l4d7", "l4cf",
    "l4c4", "k5d4", "l4cb", "l4c1", "l4d1", "k5c9", "l4d8", "l4cg", "l4c5", "k4d5",
    "k5ce", "l4c2", "l4d2", "k4cb", "k5db", "l4ci", "l4c7", "k4d7", "k5cf", "l4c4",
    "l4d4", "k4cc", "k5c2", "l4d1", "l4c9", "k4d9", "k5ch", "l4c5", "l4d5", "k4ce",
    "k5c3", "l4d2", "l4cb", "k4da", "k5ci", "l4c6", "l4d6", "k4cf", "k5c5", "l4d4",
    "l4cc", "k4c1", "k4d1", "k5c9", "l4d8", "k4cg", "k4c6", "k5d6", "l4ce", "k4c3",
    "k4d3", "k5cb", "l4da", "k4ci", "k4c7", "k5d7", "l4cf", "k4c5", "k4d5", "k5cd",
    "l4c1", "k4cj", "k4c9", "k5d9", "l4cg", "k4c6", "k4d6", "k5ce", "l4c3", "k4d2",
    "k4ca", "k5bj", "l4ci", "k4c7", "k4d7", "k4cg", "k5c5", "k4d4", "k4cc", "k4c1",
    "k5d1", "k4c9", "k4d9", "k4ch", "k5c7", "l4d6", "l4ce", "l4c3", "l5d3", "l4ca",
    "l4da", "l4cj", "l5c8", "l4d7", "l4cg", "l4c5", "l5d4", "l4cb", "l4c1", "l4d1",
    "l5ca", "l4d9", "l4ch", "l4c6", "l5d6", "l4cd", "l4c2", "l4d2", "l4cb", "k5c1",
    "l4cj", "l4c8", "l4d8", "k5cg", "l4c4", "l4d4", "l4cc", "k5c2", "l4d1", "l4ca",
    "l4da", "k5ci", "l4c6", "l4d5", "l4ce", "k5c3", "l4d2", "l4cb", "l4db", "k5cj",
    "l4c8", "l4d7", "l4cf", "k5c5", "l4d4", "l4cc", "l4c2", "k5d2", "l4c9", "l4d9",
    "l4ch", "k4c6", "k5d6", "l4ce", "l4c3", "k4d3", "k5cc", "l4db", "l4cj", "k4c8",
    "k5d8", "l4cf", "l4c4", "k4d5", "k5cd", "l4c2", "l4d2", "k4ca", "k5d9", "l4cg",
    "l4c6", "k4d6", "k5cf", "l4c3", "l4d3", "k4cb", "k5bj", "l4ci", "l4c7", "k4d7",
    "k5cg", "l4c5", "l4d5", "k4cd", "k4c2", "k5d2", "l4c9", "k4d9", "k4ch", "k5c7",
    "l4d6", "k4cf", "k4c4", "k5d4", "l4cb", "l4bj", "l4cj", "l5c8", "m4d7", "l4cg",
    "l4c5", "l5d5", "m4cc", "l4c1", "l4d1", "l5ca", "m4d9", "l4ch", "l4c7", "l5d7",
    "m4ce", "l4c3", "l4d3", "l5cb", "m4bi", "l4ci", "l4c8", "l4d8", "l5ch", "l4c5",
    "l4d5", "l4cd", "l5c2", "l4d1", "l4c9", "l4da", "l5ci", "l4c7", "l4d7", "l4cf",
    "l5c4", "l4d2", "l4cb", "l4bj", "l5d1", "l4c8", "l4d8", "l4cg", "l5c5", "l4d4",
    "l4cc", "l4c2", "l5d2", "l4c9", "l4da", "l4ci", "l5c7", "l4d6", "l4ce", "l4c3",
    "l4d3", "k5cc", "l4bj", "l4cj", "l4c9", "k5d9", "l4cg", "l4c5", "l4d5", "k5cd",
    "l4c2", "l4d2", "l4ca", "k5da", "l4ch", "l4c6", "l4d6", "k5ce", "l4c3", "l4d3",
    "l4cc", "k5c1", "l4cj", "l4c8", "l4d8", "k5cg", "l4c4", "l4d4", "l4cd", "k4c3",
    "k5d3", "l4ca", "l4da", "k4ci", "k5c7", "l4d6", "l4ce", "k4c4", "k5d4", "l4cc",
    "l4c1", "k4d1", "k5c9", "l4d7", "l4cg"];
  // This is only to make code below more human-readable
  var holyDaysEnum = {
    nawRuz: 1,
    firstDayOfRidvan: 2,
    ninthDayOfRidvan: 3,
    twelfthDayOfRidvan: 4,
    declarationOfTheBab: 5,
    ascensionOfBahaullah: 6,
    martyrdomOfTheBab: 7,
    birthOfTheBab: 8,
    birthOfBahaullah: 9,
    dayOfTheCovenant: 10,
    ascensionOfAbdulBaha: 11
  };
  // The ranges of dates (Gregorian and Badí') for which a badiDate will work
  // lower limit the beginning of the calendar, upper limit given by the range
  // of years we have stored in the badiYears variable.
  var validRangeGreg = [moment.utc("1844-03-21"), moment.utc("2400-03-20")];
  var validRangeBadi = [1, 556];
  // badiDate accepts a number of different arguments for instantiation, JS Date object,
  // moment object, ISO 8601 date string, Badí' date string in the format "year-month-day"
  // or "year-holyDayNumber", and array in the format [year, month, day] or [year, holyDayNumber]
  // where holyDayNumber follows the pattern given in holyDaysEnum.
  if (date instanceof Date) {
    gregDate = moment.utc([date.getFullYear(), date.getMonth(), date.getDate(), 12]);
  } else if (date instanceof moment) {
    gregDate = moment.utc([date.year(), date.month(), date.date(), 12]);
  } else if (typeof date === "string") {
    // Check if the input was a Badí' date string
    var dateArray = isValidBadiDate(date);
    if (dateArray) {
      setFromBadiDate(dateArray);
    } else { // Looks like the input was a gregorian datestring
      // Use this step to attempt handling a malformed string which moment complains about
      // but Date just works with as best as it can
      var tempDate = new Date(date);
      gregDate = moment.utc([tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 12]);
      // Check if it's before 1 BE or after 356 BE (which we can't handle)
      if (gregDate.isBefore(validRangeGreg[0]) || gregDate.isAfter(validRangeGreg[1])) {
        setInvalid();
      }
    }
  } else if (date instanceof Array) {
    if (date.length !== 3 && date.length !== 2) {
      setInvalid();
    } else {
      setFromBadiDate(date);
    }
  }
  if (badiYear === 0) { // We haven't yet set the Badí' date above
    setFromGregorianDate();
  }
  if (valid) {
    setHolyDay();
  }
  
  // Unpack the condensed, base36 information about Naw-Rúz, the length of Ayyám-i-Há,
  // and the Twin Birthdays to an object like that provided by the verbose version of the
  // date information
  function unpackYear(badiYear) {
    var yearData;
    // Check whether the data needs to be unpacked or exists in the verbose version
    if (badiYears[0] === "l4da") {
      var dataString = badiYears[badiYear - 172];
      var components = dataString.split("");
      var dateString = String(badiYear - 172 + 2015) + "-03-" + String(parseInt(components[0], 36));
      var ayyamiHaLength = parseInt(components[1], 36);
      var TB1 = [parseInt(components[2], 36), parseInt(components[3], 36)];
      var TB2 = TB1[1] < 19 ? [TB1[0], TB1[1] + 1] : [TB1[0] + 1, 1];
      yearData = {
        NR: dateString,
        aHL: ayyamiHaLength,
        TB: [TB1[0], TB1[1], TB2[0], TB2[1]]
      };
    }
    else {
      yearData = badiYears[badiYear];
    }
    return yearData;
  }

  // Use this if the input was a Gregorian date of whatever form
  function setFromGregorianDate() {
    // Check if it's before 1 BE or after 356 BE (which we can't handle)
    if (gregDate.isBefore(validRangeGreg[0]) || gregDate.isAfter(validRangeGreg[1])) {
      setInvalid();
    } else {
      var gregYear = gregDate.year();
      // Old implementation for days before Naw-Rúz 172
      if (gregDate.isBefore(moment.utc('2015-03-21'))) {
        if (gregDate.isBefore(gregYear + '-03-21')) {
          nawRuz = moment.utc((gregYear -1).toString() + '-03-21');
          badiYear = gregYear - 1844;
        } else {
          nawRuz = moment.utc(gregYear.toString() + '-03-21');
          badiYear = gregYear - 1843;
        }
        ayyamiHaLength = oldAyyamiHaLength(nawRuz);
      // New implementation
      } else {
        yearData = unpackYear(gregYear - 1843);
        if (gregDate.isBefore(moment.utc(yearData.NR))) {
          yearData = unpackYear(gregYear - 1844);
          badiYear = gregYear - 1844;
        } else {
          badiYear = gregYear - 1843;
        }
        nawRuz = moment.utc(yearData.NR);
        ayyamiHaLength = yearData.aHL;
      }
      // Now need to get Badí' month and date from the gregorian date
      var monthDay = badiMonthDay();
      badiMonth = monthDay[0];
      badiDay = monthDay[1];
    }
  }

  // Use this if the input was a Badí' date of whatever form (incl. year, holyDayNumber)
  function setFromBadiDate(dateArray) {
    badiYear = parseInt(dateArray[0]);
    // Are we in the valid range?
    if (badiYear < validRangeBadi[0] || badiYear > validRangeBadi[1]) {
      setInvalid();
      return;
    } else if (badiYear < 172) { // Old implementation
      nawRuz = moment.utc([1843 + badiYear, 2, 21]); // months are zero-indexed in moment
      ayyamiHaLength = oldAyyamiHaLength(nawRuz);
    } else { // New implementation
      yearData = unpackYear(badiYear);
      nawRuz = moment.utc(yearData.NR);
      ayyamiHaLength = yearData.aHL;
    }
    // If date[2] is not empty, we are setting from an actual date
    if (date[2] !== undefined) {
      badiMonth = parseInt(dateArray[1]);
      badiDay = parseInt(dateArray[2]);
      if (badiMonth === 20 && badiDay > ayyamiHaLength) {
        // If only off by one day, we'll bubble up so that 5th Ayyám-i-Há in a year with
        // only 4 days of Ayyám-i-Há can be salvaged
        if (badiDay - ayyamiHaLength === 1) {
          badiMonth = 19;
          badiDay = 1;
        } else {
          setInvalid();
        }
      }
    } else { // Input designates a Holy Day
      dateArray[1] = parseInt(dateArray[1]);
      switch(dateArray[1]) {
        case 1: // Naw-Rúz
          badiMonth = 1;
          badiDay = 1;
          break;
        case 2: // First Day of Ridván
          badiMonth = 2;
          badiDay = 13;
          break;
        case 3: // Ninth Day of Ridván
          badiMonth = 3;
          badiDay = 2;
          break;
        case 4: // Twelfth Day of Ridván
          badiMonth = 3;
          badiDay = 5;
          break;
        case 5: // Declaration of the Báb
          badiMonth = 4;
          badiDay = 8;
          // Date was different in old implementation
          if (badiYear < 172) {
            badiDay = 7;
          }
          break;
        case 6: // Ascension of Bahá'u'lláh
          badiMonth = 4;
          badiDay = 13;
          break;
        case 7: // Martyrdom of the Báb
          badiMonth = 6;
          badiDay = 17;
          // Date was different in old implementation
          if (badiYear < 172) {
            badiDay = 16;
          }
          break;
        case 8: // Birth of the Báb
          // fixed in old, variable in new implementation
          if (badiYear < 172) {
            badiMonth = 12;
            badiDay = 5;
          } else {
            badiMonth = yearData.TB[0];
            badiDay = yearData.TB[1];
          }
          break;
        case 9: // Birth of Bahá'u'lláh
          // fixed in old, variable in new implementation
          if (badiYear < 172) {
            badiMonth = 13;
            badiDay = 9;
          } else {
            badiMonth = yearData.TB[2];
            badiDay = yearData.TB[3];
          }
          break;
        case 10: // Day of the Covenant
          badiMonth = 14;
          badiDay = 4;
          break;
        case 11: // Ascension of 'Abdu'l-Bahá
          badiMonth = 14;
          badiDay = 6;
          break;
        default:
          setInvalid();
          return;
      }
    }
    // Finally we set the Gregorian date for this Badí' date
    var dayOfGregYear = nawRuz.diff(moment.utc([badiYear + 1843]), 'days') + dayOfYear("badi");
    gregDate = moment.utc([badiYear + 1843]);
    gregDate.dayOfYear(dayOfGregYear); // Bubbles up to next year if necessary
    gregDate.hour(12);
  }

  // If the date is a Holy Day, we assign it here
  function setHolyDay() {
    // first the dates that haven't changed with the new implementation
    if (badiMonth === 1 && badiDay === 1) {
      holyDay = holyDaysEnum.nawRuz;
    } else if (badiMonth === 2 && badiDay === 13) {
      holyDay = holyDaysEnum.firstDayOfRidvan;
    } else if (badiMonth === 3 && badiDay === 2) {
      holyDay = holyDaysEnum.ninthDayOfRidvan;
    } else if (badiMonth === 3 && badiDay === 5) {
      holyDay = holyDaysEnum.twelfthDayOfRidvan;
    } else if (badiMonth === 4 && badiDay === 13) {
      holyDay = holyDaysEnum.ascensionOfBahaullah;
    } else if (badiMonth === 14 && badiDay === 4) {
      holyDay = holyDaysEnum.dayOfTheCovenant;
    } else if (badiMonth === 14 && badiDay === 6) {
      holyDay = holyDaysEnum.ascensionOfAbdulBaha;
    }

    // Now for the old implementation
    if (badiYear < 172) {
      if (badiMonth === 4 && badiDay === 7) {
        holyDay = holyDaysEnum.declarationOfTheBab;
      } else if (badiMonth === 6 && badiDay === 16) {
        holyDay = holyDaysEnum.martyrdomOfTheBab;
      } else if (badiMonth === 12 && badiDay === 5) {
        holyDay = holyDaysEnum.birthOfTheBab;
      } else if (badiMonth === 13 && badiDay === 9) {
        holyDay = holyDaysEnum.birthOfBahaullah;
      }
    } else { // And the new implementation
      if (badiMonth === 4 && badiDay === 8) {
        holyDay = holyDaysEnum.declarationOfTheBab;
      } else if (badiMonth === 6 && badiDay === 17) {
        holyDay = holyDaysEnum.martyrdomOfTheBab;
      } else if (badiMonth === yearData.TB[0] && badiDay === yearData.TB[1]) {
        holyDay = holyDaysEnum.birthOfTheBab;
      } else if (badiMonth === yearData.TB[2] && badiDay === yearData.TB[3]) {
        holyDay = holyDaysEnum.birthOfBahaullah;
      }
    }
  }



  // Gets the day of the Gregorian or Badí' year (the first day of the year is "1")
  // "badi" to get the day in the Badí year based on badiMonth and badiDay
  // "nawRuz" to get the day of gregDate in the Badí year
  // "greg" to get the day of gregDate in the Gregorian year 
  function dayOfYear(type) {
    var numDays = 0;
    if (type === "badi") {
      if (badiMonth < 19) {
        numDays = 19*(badiMonth - 1) + badiDay;
      } else if (badiMonth === 20) {
        numDays = 342 + badiDay;
      } else {
        numDays = 342 + ayyamiHaLength + badiDay;
      }
    } else if (type === "nawRuz") {
      numDays = gregDate.diff(nawRuz, "days") + 1;
    } else if (type === "greg") {
      numDays = gregDate.dayOfYear();
    }
    return numDays;
  }

  // Calculate the Badí' month and day when the Gregorian date has been set
  function badiMonthDay() {
    var dayOfBadiYear = dayOfYear("nawRuz");
    if (dayOfBadiYear < 343) {
      return [Math.floor((dayOfBadiYear - 1)/19 + 1), (dayOfBadiYear - 1)%19 + 1];
    }
    if (dayOfBadiYear < 343 + ayyamiHaLength) {
      return [20, dayOfBadiYear - 342];
    }
    return [19, dayOfBadiYear - (342 + ayyamiHaLength)];
  }

  // Set the member variables to invalid values
  function setInvalid() {
    gregDate = moment.utc({'year': 0, 'month': 0, 'date': 0});
    badiYear = -1;
    badiMonth = -1;
    badiDay = -1;
    ayyamiHaLength = -1;
    nawRuz = moment.utc('0000-00-00');
    valid = false;
  }

  // Check whether a string supplied to the constructor describes a valid Badí' date
  function isValidBadiDate(badiDate) {
    var dateComponents = badiDate.split("-");
    // Are all components numerical
    for (var i = 0; i < dateComponents.length; i++) {
      if (!(/^\d+$/.test(dateComponents[i]))) {
        return false;
      }
      dateComponents[i] = parseInt(dateComponents[i]);
    }
    // If only two numbers are supplied, the second designates a Holy Day and must be between 1 and 11
    if (dateComponents.length !== 3) {
      if (dateComponents.length === 2 && dateComponents[1] > 0 && dateComponents[1] < 12) {
        return dateComponents;
      }
      return false;
    }
    // Are the month and day numbers in sensible ranges?
    // We call Ayyám-i-Há month 20
    if (dateComponents[1] > 20 || dateComponents[1] < 1) {
      return false;
    }
    if (dateComponents[2] > 19 || dateComponents[2] < 1) {
      return false;
    }
    return dateComponents;
  }

  // Calculate the length of Ayyám-i-Há for a year before 172 BE
  function oldAyyamiHaLength(nawRuzDate) {
    if (moment([nawRuzDate.year() + 1]).isLeapYear()) {
      ayyamiHaLength = 5;
    } else {
      ayyamiHaLength = 4;
    }
    return ayyamiHaLength;
  }

  /* The format() function of badiDate
   * The following tokens are accepted:
   * d - day of month without leading zeroes
   * dd - day of month with leading zeroes
   * D - day of month as 3-letter (+ apostrophes) abbreviation of transliteration
   * DD - full day of month transliteration
   * DDL - full day of month translation
   * DD+ - full day of month transliteration (translation)
   * m, mm, M, MM, MML, MM+ - same as days
   * ww - day of week, two letter abbreviation (Jl, Jm, Ka, Fi, 'Id, Ij, Iq)
   * W - day of week, 3 letter abbreviation (Jal, Jam, Kam, Fiḍ, 'Idá, Isj, Isq)
   * WW - day of week, full name
   * WWL - day of week, full name translation
   * yv - year in vahid without leading zeroes
   * yyv - year in vahid with leading zeroes
   * YV - year in vahid full transliteration
   * v - vahid without leading zeroes
   * vv - vahid with leading zeroes
   * k - Kull-i-Shay without leading zeroes
   * kk - Kull-i-Shay with leading zeroes
   * y - year without leading zeroes
   * yy - 3 digit year with leading zeroes
   */
 
  var formatTokens3 = ["DDL", "DD+", "MML", "MM+", "WWL", "yyv"];
  var formatTokens2 = ["dd", "DD", "mm", "MM", "ww", "WW", "yv", "YV", "vv", "kk", "yy", "BE"];
  var formatTokens1 = ["d", "D", "m", "M", "W", "v", "k", "y"];

  // Assemble the formatting output
  function formatBuilder(formatString, language) {
    if (typeof formatString !== "string") {
      return "Invalid input";
    }
    var returnString = "";
    var length = formatString.length;
    for (var i = 0; i < length; i++) {
      // Text wrapped in {} is output as-is. A "{" without a matching "}"
      // results in invalid input
      if (formatString.charAt(i) === "{" && i < length - 1) {
        for (var j = i + 1; j <= length; j++) {
          if (j === length) {
            return "Invalid input";
          }
          if (formatString.charAt(j) === "}") {
            i = j;
            break;
          }
          returnString += formatString.charAt(j);
        }
      } else {
        var group2 = formatString.charAt(i) + formatString.charAt(i + 1);
        var group3 = group2 + formatString.charAt(i + 2);
        // First check for match two 3-symbol token, then 2, then 1 (tokens are not uniquely decodable)
        if (formatTokens3.indexOf(group3) > -1) {
          returnString += getFormatItem(group3, language, 3);
          i += 2;
        } else if (formatTokens2.indexOf(group2) > -1) {
          returnString += getFormatItem(group2, language, 2);
          i++;
        } else if (formatTokens1.indexOf(formatString.charAt(i)) > -1) {
          returnString += getFormatItem(formatString.charAt(i), language, 1);
        } else {
          returnString += formatString.charAt(i);
        }
      }
    }
    return returnString;
  }

  // Get the appropriate output for a given formatting token
  function getFormatItem(token, language, length) {
    if (length === 1) {
      switch (token) {
        case "d":
          return String(badiDay);
        case "D":
          var day = badiLocale[language].month[badiDay];
          if (day.substring(0,1) !== "‘") {
            return day.substring(0,3);
          } else {
            return day.substring(0,4);
          }
          break;
        case "m":
          return String(badiMonth);
        case "M":
          var month = badiLocale[language].month[badiMonth];
          if (month.substring(0,1) !== "‘") {
            return month.substring(0,3);
          } else {
            return month.substring(0,4);
          }
          break;
        case "W":
          return badiLocale[language].weekdayAbbr3[(gregDate.isoWeekday() + 1)%7 + 1];
        case "y":
          return String(badiYear);
        case "v":
          return String(Math.floor((badiYear - 1)/19) + 1);
        case "k":
          return String(Math.floor((badiYear - 1)/361) + 1);
        default:
          return "";
      }
    } else if (length === 2) {
      switch (token) {
        case "dd":
          return ("0" + String(badiDay)).slice(-2);
        case "DD":
          return badiLocale[language].month[badiDay];
        case "mm":
          return ("0" + String(badiMonth)).slice(-2);
        case "MM":
          return badiLocale[language].month[badiMonth];
        case "ww":
          return badiLocale[language].weekdayAbbr2[(gregDate.isoWeekday() + 1)%7 + 1];
        case "WW":
          return badiLocale[language].weekday[(gregDate.isoWeekday() + 1)%7 + 1];
        case "yy":
          return ("00" + String(badiYear)).slice(-3);
        case "yv":
          return String((badiYear - 1)%19 + 1);
        case "YV":
          return badiLocale[language].yearInVahid[(badiYear - 1)%19 + 1];
        case "vv":
          return ("0" + String(String(Math.floor((badiYear - 1)/19) + 1))).slice(-2);
        case "kk":
          return ("0" + String(String(Math.floor((badiYear - 1)/361) + 1))).slice(-2);
        case "BE":
          return badiLocale[language].BE;
        default:
          return "";
      }
    } else if (length === 3) {
      switch (token) {
        case "DDL":
          return badiLocale[language].monthL[badiDay];
        case "DD+":
          return badiLocale[language].month[badiDay] + " (" + badiLocale[language].monthL[badiDay] + ")";
        case "MML":
          return badiLocale[language].monthL[badiMonth];
        case "MM+":
          if (badiLocale[language].month[badiMonth] !== badiLocale[language].monthL[badiMonth]) {
            return badiLocale[language].month[badiMonth] + " (" + badiLocale[language].monthL[badiMonth] + ")";
          }
          return badiLocale[language].month[badiMonth];
        case "WWL":
          return badiLocale[language].weekdayL[(gregDate.isoWeekday() + 1)%7 + 1];
        case "yyv":
          return ("0" + String((badiYear - 1)%19 + 1)).slice(-2);
        default:
          return "";
      }
    } else {
      return "";
    }
  }

  /********************
   * PUBLIC FUNCTIONS *
   ********************/

  // Format date output by the provided token and in the provided language
  // If language not given, defaults to English
  this.format = function (formatString, language) {
    if (typeof language === "undefined" || badiLocale[language] === "undefined") {
      language = "English";
    }
    if (typeof formatString === "undefined") {
      formatString = "d MM+ y BE";
    }
    return formatBuilder(formatString, language);
  };
  
  // Get the Holy Day if applicable (if language not given, defaults to English)
  this.holyDay = function (language) {
    if (typeof language === "undefined" || badiLocale[language] === "undefined") {
      language = "English";
    }
    if (!holyDay) {
      return false;
    }
    return badiLocale[language].holyDay[holyDay];
  };

  // Is this a valid Badí' date?
  this.isValid = function () {
    return valid;
  };

  // The number of the day in the Badí' month
  this.badiDay = function () {
    return badiDay;
  };

  // The number of the month in the Badí' year
  this.badiMonth = function () {
    return badiMonth;
  };

  // The Badí' year
  this.badiYear = function () {
    return badiYear;
  };

  // The number of the Badí' weekday
  // 1 -> Jalál (Saturday), 7 -> Istiqlál (Friday)
  this.badiWeekday = function () {
    var weekdayNumber = (gregDate.isoWeekday() + 1)%7 + 1;
    return weekdayNumber;
  };

  // The number of the year in the Váḥid
  this.yearInVahid = function() {
    return (badiYear - 1)%19 + 1;
  };

  // The number of the Váḥid in the Kull-i-Shay’
  this.vahid = function () {
    return (Math.floor((badiYear - 1)/19)%19) + 1;
  };

  // The number of the Kull-i-Shay’
  this.kullIShay = function () {
    return Math.floor((badiYear - 1)/361) + 1;
  };

  // The Gregorian date associated with the (end of the) Badí' date
  this.gregDate = function () {
    return gregDate;
  };

  // Get the length of Ayyám-i-Há for the year this date is in.
  this.ayyamiHaLength = function () {
    return ayyamiHaLength;
  };
  
  // The number of the Holy Day (1-11), or false if date is not a Holy Day
  this.holyDayNumber = function () {
    return holyDay;
  };
}
