/* eslint-disable max-depth */
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from 'rollup-plugin-re';

const copyrightNotice = `/**
 * @license BadiDate v3.0.2
 * (c) 2018 Jan Greis
 * licensed under MIT
 */
`;

const localeRegex = languageCodes => {
    const locales = ['ar', 'de', 'es', 'fa', 'fr', 'lv', 'nl', 'pt', 'ru', 'sv',
        'zh', 'en-us'].filter(entry => !languageCodes.includes(entry));
    const regexString = `( '?(${locales.join('|')})('?: \\S*)?,)`;
    return RegExp(regexString, 'g');
};

const rollupConfig = (root, msm, locales, minify, format, filename) => {
    if (filename === undefined) {
        filename = `dist/${root.slice(0, -3)}${msm ? '-msm' : ''}${locales === true ? '-locales' : ''}${
            minify ? '.min' : ''}.${format === 'es' ? 'm.' : ''}js`;
    }
    const config = {
        external: ['luxon'],
        input: `src/${root}`,
        output: {
            banner: copyrightNotice,
            extend: format !== 'es',
            file: filename,
            format,
            name: format === 'es' ? 'badiDate' : 'window',
            globals: format === 'es' ? {} : { luxon: 'luxon', meeussunmoon: 'MeeusSunMoon' },
        },
        plugins: [resolve({ modulesOnly: true }), typescript()],
    };
    if (locales !== true) {
        const replacePatterns = [{ match: 'src/badiLocale.ts', replace: '', test: localeRegex(locales) }];
        config.plugins.splice(1, 0, replace({ patterns: replacePatterns }));
    }
    if (!msm) {
        config.external.push('meeussunmoon');
    }
    if (minify) {
        config.plugins.push(terser());
        config.output.sourcemap = true;
    }
    return config;
};

const configs = [];
for (const root of ['badiDate.ts', 'localBadiDate.ts']) {
    for (const msm of [true, false]) {
        for (const locales of [true, []]) {
            for (const minify of [true, false]) {
                for (const format of ['es', 'umd']) {
                    if (!msm || root === 'localBadiDate.ts') {
                        configs.push(rollupConfig(root, msm, locales, minify, format));
                    }
                }
            }
        }
    }
}

export default configs;
