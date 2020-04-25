import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-re';
import { terser } from 'rollup-plugin-terser';

const copyrightNotice = `/**
 * @license BadiDate v2.1.2\n * (c) 2018 Jan Greis
 * licensed under MIT
 */
`;

/**
 * Generates a regex that removes locale imports for those locales that weren't
 * selected.
 * @param {array} languageCodes List of language codes that should be retained.
 * @returns {RegExp} generated regex
 */
const localeRegex = languageCodes => {
    const locales = ['ar', 'de', 'es', 'fa', 'fr', 'lv', 'nl', 'pt', 'ru', 'sv',
        'zh', 'en_us', 'en-us'];
    let localeListString = '';
    for (let i = 0; i < locales.length; i++) {
        if (!languageCodes.includes(locales[i])) {
            localeListString += `|${locales[i]}`;
        }
    }
    localeListString = localeListString.slice(1);
    const regexString = `(import \\* as (${localeListString}) from 
    '\\.\\/locale\\/(${localeListString})\\.js';|badiLocale\\['(${localeListString})'] = (${localeListString});)`;
    return RegExp(regexString, 'g');
};

/**
 * @param {string} root Entry point for bundle
 * @param {boolean} mss Whether MeeusSunMoon should be bundled in
 * @param {boolean|array} locales Whether all locales or else which locales
 *                                should be bundled in
 * @param {boolean} minify Whether to minify output
 * @param {'umd'|'es'} format Rollup output format
 * @param {string} filename Optional output filename override
 * @returns {object} Individual Rollup config object
 */
// eslint-disable-next-line complexity
const rollupConfig = (root, mss, locales, minify, format, filename = '') => {
    if (filename === '') {
        filename = `dist/${
            root === 'localBadiDate.ts' ? 'localB' : 'b'}adiDate${
            mss ? '-mss' : ''}${locales === true ? '-locales' : ''}${
            format === 'es' ? '-es' : ''}${minify ? '.min' : ''}.js`;
    }
    if (root === 'localBadiDate.ts' && mss) {
        root = 'mssBundle.ts';
    }
    const config = {
        external: ['moment-timezone'],
        input: `src/${root}`,
        output: {
            banner: copyrightNotice,
            extend: format !== 'es',
            file: filename,
            format,
            name: format === 'es' ? 'badiDate' : 'window',
        },
        plugins: [],
    };
    const replacePatterns = [];
    if (locales !== true) {
        replacePatterns.push({
            match: 'src/badiLocale.ts',
            replace: '',
            test: localeRegex(locales),
        });
    }
    if (locales !== true || !mss) {
        config.plugins.push(replace({ patterns: replacePatterns }));
    }
    if (format === 'umd') {
        config.plugins.push(babel());
    }
    if (minify) {
        config.plugins.push(terser({ output: { preamble: copyrightNotice } }));
        config.output.sourcemap = true;
    }
    return config;
};

export default [
    rollupConfig('badiDate.ts', false, true, true, 'es'),
    rollupConfig('badiDate.ts', false, true, true, 'umd'),
    rollupConfig('badiDate.ts', false, true, false, 'es'),
    rollupConfig('badiDate.ts', false, true, false, 'umd'),
    rollupConfig('badiDate.ts', false, [], true, 'es'),
    rollupConfig('badiDate.ts', false, [], true, 'umd'),
    rollupConfig('badiDate.ts', false, [], false, 'es'),
    rollupConfig('badiDate.ts', false, [], false, 'umd'),
    rollupConfig('localBadiDate.ts', true, true, true, 'es'),
    rollupConfig('localBadiDate.ts', true, true, true, 'umd'),
    rollupConfig('localBadiDate.ts', true, true, false, 'es'),
    rollupConfig('localBadiDate.ts', true, true, false, 'umd'),
    rollupConfig('localBadiDate.ts', true, [], true, 'es'),
    rollupConfig('localBadiDate.ts', true, [], true, 'umd'),
    rollupConfig('localBadiDate.ts', true, [], false, 'es'),
    rollupConfig('localBadiDate.ts', true, [], false, 'umd'),
    rollupConfig('localBadiDate.ts', false, true, true, 'es'),
    rollupConfig('localBadiDate.ts', false, true, true, 'umd'),
    rollupConfig('localBadiDate.ts', false, true, false, 'es'),
    rollupConfig('localBadiDate.ts', false, true, false, 'umd'),
    rollupConfig('localBadiDate.ts', false, [], true, 'es'),
    rollupConfig('localBadiDate.ts', false, [], true, 'umd'),
    rollupConfig('localBadiDate.ts', false, [], false, 'es'),
    rollupConfig('localBadiDate.ts', false, [], false, 'umd'),
];
