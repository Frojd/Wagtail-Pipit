import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import sv from '../public/locales/sv/common.json';

i18n.use(initReactI18next).init({
    resources: {
        sv: { translation: sv },
    },
    fallbackLng: 'sv',
    defaultLocale: 'sv',
    locales: ['sv'],
    debug: true,
});

export default i18n;
