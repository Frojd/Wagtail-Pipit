import { defaultLocale, locales } from './config';

export function getLocaleFromPath(pathname) {
    const [firstSegment] = (pathname || '').split('/').filter(Boolean);
    return locales.includes(firstSegment) ? firstSegment : defaultLocale;
}
