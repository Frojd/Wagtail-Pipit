import { render, screen } from '@testing-library/react';
import NotFound from '../app/not-found';
import { getViewData } from '../api/wagtail';

jest.mock('../api/wagtail', () => ({
    getViewData: jest.fn(),
}));

describe('not-found route', () => {
    afterEach(() => jest.resetAllMocks());

    it('Renders a fallback when the api call fails', async () => {
        jest.mocked(getViewData).mockRejectedValue(new Error('boom'));

        render(await NotFound());

        expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    it('Renders the resolved container on success', async () => {
        jest.mocked(getViewData).mockResolvedValue({
            headers: new Headers(),
            json: {
                componentName: 'NotFoundPage',
                componentProps: { exception: 'Nothing here' },
            },
        });

        render(await NotFound());

        expect(await screen.findByText('Nothing here')).toBeInTheDocument();
    });
});
