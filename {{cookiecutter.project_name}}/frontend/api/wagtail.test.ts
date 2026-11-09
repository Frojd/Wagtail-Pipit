/**
 * @jest-environment node
 */
import { postRequest } from './wagtail';

// The node environment provides fetch and Response, jsdom has neither
const jsonResponse = (body: unknown) =>
    new Response(JSON.stringify(body), { status: 200 });

describe('postRequest', () => {
    let fetchSpy: jest.SpiedFunction<typeof fetch>;

    beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('Fetches a csrf token and sends it with the post', async () => {
        fetchSpy
            .mockResolvedValueOnce(jsonResponse({ csrf_token: 'token-1' }))
            .mockResolvedValueOnce(jsonResponse({}));

        await postRequest('/endpoint/', { password: 'x' });

        expect(fetchSpy.mock.calls[0][0]).toContain('/v1/csrf_token/');
        expect(fetchSpy.mock.calls[1][0]).toBe('/endpoint/');
        expect(
            new Headers(fetchSpy.mock.calls[1][1]?.headers).get('X-CSRFToken')
        ).toBe('token-1');
    });

    it('Keeps a csrf token passed by the caller', async () => {
        fetchSpy.mockResolvedValueOnce(jsonResponse({}));

        await postRequest(
            '/endpoint/',
            {},
            {
                headers: { 'X-CSRFToken': 'own-token' },
            }
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(
            new Headers(fetchSpy.mock.calls[0][1]?.headers).get('X-CSRFToken')
        ).toBe('own-token');
    });

    it('Resolves without a body on 204 No Content', async () => {
        fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

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
