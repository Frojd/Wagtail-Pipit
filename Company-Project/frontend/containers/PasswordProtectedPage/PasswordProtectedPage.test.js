import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    getPasswordProtectedPage,
    WagtailApiResponseError,
} from '../../api/wagtail';
import PasswordProtectedPage from './PasswordProtectedPage';

const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock('../../api/wagtail', () => ({
    getPasswordProtectedPage: jest.fn(),
    WagtailApiResponseError: class extends Error {
        constructor(status) {
            super(`${status}`);
            this.response = { status };
        }
    },
}));

const submit = async (password) => {
    render(<PasswordProtectedPage restrictionId={1} pageId={2} />);
    await userEvent.type(screen.getByPlaceholderText('Password'), password);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
};

describe('<PasswordProtectedPage />', () => {
    afterEach(() => jest.resetAllMocks());

    it('Refreshes the route once the password is accepted', async () => {
        getPasswordProtectedPage.mockResolvedValue({ json: null });

        await submit('hello');

        expect(getPasswordProtectedPage).toHaveBeenCalledWith(1, 2, {
            password: 'hello',
        });
        expect(mockRefresh).toHaveBeenCalled();
    });

    it('Shows an error on a wrong password', async () => {
        getPasswordProtectedPage.mockRejectedValue(
            new WagtailApiResponseError(401)
        );

        await submit('wrong');

        expect(screen.getByText('Invalid password')).toBeInTheDocument();
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it('Shows an error when csrf is rejected', async () => {
        getPasswordProtectedPage.mockRejectedValue(
            new WagtailApiResponseError(403)
        );

        await submit('hello');

        expect(screen.getByText('Forbidden')).toBeInTheDocument();
    });
});
