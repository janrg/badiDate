// Global variable to set to true if clocks rather than solar events are used
// in the given area for determining events, e.g. in Alaska
var clockLocation = false;

// A wrapper for badiDate which takes care of all the location-dependent things
function localBadiDate(date, latitude, longitude, timezoneId) {
  // We treat a moment being passed as a special case where the datetime, rather
  // than just the date may be intended (as we can't assume a Date object is in
  // the desired timezone)
  if (date instanceof moment) {
    var sunset = MeeusSunMoon.sunset(date, latitude, longitude);
    if (date.isAfter(sunset)) {
      date.add(1, "day");
    }
  }
  var badidate = new badiDate(date);
  var gregDate = moment.tz(badidate.gregDate().format("YYYY-MM-DDTHH:mm:ss"), timezoneId);
  var dateStart, dateSolarNoon, dateSunrise, dateEnd;
  if (!clockLocation) { // Standard behaviour
    dateEnd = MeeusSunMoon.sunset(gregDate, latitude, longitude);
    dateSolarNoon = MeeusSunMoon.solarNoon(gregDate, longitude);
    dateSunrise = MeeusSunMoon.sunrise(gregDate, latitude, longitude);
    dateStart = MeeusSunMoon.sunset(gregDate.subtract(1, "day"), latitude, longitude);
    // add() and subtract() modify the object so we have to undo this
    gregDate.add(1, "day");
  } else { // If we use clocks instead of the sun. Set to 6/12/18 local time (-> 7/13/19 if DST is in effect)
    dateEnd = moment.tz(gregDate.format("YYYY-MM-DDT") + "18:00:00", timezoneId);
    dateSolarNoon = moment.tz(gregDate.format("YYYY-MM-DDT") + "12:00:00", timezoneId);
    dateSunrise = moment.tz(gregDate.format("YYYY-MM-DDT") + "06:00:00", timezoneId);
    dateStart = moment.tz(gregDate.subtract(1, "day").format("YYYY-MM-DDT") + "18:00:00", timezoneId);
    // add() and subtract() modify the object so we have to undo this
    gregDate.add(1, "day");
    if (dateEnd.isDST()) {
      dateEnd.add(1, "hour");
      dateSolarNoon.add(1, "hour");
      dateSunrise.add(1, "hour");
    }
    if (dateStart.isDST()) {
      dateStart.add(1, "hour");
    }
  }
  var commemoration = false;
  // For Holy Days which are commemorated at a specific time, we set the commemoration time
  switch (badidate.holyDayNumber()) {
    case 2: // First Day of Ridvan: 15:00 local standard time
      commemoration = gregDate;
      commemoration.hour(gregDate.isDST() ? 16 : 15);
      break;
    case 5: // Declaration of the Báb: 2 hours 11 minutes after sunset
      commemoration = moment.tz(dateStart, timezoneId);
      commemoration.add(131, "minutes");
      break;
    case 6: // Ascension of Bahá'u'lláh: 03:00 local standard time
      commemoration = gregDate;
      commemoration.hour(gregDate.isDST() ? 4 : 3);
      break;
    case 7: // Martyrdom of the Báb: solar noon
      commemoration = dateSolarNoon;
      break;
    case 11: // Ascension of 'Abdu'l-Bahá: 01:00 local standard time
      commemoration = gregDate;
      commemoration.hour(gregDate.isDST() ? 2 : 1);
      break;
  }
  var day = {
    badiDate: badidate,
    start: dateStart,
    end: dateEnd,
    sunrise: dateSunrise,
    solarNoon: dateSolarNoon,
    holyDayCommemoration: commemoration
  };
  return day;
}
