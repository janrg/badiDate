var nearestSunset = function(datetime) {
  var sunset1 = MeeusSunMoon.sunset(datetime.subtract(1, "day"), latitudeTihran, longitudeTihran);
  var sunset3 = MeeusSunMoon.sunset(datetime.add(2, "day"), latitudeTihran, longitudeTihran);
  var sunset2 = MeeusSunMoon.sunset(datetime.subtract(1, "day"), latitudeTihran, longitudeTihran);
  var sunset = sunset1;
  if (Math.abs(datetime.diff(sunset2)) < Math.abs(datetime.diff(sunset))) {
    sunset = sunset2;
  }
  if (Math.abs(datetime.diff(sunset3)) < Math.abs(datetime.diff(sunset))) {
    sunset = sunset3;
  }
  return sunset;
};

var nearestNewMoon = function(datetime) {
  var newMoons = MeeusSunMoon.yearMoonPhases(datetime.year(), 0);
  var newMoonBefore, newMoonAfter;
  for (var i = 0; ; i++) {
    if (newMoons[i].isAfter(datetime)) {
      newMoonBefore = newMoons[i-1];
      newMoonAfter = newMoons[i];
      break;
    }
  }
  if (Math.abs(datetime.diff(newMoonBefore)) < Math.abs(datetime.diff(newMoonAfter))) {
    return newMoonBefore;
  } else {
    return newMoonAfter;
  }
};

// Generate a list to determine uncertainties that could lead to incorrect dates in the calculation
// Columns generated are (all times in UTC, location where applicable Tihran):
// Gregorian Year, estimated delta T, uncertainty in delta T, time of the March Equinox, time of nearest sunset,
// difference in seconds, time of end of Naw-Rúz, time of nearest New Moon, difference in seconds,
// time of eighth New Moon after Naw-Rúz, time of nearest sunset, difference in seconds, Gregorian Date
// of March Equinox, Badí' date of the Birth of the Báb commemoration, corresponding Gregorian date,
// length of Ayyám-i-Há in days
var debugList = function() {
  var debug = "";
  var equinoxesLength = equinoxes.length;
  for (var i = 0; i < equinoxesLength - 1; i++) {
    var N = i + 10;
    var errorDeltaT = Math.round(365.25*N*Math.sqrt((N*0.058/3)*(1 + N/2500))/1000);
    var equinox = moment.tz(equinoxes[i], "UTC");
    var deltaT;
    var t;
    if (i < 36) {
      t = i + 15;
      deltaT = Math.round(62.92 + 0.32217*t + 0.005589*t*t);
    } else if (i < 136) {
      t = i + 2015;
      deltaT = Math.round(-20 + 32*((t-1820)/100)*((t-1820)/100) - 0.5628*(2150-t));
    } else {
      t = (i+195)/100;
      deltaT = Math.round(-20 + 32*t*t);
    }
    var sunset = nearestSunset(equinox);
    var nawRuzEnd = nawRuzTihranUTC(equinox.format("YYYY-MM-DD HH:mm:ss[Z]"));
    nawRuzEnd = MeeusSunMoon.sunset(nawRuzEnd.add(1, "day"), latitudeTihran, longitudeTihran);
    nawRuzNewMoon = nearestNewMoon(nawRuzEnd);
    var newMoons = MeeusSunMoon.yearMoonPhases(nawRuzEnd.year(), 0);
    var index = 0;
    // Count the new moons since Naw-Rúz and keep the eighth one
    for (var j = 0; j < newMoons.length; j++) {
      if (newMoons[j].isAfter(nawRuzEnd)) {
        index++;
      }
      if (index === 8) {
        eighthNewMoon = newMoons[j];
        break;
      }
    }
    var TBSunset = nearestSunset(eighthNewMoon);
    var twinBirth = twinBirthdays(nawRuzTihranUTC(equinox));
    var BoB = new badiDate([i + 172, twinBirth[0], twinBirth[1]]);
    debug += equinox.format("YYYY ");
    debug += deltaT + " ";
    debug += errorDeltaT + " ";
    debug += equinox.format("YYYY-MM-DD[T]HH:mm:ss ");
    debug += sunset.format("YYYY-MM-DD[T]HH:mm:ss ");
    if (Math.abs(equinox.diff(sunset, "seconds")) < 3*errorDeltaT + 90) {
      debug += "#";
    }
    debug += equinox.diff(sunset, "seconds") + " ";
    debug += nawRuzEnd.format("YYYY-MM-DD[T]HH:mm:ss ");
    debug += nawRuzNewMoon.format("YYYY-MM-DD[T]HH:mm:ss ");
    if (Math.abs(nawRuzEnd.diff(nawRuzNewMoon, "seconds")) < 3*errorDeltaT + 60) {
      debug += "#";
    }
    debug += nawRuzEnd.diff(nawRuzNewMoon, "seconds") + " ";
    debug += eighthNewMoon.format("YYYY-MM-DD[T]HH:mm:ss ");
    debug += TBSunset.format("YYYY-MM-DD[T]HH:mm:ss ");
    if (Math.abs(eighthNewMoon.diff(TBSunset, "seconds")) < 3*errorDeltaT + 60) {
      debug += "#";
    }
    debug += eighthNewMoon.diff(TBSunset, "seconds") + " ";
    debug += nawRuzEnd.format("DD-MMM ");
    debug += BoB.format("d-MM ");
    debug += BoB.gregDate().format("DD-MMM ");
    debug += BoB.ayyamiHaLength();
    debug += "<br>";
  }
  $("#debug").html("<pre>" + debug + "</pre>");
};
