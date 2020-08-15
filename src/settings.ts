import { BadiDateSettings } from './types';
import { setDefaultLanguage, setUnderlineFormat } from './badiLocale';

const badiDateSettings = (settings: BadiDateSettings) => {
    if (settings.defaultLanguage) {
        setDefaultLanguage(settings.defaultLanguage);
    }
    if (settings.underlineFormat) {
        setUnderlineFormat(settings.underlineFormat);
    }
};

export { badiDateSettings };
