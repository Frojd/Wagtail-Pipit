import { defaultLocale, locales } from './config';

export function getLocaleFromPath(pathname: string | null): string {
    const [firstSegment] = (pathname || '').split('/').filter(Boolean);
    return locales.includes(firstSegment) ? firstSegment : defaultLocale;
}
