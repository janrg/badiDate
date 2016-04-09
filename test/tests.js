"use strict";
QUnit.config.hidepassed = true;

QUnit.test("badiDates", function(assert) {
  for (var i = 0; i < 50; i++) {
    var nawRuz = new badiDate([i+172, 1]);
    var birthOfTheBab = new badiDate([i+172, 8]);
    var birthOfBahaullah = new badiDate([i+172, 9]);
    assert.strictEqual(nawRuz.gregDate().format("YYYY-MM-DD"), testDates[i][0], "Naw-Rúz " + (i + 172) + ": " + nawRuz.gregDate().date() + "/" + testDates[i][0].slice(8) + " March");
    assert.strictEqual(nawRuz.ayyamiHaLength(), testDates[i][1], "Length of Ayyám-i-Há " + (i + 172) + ": " + nawRuz.ayyamiHaLength() + "/" + testDates[i][1]);
    assert.strictEqual(birthOfTheBab.badiMonth(), testDates[i][2][0], "Birth of the Báb " + (i + 172) + ", Month: " + birthOfTheBab.badiMonth() + "/" +  testDates[i][2][0]);
    assert.strictEqual(birthOfTheBab.badiDay(), testDates[i][2][1], "Birth of the Báb " + (i + 172) + ", Day: " + birthOfTheBab.badiDay() + "/" +  testDates[i][2][1]);
    assert.strictEqual(birthOfBahaullah.badiMonth(), testDates[i][2][2], "Birth of Bahá'u'lláh " + (i + 172) + ", Month: " + birthOfBahaullah.badiMonth() + "/" +  testDates[i][2][2]);
    assert.strictEqual(birthOfBahaullah.badiDay(), testDates[i][2][3], "Birth of Bahá'u'lláh " + (i + 172) + ", Day: " + birthOfBahaullah.badiDay() + "/" +  testDates[i][2][3]);
  }
});

QUnit.test("Random badiDate Conversions", function (assert) {
  for (var i = 0; i < 1000; i++) {
    var dayOfMonth = Math.floor((Math.random() * 28) + 1);
    var month = Math.floor((Math.random() * 12) + 1);
    var year = Math.floor((Math.random() * 554) + 1845);
    var initDate = moment.utc(year + "-" + ("0" + month).slice(-2) + "-" + ("0" + dayOfMonth).slice(-2));
    var badiDate1 = new badiDate(initDate);
    var badiDate2 = new badiDate([badiDate1.badiYear(), badiDate1.badiMonth(), badiDate1.badiDay()]);
    var badiDate3 = new badiDate(badiDate2.gregDate());
    var badiDate4 = new badiDate(String(badiDate3.badiYear()) + "-" + String(badiDate3.badiMonth()) + "-" + String(badiDate3.badiDay()));
    assert.strictEqual(initDate.format("YYYY-MM-DD"), badiDate4.gregDate().format("YYYY-MM-DD"), "Multiple Date Conversions: " + initDate.format("YYYY-MM-DD") + "/" + badiDate4.gregDate().format("YYYY-MM-DD"));
  }
});
