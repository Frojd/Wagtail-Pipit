import { render, screen } from '@testing-library/react';
import NotFound from '../app/not-found';
import { getViewData, WagtailApiResponseError } from '../api/wagtail';

// Lives outside app/ on purpose: a .js file there is treated as route source
jest.mock('../api/wagtail', () => ({
    getViewData: jest.fn(),
    WagtailApiResponseError: class extends Error {},
}));

describe('not-found route', () => {
    afterEach(() => jest.resetAllMocks());

    it('Renders a fallback when the api call fails', async () => {
        getViewData.mockRejectedValue(new WagtailApiResponseError('boom'));

        render(await NotFound());

        expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    it('Renders the resolved container on success', async () => {
        getViewData.mockResolvedValue({
            json: {
                componentName: 'NotFoundPage',
                componentProps: { exception: 'Nothing here' },
            },
        });

        render(await NotFound());

        expect(await screen.findByText('Nothing here')).toBeInTheDocument();
    });
});
