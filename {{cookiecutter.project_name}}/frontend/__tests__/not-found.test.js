import { render, screen } from '@testing-library/react';
import NotFoundRoute from '../app/not-found';
import { getPublicViewData, WagtailApiResponseError } from '../api/wagtail';

// Lives outside app/ on purpose: a .js file there is treated as route source
jest.mock('../api/wagtail', () => ({
    getPublicViewData: jest.fn(),
    WagtailApiResponseError: class extends Error {},
}));

describe('not-found route', () => {
    afterEach(() => jest.resetAllMocks());

    it('Renders a fallback when the api call fails', async () => {
        getPublicViewData.mockRejectedValue(new WagtailApiResponseError('boom'));

        render(<NotFoundRoute />);

        expect(await screen.findByText('Page not found')).toBeInTheDocument();
    });

    it('Renders the resolved container on success', async () => {
        getPublicViewData.mockResolvedValue({
            json: {
                componentName: 'NotFoundPage',
                componentProps: { exception: 'Nothing here' },
            },
        });

        render(<NotFoundRoute />);

        expect(await screen.findByText('Nothing here')).toBeInTheDocument();
    });
});
