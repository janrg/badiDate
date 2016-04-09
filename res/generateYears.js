var latitudeTihran = 35.68;
var longitudeTihran = 51.42;

// Calculate the time of of the beginning of the year in Tihran in UTC
var nawRuzTihranUTC = function(equinox) {
  var vernalEquinox, nawruzTihran;
  vernalEquinox = moment.tz(equinox, "UTC");
  nawRuzTihran = MeeusSunMoon.sunset(vernalEquinox, latitudeTihran, longitudeTihran);
  if (vernalEquinox.isBefore(nawRuzTihran)) {
    nawRuzTihran = MeeusSunMoon.sunset(vernalEquinox.subtract(1, "day"), latitudeTihran, longitudeTihran);
  }
  return nawRuzTihran;
}

// Calculate the Badí' dates for the Twin Birthdays
var twinBirthdays = function(nawRuzTihran) {
  var eighthNewMoon;
  // want to get the end of Naw-Rúz as it is the eighth new moon after the day of Naw-Rúz
  // Note we modify nawRuzTihran here, but we want the day on which Naw-Rúz ends for the list anyway
  var nawRuzEnd = MeeusSunMoon.sunset(nawRuzTihran.add(1, "day"), latitudeTihran, longitudeTihran);
  var newMoons = MeeusSunMoon.yearMoonPhases(nawRuzTihran.year(), 0);
  var index = 0;
  // Count the new moons since Naw-Rúz and keep the eighth one
  for (var i = 0; i < newMoons.length; i++) {
    if (newMoons[i].isAfter(nawRuzEnd)) {
      index++
    }
    if (index === 8) {
      eighthNewMoon = newMoons[i];
      break;
    }
  }
  // Convert to the proper timezone and calculate sunset.
  eighthNewMoon.tz("Asia/Tehran");
  var newMoonSunset = MeeusSunMoon.sunset(eighthNewMoon, latitudeTihran, longitudeTihran);
  // Output some info about years in which the eighth new moon and sunset are very close,
  // as we might get the date wrong by a day then
  // (We don't have to worry about this for the new moon near Naw-Rúz as none will be close
  //  enough for at least a thousand years)
  var diff = eighthNewMoon.diff(newMoonSunset, "minutes");
  if (Math.abs(diff) < 5) {
    console.log(eighthNewMoon.format() + "\n" + newMoonSunset.format() + "\n" + diff);
  }
  // If sunset is before the new moon, the new moon is on the next Badí' date
  // Then we add another day because it's the day after the occurence of the eighth new moon
  if (newMoonSunset.isBefore(eighthNewMoon)) {
    eighthNewMoon.add(1, 'day');
  }
  eighthNewMoon.add(1, 'day');
  var monthDay = badiMonthDayTB(eighthNewMoon, nawRuzTihran);
  return monthDay;
}

// Calculate the Badí' dates for the Twin Birthdays from the Gregorian date of the
// Birth of the Báb and the date of Naw-Rúz
badiMonthDayTB = function (gregDate, nawRuzTihran) {
  var dayOfBadiYear = gregDate.dayOfYear() - nawRuzTihran.dayOfYear() + 1;
  var day2OfBadiYear = dayOfBadiYear + 1;
  return [Math.floor((dayOfBadiYear - 1)/19 + 1), (dayOfBadiYear - 1)%19 + 1, Math.floor((day2OfBadiYear - 1)/19 + 1), (day2OfBadiYear - 1)%19 + 1];
};

// Generate the long and short list of dates for use in the badiDate class
var yearList = function() {
  var nawRuzTihran, nextNawRuzTihran, ayyamiHaLength, TB;
  var longList = "  var badiYears = {\n";
  var shortList = "  var badiYears = [\n    ";
  var counter = 0;
  var equinoxesLength = equinoxes.length;
  for (var i = 0; i < equinoxesLength - 1; i++) {
    nawRuzTihran = nawRuzTihranUTC(equinoxes[i])
    nextNawRuzTihran = nawRuzTihranUTC(equinoxes[i+1]);
    ayyamiHaLength = Math.round(nextNawRuzTihran.diff(nawRuzTihran, "day", true) - 361);
    TB = twinBirthdays(nawRuzTihran);
    longList += "    " + (i + 172).toString() + ": {\n" +
            "      NR: \"" + nawRuzTihran.format("YYYY-MM-DD") + "\",\n" +
            "      aHL: " + ayyamiHaLength + ",\n" +
            "      TB: " + "[" + TB + "]\n" +
            "    }";
    shortList += "\"" + nawRuzTihran.date().toString(36) + ayyamiHaLength.toString(36) + TB[0].toString(36) + TB[1].toString(36) + "\"";
    if (i === equinoxesLength - 2) {
      longList += "\n  };";
      shortList += "];";
    } else if (i % 10 === 9) {
      longList += ",\n";
      shortList += ",\n    ";
    } else {
      longList += ",\n";
      shortList += ", ";
    }
  }
  $("#long").html("<pre>" + longList + "</pre>");
  $("#short").html("<pre>" + shortList + "</pre>");
}();
