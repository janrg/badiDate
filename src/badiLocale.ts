/* eslint-disable dot-notation, line-comment-position, camelcase, sort-imports */
import * as en from './locale/en';
import * as ar from './locale/ar';
import * as de from './locale/de';
import * as es from './locale/es';
import * as fa from './locale/fa';
import * as fr from './locale/fr';
import * as lv from './locale/lv';
import * as nl from './locale/nl';
import * as pt from './locale/pt';
import * as ru from './locale/ru';
import * as sv from './locale/sv';
import * as zh from './locale/zh';
import * as en_us from './locale/en-us';
import { UnderlineFormat } from './types';

const badiLocale = { en, ar, de, es, fa, fr, lv, nl, pt, ru, sv, zh, 'en-us': en_us, default: en };

const setDefaultLanguage = (language: string) => {
    if (badiLocale[language] === undefined) {
        // eslint-disable-next-line no-console
        console.log('Chosen language does not exist. Setting has not been changed.');
    } else {
        badiLocale['default'] = badiLocale[language];
    }
};

let underlineFormat = 'css';

const setUnderlineFormat = (format: UnderlineFormat) => {
    if (['css', 'u', 'diacritic', 'none'].includes(format)) {
        underlineFormat = format;
    } else {
        // eslint-disable-next-line no-console
        console.log('Invalid underline format. Choose one of ["css", "u", "diacritic", "none"]. ' +
            'Setting has not been changed.');
    }
};

export { badiLocale, setDefaultLanguage, setUnderlineFormat, underlineFormat };
