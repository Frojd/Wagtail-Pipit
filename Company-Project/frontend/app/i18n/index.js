/**
 * Usage:
 * import i18n from 'i18n'
 *
 * then call translate like this:
 * i18n.t('hello.world', 'Fallback')
 *
 * See: https://www.i18next.com/ for more information
 */

import i18next from 'i18next';

import sv from './translations/sv.json';
import en from './translations/en.json';

i18next.init({
    languages: ['en', 'sv'],
    fallbackLng: ['en'],
    resources: {
        sv: {
            translation: sv,
        },
        en: {
            translation: en,
        },
    },
});

// Update this to reflect what language your page should use
const lang = () => {
    return 'en';
};

i18next.changeLanguage(lang());

export default i18next;
