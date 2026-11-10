import { getLocaleFromPath } from './locale';

jest.mock('./config', () => ({
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
}));

describe('getLocaleFromPath', () => {
    it('Returns the locale prefix of the path', () => {
        expect(getLocaleFromPath('/en/about/')).toBe('en');
    });

    it('Falls back to the default locale when the first segment is not a locale', () => {
        expect(getLocaleFromPath('/about/')).toBe('sv');
    });

    it('Falls back to the default locale on the root path', () => {
        expect(getLocaleFromPath('/')).toBe('sv');
        expect(getLocaleFromPath('')).toBe('sv');
    });

    it('Does not match a locale later in the path', () => {
        expect(getLocaleFromPath('/blog/en/')).toBe('sv');
    });
});
