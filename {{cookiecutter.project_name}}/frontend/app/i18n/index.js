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

i18next.init({
    languages: ['sv'],
    fallbackLng: ['sv'],
    resources: {
        sv: {
            translation: sv
        }
    }
});

// Update this to reflect what language your page should use
const lang = () => {
    return 'sv'
}

i18next.changeLanguage(lang());

export default i18next;