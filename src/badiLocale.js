/* eslint-disable dot-notation, line-comment-position, camelcase, sort-imports */
import * as en from './locale/en.js';
import * as ar from './locale/ar.js';
import * as de from './locale/de.js';
import * as es from './locale/es.js';
import * as fa from './locale/fa.js';
import * as fr from './locale/fr.js';
import * as lv from './locale/lv.js';
import * as nl from './locale/nl.js';
import * as pt from './locale/pt.js';
import * as ru from './locale/ru.js';
import * as sv from './locale/sv.js';
import * as zh from './locale/zh.js';
import * as en_us from './locale/en-us.js';

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

export {badiLocale, setDefaultLanguage, setUnderlineFormat, underlineFormat};
