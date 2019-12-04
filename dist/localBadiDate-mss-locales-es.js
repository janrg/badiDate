/**
 * @license BadiDate v2.0.0
 * (c) 2018 Jan Greis
 * licensed under MIT
 */

import * as momentNs from 'moment-timezone';

/**
 * Converts angles in degrees to radians.
 * @param {number} deg Angle in degrees.
 * @returns {number} Angle in radians.
 */
const deg2rad = function (deg) {
  return deg * 0.017453292519943295;
};

/**
 * Converts angles in radians to degrees.
 * @param {number} rad Angle in radians.
 * @returns {number} Angle in degrees.
 */
const rad2deg = function (rad) {
  return rad * 57.29577951308232;
};

/**
 * Calculates the sine of an angle given in degrees.
 * @param {number} deg Angle in degrees.
 * @returns {number} Sine of the angle.
 */
const sind = function (deg) {
  return Math.sin(deg2rad(deg));
};

/**
 * Calculates the cosine of an angle given in degrees.
 * @param {number} deg Angle in degrees.
 * @returns {number} Cosine of the angle.
 */
const cosd = function (deg) {
  return Math.cos(deg2rad(deg));
};

/**
 * Reduces an angle to the interval 0-360°.
 * @param {number} angle Angle in degrees.
 * @returns {number} Reduced angle in degrees.
 */
const reduceAngle = function (angle) {
  return angle - (360 * Math.floor(angle / 360));
};

/**
 * Evaluates a polynomial in the form A + Bx + Cx^2...
 * @param {number} variable Value of x in the polynomial.
 * @param {array} coeffs Array of coefficients [A, B, C...].
 * @returns {number} Sum of the polynomial.
 */
const polynomial = function (variable, coeffs) {
  let varPower = 1;
  let sum = 0.0;
  const numCoeffs = coeffs.length;
  for (let i = 0; i < numCoeffs; i++) {
    sum += varPower * coeffs[i];
    varPower *= variable;
  }
  return sum;
};

/**
 * Interpolates a value from 3 known values (see AA p24 Eq3.3).
 * @param {number} y1 Start value of the interval.
 * @param {number} y2 Middle value of the interval.
 * @param {number} y3 End value of the interval.
 * @param {number} n Location (-0.5 >= n >= 0.5) of result in the interval.
 * @param {bool} normalize Whether the final result should be normalized.
 * @returns {number} Interpolated result.
 */
const interpolateFromThree = function (y1, y2, y3, n, normalize) {
  let a = y2 - y1;
  let b = y3 - y2;
  if (typeof normalize !== 'undefined' && normalize) {
    if (a < 0) { a += 360; }
    if (b < 0) { b += 360; }
  }
  const c = b - a;
  const y = y2 + (n / 2) * (a + b + n * c);
  return y;
};

const moment = momentNs;

/**
 * Converts a datetime in UTC to the corresponding Julian Date (see AA p60f).
 * @param {moment} datetime Datetime to be converted.
 * @returns {number} Julian date (fractional number of days since 1 January
 *     4713BC according to the proleptic Julian calendar.
 */
const datetimeToJD = function (datetime) {
  let Y = datetime.year();
  // Months are zero-indexed
  let M = datetime.month() + 1;
  const D = datetime.date() + (datetime.hour() + (datetime.minute() +
                               datetime.second() / 60) / 60) / 24;
  if (M < 3) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  // Need a different B if we are before introduction of the Gregorian Calendar
  const gregorianCutoff = moment('1582-10-15T12:00:00Z');
  let B = 0;
  if (datetime.isAfter(gregorianCutoff)) {
    B = 2 - A + Math.floor(A / 4);
  }
  const JD = Math.floor(365.25 * (Y + 4716)) +
             Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  return JD;
};

/**
 * Converts a Julian Date to the corresponding datetime in UTC (see AA p63).
 * @param {number} JD Julian date to be converted
 * @returns {moment} Datetime corresponding to the given Julian date.
 */
const JDToDatetime = function (JD) {
  JD += 0.5;
  const Z = Math.floor(JD);
  const F = JD - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A += 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const fracDay = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(fracDay);
  const hours = Math.floor((fracDay - day) * 24);
  const minutes = Math.floor(((fracDay - day) * 24 - hours) * 60);
  const seconds =
    Math.floor((((fracDay - day) * 24 - hours) * 60 - minutes) * 60);
  let month = E - 1;
  if (E > 13) {
    month -= 12;
  }
  let year = C - 4715;
  if (month > 2) {
    year -= 1;
  }
  const datetime = moment.tz('2000-01-01T12:00:00', 'UTC');
  datetime.year(year);
  // Months are zero-indexed
  datetime.month(month - 1);
  datetime.date(day);
  datetime.hour(hours);
  datetime.minute(minutes);
  datetime.second(seconds);
  return datetime;
};

/**
 * Converts a Julian date to the number of Julian centuries since
 * 2000-01-01T12:00:00Z (see AA p87 Eq12.1).
 * @param {number} JD Julian date.
 * @returns {number} T.
 */
const JDToT = function (JD) {
  return (JD - 2451545) / 36525;
};

/**
 * Converts a datetime in UTC to the number of Julian centuries since
 * 2000-01-01T12:00:00Z.
 * @param {moment} datetime Datetime to be converted.
 * @returns {number} T.
 */
const datetimeToT = function (datetime) {
  return JDToT(datetimeToJD(datetime));
};

/* eslint-disable complexity */
/**
 * Calculates the value of ΔT=TT−UT (see
 * http://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.htm).
 * @param {moment} datetime Datetime for which ΔT should be calculated.
 * @returns {number} ΔT.
 */
const DeltaT = function (datetime) {
  let y = datetime.year();
  // Months are zero-indexed
  y += (datetime.month() + 0.5) / 12;
  let u;
  let t;
  let DeltaT;
  switch (true) {
    case y < -1999:
      DeltaT = false;
      break;
    case y < -500:
      u = (y - 1820) / 100;
      DeltaT = -20 + 32 * u * u;
      break;
    case y < 500:
      u = y / 100;
      DeltaT = 10583.6 - 1014.41 * u + 33.78311 * u * u - 5.952053 * u * u * u -
               0.1798452 * u * u * u * u + 0.022174192 * u * u * u * u * u +
               0.0090316521 * u * u * u * u * u * u;
      break;
    case y < 1600:
      u = (y - 1000) / 100;
      DeltaT = 1574.2 - 556.01 * u + 71.23472 * u * u + 0.319781 * u * u * u -
               0.8503463 * u * u * u * u - 0.005050998 * u * u * u * u * u +
               0.0083572073 * u * u * u * u * u * u;
      break;
    case y < 1700:
      t = y - 1600;
      DeltaT = 120 - 0.9808 * t - 0.01532 * t * t + t * t * t / 7129;
      break;
    case y < 1800:
      t = y - 1700;
      DeltaT = 8.83 + 0.1603 * t - 0.0059285 * t * t + 0.00013336 * t * t * t -
               t * t * t * t / 1174000;
      break;
    case y < 1860:
      t = y - 1800;
      DeltaT = 13.72 - 0.332447 * t + 0.0068612 * t * t +
               0.0041116 * t * t * t - 0.00037436 * t * t * t * t +
               0.0000121272 * t * t * t * t * t -
               0.0000001699 * t * t * t * t * t * t +
               0.000000000875 * t * t * t * t * t * t * t;
      break;
    case y < 1900:
      t = y - 1860;
      DeltaT = 7.62 + 0.5737 * t - 0.251754 * t * t + 0.01680668 * t * t * t -
               0.0004473624 * t * t * t * t + t * t * t * t * t / 233174;
      break;
    case y < 1920:
      t = y - 1900;
      DeltaT = -2.79 + 1.494119 * t - 0.0598939 * t * t +
                0.0061966 * t * t * t - 0.000197 * t * t * t * t;
      break;
    case y < 1941:
      t = y - 1920;
      DeltaT = 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t * t * t;
      break;
    case y < 1961:
      t = y - 1950;
      DeltaT = 29.07 + 0.407 * t - t * t / 233 + t * t * t / 2547;
      break;
    case y < 1986:
      t = y - 1975;
      DeltaT = 45.45 + 1.067 * t - t * t / 260 - t * t * t / 718;
      break;
    case y < 2005:
      t = y - 2000;
      DeltaT = 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t +
               0.000651814 * t * t * t * t + 0.00002373599 * t * t * t * t * t;
      break;
    case y < 2050:
      t = y - 2000;
      DeltaT = 62.92 + 0.32217 * t + 0.005589 * t * t;
      break;
    case y < 2150:
      DeltaT = -20 + 32 * ((y - 1820) / 100) * ((y - 1820) / 100) -
        0.5628 * (2150 - y);
      break;
    default:
      u = (y - 1820) / 100;
      DeltaT = -20 + 32 * u * u;
  }
  return DeltaT;
};
/* eslint-enable complexity */

/**
 * Calculates an approximate value for k (the fractional number of new moons
 * since 2000-01-06).
 * @param {moment} datetime Datetime for which k is calculated.
 * @returns {number} k.
 */
const approxK = function (datetime) {
  const year = datetime.year() + (datetime.month() + 1) / 12 +
    datetime.date() / 365.25;
  return (year - 2000) * 12.3685;
};

/**
 * Calculates T from k.
 * @param {number} k Fractional number of new moons since 2000-01-06.
 * @returns {number} T Fractional num. of centuries since 2000-01-01:12:00:00Z.
 */
const kToT = function (k) {
  return k / 1236.85;
};

/**
 * Calculates the Julian date in ephemeris time of the moon near the date
 * corresponding to k (see AA p350ff).
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @param {int} phase 0 -> new moon, 1 -> first quarter,
 *                    2 -> full moon, 3 -> last quarter.
 * @returns {number} Julian date in ephemeris time of the moon of given phase.
 */
const truePhase = function (k, phase) {
  k += phase / 4;
  const T = kToT(k);
  const E = eccentricityCorrection(T);
  let JDE = meanPhase(T, k);
  const M = sunMeanAnomaly(T, k);
  const MPrime = moonMeanAnomaly(T, k);
  const F = moonArgumentOfLatitude(T, k);
  const Omega = moonAscendingNodeLongitude(T, k);
  const A = planetaryArguments(T, k);
  let DeltaJDE = 0;
  if (phase === 0 || phase === 2) {
    DeltaJDE += newMoonFullMoonCorrections(E, M, MPrime, F, Omega, phase);
  } else if (phase === 1 || phase === 3) {
    DeltaJDE += quarterCorrections(E, M, MPrime, F, Omega, phase);
  }
  DeltaJDE += commonCorrections(A);
  JDE += DeltaJDE;
  return JDE;
};

/**
 * Calculates the mean phase of the moon as Julian date in ephemeris time (see
 * AA p349 Eq49.1).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @returns {number} Julian date in ephemeris time of the moon of given mean
 *     phase.
 */
const meanPhase = function (T, k) {
  const JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T -
              0.000000150 * T * T * T + 0.00000000073 * T * T * T * T;
  return JDE;
};

/**
 * Calculates the mean anomaly of the sun (see AA p350 Eq49.4).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @returns {number} Mean anomaly of the sun at the given time.
 */
const sunMeanAnomaly = function (T, k) {
  const M = 2.5534 + 29.10535670 * k - 0.0000014 * T * T -
            0.00000011 * T * T * T;
  return M;
};

/**
 * Calculates the mean anomaly of the moon (see AA p350 Eq49.5).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @returns {number} Mean anomaly of the moon at the given time.
 */
const moonMeanAnomaly = function (T, k) {
  const MPrime = 201.5643 + 385.81693528 * k + 0.0107582 * T * T +
                 0.00001238 * T * T * T - 0.000000058 * T * T * T * T;
  return MPrime;
};

/**
 * Calculates the argument of latitude of the moon (see AA p350 Eq49.6).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @returns {number} Argument of latitude of the moon at the given time.
 */
const moonArgumentOfLatitude = function (T, k) {
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T * T -
            0.00000227 * T * T * T + 0.000000011 * T * T * T * T;
  return F;
};

/**
 * Calculates the longitude of the ascending node of the lunar orbit (see AA
 * p350 Eq49.7).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @returns {number} Longitude of the ascending node of the lunar orbit at the
 *     given time.
 */
const moonAscendingNodeLongitude = function (T, k) {
  const Omega = 124.7746 - 1.56375588 * k + 0.0020672 * T * T +
                0.00000215 * T * T * T;
  return Omega;
};

/**
 * Calculates the correction for the eccentricity of the earth's orbit.
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Eccentricity correction.
 */
const eccentricityCorrection = function (T) {
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  return E;
};

/**
 * Calculates the planetary arguments for the moon phases (see AA p351).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} k The approximate fractional number of new moons since
 *     2000-01-06.
 * @returns {array} Planetary arguments for the moon phases.
 */
const planetaryArguments = function (T, k) {
  const A = [];
  /* eslint-disable no-multi-spaces */
  // Want to follow the numbering conventions from AA
  A[0]  = 0;
  A[1]  = 299.77 +  0.107408 * k - 0.009173 * T * T;
  A[2]  = 251.88 +  0.016321 * k;
  A[3]  = 251.83 + 26.651886 * k;
  A[4]  = 349.42 + 36.412478 * k;
  A[5]  =  84.66 + 18.206239 * k;
  A[6]  = 141.74 + 53.303771 * k;
  A[7]  = 207.14 +  2.453732 * k;
  A[8]  = 154.84 +  7.306860 * k;
  A[9]  =  34.52 + 27.261239 * k;
  A[10] = 207.19 +  0.121824 * k;
  A[11] = 291.34 +  1.844379 * k;
  A[12] = 161.72 + 24.198154 * k;
  A[13] = 239.56 + 25.513099 * k;
  A[14] = 331.55 +  3.592518 * k;
  /* eslint-enable no-multi-spaces */
  return A;
};

/**
 * Calculates the corrections to the planetary arguments for the moon phases
 * that are common to all phases (see AA p352).
 * @param {array} A Array of planetary arguments
 * @returns {number} Correction to the Julian date in ephemeris time for the
 *     moon phase.
 */
const commonCorrections = function (A) {
  const DeltaJDE = 0.000325 * sind(A[1]) +
                   0.000165 * sind(A[2]) +
                   0.000164 * sind(A[3]) +
                   0.000126 * sind(A[4]) +
                   0.000110 * sind(A[5]) +
                   0.000062 * sind(A[6]) +
                   0.000060 * sind(A[7]) +
                   0.000056 * sind(A[8]) +
                   0.000047 * sind(A[9]) +
                   0.000042 * sind(A[10]) +
                   0.000040 * sind(A[11]) +
                   0.000037 * sind(A[12]) +
                   0.000035 * sind(A[13]) +
                   0.000023 * sind(A[14]);
  return DeltaJDE;
};

/**
 * Calculates the corrections to the planetary arguments for the moon phases
 * for full and new moons (see AA p351).
 * @param {number} E Correction for the eccentricity of the earth's orbit.
 * @param {number} M Mean anomaly of the sun.
 * @param {number} MPrime Mean anomaly of the moon.
 * @param {number} F Argument of latitude of the moon.
 * @param {number} Omega Longitude of the ascending node of the lunar orbit.
 * @param {int} phase 0 -> new moon, 1 -> first quarter,
 *                    2 -> full moon, 3 -> last quarter.
 * @returns {number} Correction to the Julian date in ephemeris time for the
 *     moon phase.
 */
const newMoonFullMoonCorrections = function (E, M, MPrime, F, Omega, phase) {
  let DeltaJDE = -0.00111 * sind(MPrime - 2 * F) -
                  0.00057 * sind(MPrime + 2 * F) +
                  0.00056 * E * sind(2 * MPrime + M) -
                  0.00042 * sind(3 * MPrime) +
                  0.00042 * E * sind(M + 2 * F) +
                  0.00038 * E * sind(M - 2 * F) -
                  0.00024 * E * sind(2 * MPrime - M) -
                  0.00017 * sind(Omega) -
                  0.00007 * sind(MPrime + 2 * M) +
                  0.00004 * sind(2 * MPrime - 2 * F) +
                  0.00004 * sind(3 * M) +
                  0.00003 * sind(MPrime + M - 2 * F) +
                  0.00003 * sind(2 * MPrime + 2 * F) -
                  0.00003 * sind(MPrime + M + 2 * F) +
                  0.00003 * sind(MPrime - M + 2 * F) -
                  0.00002 * sind(MPrime - M - 2 * F) -
                  0.00002 * sind(3 * MPrime + M) +
                  0.00002 * sind(4 * MPrime);
  if (phase === 0) {
    DeltaJDE += -0.40720 * sind(MPrime) +
                 0.17241 * E * sind(M) +
                 0.01608 * sind(2 * MPrime) +
                 0.01039 * sind(2 * F) +
                 0.00739 * E * sind(MPrime - M) -
                 0.00514 * E * sind(MPrime + M) +
                 0.00208 * E * E * sind(2 * M);
  } else if (phase === 2) {
    DeltaJDE += -0.40614 * sind(MPrime) +
                 0.17302 * E * sind(M) +
                 0.01614 * sind(2 * MPrime) +
                 0.01043 * sind(2 * F) +
                 0.00734 * E * sind(MPrime - M) -
                 0.00515 * E * sind(MPrime + M) +
                 0.00209 * E * E * sind(2 * M);
  }
  return DeltaJDE;
};

/**
 * Calculates the corrections to the planetary arguments for the moon phases
 * for first and last quarters (see AA p352).
 * @param {number} E Correction for the eccentricity of the earth's orbit.
 * @param {number} M Mean anomaly of the sun.
 * @param {number} MPrime Mean anomaly of the moon.
 * @param {number} F Argument of latitude of the moon.
 * @param {number} Omega Longitude of the ascending node of the lunar orbit.
 * @param {int} phase 0 -> new moon, 1 -> first quarter,
 *                    2 -> full moon, 3 -> last quarter.
 * @returns {number} Correction to the Julian date in ephemeris time for the
 *     moon phase.
 */
const quarterCorrections = function (E, M, MPrime, F, Omega, phase) {
  let DeltaJDE = -0.62801 * sind(MPrime) +
                  0.17172 * E * sind(M) -
                  0.01183 * E * sind(MPrime + M) +
                  0.00862 * sind(2 * MPrime) +
                  0.00804 * sind(2 * F) +
                  0.00454 * E * sind(MPrime - M) +
                  0.00204 * E * E * sind(2 * M) -
                  0.00180 * sind(MPrime - 2 * F) -
                  0.00070 * sind(MPrime + 2 * F) -
                  0.00040 * sind(3 * MPrime) -
                  0.00034 * E * sind(2 * MPrime - M) +
                  0.00032 * E * sind(M + 2 * F) +
                  0.00032 * E * sind(M - 2 * F) -
                  0.00028 * E * E * sind(MPrime + 2 * M) +
                  0.00027 * E * sind(2 * MPrime + M) -
                  0.00017 * sind(Omega) -
                  0.00005 * sind(MPrime - M - 2 * F) +
                  0.00004 * sind(2 * MPrime + 2 * F) -
                  0.00004 * sind(MPrime + M + 2 * F) +
                  0.00004 * sind(MPrime - 2 * M) +
                  0.00003 * sind(MPrime + M - 2 * F) +
                  0.00003 * sind(3 * M) +
                  0.00002 * sind(2 * MPrime - 2 * F) +
                  0.00002 * sind(MPrime - M + 2 * F) -
                  0.00002 * sind(3 * MPrime + M);
  const W = 0.00306 -
            0.00038 * E * cosd(M) +
            0.00026 * cosd(MPrime) -
            0.00002 * cosd(MPrime - M) +
            0.00002 * cosd(MPrime + M) +
            0.00002 * cosd(2 * F);
  if (phase === 1) {
    DeltaJDE += W;
  } else if (phase === 3) {
    DeltaJDE -= W;
  }
  return DeltaJDE;
};

/* eslint array-bracket-spacing: "off", indent: "off", no-multi-spaces: "off", standard/array-bracket-even-spacing: "off" */

/** See AA p144 */
const sunMeanAnomaly$1 = [357.52772, 35999.050340, -0.0001603, -1 / 300000];

/** See AA p163 Eq 25.2 */
const sunMeanLongitude = [280.46646, 36000.76983, 0.0003032];

/** See AA p147 Eq22.3 */
const meanObliquityOfEcliptic =
  [84381.448 / 3600, -4680.93 / 3600, -1.55 / 3600, 1999.25 / 3600,
   -51.38 / 3600, -249.67 / 3600, -39.05 / 3600, 7.12 / 3600, 27.87 / 3600,
   5.79 / 3600, 2.45 / 3600];

/** See AA p144 */
const moonArgumentOfLatitude$1 =
  [93.27191, 483202.017538, -0.0036825, 1 / 327270];

/** See AA p144 */
const moonAscendingNodeLongitude$1 =
  [125.04452, -1934.136261, 0.0020708, 1 / 450000];

/** See AA p144 */
const moonMeanAnomaly$1 = [134.96298, 477198.867398, 0.0086972, 1 / 56250];

/** See AA p144 */
const moonMeanElongation = [297.85036, 445267.111480, -0.0019142, 1 / 189474];

/**
 * Nutations in longitude and obliquity
 * See AA p145f
 */
const nutations =
  [[ 0,  0,  0,  0, 1, -171996, -174.2, 92025,  8.9],
   [-2,  0,  0,  2, 2,  -13187,   -1.6,  5736, -3.1],
   [ 0,  0,  0,  2, 2,   -2274,   -0.2,   977, -0.5],
   [ 0,  0,  0,  0, 2,    2062,    0.2,  -895,  0.5],
   [ 0,  1,  0,  0, 0,    1426,   -3.4,    54, -0.1],
   [ 0,  0,  1,  0, 0,     712,    0.1,    -7,    0],
   [-2,  1,  0,  2, 2,    -517,    1.2,   224, -0.6],
   [ 0,  0,  0,  2, 1,    -386,   -0.4,   200,    0],
   [ 0,  0,  1,  2, 2,    -301,      0,   129, -0.1],
   [-2, -1,  0,  2, 2,     217,   -0.5,   -95,  0.3],
   [-2,  0,  1,  0, 0,    -158,      0,     0,    0],
   [-2,  0,  0,  2, 1,     129,    0.1,   -70,    0],
   [ 0,  0, -1,  2, 2,     123,      0,   -53,    0],
   [ 2,  0,  0,  0, 0,      63,      0,     0,    0],
   [ 0,  0,  1,  0, 1,      63,    0.1,   -33,    0],
   [ 2,  0, -1,  2, 2,     -59,      0,    26,    0],
   [ 0,  0, -1,  0, 1,     -58,   -0.1,    32,    0],
   [ 0,  0,  1,  2, 1,     -51,      0,    27,    0],
   [-2,  0,  2,  0, 0,      48,      0,     0,    0],
   [ 0,  0, -2,  2, 1,      46,      0,   -24,    0],
   [ 2,  0,  0,  2, 2,     -38,      0,    16,    0],
   [ 0,  0,  2,  2, 2,     -31,      0,    13,    0],
   [ 0,  0,  2,  0, 0,      29,      0,     0,    0],
   [-2,  0,  1,  2, 2,      29,      0,   -12,    0],
   [ 0,  0,  0,  2, 0,      26,      0,     0,    0],
   [-2,  0,  0,  2, 0,     -22,      0,     0,    0],
   [ 0,  0, -1,  2, 1,      21,      0,   -10,    0],
   [ 0,  2,  0,  0, 0,      17,   -0.1,     0,    0],
   [ 2,  0, -1,  0, 1,      16,      0,    -8,    0],
   [-2,  2,  0,  2, 2,     -16,    0.1,     7,    0],
   [ 0,  1,  0,  0, 1,     -15,      0,     9,    0],
   [-2,  0,  1,  0, 1,     -13,      0,     7,    0],
   [ 0, -1,  0,  0, 1,     -12,      0,     6,    0],
   [ 0,  0,  2, -2, 0,      11,      0,     0,    0],
   [ 2,  0, -1,  2, 1,     -10,      0,     5,    0],
   [ 2,  0,  1,  2, 2,     -8,       0,     3,    0],
   [ 0,  1,  0,  2, 2,      7,       0,    -3,    0],
   [-2,  1,  1,  0, 0,     -7,       0,     0,    0],
   [ 0, -1,  0,  2, 2,     -7,       0,     3,    0],
   [ 2,  0,  0,  2, 1,     -7,       0,     3,    0],
   [ 2,  0,  1,  0, 0,      6,       0,     0,    0],
   [-2,  0,  2,  2, 2,      6,       0,    -3,    0],
   [-2,  0,  1,  2, 1,      6,       0,    -3,    0],
   [ 2,  0, -2,  0, 1,     -6,       0,     3,    0],
   [ 2,  0,  0,  0, 1,     -6,       0,     3,    0],
   [ 0, -1,  1,  0, 0,      5,       0,     0,    0],
   [-2, -1,  0,  2, 1,     -5,       0,     3,    0],
   [-2,  0,  0,  0, 1,     -5,       0,     3,    0],
   [ 0,  0,  2,  2, 1,     -5,       0,     3,    0],
   [-2,  0,  2,  0, 1,      4,       0,     0,    0],
   [-2,  1,  0,  2, 1,      4,       0,     0,    0],
   [ 0,  0,  1, -2, 0,      4,       0,     0,    0],
   [-1,  0,  1,  0, 0,     -4,       0,     0,    0],
   [-2,  1,  0,  0, 0,     -4,       0,     0,    0],
   [ 1,  0,  0,  0, 0,     -4,       0,     0,    0],
   [ 0,  0,  1,  2, 0,      3,       0,     0,    0],
   [ 0,  0, -2,  2, 2,     -3,       0,     0,    0],
   [-1, -1,  1,  0, 0,     -3,       0,     0,    0],
   [ 0,  1,  1,  0, 0,     -3,       0,     0,    0],
   [ 0, -1,  1,  2, 2,     -3,       0,     0,    0],
   [ 2, -1, -1,  2, 2,     -3,       0,     0,    0],
   [ 0,  0,  3,  2, 2,      3,       0,     0,    0],
   [ 2, -1,  0,  2, 2,     -3,       0,     0,    0]];

const moment$1 = momentNs;

/**
 * Calculates the solar transit time on a date at a given longitude (see AA
 * p102f).
 * @param {moment} datetime Date for which transit is calculated.
 * @param {number} L Longitude.
 * @returns {moment} Solar transit time.
 */
const sunTransit = function (datetime, L) {
  const timezone = datetime.tz();
  const transit = moment$1.tz(
    [datetime.year(), datetime.month(), datetime.date(), 0, 0, 0], 'UTC');
  const DeltaT$1 = DeltaT(transit);
  const T = datetimeToT(transit);
  const Theta0 = apparentSiderealTimeGreenwhich(T);
  // Want 0h TD for this, not UT
  const TD = T - (DeltaT$1 / (3600 * 24 * 36525));
  const alpha = sunApparentRightAscension(TD);
  // Sign flip for longitude from AA as we take East as positive
  let m = (alpha - L - Theta0) / 360;
  m = normalizeM(m, datetime.utcOffset());
  const DeltaM = sunTransitCorrection(T, Theta0, DeltaT$1, L, m);
  m += DeltaM;
  transit.add(Math.floor(m * 3600 * 24 + 0.5), 'seconds');
  if (roundToNearestMinute) {
    transit.add(30, 'seconds');
    transit.second(0);
  }
  transit.tz(timezone);
  return transit;
};

/**
 * Calculates the sunrise or sunset time on a date at a given latitude and
 * longitude (see AA p102f).
 * @param {moment} datetime Date for which sunrise or sunset is calculated.
 * @param {number} phi Latitude.
 * @param {number} L Longitude.
 * @param {string} flag 'RISE' or 'SET' depending on which event should be
 *     calculated.
 * @param {number} offset number of degrees below the horizon for the desired
 *     event (50/60 for sunrise/set, 6 for civil, 12 for nautical, 18 for
 *     astronomical dawn/dusk.
 * @returns {moment} Sunrise or sunset time.
 */
const sunRiseSet = function (datetime, phi, L, flag, offset = 50 / 60) {
  const timezone = datetime.tz();
  const suntime = moment$1.tz(
    [datetime.year(), datetime.month(), datetime.date(), 0, 0, 0], 'UTC');
  const DeltaT$1 = DeltaT(suntime);
  const T = datetimeToT(suntime);
  const Theta0 = apparentSiderealTimeGreenwhich(T);
  // Want 0h TD for this, not UT
  const TD = T - (DeltaT$1 / (3600 * 24 * 36525));
  const alpha = sunApparentRightAscension(TD);
  const delta = sunApparentDeclination(TD);
  const H0 = approxLocalHourAngle(phi, delta, offset);
  // Sign flip for longitude from AA as we take East as positive
  let m0 = (alpha - L - Theta0) / 360;
  m0 = normalizeM(m0, datetime.utcOffset());
  let m;
  if (flag === 'RISE') {
    m = m0 - H0 / 360;
  } else if (flag === 'SET') {
    m = m0 + H0 / 360;
  } else {
    return false;
  }
  let counter = 0;
  let DeltaM = 1;
  // Repeat if correction is larger than ~9s
  while ((Math.abs(DeltaM) > 0.0001) && (counter < 3)) {
    DeltaM = sunRiseSetCorrection(T, Theta0, DeltaT$1, phi, L, m, offset);
    m += DeltaM;
    counter++;
  }
  if (m > 0) {
    suntime.add(Math.floor(m * 3600 * 24 + 0.5), 'seconds');
  } else {
    suntime.subtract(Math.floor(Math.abs(m) * 3600 * 24 + 0.5), 'seconds');
  }
  if (roundToNearestMinute) {
    suntime.add(30, 'seconds');
    suntime.second(0);
  }
  suntime.tz(timezone);
  return suntime;
};

/**
 * Returns 06:00/18:00 (07:00/19:00 during DST) if there is no sunrise or sunset
 * on the date. If returnTimeForPNMS is true, otherwise return whether there is
 * Polar Night or Midnight Sun.
 * @param {moment} returnDate The calculated time for sunrise or sunset.
 * @param {moment} date The original date from which the event was calculated.
 * @param {int} hour Hour to which the returned datetime should be set.
 * @param {int} minute Minute to which the returned datetime should be set.
 * @returns {(moment|string)} Time given by parameter 'hour' (+ correction for
 *     DST if applicable) or a string indicating that the location experiences
 *     midnight sun ('MS') or polar night ('PN') on that date.
 */
const returnPNMS = function (returnDate, date, hour, minute = 0) {
  if (returnTimeForPNMS) {
    if (date.isDST()) {
      hour += 1;
    }
    returnDate.tz(date.tz())
      .year(date.year())
      .month(date.month())
      .date(date.date())
      .hour(hour)
      .minute(minute)
      .second(0);
  }
  return returnDate;
};

/**
 * Calculates the approximate local hour angle of the sun at sunrise or sunset.
 * @param {number} phi Latitude (see AA p102 Eq15.1).
 * @param {number} delta Apparent declination of the sun.
 * @param {number} offset number of degrees below the horizon for the desired
 *     event (50/60 for sunrise/set, 6 for civil, 12 for nautical, 18 for
 *     astronomical dawn/dusk.
 * @returns {number} Approximate local hour angle.
 */
const approxLocalHourAngle = function (phi, delta, offset) {
  const cosH0 = (sind(-offset) -
                sind(phi) * sind(delta)) /
                (cosd(phi) * cosd(delta));
  if (cosH0 < -1) {
    if (returnTimeForPNMS) {
      throw moment$1.tz('**2000-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss',
        'Europe/London');
    } else {
      let special = 'MS';
      if (offset === 6) {
        special = 'NCD';
      } else if (offset === 12) {
        special = 'NND';
      } else if (offset === 18) {
        special = 'NAD';
      }
      throw special;
    }
  } else if (cosH0 > 1) {
    if (returnTimeForPNMS) {
      throw moment$1.tz('--2000-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss',
        'Europe/London');
    } else {
      let special = 'PN';
      if (offset === 6) {
        special = 'NCD';
      } else if (offset === 12) {
        special = 'NND';
      } else if (offset === 18) {
        special = 'NAD';
      }
      throw special;
    }
  }
  const H0 = rad2deg(Math.acos(cosH0));
  return H0;
};

/**
 * Normalizes a fractional time of day to be on the correct date.
 * @param {number} m Fractional time of day
 * @param {int} utcOffset Offset in minutes from UTC.
 * @returns {number} m Normalized m.
 */
const normalizeM = function (m, utcOffset) {
  const localM = m + utcOffset / 1440;
  if (localM < 0) {
    return m + 1;
  } else if (localM > 1) {
    return m - 1;
  }
  return m;
};

/**
 * Calculates the correction for the solar transit time (see AA p103).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} Theta0 Apparent sidereal time at Greenwhich.
 * @param {number} DeltaT ΔT = TT − UT.
 * @param {number} L Longitude.
 * @param {number} m Fractional time of day of the event.
 * @returns {number} Currection for the solar transit time.
 */
const sunTransitCorrection = function (T, Theta0, DeltaT, L, m) {
  const theta0 = Theta0 + 360.985647 * m;
  const n = m + DeltaT / 864000;
  const alpha = interpolatedRa(T, n);
  const H = localHourAngle(theta0, L, alpha);
  const DeltaM = -H / 360;
  return DeltaM;
};

/**
 * Calculates the correction for the sunrise/sunset time (see AA p103).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} Theta0 Apparent sidereal time at Greenwhich.
 * @param {number} DeltaT ΔT = TT − UT.
 * @param {number} phi Latitude.
 * @param {number} L Longitude.
 * @param {number} m Fractional time of day of the event.
 * @param {number} offset number of degrees below the horizon for the desired
 *     event (50/60 for sunrise/set, 6 for civil, 12 for nautical, 18 for
 *     astronomical dawn/dusk.
 * @returns {number} Currection for the sunrise/sunset time.
 */
const sunRiseSetCorrection = function (T, Theta0, DeltaT, phi, L, m, offset) {
  const theta0 = Theta0 + 360.985647 * m;
  const n = m + DeltaT / 864000;
  const alpha = interpolatedRa(T, n);
  const delta = interpolatedDec(T, n);
  const H = localHourAngle(theta0, L, alpha);
  const h = altitude(phi, delta, H);
  const DeltaM = (h + offset) /
    (360 * cosd(delta) * cosd(phi) * sind(H));
  return DeltaM;
};

/**
 * Calculates the local hour angle of the sun (see AA p103).
 * @param {number} theta0 Sidereal time at Greenwhich in degrees.
 * @param {number} L Longitude.
 * @param {number} alpha Apparent right ascension of the sun.
 * @returns {number} Local hour angle of the sun.
 */
const localHourAngle = function (theta0, L, alpha) {
  // Signflip for longitude
  let H = reduceAngle(theta0 + L - alpha);
  if (H > 180) { H -= 360; }
  return H;
};

/**
 * Calculates the altitude of the sun above the horizon (see AA P93 Eq13.6).
 * @param {number} phi Latitude.
 * @param {number} delta Apparent declination of the sun.
 * @param {number} H Local hour angle of the sun.
 * @returns {number} Altitude of the sun above the horizon.
 */
const altitude = function (phi, delta, H) {
  const h = rad2deg(Math.asin(
    sind(phi) * sind(delta) +
    cosd(phi) * cosd(delta) * cosd(H)));
  return h;
};

/**
 * Interpolates the sun's right ascension (see AA p103).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} n Fractional time of day of the event corrected by ΔT.
 * @returns {number} Interpolated right ascension.
 */
const interpolatedRa = function (T, n) {
  const alpha1 = sunApparentRightAscension(T - (1 / 36525));
  const alpha2 = sunApparentRightAscension(T);
  const alpha3 = sunApparentRightAscension(T + (1 / 36525));
  // I don't understand why the RA has to be interpolated with normalization
  // but the Dec without, but the returned values are wrong otherwise...
  const alpha = interpolateFromThree(alpha1, alpha2, alpha3, n, true);
  return reduceAngle(alpha);
};

/**
 * Interpolates the sun's declination (see AA p103).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @param {number} n Fractional time of day of the event corrected by ΔT.
 * @returns {number} Interpolated declination.
 */
const interpolatedDec = function (T, n) {
  const delta1 = sunApparentDeclination(T - (1 / 36525));
  const delta2 = sunApparentDeclination(T);
  const delta3 = sunApparentDeclination(T + (1 / 36525));
  const delta = interpolateFromThree(delta1, delta2, delta3, n);
  return reduceAngle(delta);
};

/**
 * Calculates the apparent right ascension of the sun (see AA p165 Eq25.6).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Apparent right ascension of the sun.
 */
const sunApparentRightAscension = function (T) {
  const Omega = moonAscendingNodeLongitude$2(T);
  const epsilon = trueObliquityOfEcliptic(T) +
                  0.00256 * cosd(Omega);
  const lambda = sunApparentLongitude(T);
  const alpha = rad2deg(Math.atan2(
    cosd(epsilon) * sind(lambda), cosd(lambda)));
  return reduceAngle(alpha);
};

/**
 * Calculates the apparent declination of the sun (see AA p165 Eq25.7).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Apparent declination of the sun.
 */
const sunApparentDeclination = function (T) {
  const Omega = moonAscendingNodeLongitude$2(T);
  const epsilon = trueObliquityOfEcliptic(T) +
                  0.00256 * cosd(Omega);
  const lambda = sunApparentLongitude(T);
  const delta = rad2deg(Math.asin(
    sind(epsilon) * sind(lambda)));
  return delta;
};

/**
 * Calculates the apparent sidereal time at Greenwhich (see AA p88).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Apparent sidereal time at Greenwhich
 */
const apparentSiderealTimeGreenwhich = function (T) {
  const theta0 = meanSiderealTimeGreenwhich(T);
  const epsilon = trueObliquityOfEcliptic(T);
  const DeltaPsi = nutationInLongitude(T);
  const theta = theta0 + DeltaPsi * cosd(epsilon);
  return reduceAngle(theta);
};

/**
 * Calculates the mean sidereal time at Greenwhich (see AA p88 Eq12.4).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Mean sidereal time at Greenwhich
 */
const meanSiderealTimeGreenwhich = function (T) {
  const JD2000 = T * 36525;
  const theta0 = 280.46061837 + 360.98564736629 * JD2000 + 0.000387933 * T * T -
                 T * T * T / 38710000;
  return theta0;
};

/**
 * Calculates the true obliquity of the ecliptic (see AA p147).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} True obliquity of the ecliptic.
 */
const trueObliquityOfEcliptic = function (T) {
  const epsilon0 = meanObliquityOfEcliptic$1(T);
  const DeltaEpsilon = nutationInObliquity(T);
  const epsilon = epsilon0 + DeltaEpsilon;
  return epsilon;
};

/**
 * Calculates the mean obliquity of the ecliptic (see AA p147 Eq 22.3).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Mean obliquity of the ecliptic.
 */
const meanObliquityOfEcliptic$1 = function (T) {
  const U = T / 100;
  const epsilon0 = polynomial(U, meanObliquityOfEcliptic);
  return epsilon0;
};

/**
 * Calculates the apparent longitude of the sun (see AA p164).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Apparent longitude of the sun.
 */
const sunApparentLongitude = function (T) {
  const Sol = sunTrueLongitude(T);
  const Omega = moonAscendingNodeLongitude$2(T);
  const lambda = Sol - 0.00569 - 0.00478 * sind(Omega);
  return lambda;
};

/**
 * Calculates the true longitude of the sun (see AA p164).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} True longitude of the sun.
 */
const sunTrueLongitude = function (T) {
  const L0 = sunMeanLongitude$1(T);
  const C = sunEquationOfCenter(T);
  const Sol = L0 + C;
  return Sol;
};

/**
 * Calculates the equation of center of the sun (see AA p164).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Equation of center of the sun.
 */
const sunEquationOfCenter = function (T) {
  const M = sunMeanAnomaly$2(T);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M) +
            (0.019993 - 0.000101 * T) * sind(2 * M) +
            0.000290 * sind(3 * M);
  return C;
};

/**
 * Calculates the nutation in longitude of the sun (see AA p144ff).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Nutation in longitude of the sun.
 */
const nutationInLongitude = function (T) {
  const D = moonMeanElongation$1(T);
  const M = sunMeanAnomaly$2(T);
  const MPrime = moonMeanAnomaly$2(T);
  const F = moonArgumentOfLatitude$2(T);
  const Omega = moonAscendingNodeLongitude$2(T);
  let DeltaPsi = 0;
  let sineArg;
  for (let i = 0; i < 63; i++) {
    sineArg = nutations[i][0] * D +
              nutations[i][1] * M +
              nutations[i][2] * MPrime +
              nutations[i][3] * F +
              nutations[i][4] * Omega;
    DeltaPsi += (nutations[i][5] +
                 nutations[i][6] * T) * sind(sineArg);
  }
  DeltaPsi /= 36000000;
  return DeltaPsi;
};

/**
 * Calculates the nutation in obliquity of the sun (see AA p144ff).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Nutation in obliquity of the sun.
 */
const nutationInObliquity = function (T) {
  const D = moonMeanElongation$1(T);
  const M = sunMeanAnomaly$2(T);
  const MPrime = moonMeanAnomaly$2(T);
  const F = moonArgumentOfLatitude$2(T);
  const Omega = moonAscendingNodeLongitude$2(T);
  let DeltaEpsilon = 0;
  let cosArg;
  for (let i = 0; i < 63; i++) {
    cosArg = nutations[i][0] * D +
             nutations[i][1] * M +
             nutations[i][2] * MPrime +
             nutations[i][3] * F +
             nutations[i][4] * Omega;
    DeltaEpsilon += (nutations[i][7] +
                     nutations[i][8] * T) * cosd(cosArg);
  }
  DeltaEpsilon /= 36000000;
  return DeltaEpsilon;
};

/**
 * Calculates the argument of latitude of the moon (see AA p144).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Argument of latitude of the moon.
 */
const moonArgumentOfLatitude$2 = function (T) {
  const F = polynomial(T, moonArgumentOfLatitude$1);
  return reduceAngle(F);
};

/**
 * Calculates the longitude of the ascending node of the Moon's mean orbit on
 * the ecliptic, measured from the mean equinox of the datea (see AA p144).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Longitude of the asc. node of the moon's mean orbit.
 */
const moonAscendingNodeLongitude$2 = function (T) {
  const Omega = polynomial(T, moonAscendingNodeLongitude$1);
  return reduceAngle(Omega);
};

/**
 * Calculates the mean anomaly of the moon (see AA p144).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Mean anomaly of the moon.
 */
const moonMeanAnomaly$2 = function (T) {
  const MPrime = polynomial(T, moonMeanAnomaly$1);
  return reduceAngle(MPrime);
};

/**
 * Calculates the mean elongation of the moon from the sun (see AA p144).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Mean elongation of the moon from the sun.
 */
const moonMeanElongation$1 = function (T) {
  const D = polynomial(T, moonMeanElongation);
  return reduceAngle(D);
};

/**
 * Calculates the mean anomaly of the sun (see AA p144).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Mean anomaly of the sun.
 */
const sunMeanAnomaly$2 = function (T) {
  const M = polynomial(T, sunMeanAnomaly$1);
  return reduceAngle(M);
};

/**
 * Calculates the mean longitude of the sun referred to the mean equinox of the
 * date (see AA p163).
 * @param {number} T Fractional number of Julian centuries since
 *     2000-01-01T12:00:00Z.
 * @returns {number} Mean longitude of the sun referred to the mean equinox of
 *     the date.
 */
const sunMeanLongitude$1 = function (T) {
  const L0 = polynomial(T, sunMeanLongitude);
  return reduceAngle(L0);
};

const moment$2 = momentNs;

let roundToNearestMinute = false;
let returnTimeForPNMS = false;
let dateFormatKeys = {'**': '‡', '--': '†'};

/**
 * Sets options (roundToNearestMinute, returnTimeForPNMS, dateFormatKey) for the
 * module.
 * @param {object} options Options to be set.
 */
const options = function (options) {
  if (typeof options.roundToNearestMinute === 'boolean') {
    roundToNearestMinute = options.roundToNearestMinute;
  }
  if (typeof options.returnTimeForPNMS === 'boolean') {
    returnTimeForPNMS = options.returnTimeForPNMS;
  }
  if (typeof options.dateFormatKeys === 'object') {
    dateFormatKeys = options.dateFormatKeys;
  }
};

/**
 * Uses the extra information encoded into the moment object for dates without
 * a sunrise or sunset if returnTimeForPNMS is true to mark the output string.
 * @param {moment} datetime Input datetime.
 * @param {string} formatString Valid moment format string.
 * @returns {string} Formatted string with marker appended.
 */
const formatCI = function (datetime, formatString) {
  const customKey = datetime.creationData().input.slice(0, 2);
  let datestring = datetime.format(formatString);
  if (dateFormatKeys[customKey]) {
    datestring += dateFormatKeys[customKey];
  }
  return datestring;
};

/**
 * Calculates sunrise on the provided date.
 * @param {moment} datetime Datetime for which sunrise is calculated. Should
 *     always contain a timezone or be in UTC, lone UTC offsets might lead to
 *     unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of sunrise or a string indicating that the
 *     location experiences midnight sun ('MS') or polar night ('PN') on that
 *     date (unless returnTimeForPNMS is true).
 */
const sunrise = function (datetime, phi, L) {
  let sunrise;
  try {
    sunrise = sunRiseSet(datetime, phi, L, 'RISE');
  } catch (err) {
    return returnPNMS(err, datetime, 6);
  }
  return sunrise;
};

/**
 * Calculates sunset on the provided date.
 * @param {moment} datetime Datetime for which sunset is calculated. Should
 *     always contain a timezone or be in UTC, lone UTC offsets might lead to
 *     unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of sunset or a string indicating that the
 *     location experiences midnight sun ('MS') or polar night ('PN') on that
 *     date (unless returnTimeForPNMS is true).
 */
const sunset = function (datetime, phi, L) {
  let sunset;
  try {
    sunset = sunRiseSet(datetime, phi, L, 'SET');
  } catch (err) {
    return returnPNMS(err, datetime, 18);
  }
  return sunset;
};

/**
 * Calculates civil dawn (sun 6° below horizon) on the provided date.
 * @param {moment} datetime Datetime for which civil dawn is calculated. Should
 *     always contain a timezone or be in UTC, lone UTC offsets might lead to
 *     unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of civil dawn or a string ('NCD') indicating
 *     that the location does not experience civil dawn on that date (unless
 *     returnTimeForPNMS is true).
 */
const civilDawn = function (datetime, phi, L) {
  let civilDawn;
  try {
    civilDawn = sunRiseSet(datetime, phi, L, 'RISE', 6);
  } catch (err) {
    return returnPNMS(err, datetime, 5, 30);
  }
  return civilDawn;
};

/**
 * Calculates civil dusk (sun 6° below horizon) on the provided date.
 * @param {moment} datetime Datetime for which civil dusk is calculated. Should
 *     always contain a timezone or be in UTC, lone UTC offsets might lead to
 *     unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of civil dusk or a string ('NCD') indicating
 *     that the location does not experience civil dusk on that date (unless
 *     returnTimeForPNMS is true).
 */
const civilDusk = function (datetime, phi, L) {
  let civilDusk;
  try {
    civilDusk = sunRiseSet(datetime, phi, L, 'SET', 6);
  } catch (err) {
    return returnPNMS(err, datetime, 18, 30);
  }
  return civilDusk;
};

/**
 * Calculates nautical dawn (sun 12° below horizon) on the provided date.
 * @param {moment} datetime Datetime for which nautical dawn is calculated.
 *     Should always contain a timezone or be in UTC, lone UTC offsets might
 *     lead to unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of nautical dawn or a string ('NND')
 *     indicating that the location does not experience nautical dawn on that
 *     date (unless returnTimeForPNMS is true).
 */
const nauticalDawn = function (datetime, phi, L) {
  let nauticalDawn;
  try {
    nauticalDawn = sunRiseSet(datetime, phi, L, 'RISE', 12);
  } catch (err) {
    return returnPNMS(err, datetime, 5);
  }
  return nauticalDawn;
};

/**
 * Calculates nautical dusk (sun 12° below horizon) on the provided date.
 * @param {moment} datetime Datetime for which nautical dusk is calculated.
 *     Should always contain a timezone or be in UTC, lone UTC offsets might
 *     lead to unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of nautical dusk or a string ('NND')
 *     indicating that the location does not experience nautical dusk on that
 *     date (unless returnTimeForPNMS is true).
 */
const nauticalDusk = function (datetime, phi, L) {
  let nauticalDusk;
  try {
    nauticalDusk = sunRiseSet(datetime, phi, L, 'SET', 12);
  } catch (err) {
    return returnPNMS(err, datetime, 19);
  }
  return nauticalDusk;
};

/**
 * Calculates astronomical dawn (sun 18° below horizon) on the provided date.
 * @param {moment} datetime Datetime for which astronomical dawn is calculated.
 *     Should always contain a timezone or be in UTC, lone UTC offsets might
 *     lead to unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of astronomical dawn or a string ('NAD')
 *     indicating that the location does not experience astronomical dawn on
 *     that date (unless returnTimeForPNMS is true).
 */
const astronomicalDawn = function (datetime, phi, L) {
  let astronomicalDawn;
  try {
    astronomicalDawn = sunRiseSet(datetime, phi, L, 'RISE', 18);
  } catch (err) {
    return returnPNMS(err, datetime, 4, 30);
  }
  return astronomicalDawn;
};

/**
 * Calculates astronomical dusk (sun 18° below horizon) on the provided date.
 * @param {moment} datetime Datetime for which astronomical dusk is calculated.
 *     Should always contain a timezone or be in UTC, lone UTC offsets might
 *     lead to unexpected behaviour.
 * @param {number} phi Latitude of target location.
 * @param {number} L longitude of target location.
 * @returns {(moment|string)} Time of astronomical dusk or a string ('NAD')
 *     indicating that the location does not experience astronomical dusk on
 *     that date (unless returnTimeForPNMS is true).
 */
const astronomicalDusk = function (datetime, phi, L) {
  let astronomicalDusk;
  try {
    astronomicalDusk = sunRiseSet(datetime, phi, L, 'SET', 18);
  } catch (err) {
    return returnPNMS(err, datetime, 19, 30);
  }
  return astronomicalDusk;
};

/**
 * Calculates solar noon on the provided date.
 * @param {moment} datetime Datetime for which solar noon is calculated. Should
 *     always contain a timezone or be in UTC, lone UTC offsets might lead to
 *     unexpected behaviour.
 * @param {number} L longitude of target location.
 * @returns {moment} Time of solar noon at the given longitude.
 */
const solarNoon = function (datetime, L) {
  const transit = sunTransit(datetime, L);
  return transit;
};

/**
 * Calculates all moons of the given phase that occur within the given
 * Gregorian calendar year.
 * @param {int} year Year for which moon phases should be calculated.
 * @param {int} phase 0 -> new moon, 1 -> first quarter,
 *                    2 -> full moon, 3 -> last quarter.
 * @param {string} timezone Optional: IANA timezone string.
 * @returns {array} Array of moment objects for moons of the given phase.
 */
const yearMoonPhases = function (year, phase, timezone) {
  const yearBegin = moment$2([year]);
  const yearEnd = moment$2([year + 1]);
  // this will give us k for the first new moon of the year or earlier
  let k = Math.floor(approxK(yearBegin)) - 1;
  // taking 15 events will make sure we catch every event in the year
  const phaseTimes = [];
  let JDE;
  let moonDatetime;
  let DeltaT$1;
  for (let i = 0; i < 15; i++) {
    JDE = truePhase(k, phase);
    // we pretend it's JD and not JDE
    moonDatetime = JDToDatetime(JDE);
    // now use that to calculate deltaT
    DeltaT$1 = DeltaT(moonDatetime);
    if (DeltaT$1 > 0) {
      moonDatetime.subtract(Math.abs(DeltaT$1), 'seconds');
    } else {
      moonDatetime.add(Math.abs(DeltaT$1), 'seconds');
    }
    if (roundToNearestMinute) {
      moonDatetime.add(30, 'seconds');
      moonDatetime.second(0);
    }
    if (typeof timezone === 'undefined') {
      timezone = 'UTC';
    }
    moonDatetime.tz(timezone);
    if ((moonDatetime.isAfter(yearBegin)) && (moonDatetime.isBefore(yearEnd))) {
      phaseTimes.push(moonDatetime);
    }
    k++;
  }
  return phaseTimes;
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  options: options,
  formatCI: formatCI,
  sunrise: sunrise,
  sunset: sunset,
  civilDawn: civilDawn,
  civilDusk: civilDusk,
  nauticalDawn: nauticalDawn,
  nauticalDusk: nauticalDusk,
  astronomicalDawn: astronomicalDawn,
  astronomicalDusk: astronomicalDusk,
  solarNoon: solarNoon,
  yearMoonPhases: yearMoonPhases,
  get roundToNearestMinute () { return roundToNearestMinute; },
  get returnTimeForPNMS () { return returnTimeForPNMS; }
});

const month = {
  1: 'Bahá',
  2: 'Jalál',
  3: 'Jamál',
  4: '‘Aẓamat',
  5: 'Núr',
  6: 'Raḥmat',
  7: 'Kalimát',
  8: 'Kamál',
  9: 'Asmá’',
  10: '‘Izzat',
  11: 'Ma_sh_íyyat',
  12: '‘Ilm',
  13: 'Qudrat',
  14: 'Qawl',
  15: 'Masá’il',
  16: '_Sh_araf',
  17: 'Sulṭán',
  18: 'Mulk',
  19: '‘Alá’',
  20: 'Ayyám-i-Há'
};

const monthL = {
  1: 'Splendour',
  2: 'Glory',
  3: 'Beauty',
  4: 'Grandeur',
  5: 'Light',
  6: 'Mercy',
  7: 'Words',
  8: 'Perfection',
  9: 'Names',
  10: 'Might',
  11: 'Will',
  12: 'Knowledge',
  13: 'Power',
  14: 'Speech',
  15: 'Questions',
  16: 'Honour',
  17: 'Sovereignty',
  18: 'Dominion',
  19: 'Loftiness',
  20: 'Ayyám-i-Há'
};

const holyDay = {
  1: 'Naw-Rúz',
  2: 'First day of Riḍván',
  3: 'Ninth day of Riḍván',
  4: 'Twelfth day of Riḍván',
  5: 'Declaration of the Báb',
  6: 'Ascension of Bahá’u’lláh',
  7: 'Martyrdom of the Báb',
  8: 'Birth of the Báb',
  9: 'Birth of Bahá’u’lláh',
  10: 'Day of the Covenant',
  11: 'Ascension of ‘Abdu’l-Bahá'
};

// CAREFUL: Numbering corresponds to Badí' week, i.e. 1 is Jalál (-> Saturday)
const weekday = {
  1: 'Jalál',
  2: 'Jamál',
  3: 'Kamál',
  4: 'Fiḍál',
  5: '‘Idál',
  6: 'Istijlál',
  7: 'Istiqlál'
};

const weekdayAbbr3 = {
  1: 'Jal',
  2: 'Jam',
  3: 'Kam',
  4: 'Fiḍ',
  5: '‘Idá',
  6: 'Isj',
  7: 'Isq'
};

const weekdayAbbr2 = {
  1: 'Jl',
  2: 'Jm',
  3: 'Ka',
  4: 'Fi',
  5: '‘Id',
  6: 'Ij',
  7: 'Iq'
};

const weekdayL = {
  1: 'Glory',
  2: 'Beauty',
  3: 'Perfection',
  4: 'Grace',
  5: 'Justice',
  6: 'Majesty',
  7: 'Independence'
};

const yearInVahid = {
  1: 'Alif',
  2: 'Bá’',
  3: 'Ab',
  4: 'Dál',
  5: 'Báb',
  6: 'Váv',
  7: 'Abad',
  8: 'Jád',
  9: 'Bahá',
  10: 'Ḥubb',
  11: 'Bahháj',
  12: 'Javáb',
  13: 'Aḥad',
  14: 'Vahháb',
  15: 'Vidád',
  16: 'Badí‘',
  17: 'Bahí',
  18: 'Abhá',
  19: 'Váḥid'
};

const vahid = 'Váḥid';
const kulliShay = 'Kull-i-_Sh_ay’';
const BE = 'B.E.';
const badiCalendar = 'Badí‘ Calendar';
const digitUnicodeOffset = '0'.charCodeAt(0);
const defaultFormat = 'd MM+ y BE';

var en = /*#__PURE__*/Object.freeze({
  __proto__: null,
  month: month,
  monthL: monthL,
  holyDay: holyDay,
  weekday: weekday,
  weekdayAbbr3: weekdayAbbr3,
  weekdayAbbr2: weekdayAbbr2,
  weekdayL: weekdayL,
  yearInVahid: yearInVahid,
  vahid: vahid,
  kulliShay: kulliShay,
  BE: BE,
  badiCalendar: badiCalendar,
  digitUnicodeOffset: digitUnicodeOffset,
  defaultFormat: defaultFormat
});

const month$1 = {
  1: 'البهاء',
  2: 'الجلال',
  3: 'الجمال',
  4: 'العظمة',
  5: 'النور',
  6: 'الرحمة',
  7: 'الكلمات',
  8: 'الكمال',
  9: 'الأسماء',
  10: 'العزّة',
  11: 'المشية',
  12: 'العلم',
  13: 'القدرة',
  14: 'القول',
  15: 'المسائل',
  16: 'الشرف',
  17: 'السلطان',
  18: 'الملك',
  19: 'العلاء',
  20: 'ايام الهاء'
};

const monthL$1 = month$1;

const holyDay$1 = {
  1: 'عيد النَّيروز',
  2: 'اليوم الأول من عيد الرِّضوان',
  3: 'اليوم التاسع من عيد الرِّضوان',
  4: 'اليوم الثاني عشر من عيد الرِّضوان',
  5: 'يوم إعلان دعوة حضرة الباب',
  6: 'يوم صعود حضرة بهاء الله',
  7: 'يوم استشهاد حضرة الباب',
  8: 'يوم ولادة حضرة الباب',
  9: 'يوم ولادة حضرة بهاء الله',
  10: 'يوم الميثاق',
  11: 'يوم صعود حضرة عبد البهاء'
};

const weekday$1 = {
  1: 'الجلال',
  2: 'الجمال',
  3: 'الكمال',
  4: 'الفضّال',
  5: 'العدّال',
  6: 'الأستجلال',
  7: 'الاستقلال'
};

const weekdayAbbr3$1 = {
  1: 'جلا',
  2: 'جما',
  3: 'كما',
  4: 'فضّا',
  5: 'عدّا',
  6: 'اسج',
  7: 'اسق'
};

const weekdayAbbr2$1 = {
  1: 'جل',
  2: 'جم',
  3: 'كم',
  4: 'فض',
  5: 'عد',
  6: 'اج',
  7: 'اق'
};

const weekdayL$1 = {
  1: 'الجلال',
  2: 'الجمال',
  3: 'الكمال',
  4: 'الفضّال',
  5: 'العدّال',
  6: 'الأستجلال',
  7: 'أستقلال'
};

const yearInVahid$1 = {
  1: 'ألف',
  2: 'باء',
  3: 'أب',
  4: 'دﺍﻝ',
  5: 'باب',
  6: 'وﺍو',
  7: 'أبد',
  8: 'جاد',
  9: 'بهاء',
  10: 'حب',
  11: 'بهاج',
  12: 'جواب',
  13: 'احد',
  14: 'وﻫﺎب',
  15: 'وداد',
  16: 'بدیع',
  17: 'بهي',
  18: 'ابهى',
  19: 'واحد'
};

const vahid$1 = 'واحد';
const kulliShay$1 = 'كل شيء';
const BE$1 = 'بديع';
const badiCalendar$1 = 'تقويم بديع';
const digitUnicodeOffset$1 = '٠'.charCodeAt(0);
const defaultFormat$1 = '&#8207;d MM y BE&#8207;';

var ar = /*#__PURE__*/Object.freeze({
  __proto__: null,
  month: month$1,
  monthL: monthL$1,
  holyDay: holyDay$1,
  weekday: weekday$1,
  weekdayAbbr3: weekdayAbbr3$1,
  weekdayAbbr2: weekdayAbbr2$1,
  weekdayL: weekdayL$1,
  yearInVahid: yearInVahid$1,
  vahid: vahid$1,
  kulliShay: kulliShay$1,
  BE: BE$1,
  badiCalendar: badiCalendar$1,
  digitUnicodeOffset: digitUnicodeOffset$1,
  defaultFormat: defaultFormat$1
});

const monthL$2 = {
  1: 'Herrlichkeit',
  2: 'Ruhm',
  3: 'Schönheit',
  4: 'Größe',
  5: 'Licht',
  6: 'Barmherzigkeit',
  7: 'Worte',
  8: 'Vollkommenheit',
  9: 'Namen',
  10: 'Macht',
  11: 'Wille',
  12: 'Wissen',
  13: 'Kraft',
  14: 'Sprache',
  15: 'Fragen',
  16: 'Ehre',
  17: 'Souveränität',
  18: 'Herrschaft',
  19: 'Erhabenheit',
  20: 'Ayyám-i-Há'
};

const holyDay$2 = {
  1: 'Naw-Rúz',
  2: 'Erster Riḍván-Tag',
  3: 'Neunter Riḍván-Tag',
  4: 'Zwölfter Riḍván-Tag',
  5: 'Erklärung des Báb',
  6: 'Hinscheiden Bahá’u’lláhs',
  7: 'Märtyrertod des Báb',
  8: 'Geburt des Báb',
  9: 'Geburt Bahá’u’lláhs',
  10: 'Tag des Bundes',
  11: 'Hinscheiden ‘Abdu’l-Bahás'
};

const weekdayL$2 = {
  1: 'Ruhm',
  2: 'Schönheit',
  3: 'Vollkommenheit',
  4: 'Gnade',
  5: 'Gerechtigkeit',
  6: 'Majestät',
  7: 'Unabhängigkeit'
};

const BE$2 = 'B.E.';
const badiCalendar$2 = 'Badí‘ Kalender';

var de = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$2,
  holyDay: holyDay$2,
  weekdayL: weekdayL$2,
  BE: BE$2,
  badiCalendar: badiCalendar$2
});

const monthL$3 = {
  1: 'Esplendor',
  2: 'Gloria',
  3: 'Belleza',
  4: 'Grandeza',
  5: 'Luz',
  6: 'Misericordia',
  7: 'Palabras',
  8: 'Perfección',
  9: 'Nombres',
  10: 'Fuerza',
  11: 'Voluntad',
  12: 'Conocimiento',
  13: 'Poder',
  14: 'Discurso',
  15: 'Preguntas',
  16: 'Honor',
  17: 'Soberanía',
  18: 'Dominio',
  19: 'Sublimidad',
  20: 'Ayyám-i-Há'
};

const holyDay$3 = {
  1: 'Naw-Rúz',
  2: 'Primer día de Riḍván',
  3: 'Noveno día de Riḍván',
  4: 'Duodécimo día de Riḍván',
  5: 'Declaración del Báb',
  6: 'Ascensión de Bahá’u’lláh',
  7: 'Martirio del Báb',
  8: 'Nacimiento del Báb',
  9: 'Nacimiento de Bahá’u’lláh',
  10: 'Día de la Alianza',
  11: 'Fallecimiento de ‘Abdu’l-Bahá'
};

const weekdayL$3 = {
  1: 'Gloria',
  2: 'Belleza',
  3: 'Perfección',
  4: 'Gracia',
  5: 'Justicia',
  6: 'Majestuosidad',
  7: 'Independencia'
};

const BE$3 = 'E.B.';
const badiCalendar$3 = 'Calendario Badí‘';

var es = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$3,
  holyDay: holyDay$3,
  weekdayL: weekdayL$3,
  BE: BE$3,
  badiCalendar: badiCalendar$3
});

const month$2 = {
  1: 'البهاء',
  2: 'الجلال',
  3: 'الجمال',
  4: 'العظمة',
  5: 'النور',
  6: 'الرحمة',
  7: 'الكلمات',
  8: 'الكمال',
  9: 'الأسماء',
  10: 'العزّة',
  11: 'المشية',
  12: 'العلم',
  13: 'القدرة',
  14: 'القول',
  15: 'المسائل',
  16: 'الشرف',
  17: 'السلطان',
  18: 'الملك',
  19: 'العلاء',
  20: 'ايام الهاء'
};

const monthL$4 = {
  1: 'بهاء',
  2: 'جلال',
  3: 'جمال',
  4: 'عظمت',
  5: 'نور',
  6: 'رحمت',
  7: 'كلمات',
  8: 'كمال',
  9: 'أسماء',
  10: 'عزّت',
  11: 'مشيت',
  12: 'علم',
  13: 'قدرت',
  14: 'قول',
  15: 'مسائل',
  16: 'شرف',
  17: 'سلطان',
  18: 'ملك',
  19: 'علاء',
  20: 'ايام ها'
};

const holyDay$4 = {
  1: 'عید نوروز',
  2: 'روز اوّل عید رضوان',
  3: 'روز نهم عید رضوان',
  4: 'روز دوازدهم عید رضوان',
  5: 'بعثت حضرت باب',
  6: 'صعود حضرت بهاالله',
  7: 'شهادت حضرت اعلی',
  8: 'تولّد حضرت اعلی',
  9: 'تولّد حضرت بهالله',
  10: 'روز عهد و میثاق',
  11: 'صعود حضرت عبدالبها'
};

const weekday$2 = {
  1: 'یوم الجلال',
  2: 'یوم الجمال',
  3: 'یوم الكمال',
  4: 'یوم الفضّال',
  5: 'یوم العدّال',
  6: 'یوم الأستجلال',
  7: 'یوم الاستقلال'
};

const weekdayAbbr3$2 = {
  1: 'جلا',
  2: 'جما',
  3: 'كما',
  4: 'فضّا',
  5: 'عدّا',
  6: 'اسج',
  7: 'اسق'
};

const weekdayAbbr2$2 = {
  1: 'جل',
  2: 'جم',
  3: 'كم',
  4: 'فض',
  5: 'عد',
  6: 'اج',
  7: 'اق'
};

const weekdayL$4 = {
  1: 'جلال',
  2: 'جمال',
  3: 'كمال',
  4: 'فضّال',
  5: 'عدّال',
  6: 'استجلال',
  7: 'استقلال'
};

const yearInVahid$2 = {
  1: 'ألف',
  2: 'باء',
  3: 'أب',
  4: 'دﺍﻝ',
  5: 'باب',
  6: 'وﺍو',
  7: 'أبد',
  8: 'جاد',
  9: 'بهاء',
  10: 'حب',
  11: 'بهاج',
  12: 'جواب',
  13: 'احد',
  14: 'وﻫﺎب',
  15: 'وداد',
  16: 'بدیع',
  17: 'بهي',
  18: 'ابهى',
  19: 'واحد'
};

const vahid$2 = 'واحد';
const kulliShay$2 = 'كل شيء';
const BE$4 = 'بديع';
const badiCalendar$4 = 'تقويم بديع';
const digitUnicodeOffset$2 = '۰'.charCodeAt(0);
const defaultFormat$2 = '&#8207;d MML y BE&#8207;';

var fa = /*#__PURE__*/Object.freeze({
  __proto__: null,
  month: month$2,
  monthL: monthL$4,
  holyDay: holyDay$4,
  weekday: weekday$2,
  weekdayAbbr3: weekdayAbbr3$2,
  weekdayAbbr2: weekdayAbbr2$2,
  weekdayL: weekdayL$4,
  yearInVahid: yearInVahid$2,
  vahid: vahid$2,
  kulliShay: kulliShay$2,
  BE: BE$4,
  badiCalendar: badiCalendar$4,
  digitUnicodeOffset: digitUnicodeOffset$2,
  defaultFormat: defaultFormat$2
});

const monthL$5 = {
  1: 'Splendeur',
  2: 'Gloire',
  3: 'Beauté',
  4: 'Grandeur',
  5: 'Lumière',
  6: 'Miséricorde',
  7: 'Paroles',
  8: 'Perfection',
  9: 'Noms',
  10: 'Puissance',
  11: 'Volonté',
  12: 'Connaissance',
  13: 'Pouvoir',
  14: 'Discours',
  15: 'Questions',
  16: 'Honneur',
  17: 'Souveraineté',
  18: 'Empire',
  19: 'Élévation',
  20: 'Ayyám-i-Há'
};

const holyDay$5 = {
  1: 'Naw-Rúz',
  2: 'Premier jour de Riḍván',
  3: 'Neuvième jour de Riḍván',
  4: 'Douzième jour de Riḍván',
  5: 'Déclaration du Báb',
  6: 'Ascension de Bahá’u’lláh',
  7: 'Martyre du Báb',
  8: 'Naissance du Báb',
  9: 'Naissance de Bahá’u’lláh',
  10: 'Jour de l’Alliance',
  11: 'Ascension de ‘Abdu’l-Bahá'
};

const weekdayL$5 = {
  1: 'Gloire',
  2: 'Beauté',
  3: 'Perfection',
  4: 'Grâce',
  5: 'Justice',
  6: 'Majesté',
  7: 'Indépendance'
};

const BE$5 = 'E.B.';
const badiCalendar$5 = 'Calendrier Badí‘';

var fr = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$5,
  holyDay: holyDay$5,
  weekdayL: weekdayL$5,
  BE: BE$5,
  badiCalendar: badiCalendar$5
});

const monthL$6 = {
  1: 'Spožums',
  2: 'Slava',
  3: 'Skaistums',
  4: 'Dižums',
  5: 'Gaisma',
  6: 'Žēlastība',
  7: 'Vārdi',
  8: 'Pilnība',
  9: 'Nosaukumi',
  10: 'Varenība',
  11: 'Griba',
  12: 'Zināšanas',
  13: 'Vara',
  14: 'Runa',
  15: 'Jautājumi',
  16: 'Gods',
  17: 'Suverenitāte',
  18: 'Valdīšana',
  19: 'Cēlums',
  20: 'Ayyám-i-Há'
};

const holyDay$6 = {
  1: 'Naw-Rúz',
  2: 'Riḍván pirmā diena',
  3: 'Riḍván devītā diena',
  4: 'Riḍván divpadsmitā diena',
  5: 'Bába paziņojums',
  6: 'Bahá’u’lláh Debessbraukšana',
  7: 'Bába mocekļa nāve',
  8: 'Bába dzimšanas diena',
  9: 'Bahá’u’lláh dzimšanas diena',
  10: 'Derības diena',
  11: '‘Abdu’l-Bahá Debessbraukšana'
};

const weekdayL$6 = {
  1: 'Slava',
  2: 'Skaistums',
  3: 'Pilnība',
  4: 'Žēlastība',
  5: 'Taisnīgums',
  6: 'Majestātiskums',
  7: 'Neatkarība'
};

const BE$6 = 'B.Ē.';
const badiCalendar$6 = 'Badí‘ kalendārs';

var lv = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$6,
  holyDay: holyDay$6,
  weekdayL: weekdayL$6,
  BE: BE$6,
  badiCalendar: badiCalendar$6
});

const monthL$7 = {
  1: 'Pracht',
  2: 'Heerlijkheid',
  3: 'Schoonheid',
  4: 'Grootheid',
  5: 'Licht',
  6: 'Barmhartigheid',
  7: 'Woorden',
  8: 'Volmaaktheid',
  9: 'Namen',
  10: 'Macht',
  11: 'Wil',
  12: 'Kennis',
  13: 'Kracht',
  14: 'Spraak',
  15: 'Vragen',
  16: 'Eer',
  17: 'Soevereiniteit',
  18: 'Heerschappij',
  19: 'Verhevenheid',
  20: 'Ayyám-i-Há'
};

const holyDay$7 = {
  1: 'Naw-Rúz',
  2: 'Eerste dag van Riḍván',
  3: 'Negende dag van Riḍván',
  4: 'Twaalfde dag van Riḍván',
  5: 'Verkondiging van de Báb',
  6: 'Heengaan van Bahá’u’lláh',
  7: 'Marteldood van de Báb',
  8: 'Geboortedag van de Báb',
  9: 'Geboortedag van Bahá’u’lláh',
  10: 'Dag van het Verbond',
  11: 'Heengaan van ‘Abdu’l-Bahá'
};

const weekdayL$7 = {
  1: 'Heerlijkheid',
  2: 'Schoonheid',
  3: 'Volmaaktheid',
  4: 'Genade',
  5: 'Gerechtigheid',
  6: 'Majesteit',
  7: 'Onafhankelijkheid'
};

const BE$7 = 'B.E.';
const badiCalendar$7 = 'Badí‘-Kalender';

var nl = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$7,
  holyDay: holyDay$7,
  weekdayL: weekdayL$7,
  BE: BE$7,
  badiCalendar: badiCalendar$7
});

const monthL$8 = {
  1: 'Esplendor',
  2: 'Glória',
  3: 'Beleza',
  4: 'Grandeza',
  5: 'Luz',
  6: 'Miséricórdia',
  7: 'Palavras',
  8: 'Perfeição',
  9: 'Nomes',
  10: 'Potência',
  11: 'Vontade',
  12: 'Conhecimento',
  13: 'Poder',
  14: 'Discurso',
  15: 'Perguntas',
  16: 'Honra',
  17: 'Soberania',
  18: 'Domínio',
  19: 'Sublimidade',
  20: 'Ayyám-i-Há'
};

const holyDay$8 = {
  1: 'Naw-Rúz',
  2: '1º dia do Riḍván',
  3: '9º dia do Riḍván',
  4: '12º dia do Riḍván',
  5: 'Declaração do Báb',
  6: 'Ascensão de Bahá’u’lláh',
  7: 'Martírio do Báb',
  8: 'Aniversário do Báb',
  9: 'Aniversário de Bahá’u’lláh',
  10: 'Dia do Convênio',
  11: 'Ascensão de ‘Abdu’l-Bahá'
};

const weekdayL$8 = {
  1: 'Glória',
  2: 'Beleza',
  3: 'Perfeição',
  4: 'Graça',
  5: 'Justiça',
  6: 'Majestade',
  7: 'Independência'
};

const BE$8 = 'E.B.';
const badiCalendar$8 = 'Calendário Badí‘';

var pt = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$8,
  holyDay: holyDay$8,
  weekdayL: weekdayL$8,
  BE: BE$8,
  badiCalendar: badiCalendar$8
});

const month$3 = {
  1: 'Бахā',
  2: 'Джалāл',
  3: 'Джамāл',
  4: '‘Аз̣амат',
  5: 'Нӯр',
  6: 'Рах̣мат',
  7: 'Калимāт',
  8: 'Камāл',
  9: 'Асмā’',
  10: '‘Иззат',
  11: 'Машӣййат',
  12: '‘Илм',
  13: 'К̣удрат',
  14: 'К̣аул',
  15: 'Масā’ил',
  16: 'Шараф',
  17: 'Султ̣ан',
  18: 'Мулк',
  19: '‘Алā’',
  20: 'Аййāм-и Хā'
};

const monthL$9 = {
  1: 'Великолепие',
  2: 'Слава',
  3: 'Красота',
  4: 'Величие',
  5: 'Свет',
  6: 'Милость',
  7: 'Слова',
  8: 'Совершенство',
  9: 'Имена',
  10: 'Мощь',
  11: 'Воля',
  12: 'Знание',
  13: 'Могущество',
  14: 'Речь',
  15: 'Вопросы',
  16: 'Честь',
  17: 'Владычество',
  18: 'Господство',
  19: 'Возвышенность',
  20: 'Аййāм-и Хā'
};

const holyDay$9 = {
  1: 'Нау-Рӯз',
  2: '1-й день Рид̣вāна',
  3: '9-й день Рид̣вāна',
  4: '12-й день Рид̣вāна',
  5: 'Возвещение Баба',
  6: 'Вознесение Бахауллы',
  7: 'Мученическая Баба',
  8: 'рождения Баба',
  9: 'рождения Бахауллы',
  10: 'День Завета',
  11: 'Вознесение Абдул-Баха'
};

const weekday$3 = {
  1: 'Джалāл',
  2: 'Джамāл',
  3: 'Камāл',
  4: 'Фид̣āл',
  5: '‘Идāл',
  6: 'Истиджлāл',
  7: 'Истик̣лāл'
};

const weekdayAbbr3$3 = {
  1: 'Джл',
  2: 'Джм',
  3: 'Кам',
  4: 'Фид̣',
  5: '‘Идā',
  6: 'Исд',
  7: 'Иск̣'
};

const weekdayAbbr2$3 = {
  1: 'Дл',
  2: 'Дм',
  3: 'Ка',
  4: 'Фи',
  5: '‘Ид',
  6: 'Ид',
  7: 'Ик̣'
};

const weekdayL$9 = {
  1: 'Слава',
  2: 'Красота',
  3: 'Совершенство',
  4: 'Благодать',
  5: 'Справедливость',
  6: 'Величие',
  7: 'Независимость'
};

const yearInVahid$3 = {
  1: 'Алиф',
  2: 'Бā’',
  3: 'Аб',
  4: 'Дāл',
  5: 'Бāб',
  6: 'Вāв',
  7: 'Абад',
  8: 'Джāд',
  9: 'Бахā',
  10: 'Х̣убб',
  11: 'Баххāдж',
  12: 'Джавāб',
  13: 'Ах̣ад',
  14: 'Ваххāб',
  15: 'Видāд',
  16: 'Бадӣ‘',
  17: 'Бахӣ',
  18: 'Абхā',
  19: 'Вāх̣ид'
};

const vahid$3 = 'Вāх̣ид';
const kulliShay$3 = 'кулл-и шай’';
const BE$9 = 'Э.Б.';
const badiCalendar$9 = 'Календарь Бадӣ‘';

var ru = /*#__PURE__*/Object.freeze({
  __proto__: null,
  month: month$3,
  monthL: monthL$9,
  holyDay: holyDay$9,
  weekday: weekday$3,
  weekdayAbbr3: weekdayAbbr3$3,
  weekdayAbbr2: weekdayAbbr2$3,
  weekdayL: weekdayL$9,
  yearInVahid: yearInVahid$3,
  vahid: vahid$3,
  kulliShay: kulliShay$3,
  BE: BE$9,
  badiCalendar: badiCalendar$9
});

const monthL$a = {
  1: 'Praktfullhet',
  2: 'Härlighet',
  3: 'Skönhet',
  4: 'Storhet',
  5: 'Ljus',
  6: 'Barmhärtighet',
  7: 'Ord',
  8: 'Fullkomlighet',
  9: 'Namn',
  10: 'Makt',
  11: 'Vilja',
  12: 'Kunskap',
  13: 'Kraft',
  14: 'Tal',
  15: 'Frågor',
  16: 'Ära',
  17: 'Överhöghet',
  18: 'Herravälde',
  19: 'Upphöjdhet',
  20: 'Ayyám-i-Há'
};

const holyDay$a = {
  1: 'Naw-Rúz',
  2: 'Första Riḍván',
  3: 'Nionde Riḍván',
  4: 'Tolfte Riḍván',
  5: 'Bábs Deklaration',
  6: 'Bahá’u’lláhs Bortgång',
  7: 'Bábs Martyrskap',
  8: 'Bábs Födelse',
  9: 'Bahá’u’lláhs Födelse',
  10: 'Förbundets dag',
  11: '‘Abdu’l-Bahás Bortgång'
};

const weekdayL$a = {
  1: 'Härlighet',
  2: 'Skönhet',
  3: 'Fullkomlighet',
  4: 'Nåd',
  5: 'Rättvisa',
  6: 'Majestät',
  7: 'Oberoende'
};

const BE$a = 'B.E.';
const badiCalendar$a = 'Badí‘kalendern';

var sv = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$a,
  holyDay: holyDay$a,
  weekdayL: weekdayL$a,
  BE: BE$a,
  badiCalendar: badiCalendar$a
});

const month$4 = {
  1: '巴哈',
  2: '贾拉勒',
  3: '贾迈勒',
  4: '阿泽迈特',
  5: '努尔',
  6: '拉赫迈特',
  7: '凯利马特',
  8: '卡迈勒',
  9: '艾斯玛',
  10: '伊扎特',
  11: '迈希耶特',
  12: '伊勒姆',
  13: '古德雷特',
  14: '高勒',
  15: '迈萨伊勒',
  16: '谢拉夫',
  17: '苏丹',
  18: '穆勒克',
  19: '阿拉',
  20: '阿亚米哈'
};

const monthL$b = {
  1: '耀',
  2: '辉',
  3: '美',
  4: '宏',
  5: '光',
  6: '仁',
  7: '言',
  8: '完',
  9: '名',
  10: '能',
  11: '意',
  12: '知',
  13: '力',
  14: '语',
  15: '问',
  16: '尊',
  17: '权',
  18: '统',
  19: '崇',
  20: '哈之日'
};

const holyDay$b = {
  1: '诺鲁孜节',
  2: '里兹万节第一日',
  3: '里兹万节第九日',
  4: '里兹万节第十二日',
  5: '巴孛宣示日',
  6: '巴哈欧拉升天日',
  7: '巴孛殉道日',
  8: '巴孛诞辰',
  9: '巴哈欧拉诞辰',
  10: '圣约日',
  11: '阿博都-巴哈升天日'
};

const weekday$4 = {
  1: '贾拉勒',
  2: '贾迈勒',
  3: '卡迈勒',
  4: '菲达勒',
  5: '伊达勒',
  6: '伊斯提杰拉勒',
  7: '伊斯提格拉勒'
};

const weekdayAbbr3$4 = {
  1: '贾拉勒',
  2: '贾迈勒',
  3: '卡迈勒',
  4: '菲达勒',
  5: '伊达勒',
  6: '伊斯杰',
  7: '伊斯格'
};

const weekdayAbbr2$4 = {
  1: '贾拉',
  2: '贾迈',
  3: '卡迈',
  4: '菲达',
  5: '伊达',
  6: '伊杰',
  7: '伊格'
};

const weekdayL$b = {
  1: '辉日',
  2: '美日',
  3: '完日',
  4: '恩日',
  5: '正日',
  6: '威日',
  7: '独日'
};

const yearInVahid$4 = {
  1: '艾利夫',
  2: '巴',
  3: '艾卜',
  4: '达勒',
  5: '巴卜',
  6: '瓦乌',
  7: '阿巴德',
  8: '贾德',
  9: '巴哈',
  10: '胡卜',
  11: '巴哈杰',
  12: '贾瓦卜',
  13: '阿哈德',
  14: '瓦哈卜',
  15: '维达德',
  16: '巴迪',
  17: '巴希',
  18: '阿卜哈',
  19: '瓦希德'
};

const vahid$4 = '瓦希德';
const kulliShay$4 = '库里沙伊';
const BE$b = 'BE';
const badiCalendar$b = '巴迪历';

var zh = /*#__PURE__*/Object.freeze({
  __proto__: null,
  month: month$4,
  monthL: monthL$b,
  holyDay: holyDay$b,
  weekday: weekday$4,
  weekdayAbbr3: weekdayAbbr3$4,
  weekdayAbbr2: weekdayAbbr2$4,
  weekdayL: weekdayL$b,
  yearInVahid: yearInVahid$4,
  vahid: vahid$4,
  kulliShay: kulliShay$4,
  BE: BE$b,
  badiCalendar: badiCalendar$b
});

const monthL$c = {
  1: 'Splendor',
  16: 'Honor'
};

var en_us = /*#__PURE__*/Object.freeze({
  __proto__: null,
  monthL: monthL$c
});

/* eslint-disable dot-notation, line-comment-position, camelcase, sort-imports */

const badiLocale = {};
badiLocale['en'] = en;
badiLocale['ar'] = ar;
badiLocale['de'] = de;
badiLocale['es'] = es;
badiLocale['fa'] = fa;
badiLocale['fr'] = fr;
badiLocale['lv'] = lv;
badiLocale['nl'] = nl;
badiLocale['pt'] = pt;
badiLocale['ru'] = ru;
badiLocale['sv'] = sv;
badiLocale['zh'] = zh;
badiLocale['en-us'] = en_us;

/**
 * Set default language for localization. If the language doesn't exist,
 * nothing is changed.
 * @param {string} language that should be set as default
 */
const setDefaultLanguage = function (language) {
  if (badiLocale[language] === undefined) {
    // eslint-disable-next-line no-console
    console.log('Chosen language does not exist. Setting has not been ' +
      'changed.');
  } else {
    badiLocale['default'] = badiLocale[language];
  }
};

let underlineFormat = 'css';

/**
 * Set underline format for locale items that include underlined characters.
 * @param {'css'|'u'|'diacritic'} format that should be used for underlining
 */
const setUnderlineFormat = function (format) {
  if (['css', 'u', 'diacritic'].indexOf(format) > -1) {
    underlineFormat = format;
  } else {
    // eslint-disable-next-line no-console
    console.log('Invalid underline format. Choose one of ' +
      '["css", "u", "diacritic"]. Setting has not been changed.');
  }
};

const badiYears = [
  'l4da', 'k4ci', 'k5c7', 'l4d6', 'l4ce', 'k4c4', 'k5d4', 'l4cb', 'l4c1',
  'k4cj', 'k5c8', 'l4d7', 'l4cf', 'k4c5', 'k4d5', 'k5ce', 'l4c2', 'k4d2',
  'k4ca', 'k5da', 'l4ch', 'k4c6', 'k4d6', 'k5cf', 'l4c4', 'k4d4', 'k4cc',
  'k5c1', 'l4cj', 'k4c8', 'k4d8', 'k5cg', 'l4c5', 'k4d5', 'k4ce', 'k5c3',
  'l4d2', 'k4ca', 'k4d9', 'k5ci', 'l4c6', 'k4d6', 'k4cf', 'k4c4', 'k5d4',
  'k4cb', 'k4bj', 'k4cj', 'k5c9', 'k4d8', 'k4cg', 'k4c6', 'k5d6', 'k4cd',
  'k4c2', 'k4d2', 'k5ca', 'k4d9', 'k4ci', 'k4c7', 'k5d7', 'k4cf', 'k4c4',
  'k4d4', 'k5cc', 'k4bj', 'k4cj', 'k4c9', 'k5d9', 'k4cg', 'k4c6', 'k4d5',
  'k5cd', 'k4c2', 'k4d1', 'k4ca', 'k4da', 'j5cj', 'k4c7', 'k4d7', 'k4cf',
  'j5c4', 'k4d3', 'k4cb', 'k4c1', 'k5d1', 'l4c9', 'l4d9', 'l4ch', 'k5c6',
  'l4d5', 'l4cd', 'l4c2', 'k5d2', 'l4ca', 'l4da', 'l4cj', 'k5c8', 'l4d7',
  'l4cf', 'l4c4', 'k5d4', 'l4cb', 'l4c1', 'l4d1', 'k5c9', 'l4d8', 'l4cg',
  'l4c5', 'k4d5', 'k5ce', 'l4c2', 'l4d2', 'k4cb', 'k5db', 'l4ci', 'l4c7',
  'k4d7', 'k5cf', 'l4c4', 'l4d4', 'k4cc', 'k5c2', 'l4d1', 'l4c9', 'k4d9',
  'k5ch', 'l4c5', 'l4d5', 'k4ce', 'k5c3', 'l4d2', 'l4cb', 'k4da', 'k5ci',
  'l4c6', 'l4d6', 'k4cf', 'k5c5', 'l4d4', 'l4cc', 'k4c1', 'k4d1', 'k5c9',
  'l4d8', 'k4cg', 'k4c6', 'k5d6', 'l4ce', 'k4c3', 'k4d3', 'k5cb', 'l4da',
  'k4ci', 'k4c7', 'k5d7', 'l4cf', 'k4c5', 'k4d5', 'k5cd', 'l4c1', 'k4cj',
  'k4c9', 'k5d9', 'l4cg', 'k4c6', 'k4d6', 'k5ce', 'l4c3', 'k4d2', 'k4ca',
  'k5bj', 'l4ci', 'k4c7', 'k4d7', 'k4cg', 'k5c5', 'k4d4', 'k4cc', 'k4c1',
  'k5d1', 'k4c9', 'k4d9', 'k4ch', 'k5c7', 'l4d6', 'l4ce', 'l4c3', 'l5d3',
  'l4ca', 'l4da', 'l4cj', 'l5c8', 'l4d7', 'l4cg', 'l4c5', 'l5d4', 'l4cb',
  'l4c1', 'l4d1', 'l5ca', 'l4d9', 'l4ch', 'l4c6', 'l5d6', 'l4cd', 'l4c2',
  'l4d2', 'l4cb', 'k5c1', 'l4cj', 'l4c8', 'l4d8', 'k5cg', 'l4c4', 'l4d4',
  'l4cc', 'k5c2', 'l4d1', 'l4ca', 'l4da', 'k5ci', 'l4c6', 'l4d5', 'l4ce',
  'k5c3', 'l4d2', 'l4cb', 'l4db', 'k5cj', 'l4c8', 'l4d7', 'l4cf', 'k5c5',
  'l4d4', 'l4cc', 'l4c2', 'k5d2', 'l4c9', 'l4d9', 'l4ch', 'k4c6', 'k5d6',
  'l4ce', 'l4c3', 'k4d3', 'k5cc', 'l4db', 'l4cj', 'k4c8', 'k5d8', 'l4cf',
  'l4c4', 'k4d5', 'k5cd', 'l4c2', 'l4d2', 'k4ca', 'k5d9', 'l4cg', 'l4c6',
  'k4d6', 'k5cf', 'l4c3', 'l4d3', 'k4cb', 'k5bj', 'l4ci', 'l4c7', 'k4d7',
  'k5cg', 'l4c5', 'l4d5', 'k4cd', 'k4c2', 'k5d2', 'l4c9', 'k4d9', 'k4ch',
  'k5c7', 'l4d6', 'k4cf', 'k4c4', 'k5d4', 'l4cb', 'l4bj', 'l4cj', 'l5c8',
  'm4d7', 'l4cg', 'l4c5', 'l5d5', 'm4cc', 'l4c1', 'l4d1', 'l5ca', 'm4d9',
  'l4ch', 'l4c7', 'l5d7', 'm4ce', 'l4c3', 'l4d3', 'l5cb', 'm4bi', 'l4ci',
  'l4c8', 'l4d8', 'l5ch', 'l4c5', 'l4d5', 'l4cd', 'l5c2', 'l4d1', 'l4c9',
  'l4da', 'l5ci', 'l4c7', 'l4d7', 'l4cf', 'l5c4', 'l4d2', 'l4cb', 'l4bj',
  'l5d1', 'l4c8', 'l4d8', 'l4cg', 'l5c5', 'l4d4', 'l4cc', 'l4c2', 'l5d2',
  'l4c9', 'l4da', 'l4ci'];

const moment$3 = momentNs;

/**
 * A date in the Badí' calendar.
 */
class BadiDate {
  /**
   * Accepts a number of different sets of arguments for instantiation: JS Date
   * object, moment object, ISO 8601 date string, Badí' date string in the
   * format 'year-month-day' or 'year-holyDayNumber' and array in the format
   * [year, month, day] or [year, holyDayNumber] where holyDayNumber is a number
   * between 1 (Naw-Rúz) and 11 (Ascension of 'Abdu'l-Bahá).
   * @param {(Date|moment|string|Array)} date input date
   */
  constructor(date) { // eslint-disable-line complexity
    this._gregDate = 0;
    this._badiYear = 0;
    this._badiMonth = 0;
    this._badiDate = 0;
    this._nawRuz = 0;
    this._ayyamiHaLength = 0;
    this._yearTB = [];
    this._holyDay = false;
    this._valid = true;

    if (date instanceof Date) {
      this.gregDate = moment$3.utc(
        [date.getFullYear(), date.getMonth(), date.getDate(), 12]);
    } else if (date instanceof moment$3) {
      this._gregDate = moment$3.utc([date.year(), date.month(), date.date(), 12]);
    } else if (typeof date === 'string') {
      const dateArray = this._parseBadiDateString(date);
      if (dateArray) {
        this._setFromBadiDate(dateArray);
      // Looks like the input was a Gregorian datestring
      } else {
        // Attempt to handle a malformed string which moment complains about but
        // Date makes a best guess at.
        const tempDate = new Date(date);
        this._gregDate = moment$3.utc([tempDate.getFullYear(),
          tempDate.getMonth(), tempDate.getDate(), 12]);
        // Check if it's before 1 BE or after 356 BE (which we can't handle)
        if (this._notInValidGregRange(this._gregDate)) {
          this._setInvalid();
        }
      }
    } else if (date.constructor === Array) {
      if (date.length !== 3 && date.length !== 2) {
        this._setInvalid();
      } else {
        this._setFromBadiDate(date);
      }
    }
    if (this._badiYear === 0) {
      // We haven't set the Badí' date yet
      this._setFromGregorianDate();
    }
    if (this._valid) {
      this._setHolyDay();
    }
  }

  /**
   * Formats the output as defined by the given format string
   * The following tokens are accepted:
   * d - day of month without leading zeroes
   * dd - day of month with leading zeroes
   * D - day of month as 3-letter (+ apostrophes) abbreviation of translit.
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
   * BE - localized variant of "B.E."
   * BC - localized variant of "Badí' Calendar"
   * Va - localized variant of "Váḥid"
   * KiS - localized variant of "Kull-i-Shay’"
   * Anything in between {} will be printed as is.
   * @param {string} formatString gives the output format (see reference above)
   * @param {string} language output language (subject to fallbacks)
   * @returns {string} date formatted according to inputs
   */
  format(formatString, language) { /* eslint-disable-line complexity */
    if (!this.isValid()) {
      return 'Not a valid date';
    }
    const formatTokens = [
      ['DDL', 'DD+', 'MML', 'MM+', 'WWL', 'yyv', 'KiS'],
      ['dd', 'DD', 'mm', 'MM', 'ww', 'WW', 'yv', 'YV', 'vv', 'kk', 'yy', 'BE',
        'BC', 'Va'],
      ['d', 'D', 'm', 'M', 'W', 'v', 'k', 'y']];
    if (language === undefined ||
        typeof badiLocale[language] === 'undefined') {
      // eslint-disable-next-line dot-notation
      if (typeof badiLocale['default'] === 'undefined') {
        language = 'en';
      } else {
        language = 'default';
      }
    }
    if (typeof formatString !== 'string') {
      formatString = this._formatItemFallback(language, 'defaultFormat');
    }
    let returnString = '';
    const length = formatString.length;
    for (let i = 0; i < length; i++) {
      // Text wrapped in {} is output as-is. A '{' without a matching '}'
      // results in invalid input
      if (formatString[i] === '{' && i < length - 1) {
        for (let j = i + 1; j <= length; j++) {
          if (j === length) {
            return 'Invalid formatting string.';
          }
          if (formatString[j] === '}') {
            i = j;
            break;
          }
          returnString += formatString[j];
        }
      } else {
        const next1 = formatString[i];
        const next2 = next1 + formatString[i + 1];
        const next3 = next2 + formatString[i + 2];
        // First check for match to 3-symbol token, then 2, then 1
        // (Tokens are not uniquely decodable)
        if (formatTokens[0].indexOf(next3) > -1) {
          returnString += this._getFormatItem(next3, language);
          i += 2;
        } else if (formatTokens[1].indexOf(next2) > -1) {
          returnString += this._getFormatItem(next2, language);
          i += 1;
        } else if (formatTokens[2].indexOf(next1) > -1) {
          returnString += this._getFormatItem(next1, language);
        } else {
          returnString += next1;
        }
      }
    }
    return returnString;
  }

  /**
   * Perform post-processing for locale items that contain underlined
   * characters. These are written in locale files as e.g. '_Sh_araf'.
   * Depending on the setting, designated characters are wrapped in a <u> tag
   * or a CSS style or have the underline combining diacritic added to them.
   * @param {string} string the locale item that should be processed
   * @param {undefined|int} crop whether the item should be cropped at a
   *                             specific number of characters (excluding
   *                             apostrophes and underline markers).
   * @returns {string} processed string
   */
  _postProcessLocaleItem(string, crop = undefined) { /* eslint-disable-line complexity, class-methods-use-this */
    if (crop && crop < string.length) {
      let char = 0;
      let counter = 0;
      while (counter < crop) {
        if ('_’‘'.indexOf(string[char]) === -1) {
          counter++;
        }
        char++;
      }
      if ('_’‘'.indexOf(string[char]) > -1) {
        char++;
      }
      string = string.slice(0, char);
      if (string.split('_').length % 2 === 0) {
        string += '_';
      }
    }
    const stringComponents = string.split('_');
    for (let comp = 1; comp < stringComponents.length; comp += 2) {
      switch (underlineFormat) {
        case 'css': {
          stringComponents[comp] = '<span style="text-decoration:underline">' +
            stringComponents[comp] + '</span>';
          break;
        }
        case 'diacritic': {
          let newstring = '';
          for (let i = 0; i < stringComponents[comp].length; i++) {
            newstring += stringComponents[comp][i] + '\u0332';
          }
          stringComponents[comp] = newstring;
          break;
        }
        case 'u': {
          stringComponents[comp] = '<u>' + stringComponents[comp] + '</u>';
          break;
        }
        default:
          throw new TypeError('Unexpected underlineFormat');
      }
    }
    return stringComponents.join('');
  }

  /**
   * Retrieve the appropriate output for a given formatting token and language.
   * @param {string} token identifying the date component for output
   * @param {string} language output language
   * @returns {string} localized output string in desired language (or fallback)
   */
  _getFormatItem(token, language) { // eslint-disable-line complexity
    switch (token) {
      // Single character tokens
      case 'd':
        return this._digitRewrite(this._badiDay, language);
      case 'D': {
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiDay), 3);
      } case 'm':
        return this._digitRewrite(this._badiMonth, language);
      case 'M': {
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiMonth), 3);
      } case 'W':
        return this._formatItemFallback(
          language, 'weekdayAbbbr3', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'y':
        return this._digitRewrite(this._badiYear, language);
      case 'v':
        return this._digitRewrite(
          (Math.floor((this._badiYear - 1) / 19) % 19) + 1, language);
      case 'k':
        return this._digitRewrite(
          Math.floor((this._badiYear - 1) / 361) + 1, language);
      // Two character tokens
      case 'dd':
        return this._digitRewrite(
          ('0' + String(this._badiDay)).slice(-2), language);
      case 'DD':
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiDay));
      case 'mm':
        return this._digitRewrite(
          ('0' + String(this._badiMonth)).slice(-2), language);
      case 'MM':
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiMonth));
      case 'ww':
        return this._formatItemFallback(
          language, 'weekdayAbbr2', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'WW':
        return this._formatItemFallback(
          language, 'weekday', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'yy':
        return this._digitRewrite(
          ('00' + String(this._badiYear)).slice(-3), language);
      case 'yv':
        return this._digitRewrite((this._badiYear - 1) % 19 + 1, language);
      case 'YV':
        return this._formatItemFallback(
          language, 'yearInVahid', (this._badiYear - 1) % 19 + 1);
      case 'vv':
        return this._digitRewrite(('0' + String((Math.floor(
          (this._badiYear - 1) / 19) + 2) % 19 - 1)).slice(-2), language);
      case 'kk':
        return this._digitRewrite(('0' + String(Math.floor(
          (this._badiYear - 1) / 361) + 1)).slice(-2), language);
      case 'Va':
        return this._formatItemFallback(language, 'vahid');
      case 'BE':
        return this._formatItemFallback(language, 'BE');
      case 'BC':
        return this._formatItemFallback(language, 'badiCalendar');
      // Three character tokens
      case 'DDL':
        return this._formatItemFallback(language, 'monthL', this._badiDay);
      case 'DD+': {
        const day = this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiDay));
        const dayL = this._formatItemFallback(
          language, 'monthL', this._badiDay);
        if (day === dayL) {
          return day;
        }
        if (badiLocale[language] === badiLocale.fa) {
          return `<span dir="rtl">${day} (${dayL})</span>`;
        }
        return `${day} (${dayL})`;
      }
      case 'MML':
        return this._formatItemFallback(language, 'monthL', this._badiMonth);
      case 'MM+': {
        const month = this._postProcessLocaleItem(this._formatItemFallback(
          language, 'month', this._badiMonth));
        const monthL = this._formatItemFallback(
          language, 'monthL', this._badiMonth);
        if (month === monthL) {
          return month;
        }
        if (badiLocale[language] === badiLocale.fa) {
          return `<span dir="rtl">${month} (${monthL})</span>`;
        }
        return `${month} (${monthL})`;
      }
      case 'WWL':
        return this._formatItemFallback(
          language, 'weekdayL', (this._gregDate.isoWeekday() + 1) % 7 + 1);
      case 'yyv':
        return this._digitRewrite(
          ('0' + String((this._badiYear - 1) % 19 + 1)).slice(-2), language);
      case 'KiS':
        return this._postProcessLocaleItem(this._formatItemFallback(
          language, 'kulliShay'));
      default:
        return '';
    }
  }

  /**
   * For languages that don't use Western Arabic numerals, rewrite digits into
   * the proper unicode characters.
   * @param {int|string} number that should be rewritten
   * @param {string} language code into which the number should be rewritten
   * @returns {string} string of digits using the correct glyphs.
   */
  _digitRewrite(number, language) {
    number = String(number);
    const unicodeOffset = this._formatItemFallback(
      language, 'digitUnicodeOffset') - '0'.charCodeAt(0);
    if (unicodeOffset === 0) {
      return number;
    }
    const codePoints = [...number].map((num) => {
      return num.charCodeAt(0) + unicodeOffset;
    });
    return String.fromCharCode(...codePoints);
  }

  /**
   * Determine the next language in the fallback order:
   * regional variant -> primary language -> default language -> English
   * @param {string} languageCode of the language for which fallback is needed
   * @returns {string} next item in fallback order
   */
  _languageFallback(languageCode) {
    if (languageCode.indexOf('-') > -1) {
      return languageCode.split('-')[0];
    // eslint-disable-next-line no-negated-condition
    } else if (languageCode !== 'default') {
      return 'default';
    }
    return 'en';
  }

  /**
   * Retrieve element from localization with fallback
   * @param {string} language output language (subject to fallbacks)
   * @param {string} category group of localization elements (e.g. 'holyDay')
   *                 or label for single items such as 'BE'
   * @param {int} index of desired item in category, always 1-indexed
   * @returns {string} localized output string
   */
  _formatItemFallback(language, category, index) {
    if (index === undefined) {
      while (typeof badiLocale[language] === 'undefined' ||
             typeof badiLocale[language][category] === 'undefined') {
        language = this._languageFallback(language);
      }
      return badiLocale[language][category];
    }
    while (typeof badiLocale[language] === 'undefined' ||
           typeof badiLocale[language][category] === 'undefined' ||
           typeof badiLocale[language][category][index] === 'undefined') {
      language = this._languageFallback(language);
    }
    return badiLocale[language][category][index];
  }

  /**
   * Check whether a string supplied to the constructor describes a valid Badí'
   * date, either as year-month-day or year-holyDay and if yes, return an array
   * of date components.
   * @param {string} dateString Badí' date in string format
   * @returns {(array|false)} array consisting of the Badí' date components
   *                          (either [year, month, day] or
   *                          [year, holyDayNumber]) or false
   */
  _parseBadiDateString(dateString) { // eslint-disable-line complexity
    const dateComponents = dateString.split('-');
    // Are all components numerical
    for (let i = 0; i < dateComponents.length; i++) {
      if (!((/^\d+$/).test(dateComponents[i]))) {
        return false;
      }
      dateComponents[i] = parseInt(dateComponents[i], 10);
    }
    // If only two numbers are supplied, the second designates a Holy Day and
    // must be between 1 and 11
    if (dateComponents.length !== 3) {
      if (dateComponents.length === 2 && dateComponents[1] > 0 &&
          dateComponents[1] < 12) {
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

  /**
   * Check whether a moment object is within the valid range of dates.
   * @param {moment} datetime date to be checked
   * @returns {bool} whether the provided datetime is within the valid range
   */
  _notInValidGregRange(datetime) {
    return datetime.isBefore(moment$3.utc('1844-03-21')) ||
        datetime.isAfter(moment$3.utc('2351-03-20'));
  }

  /**
   * Generate date from input corresponding to a Gregorian date.
   */
  _setFromGregorianDate() {
    if (this._notInValidGregRange(this._gregDate)) {
      this._setInvalid();
      return;
    }
    const gregYear = this._gregDate.year();
    if (this._gregDate.isBefore(moment$3.utc('2015-03-21'))) {
      // Old implementation for day before Naw-Rúz 172
      if (this._gregDate.isBefore(gregYear + '-03-21')) {
        this._nawRuz = moment$3.utc((gregYear - 1).toString() + '-03-21');
        this._badiYear = gregYear - 1844;
      } else {
        this._nawRuz = moment$3.utc(gregYear.toString() + '-03-21');
        this._badiYear = gregYear - 1843;
      }
      this._setOldAyyamiHaLength();
      this._yearTB = [12, 5, 13, 9];
    } else {
      // New implementation
      this._badiYear = gregYear - 1843;
      this._setBadiYearInfo(true);
    }
    // Now need to set Badí' month and date from the gregorian date
    this._setBadiMonthDay();
  }

  /**
   * Set Badí' month and day from Gregorian date
   */
  _setBadiMonthDay() {
    const dayOfBadiYear = this._dayOfYear(this._gregDate);
    if (dayOfBadiYear < 343) {
      this._badiMonth = Math.floor((dayOfBadiYear - 1) / 19 + 1);
      this._badiDay = (dayOfBadiYear - 1) % 19 + 1;
    } else if (dayOfBadiYear < 343 + this._ayyamiHaLength) {
      this._badiMonth = 20;
      this._badiDay = dayOfBadiYear - 342;
    } else {
      this._badiMonth = 19;
      this._badiDay = dayOfBadiYear - (342 + this._ayyamiHaLength);
    }
  }

  /**
   * Generate date from input that supplied the Badí' year and either Badí'
   * month and day or a Holy Day number.
   * @param {array} dateArray Badí' date either given in the form
   *                          [year, month, day] or [year, holyDayNumber]
   */
  _setFromBadiDate(dateArray) { // eslint-disable-line complexity
    this._badiYear = parseInt(dateArray[0], 10);
    // Are we in the valid range?
    if (this._badiYear < 1 || this._badiYear > 507) {
      this._setInvalid();
      return;
    } else if (this._badiYear < 172) {
      // Old implementation for dates before Naw-Rúz 172
      this._nawRuz = moment$3.utc([1843 + this._badiYear, 2, 21]);
      this._setOldAyyamiHaLength();
      this._yearTB = [12, 5, 13, 9];
    } else {
      // New implementation
      this._setBadiYearInfo();
    }
    // If all three components exist, we have a year, month, and day
    // eslint-disable-next-line no-negated-condition
    if (typeof dateArray[2] !== 'undefined') {
      this._badiMonth = parseInt(dateArray[1], 10);
      this._badiDay = parseInt(dateArray[2], 10);
      if (this._badiMonth === 20 && this._badiDay > this._ayyamiHaLength) {
        // If only off by one day, we'll bubble up so that 5th Ayyám-i-Há in a
        // year with only 4 days of Ayyám-i-Há can be salvaged
        if (this._badiDay - this._ayyamiHaLength === 1) {
          this._badiMonth = 19;
          this._badiDay = 1;
        } else {
          this._setInvalid();
        }
      }
    // Otherwise input designated a Holy Day
    } else {
      const holyDayNum = parseInt(dateArray[1], 10);
      switch (holyDayNum) {
        case 1:
          // Naw-Rúz
          this._badiMonth = 1;
          this._badiDay = 1;
          break;
        case 2:
          // First Day of Ridván
          this._badiMonth = 2;
          this._badiDay = 13;
          break;
        case 3:
          // Ninth Day of Ridván
          this._badiMonth = 3;
          this._badiDay = 2;
          break;
        case 4:
          // Twelfth Day of Ridván
          this._badiMonth = 3;
          this._badiDay = 5;
          break;
        case 5:
          // Declaration of the Báb
          this._badiMonth = 4;
          this._badiDay = 8;
          if (this._badiYear < 172) {
            // Date was different in old implementation
            this._badiDay = 7;
          }
          break;
        case 6:
          // Ascension of Bahá'u'lláh
          this._badiMonth = 4;
          this._badiDay = 13;
          break;
        case 7:
          // Martyrdom of the Báb
          this._badiMonth = 6;
          this._badiDay = 17;
          if (this._badiYear < 172) {
            // Date was different in old implementation
            this._badiDay = 16;
          }
          break;
        case 8:
          // Birth of the Báb
          this._badiMonth = this._yearTB[0];
          this._badiDay = this._yearTB[1];
          break;
        case 9:
          // Birth of Bahá'u'lláh
          this._badiMonth = this._yearTB[2];
          this._badiDay = this._yearTB[3];
          break;
        case 10:
          // Day of the Covenant
          this._badiMonth = 14;
          this._badiDay = 4;
          break;
        case 11:
          // Ascension of 'Abdu'l-Bahá
          this._badiMonth = 14;
          this._badiDay = 6;
          break;
        default:
          this._setInvalid();
          return;
      }
    }
    // Finally we set the Gregorian date for this Badí' date
    const dayOfGregYear = this._nawRuz.diff(
      moment$3.utc([this._badiYear + 1843]), 'days') +
      this._dayOfYear([this._badiYear, this._badiMonth, this._badiDay]);
    this._gregDate = moment$3.utc([this._badiYear + 1843]);
    // Bubbles up to next year if necessary
    this._gregDate.dayOfYear(dayOfGregYear);
    this._gregDate.hour(12);
  }

  /**
   * Set the length of Ayyám-i-Há for dates before the new implementation.
   */
  _setOldAyyamiHaLength() {
    if (moment$3([this._nawRuz.year() + 1]).isLeapYear()) {
      this._ayyamiHaLength = 5;
    } else {
      this._ayyamiHaLength = 4;
    }
  }

  /**
   * Set year parameters for the given year.
   * @param {bool} fromGregDate whether we are generating the date object from
   *                            a Gregorian date
   */
  _setBadiYearInfo(fromGregDate) {
    let yearData = this._extractBadiYearInfo();
    if (fromGregDate === true &&
        this._gregDate.isBefore(moment$3.utc(yearData.NR))) {
      this._badiYear -= 1;
      yearData = this._extractBadiYearInfo();
    }
    this._nawRuz = moment$3.utc(yearData.NR);
    this._ayyamiHaLength = yearData.aHL;
    this._yearTB = yearData.TB;
  }

  /**
   * Unpack the info for the Badí' year from the base36 encoded version.
   * @returns {object} Object containing the date of Naw-Rúz, the length of
   *                   Ayyám-i-Há, and an array containing month, day, month,
   *                   day of the Twin Holy Days
   */
  _extractBadiYearInfo() {
    let yearData = {};
    // Check whether data needs to be unpacked or exists in the verbose version
    if (badiYears[0] === 'l4da') {
      const components = badiYears[this._badiYear - 172].split('');
      yearData.NR = String(this._badiYear - 172 + 2015) + '-03-' +
                    String(parseInt(components[0], 36));
      yearData.aHL = parseInt(components[1], 36);
      const TB1 = [parseInt(components[2], 36), parseInt(components[3], 36)];
      const TB2 = TB1[1] < 19 ? [TB1[0], TB1[1] + 1] : [TB1[0] + 1, 1];
      yearData.TB = [TB1[0], TB1[1], TB2[0], TB2[1]];
    } else {
      yearData = badiYears[this._badiYear];
    }
    return yearData;
  }

  /**
   * Get the days since Naw-Rúz (NR itself is '1') of the Badí' or Gregorian
   * date provided.
   * @param {(array|moment)} date Badí' date in the form [year, month, day]
   *                         or moment
   * @returns {int} 1-indexed number of the day in the Badí' year
   */
  _dayOfYear(date) {
    let numDays = 0;
    if (date.constructor === Array) {
      // We have a Badí' date
      if (date[1] < 19) {
        numDays = 19 * (date[1] - 1) + date[2];
      } else if (date[1] === 20) {
        numDays = 342 + date[2];
      } else if (date[1] === 19) {
        numDays = 342 + this._ayyamiHaLength + date[2];
      }
    } else {
      numDays = date.diff(this._nawRuz, 'days') + 1;
    }
    return numDays;
  }

  /**
   * Set the member variables to invalid values.
   */
  _setInvalid() {
    this._gregDate = moment$3.utc('0000-00-00');
    this._badiYear = -1;
    this._badiMonth = -1;
    this._badiDay = -1;
    this._ayyamiHaLength = -1;
    this._nawRuz = moment$3.utc('0000-00-00');
    this._valid = false;
  }

  /**
   * If the date is a Holy Day, assign it
   */
  _setHolyDay() { // eslint-disable-line complexity
    // First the dates that haven't changed with the new implementation
    if (this._badiMonth === 1 && this._badiDay === 1) {
      // Naw-Rúz
      this._holyDay = 1;
    } else if (this._badiMonth === 2 && this._badiDay === 13) {
      // First Day of Ridván
      this._holyDay = 2;
    } else if (this._badiMonth === 3 && this._badiDay === 2) {
      // Ninth Day of Ridván
      this._holyDay = 3;
    } else if (this._badiMonth === 3 && this._badiDay === 5) {
      // Twelfth Day of Ridván
      this._holyDay = 4;
    } else if (this._badiMonth === 4 && this._badiDay === 13) {
      // Ascension of Bahá'u'lláh
      this._holyDay = 6;
    } else if (this._badiMonth === 14 && this._badiDay === 4) {
      // Day of the Covenant
      this._holyDay = 10;
    } else if (this._badiMonth === 14 && this._badiDay === 6) {
      // Ascension of 'Abdu'l-Bahá
      this._holyDay = 11;
    }
    // Twin birthdays are set in the instance at this point regardless of
    // implementation
    if (this._badiMonth === this._yearTB[0] &&
        this._badiDay === this._yearTB[1]) {
      // Birth of the Báb
      this._holyDay = 8;
    } else if (this._badiMonth === this._yearTB[2] &&
               this._badiDay === this._yearTB[3]) {
      // Birth of Bahá'u'lláh
      this._holyDay = 9;
    }
    // Finally the two dates that have changed by one day
    if (this._badiYear < 172) {
      if (this._badiMonth === 4 && this._badiDay === 7) {
        // Declaration of the Báb
        this._holyDay = 5;
      } else if (this._badiMonth === 6 && this._badiDay === 16) {
        // Martyrdom of the Báb
        this._holyDay = 7;
      }
    } else if (this._badiMonth === 4 && this._badiDay === 8) {
      // Declaration of the Báb
      this._holyDay = 5;
    } else if (this._badiMonth === 6 && this._badiDay === 17) {
      // Martyrdom of the Báb
      this._holyDay = 7;
    }
  }

  /**
   * Get the name of the Holy Day (if any) in the given language (using
   * localization fallbacks as necessary).
   * @param {string} language Optional language for the return string
   *                 (subject to language fallback)
   * @returns {(string|false)} Name of the Holy Day in the given (or fallback)
   *                           language, or false.
   */
  holyDay(language) {
    if (!this._holyDay) {
      return false;
    }
    if (language === undefined ||
        typeof badiLocale[language] === 'undefined') {
      // eslint-disable-next-line dot-notation
      if (typeof badiLocale['default'] === 'undefined') {
        language = 'en';
      } else {
        language = 'default';
      }
    }
    return this._formatItemFallback(language, 'holyDay', this._holyDay);
  }

  /**
   * Check whether this is a valid date (i.e. created from valid input).
   * @returns {bool} whether this is a valid date.
   */
  isValid() {
    return this._valid;
  }

  /**
   * Get the Badí' day as a number.
   * @returns {int} number of the day in the Badí' month (between 1 and 19)
   */
  badiDay() {
    return this._badiDay;
  }

  /**
   * Get the Badí' month as a number.
   * @returns {int} number of the Badí' month (between 1 and 20 where 20 is
   *                Ayyám-i-Há
   */
  badiMonth() {
    return this._badiMonth;
  }

  /**
   * Get the Badí' year.
   * @returns {int} number of the Badí' year.
   */
  badiYear() {
    return this._badiYear;
  }

  /**
   * Get number of the Badí' weekday between 1 (Jalál ~> Saturday) and
   * 7 (Istiqlál ~> Friday).
   * @returns {int} number of Badí' weekday
   */
  badiWeekday() {
    return (this._gregDate.isoWeekday() + 1) % 7 + 1;
  }

  /**
   * Get number of the year in the Váḥid the current date is in.
   * @returns {int} number of year in Váḥid (between 1 and 19)
   */
  yearInVahid() {
    return (this._badiYear - 1) % 19 + 1;
  }

  /**
   * Get number of the Váḥid (19 year period) the current date is in.
   * @returns {int} number of Váḥid (between 1 and 19)
   */
  vahid() {
    return (Math.floor((this._badiYear - 1) / 19) % 19) + 1;
  }

  /**
   * Get number of the Kull-i-Shay' (361 year period) the current date is in.
   * @returns {int} number of Kull-i-Shay' (1 for most supported dates)
   */
  kullIShay() {
    return Math.floor((this._badiYear - 1) / 361) + 1;
  }

  /**
   * Get the Gregorian date on whose sunset the Badí' date ends.
   * @returns {moment} Gregorian date, with time set to 12:00:00
   */
  gregorianDate() {
    return this._gregDate;
  }

  /**
   * Get the length of Ayyám-i-Há for the year this date is in.
   * @returns {int} Number of days of Ayyám-i-Há
   */
  ayyamiHaLength() {
    return this._ayyamiHaLength;
  }

  /**
   * Get the number (between 1 and 11) of the Holy Day.
   * @returns {(int|false)} number of Holy Day or false if none.
   */
  holyDayNumber() {
    return this._holyDay;
  }
}

/**
 * Sets option (defaultLanguage) for the
 * module.
 * @param {object} options Options to be set.
 */
const badiDateOptions = function (options) {
  if (typeof options.defaultLanguage === 'string') {
    setDefaultLanguage(options.defaultLanguage);
  }
  if (typeof options.underlineFormat === 'string') {
    setUnderlineFormat(options.underlineFormat);
  }
};

/* eslint-disable max-len, complexity */
const clockLocations = {
  Canada: [[[-63.29333, 60], [-138.9386, 60], [-139.1889, 60.08888], [-139.0681, 60.35222], [-139.6767, 60.34055], [-139.9794, 60.18777], [-140.45081, 60.30972], [-140.52139, 60.22221], [-140.9955, 60.30721], [-140.99686, 61.8948], [-141.00005, 65.84028], [-141.00206, 68.42821], [-141.00296, 69.58786], [-141.00477, 69.58884], [-140.99813, 70.12335], [-124.80692, 77.04204], [-117.95462, 78.95431], [-99.46935, 82.3539], [-75.0348, 84.79736], [-59.3117, 83.84122], [-60.98493, 82.07503], [-69.57686, 80.21588], [-71.1173, 79.6183], [-74.13178, 79.24647], [-73.93259, 78.5692], [-75.69878, 77.78571], [-77.43842, 77.49355], [-77.55793, 76.52414], [-78.54063, 76.17887], [-79.31085, 74.25332], [-75.79174, 73.25735], [-73.13581, 72.0489], [-69.1652, 71.09276], [-66.31007, 69.91087], [-66.05776, 68.70243], [-60.73262, 66.89639], [-62.3129, 65.07708], [-63.60102, 64.69197], [-64.19861, 60.84087], [-63.29333, 60.00012]]],
  Finland: [[[31.5848296, 62.9070356], [31.4390606, 62.785375], [31.3454013, 62.64032620000001], [31.2218346, 62.49829550000001], [31.138311, 62.4420838], [30.720412, 62.20890580000002], [30.6564061, 62.2085877], [30.602068, 62.14134890000001], [30.4231749, 62.02237140000001], [30.3061104, 61.964546], [30.1556605, 61.8579888], [30.0752371, 61.8183646], [30.0387281, 61.76500110000001], [29.8185491, 61.6549278], [29.74029919999999, 61.5737044], [29.5030724, 61.461338900000015], [29.3304371, 61.3526198], [29.2330501, 61.268169], [29.0298879, 61.191815300000016], [28.9583837, 61.1514492], [28.818984, 61.1216471], [28.7136921, 61.0443349], [28.6578963, 60.95109439999999], [28.5246697, 60.9571371], [28.1354613, 60.7408695], [27.873414, 60.604559], [27.7736111, 60.53333330000002], [27.725, 60.3913889], [27.4550934, 60.223534], [27.2938862, 60.2003975], [26.8756332, 60.200342100000015], [26.6110136, 60.161753200000014], [26.2947105, 60.0465237], [26.0173046, 59.97679690000001], [25.1693516, 59.9434386], [24.2815873, 59.79155570000002], [23.4566746, 59.67247360000001], [22.9224144, 59.6384411], [22.6345729, 59.6079549], [22.3965563, 59.5130947], [21.4475658, 59.4772985], [20.7608658, 59.5324815], [20.3839584, 59.4576178], [20.2843364, 59.4660819], [19.083209799999988, 60.19169020000001], [19.2202109, 60.61151010000001], [20.0251664, 60.72755450000001], [20.7714495, 61.12690790000001], [20.903203, 61.6462488], [20.1658123, 63.1648577], [20.4010006, 63.3318822], [20.8175143, 63.5011379], [21.4628083, 63.6552312], [21.8845783, 63.70121190000001], [22.9611467, 64.2200974], [23.835799, 64.66547409999997], [24.1545056, 65.29247769999998], [24.131900100000014, 65.5153846], [24.1776819, 65.6603564], [24.1318042, 65.7716089], [24.152978, 65.862572], [24.0536762, 65.95152940000006], [24.0491701, 65.99502970000003], [23.9394784, 66.07568309999998], [23.9170552, 66.16186640000002], [23.7313763, 66.19408560000002], [23.6489848, 66.30377249999997], [23.6880374, 66.3815611], [23.650965700000015, 66.4557476], [23.8605347, 66.5595503], [23.86853209999999, 66.6568254], [23.9078441, 66.72140390000003], [23.880337, 66.76350940000003], [23.99566289999999, 66.822049], [23.8525565, 66.9573479], [23.677678, 67.0620298], [23.5545444, 67.16789390000002], [23.596079, 67.20820560000003], [23.5637833, 67.2606725], [23.7311639, 67.28763560000003], [23.7172209, 67.38530669999997], [23.7639366, 67.42772120000002], [23.408239899999984, 67.46939490000003], [23.4059159, 67.50091320000003], [23.5452477, 67.5838871], [23.492249099999984, 67.6652745], [23.47871239999999, 67.8419848], [23.5171915, 67.88433529999998], [23.6407972, 67.9151784], [23.6525654, 67.9589433], [23.3937061, 68.0452571], [23.3077618, 68.14837649999997], [23.1656349, 68.13315060000002], [23.152641, 68.2333806], [23.0702517, 68.29970360000003], [22.9181313, 68.3335115], [22.8028778, 68.39328420000002], [22.3437523, 68.45688960000003], [22.2960914, 68.4840408], [22.045040799999988, 68.479329], [21.8898693, 68.5844051], [21.7010887, 68.59686950000003], [21.6061629, 68.6678769], [21.4298688, 68.691352], [21.39042, 68.76478960000003], [20.9988391, 68.89612380000003], [20.8441913, 68.93656440000004], [20.9116456, 68.96882420000003], [20.775042799999987, 69.0326073], [20.5523258, 69.0600767], [20.7173208, 69.1197912], [21.057543, 69.03628970000003], [21.1086742, 69.1039291], [20.9875741, 69.19192740000003], [21.0961691, 69.260912], [21.2788202, 69.3118841], [21.6270859, 69.27658829999997], [22.1757622, 68.95632440000003], [22.1918678, 68.9187737], [22.3407806, 68.82722570000003], [22.3745217, 68.71666660000004], [22.5353893, 68.74451260000004], [22.800824, 68.68754809999997], [23.0459522, 68.6893436], [23.1675822, 68.6285189], [23.4406356, 68.6921635], [23.6735202, 68.70552140000002], [23.7753915, 68.81885129999998], [23.983330799999987, 68.82714340000003], [24.0755916, 68.7799668], [24.30226, 68.71735020000003], [24.6083879, 68.6819016], [24.9170187, 68.60529109999997], [25.1193208, 68.6428308], [25.1212144, 68.7458351], [25.1573697, 68.80006390000003], [25.2931271, 68.8600372], [25.47250939999999, 68.90329120000003], [25.6543285, 68.90577049999997], [25.745596499999987, 69.03984729999998], [25.742717799999987, 69.14430209999998], [25.6939225, 69.1957144], [25.7410164, 69.31839509999998], [25.8462009, 69.3929115], [25.8084981, 69.4259367], [25.8768225, 69.5261298], [25.9760403, 69.610225], [25.8925512, 69.66539549999997], [26.0071395, 69.7228555], [26.1255598, 69.7345401], [26.3835888, 69.8541585], [26.4653759, 69.93980490000003], [26.6834067, 69.96301920000003], [26.8407548, 69.9603025], [27.0316081, 69.9107924], [27.3049484, 69.95762760000004], [27.43070959999999, 70.0194461], [27.5206048, 70.02243659999996], [27.614207, 70.074151], [27.9593778, 70.0921111], [27.9842853, 70.0139707], [28.160713, 69.92099370000003], [28.3452694, 69.88083179999997], [28.4042254, 69.818425], [29.1339095, 69.69534039999996], [29.1705369, 69.6390414], [29.3364956, 69.47832269999998], [29.2193395, 69.39763620000002], [28.831539, 69.2243617], [28.80543, 69.1111558], [28.929451, 69.0519407], [28.4953735, 68.9300403], [28.468076, 68.8855137], [28.66118, 68.8864737], [28.8014499, 68.8693665], [28.7072131, 68.732555], [28.4341202, 68.53979460000002], [28.6478382, 68.19591340000002], [29.3271337, 68.0745162], [29.6593888, 67.80297219999996], [30.0173409, 67.67356889999996], [29.9305102, 67.5228214], [29.8567823, 67.48926540000004], [29.6361151, 67.332861], [29.522709499999987, 67.3099172], [29.48660609999999, 67.26011490000003], [29.0732544, 66.99615390000004], [29.0331239, 66.92547219999996], [29.0607529, 66.85269279999997], [29.3507185, 66.6439171], [29.4726751, 66.5434478], [29.6969469, 66.277347], [29.9239353, 66.1262486], [29.997268, 65.97889249999997], [30.0647878, 65.90105890000002], [30.138463, 65.66868749999998], [30.0170916, 65.6965272], [29.722432799999986, 65.637045], [29.8637508, 65.5604702], [29.7331208, 65.472637], [29.7467636, 65.347391], [29.6018471, 65.2599435], [29.893525, 65.19295509999998], [29.8193446, 65.1444587], [29.896916, 65.1051579], [29.7328054, 65.09129760000003], [29.6255535, 65.06020520000003], [29.5993537, 64.99509809999998], [29.6470353, 64.8674467], [29.739663, 64.7897553], [30.0430007, 64.7928625], [30.0416232, 64.74110840000003], [30.1365729, 64.6488835], [29.9894058, 64.58761530000002], [29.9869609, 64.5338998], [30.0583348, 64.4508749], [30.0448933, 64.4020122], [30.482439699999983, 64.2623385], [30.466399899999985, 64.2044319], [30.5534271, 64.1322443], [30.5280169, 64.0488769], [30.320039, 63.9082685], [30.260416, 63.82200320000001], [29.9718903, 63.7571676], [30.24571609999999, 63.60696830000001], [30.385620199999988, 63.54577980000001], [30.4841978, 63.4670887], [30.789711, 63.4050884], [30.9330443, 63.3559208], [30.9798739, 63.3078177], [31.1483116, 63.26151890000002], [31.2416464, 63.2166421], [31.2658547, 63.1154671], [31.46252279999998, 63.02421930000001], [31.5848296, 62.9070356]]],
  // Greenland: [[[-57.44887, 82.28507], [-60.15022, 82.05782], [-61.87928, 81.82771], [-62.2191, 81.7294], [-63.42448, 81.28486], [-65.32658, 80.98138], [-66.57577, 80.83605], [-67.38791, 80.54753], [-67.66468, 80.1436], [-68.73755, 79.10919], [-72.47765, 78.62618], [-72.96065, 78.36972], [-73.1359, 78.13036], [-72.78968, 77.34387], [-73.38382, 76.66424], [-72.79822, 76.5702], [-69.80615, 76.29664], [-68.45971, 75.97179], [-66.32252, 75.80508], [-64.89914, 75.80081], [-63.13809, 76.04018], [-62.31741, 75.9034], [-60.47087, 75.78371], [-60.19731, 75.62983], [-58.94919, 75.49305], [-58.81241, 74.92883], [-58.38497, 74.89464], [-58.21399, 74.63817], [-57.47879, 74.17654], [-57.15394, 73.47554], [-55.83743, 71.40673], [-55.23901, 70.48346], [-55.10223, 69.40632], [-53.87121, 68.825], [-54.21316, 66.80748], [-53.75152, 65.52517], [-52.5034, 63.43926], [-47.39122, 59.6265], [-42.68939, 59.38714], [-41.16771, 61.50723], [-30.05428, 67.67946], [-26.83993, 68.124], [-21.04386, 70.27829], [-21.24903, 72.74034], [-16.78656, 74.91174], [-16.39331, 77.2541], [-17.64144, 78.51933], [-16.82075, 79.78455], [-11.02468, 81.34043], [-11.93085, 82.02433], [-19.48798, 82.45177], [-19.71024, 83.01599], [-27.19898, 83.85377], [-39.64602, 83.80248], [-50.82784, 82.9476], [-57.44887, 82.28507]]],
  Iceland: [[[-25.0, 63.0], [-12.8, 63.0], [-12.8, 66.8], [-25.0, 66.8]]],
  Norway: [[[30.79367, 69.78758], [30.89032, 69.73729], [30.95448, 69.63243], [30.93257, 69.55989], [30.81756, 69.52877], [30.51593, 69.54042], [30.41768, 69.58992], [30.23373, 69.65016], [30.13777, 69.64353], [30.18838, 69.56846], [30.12305, 69.51749], [30.11721, 69.46989], [30.00876, 69.41591], [29.85802, 69.42374], [29.7244, 69.38965], [29.56938, 69.31756], [29.39594, 69.32384], [29.28845, 69.29618], [29.31313, 69.23752], [29.24224, 69.11306], [29.05666, 69.01528], [28.85456, 69.07664], [28.80541, 69.11116], [28.83152, 69.22436], [29.21932, 69.39764], [29.33647, 69.47832], [29.17052, 69.63904], [29.13389, 69.69534], [28.40421, 69.81842], [28.33046, 69.84919], [28.34506, 69.8808], [28.1607, 69.92099], [27.98428, 70.01397], [27.94828, 70.09187], [27.79768, 70.07731], [27.61245, 70.07456], [27.52598, 70.02346], [27.42855, 70.01921], [27.27471, 69.97591], [27.29177, 69.95225], [27.03749, 69.91039], [26.89776, 69.93245], [26.85129, 69.96013], [26.71807, 69.94499], [26.67869, 69.96477], [26.46435, 69.93939], [26.38594, 69.85535], [26.24129, 69.81453], [26.13562, 69.73861], [26.01418, 69.72334], [25.89149, 69.6655], [25.97672, 69.61067], [25.93749, 69.57253], [25.83994, 69.54298], [25.87704, 69.5222], [25.80934, 69.42639], [25.8461, 69.39325], [25.75938, 69.34038], [25.74753, 69.28679], [25.70204, 69.25366], [25.69302, 69.19674], [25.74351, 69.13879], [25.72429, 69.0796], [25.77744, 69.01828], [25.71241, 68.98063], [25.65423, 68.90587], [25.60033, 68.88487], [25.48119, 68.90507], [25.2677, 68.85099], [25.15713, 68.79989], [25.11152, 68.70252], [25.11924, 68.6428], [24.91692, 68.60525], [24.85717, 68.56221], [24.78342, 68.63623], [24.60839, 68.6819], [24.30226, 68.71735], [24.07559, 68.77997], [23.98333, 68.82714], [23.87146, 68.83652], [23.77539, 68.81885], [23.73106, 68.75075], [23.67352, 68.70552], [23.44064, 68.69216], [23.16758, 68.62852], [23.04595, 68.68934], [22.80082, 68.68755], [22.53539, 68.74451], [22.37452, 68.71667], [22.34078, 68.82723], [22.19187, 68.91877], [22.17576, 68.95632], [21.98361, 69.07289], [21.8464, 69.14416], [21.62709, 69.27659], [21.27882, 69.31188], [21.09617, 69.26091], [21.00331, 69.22234], [20.98758, 69.19193], [21.05563, 69.12209], [21.10868, 69.10393], [21.05754, 69.03629], [20.71732, 69.11979], [20.55233, 69.06008], [20.06005, 69.04576], [20.30659, 68.92618], [20.33587, 68.80231], [20.20284, 68.66592], [20.05225, 68.59107], [19.9375, 68.55794], [20.02589, 68.53081], [20.22654, 68.49081], [19.97796, 68.38816], [19.9214, 68.35601], [18.9838, 68.51696], [18.62122, 68.50696], [18.40569, 68.58188], [18.12592, 68.53652], [18.10109, 68.40605], [18.15135, 68.19879], [17.89976, 67.96937], [17.66475, 68.03838], [17.28152, 68.11881], [17.18051, 68.05046], [16.73812, 67.91421], [16.55628, 67.64719], [16.40757, 67.53403], [16.158, 67.51916], [16.08983, 67.43528], [16.4041, 67.20497], [16.38776, 67.04546], [16.19402, 66.98259], [16.03876, 66.91245], [15.99364, 66.87323], [15.62137, 66.59434], [15.37723, 66.4843], [15.48473, 66.28246], [15.03568, 66.15356], [14.51629, 66.13258], [14.58441, 65.90134], [14.62548, 65.81181], [14.54147, 65.70075], [14.49877, 65.5213], [14.50683, 65.30973], [14.3788, 65.24762], [14.32598, 65.11892], [14.12989, 64.97856], [13.70547, 64.63996], [13.65426, 64.58034], [13.89118, 64.50713], [14.08523, 64.47825], [14.11387, 64.46248], [14.15711, 64.19505], [13.96752, 64.00797], [13.7154, 64.04629], [13.21111, 64.09537], [12.92672, 64.05795], [12.68356, 63.97422], [12.48023, 63.81876], [12.33057, 63.71507], [12.29946, 63.67198], [12.14977, 63.59395], [12.21288, 63.47859], [12.08407, 63.35558], [11.97458, 63.26923], [12.21823, 63.00033], [12.07469, 62.90254], [12.13638, 62.74792], [12.05614, 62.61192], [12.29937, 62.26749], [12.13766, 61.72382], [12.41961, 61.56298], [12.56932, 61.56875], [12.87085, 61.3565], [12.83383, 61.25846], [12.79035, 61.19705], [12.70703, 61.14327], [12.68258, 61.06122], [12.61251, 61.04683], [12.44761, 61.05073], [12.22399, 61.01308], [12.33279, 60.89017], [12.33448, 60.85236], [12.39537, 60.73389], [12.51102, 60.64246], [12.51578, 60.60015], [12.60688, 60.51274], [12.60605, 60.40593], [12.49879, 60.32365], [12.54191, 60.19338], [12.50064, 60.09908], [12.44856, 60.03917], [12.34114, 59.96567], [12.23104, 59.92759], [12.17429, 59.88981], [12.05346, 59.88594], [11.98518, 59.90072], [11.84045, 59.84174], [11.92597, 59.794], [11.93988, 59.69458], [11.88922, 59.69321], [11.85571, 59.64829], [11.72056, 59.62549], [11.69113, 59.58955], [11.75993, 59.45818], [11.77987, 59.38646], [11.81625, 59.34474], [11.82979, 59.24223], [11.78393, 59.20838], [11.77539, 59.08659], [11.71051, 59.03368], [11.68908, 58.95685], [11.59063, 58.89072], [11.45623, 58.89021], [11.45853, 58.99597], [11.34184, 59.12041], [11.20498, 59.08311], [11.17718, 59.09736], [11.1, 59], [11.0203, 58.97], [9.67858, 58.87844], [8.51901, 58.15871], [7.92368, 57.95878], [6.62638, 57.9188], [5.34686, 58.63409], [4.70265, 59.35382], [4.57381, 61.1576], [4.78262, 62.0506], [5.46681, 62.55263], [6.79965, 62.99691], [8.29243, 63.77884], [9.92293, 64.11205], [10.71819, 65.0095], [11.4246, 65.12057], [11.79779, 65.84919], [11.95329, 67.64852], [13.20171, 68.29717], [14.5701, 68.89694], [16.08064, 69.41675], [17.91552, 69.8166], [19.1906, 70.36306], [19.81259, 70.33196], [20.19467, 70.19424], [21.78519, 70.50523], [21.89626, 70.73182], [23.70892, 70.96284], [23.91773, 71.1139], [24.46864, 71.07391], [24.71744, 71.21608], [25.89478, 71.26051], [26.77445, 71.08724], [27.79185, 71.22052], [28.65819, 71.06503], [30.03102, 70.78069], [31.23946, 70.43859], [31.19482, 70.34084], [30.79367, 69.78758]], [[4.2, 80.84], [-11.5, 70.1], [19.2, 73.5], [39.2, 81.4]]],
  Sweden: [[[15.4538561, 66.34534869999999], [15.3772302, 66.4843117], [15.625833, 66.605833], [15.80794, 66.735271], [16.0387632, 66.9124213], [16.195223, 66.982232], [16.3877, 67.0455], [16.4040109, 67.2049795], [16.09015, 67.435232], [16.1566, 67.519458], [16.407797, 67.533978], [16.555733, 67.647289], [16.7381292, 67.91418620000002], [17.180003, 68.050508], [17.2818957, 68.1188101], [17.6648128, 68.0384733], [17.8998048, 67.9693359], [18.1514126, 68.198755], [18.1010915, 68.406043], [18.1258499, 68.5364954], [18.4056102, 68.5818554], [18.6211478, 68.5069382], [18.9836971, 68.5169473], [19.921397, 68.3560137], [19.9778586, 68.3881535], [20.2264196, 68.4908071], [19.9375039, 68.5579418], [20.0521233, 68.5910515], [20.2027029, 68.6659076], [20.3358646, 68.8023404], [20.3064282, 68.9261735], [20.0600472, 69.0457578], [20.5486422, 69.05996990000001], [20.7750428, 69.0326073], [20.9137291, 68.9603927], [20.8441913, 68.93656440000002], [20.9156942, 68.8971424], [20.9967921, 68.896741], [21.2340165, 68.8140862], [21.3194271, 68.7592708], [21.3893348, 68.76495460000002], [21.4298688, 68.691352], [21.5651505, 68.6752534], [21.7013706, 68.6305605], [21.7016655, 68.5963461], [21.8898693, 68.5844051], [21.9919125, 68.5339794], [22.0182391, 68.495951], [22.1528153, 68.4701805], [22.2945732, 68.4838241], [22.4661749, 68.4413001], [22.6482126, 68.41604160000001], [22.7362404, 68.3852018], [22.8041064, 68.39294], [22.9181313, 68.3335115], [23.0702517, 68.29970360000002], [23.1528179, 68.2310713], [23.1415318, 68.1543005], [23.2783645, 68.15733889999998], [23.3216014, 68.1347101], [23.3966203, 68.044179], [23.5310194, 68.0067455], [23.6632301, 67.94218640000001], [23.6407972, 67.9151784], [23.5098377, 67.87994509999999], [23.4739757, 67.81714420000002], [23.4946531, 67.7903019], [23.493057, 67.6641861], [23.5588847, 67.6192741], [23.5450496, 67.5829545], [23.4081036, 67.50173829999999], [23.4104738, 67.46759370000002], [23.5365192, 67.4599963], [23.7632859, 67.4262029], [23.7179667, 67.384843], [23.7750768, 67.3393805], [23.7311639, 67.28763560000002], [23.5834506, 67.269308], [23.5535126, 67.2468025], [23.5958386, 67.2071971], [23.5569385, 67.16578719999998], [23.6536532, 67.1042345], [23.6739708, 67.0650834], [23.8564714, 66.9558968], [23.8640579, 66.9221303], [23.9330592, 66.8845665], [23.9945079, 66.82348849999998], [23.9782068, 66.78409040000001], [23.8797209, 66.7620511], [23.9078441, 66.72140390000001], [23.8685321, 66.6568254], [23.8846737, 66.61277119999998], [23.8605347, 66.5595503], [23.7853219, 66.5333886], [23.6509657, 66.4557476], [23.6880374, 66.3815611], [23.6489848, 66.3037725], [23.7263744, 66.1968556], [23.9159179, 66.1621612], [23.936749, 66.0794759], [24.0374327, 66.0090364], [24.0421963, 65.9633925], [24.152978, 65.862572], [24.1318042, 65.7716089], [24.1721721, 65.72528229999999], [24.1776819, 65.6603564], [24.1319001, 65.5153846], [24.1444599, 65.3956667], [23.1299456, 65.2854532], [21.8250561, 64.8363612], [22.0872366, 64.43431070000001], [21.5096176, 64.04121570000002], [21.4570471, 63.7528427], [20.20662871333013, 63.274568586669865], [19.4322896, 63.0737152], [18.2961641, 62.4173632], [17.7755886, 61.1718712], [17.8981165, 60.9377595], [17.7095869, 60.7102649], [17.3865202, 60.6893467], [17.3489744, 60.5862714], [17.3024177, 60.508762], [17.29774, 60.4647038], [17.2565412, 60.4243351], [17.1955585, 60.4105852], [17.1986283, 60.3077815], [17.0585097, 60.2727725], [16.908878, 60.281498], [16.9048859, 60.2394077], [16.7046001, 60.1950497], [16.6294785, 60.2384924], [16.6154023, 60.2786235], [16.5166127, 60.3554293], [16.3927146, 60.3794045], [16.2589904, 60.4931441], [16.1947891, 60.5354328], [16.13651, 60.6103267], [16.2382972, 60.6230491], [16.3769218, 60.7434488], [16.386117, 60.7868], [16.2552139, 60.8636119], [16.1310092, 60.9920575], [15.9216155, 61.00763], [15.7619207, 61.0496869], [15.6803816, 61.11321], [15.6573361, 61.2154788], [15.4760187, 61.3149858], [15.3370007, 61.4016369], [15.20475, 61.503826], [15.1531933, 61.5956892], [14.8564014, 61.7835491], [14.7971, 61.798451], [14.6666465, 61.8918775], [14.5296202, 61.783626], [14.4997464, 61.62599], [14.3947754, 61.5637652], [14.3364964, 61.59913920000001], [14.1822587, 61.6175455], [13.9769516, 61.6213397], [13.8902353, 61.6525473], [13.6131488, 61.6726273], [13.564749, 61.656455], [13.5066718, 61.6929666], [13.5145384, 61.7377738], [13.4160916, 61.8280592], [13.2092287, 61.9365972], [13.0799221, 62.0376119], [13.0423631, 62.0182008], [12.9513736, 62.1334555], [12.9026405, 62.1418727], [12.8059683, 62.2205277], [12.6078489, 62.214806], [12.299389, 62.2659814], [12.056144, 62.6119191], [12.1363845, 62.7479169], [12.074689, 62.9025463], [12.218233, 63.0003345], [11.9745822, 63.2692252], [12.0840901, 63.3555796], [12.2128783, 63.4785906], [12.1497625, 63.593946], [12.2975812, 63.6732169], [12.3399662, 63.7269855], [12.4797773, 63.8196667], [12.6860556, 63.9738931], [12.9268369, 64.05783829999999], [13.2109436, 64.0951725], [13.7151219, 64.045304], [13.981667, 64.013056], [14.1579301, 64.1860759], [14.120556, 64.452778], [14.086006, 64.47814109999999], [13.8924406, 64.507004], [13.6540802, 64.579929], [13.7050997, 64.6396655], [14.1081927, 64.96225790000001], [14.3257603, 65.1190618], [14.3790211, 65.24804960000002], [14.5056577, 65.3099238], [14.4967711, 65.5174317], [14.5295213, 65.682227], [14.6240045, 65.81419090000001], [14.584253, 65.9013501], [14.5162846, 66.132567], [15.035653, 66.1535649], [15.4847146, 66.282458], [15.4538561, 66.34534869999999]]],
  USA: [[[-130.01989, 55.9153], [-130.17038, 55.77749], [-130.13861, 55.55335], [-129.99201, 55.28955], [-130.25933, 54.99635], [-130.66666, 54.71444], [-131.17048, 54.72103], [-132.10046, 54.6269], [-132.86477, 54.63066], [-133.60649, 54.72479], [-134.93933, 56.02375], [-136.80681, 57.75192], [-137.09296, 58.25079], [-139.07716, 59.1017], [-141.32115, 59.76436], [-143.47102, 59.81707], [-146.37014, 59.17701], [-149.21654, 59.54598], [-152.0253, 57.0535], [-155.80544, 55.02035], [-159.93198, 54.32757], [-173.1399, 51.33056], [-179.49537, 50.84863], [-179.28453, 52.29443], [-171.78447, 63.95114], [-169.94709, 63.91437], [-169.09903, 65.86662], [-168.1474, 65.7885], [-164.9772, 66.85025], [-167.15342, 68.37135], [-166.29498, 69.12437], [-161.71663, 70.74335], [-156.23466, 71.55661], [-143.75716, 70.6304], [-141.58847, 70.26895], [-141.56335, 69.73575], [-141.39798, 69.64277], [-141.00304, 69.64616], [-141.00189, 60.6745], [-141.00157, 60.30507], [-140.52034, 60.21906], [-140.44797, 60.30796], [-139.97408, 60.18451], [-139.68007, 60.33572], [-139.05208, 60.35373], [-139.17702, 60.08286], [-138.70578, 59.90624], [-138.60921, 59.76], [-137.60744, 59.24348], [-137.45151, 58.90854], [-136.82468, 59.1598], [-136.58199, 59.16554], [-136.19525, 59.63881], [-135.9476, 59.66343], [-135.47958, 59.7981], [-135.02888, 59.56364], [-135.10063, 59.42776], [-134.95978, 59.28104], [-134.7007, 59.2489], [-134.48273, 59.13097], [-134.258, 58.86087], [-133.84105, 58.72985], [-133.37997, 58.43181], [-133.45987, 58.38848], [-133.17195, 58.15383], [-132.55389, 57.4967], [-132.2478, 57.21112], [-132.36871, 57.09167], [-132.0448, 57.0451], [-132.12311, 56.8739], [-131.87311, 56.80627], [-131.83539, 56.59912], [-131.5813, 56.6123], [-131.08698, 56.40613], [-130.7818, 56.36713], [-130.4682, 56.24329], [-130.42548, 56.14172], [-130.10541, 56.12268], [-130.01989, 55.9153]], [[179.9, 52.2], [172.0, 53.3], [172.0, 52.4], [179.9, 51.0]]]
};
/* eslint-enable max-len */

let usingClockLocations = true;

/**
 * Toggle the use of clock locations on or off
 * @param {bool} useCL whether clock locations should be used.
 */
const useClockLocations = function (useCL) {
  usingClockLocations = useCL;
};

/**
 * Determine whether a point lies within a polygon.
 * All coordinates are given as [longitude, latitude].
 * @param {array} coords Coordinates of the point
 * @param {array} polygon given by an array of pairs of x and y coordinates
 * @returns {bool} whether the point given by coords is inside the polygon
 */
const inPolygon = function (coords, polygon) {
  const [x, y] = coords;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    // Check that a) the segment crosses the y coordinate of the point
    //            b) at least one of the two vertices is left of the point
    //            c) at the y coordinate of the point, the segment is left of it
    if ((((yi < y) !== (yj < y)) && (xi <= x || xj <= x)) &&
        ((xi + (y - yi) * (xj - xi) / (yj - yi)) < x)) {
      inside = !inside;
    }
    j = i;
  }
  return inside;
};

/**
 * Determine whether coordinates are within a region where fixed times are used
 * as "sunrise" and "sunset" using polygons. The name of a country being
 * returned doesn't just mean that the coordinates are within that country, but
 * that they are within the region of that country where such a rule applies.
 * @param {number} latitude of the point to be checked
 * @param {number} longitude of the point to be checked
 * @returns {(string|false)} the appropriate region or false
 */
const clockLocationFromPolygons = function (latitude, longitude) {
  if (!usingClockLocations) {
    return false;
  }
  // First exclude as large an area as possible from having to check polygons
  if (latitude < 51.0) {
    return false;
  }
  if (latitude < 57.0 && longitude > -129.0 && longitude < 172.0) {
    return false;
  }
  // Make a list of plausible areas based on longitude, then only check those
  const countries = [];
  const labels = [];
  if (longitude < -129.9 || longitude > 172.4) {
    countries.push(clockLocations.USA);
    labels.push('USA');
  }
  if (longitude > -141.1 && longitude < -61.1) {
    countries.push(clockLocations.Canada);
    labels.push('Canada');
  }
  // Greenland doesn't currently have a rule for this
  // if (longitude > -73.1 && longitude < -11.3) {
  //   countries.push(clockLocations.Greenland);
  //   labels.push('Greenland');
  // }
  if (longitude > -25.0 && longitude < -12.8) {
    countries.push(clockLocations.Iceland);
    labels.push('Iceland');
  }
  if (longitude > -9.2 && longitude < 33.6) {
    countries.push(clockLocations.Norway);
    labels.push('Norway');
  }
  if (longitude > 10.9 && longitude < 24.2) {
    countries.push(clockLocations.Sweden);
    labels.push('Sweden');
  }
  if (longitude > 19.1 && longitude < 31.6) {
    countries.push(clockLocations.Finland);
    labels.push('Finland');
  }
  // Russia currently doesn't have a rule for this
  // if (longitude > 27.3 || longitude < -169.6) {
  //  countries.push(clockLocations.Russia);
  //  labels.push('Russia');
  // }
  for (let i = 0; i < countries.length; i++) {
    for (let j = 0; j < countries[i].length; j++) {
      if (inPolygon([longitude, latitude], countries[i][j])) {
        return labels[i];
      }
    }
  }
  return false;
};

const moment$4 = momentNs;

/* eslint-disable complexity */

/**
 * Wrapper class for Badí' date which takes care of all the location dependent
 * things: times for start, end, sunrise, and solar noon of the date as well as
 * the times for Holy Day commemorations.
 */
class LocalBadiDate {
  /**
   * Creates a Badí' date with location dependent information.
   * @param {(Date|moment|string|Array)} date input date, same formats as for
   *   badiDate are accepted. For a moment object, the time (before or after
   *   sunset) is taken into consideration, otherwise only the date.
   * @param {number} latitude of target location
   * @param {number} longitude of target location
   * @param {string} timezoneId as per IANA time zone database
   */
  constructor(date, latitude, longitude, timezoneId) {
    // If a moment object is being passed, we use date and time, not just the
    // date. For a JS Date object, we can't assume it's in the correct timezone,
    // so in that case we use the date information only.
    if (date instanceof moment$4) {
      const sunset$1 = sunset(date, latitude, longitude);
      if (date.isAfter(sunset$1)) {
        date.add(1, 'day');
      }
    }
    this.badiDate = new BadiDate(date);
    const gregDate = moment$4.tz(
      this.badiDate.gregorianDate().format('YYYY-MM-DDTHH:mm:ss'), timezoneId);
    this.clockLocation = clockLocationFromPolygons(latitude, longitude);
    if (!this.clockLocation ||
        (this.clockLocation === 'Finland' &&
         this.badiDate.badiMonth() === 19)) {
      this.end = sunset(gregDate, latitude, longitude);
      this.solarNoon = solarNoon(gregDate, longitude);
      this.sunrise = sunrise(gregDate, latitude, longitude);
      this.start = sunset(
        gregDate.subtract(1, 'day'), latitude, longitude);
      // add() and subtract() mutate the object, so we have to undo it
      gregDate.add(1, 'day');
    } else {
      // First we set times to 18:00, 06:00, 12:00, 18:00, modifications are
      // then made depending on the region.
      this.end = moment$4.tz(
        gregDate.format('YYYY-MM-DDT') + '18:00:00', timezoneId);
      this.solarNoon = moment$4.tz(
        gregDate.format('YYYY-MM-DDT') + '12:00:00', timezoneId);
      this.sunrise = moment$4.tz(
        gregDate.format('YYYY-MM-DDT') + '06:00:00', timezoneId);
      this.start = moment$4.tz(gregDate.subtract(
        1, 'day').format('YYYY-MM-DDT') + '18:00:00', timezoneId);
      // add() and subtract() mutate the object, so we have to undo it
      gregDate.add(1, 'day');
      if (this.clockLocation === 'Canada') {
        this.sunrise.add(30, 'minutes');
      } else if (this.clockLocation === 'Iceland') {
        this.solarNoon.add(1, 'hour');
      } else if (this.clockLocation === 'Finland' ||
                 this.clockLocation === 'USA') {
        if (this.end.isDST()) {
          this.end.add(1, 'hour');
          this.solarNoon.add(1, 'hour');
          this.sunrise.add(1, 'hour');
        }
        if (this.start.isDST()) {
          this.start.add(1, 'hour');
        }
      }
    }
    this.holyDayCommemoration = false;
    switch (this.badiDate.holyDayNumber()) {
      case 2:
        // First Day of Ridvan: 15:00 local standard time
        this.holyDayCommemoration = gregDate;
        this.holyDayCommemoration.hour(gregDate.isDST() ? 16 : 15);
        break;
      case 5:
        // Declaration of the Báb: 2 hours 11 minutes after sunset
        this.holyDayCommemoration = moment$4.tz(this.start, timezoneId);
        this.holyDayCommemoration.add(131, 'minutes');
        break;
      case 6:
        // Ascension of Bahá'u'lláh: 03:00 local standard time
        this.holyDayCommemoration = gregDate;
        this.holyDayCommemoration.hour(gregDate.isDST() ? 4 : 3);
        break;
      case 7:
        // Martyrdom of the Báb: solar noon
        this.holyDayCommemoration = this.solarNoon;
        break;
      case 11:
        // Ascension of 'Abdu'l-Bahá: 01:00 local standard time
        this.holyDayCommemoration = gregDate;
        this.holyDayCommemoration.hour(gregDate.isDST() ? 2 : 1);
        break;
      // skip default
    }
  }
}

/**
 * Sets options (defaultLanguage, useClockLocations) for the
 * module.
 * @param {object} options Options to be set.
 */
const badiDateOptions$1 = function (options) {
  if (typeof options.defaultLanguage === 'string' ||
      typeof options.underlineFormat === 'string') {
    badiDateOptions(options);
  }
  if (typeof options.useClockLocations === 'boolean') {
    useClockLocations(options.useClockLocations);
  }
};

options({returnTimeForPNMS: true, roundToNearestMinute: true});

export { BadiDate, LocalBadiDate, index as MeeusSunMoon, badiDateOptions$1 as badiDateOptions };
