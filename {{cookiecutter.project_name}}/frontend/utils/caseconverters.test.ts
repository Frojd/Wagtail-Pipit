import { keysToCamelFromSnake, keysToSnakeFromCamel } from './caseconverters';

describe('keysToCamelFromSnake', () => {
    it('Converts nested keys, drops null values and keeps null array items', () => {
        expect(
            keysToCamelFromSnake({
                site_setting: { gtm_id: 'GTM-1', robots: null },
                items: [{ relative_url: '/a/' }, null],
            })
        ).toEqual({
            siteSetting: { gtmId: 'GTM-1' },
            items: [{ relativeUrl: '/a/' }, null],
        });
    });

    it('Keeps null values when asked to', () => {
        expect(keysToCamelFromSnake({ seo_title: null }, false)).toEqual({
            seoTitle: null,
        });
    });
});

describe('keysToSnakeFromCamel', () => {
    it('Converts camel case keys to snake case', () => {
        expect(keysToSnakeFromCamel({ htmlPath: '/', pageId: 1 })).toEqual({
            html_path: '/',
            page_id: 1,
        });
    });
});
