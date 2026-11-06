import { postRequest } from './wagtail';

const jsonResponse = (body) => ({
    status: 200,
    headers: new Headers(),
    json: async () => body,
});

describe('postRequest', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        delete global.fetch;
    });

    it('Fetches a csrf token and sends it with the post', async () => {
        fetch
            .mockResolvedValueOnce(jsonResponse({ csrf_token: 'token-1' }))
            .mockResolvedValueOnce(jsonResponse({}));

        await postRequest('/endpoint/', { password: 'x' });

        expect(fetch.mock.calls[0][0]).toContain('/v1/csrf_token/');
        expect(fetch.mock.calls[1][0]).toBe('/endpoint/');
        expect(fetch.mock.calls[1][1].headers['X-CSRFToken']).toBe('token-1');
    });

    it('Keeps a csrf token passed by the caller', async () => {
        fetch.mockResolvedValueOnce(jsonResponse({}));

        await postRequest(
            '/endpoint/',
            {},
            {
                headers: { 'X-CSRFToken': 'own-token' },
            }
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][1].headers['X-CSRFToken']).toBe('own-token');
    });

    it('Resolves without a body on 204 No Content', async () => {
        fetch.mockResolvedValueOnce({
            status: 204,
            headers: new Headers(),
            json: async () => {
                throw new SyntaxError('Unexpected end of JSON input');
            },
        });

        const { json } = await postRequest(
            '/endpoint/',
            {},
            {
                headers: { 'X-CSRFToken': 'own-token' },
            }
        );

        expect(json).toBeNull();
    });
});
