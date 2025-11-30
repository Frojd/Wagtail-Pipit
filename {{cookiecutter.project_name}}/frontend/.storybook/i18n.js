import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Fetch JSON from public directory for Vite compatibility
const sv = await fetch('/locales/sv/common.json').then(r => r.json()).catch(() => ({}));

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
