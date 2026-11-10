import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPasswordProtectedPage } from '../../api/wagtail';
import PasswordProtectedPage from './PasswordProtectedPage';

const mockRefresh = jest.fn();

class MockWagtailApiResponseError extends Error {
    readonly response: { status: number };

    constructor(status: number) {
        super(`${status}`);
        this.response = { status };
    }
}

jest.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock('../../api/wagtail', () => ({
    getPasswordProtectedPage: jest.fn(),
    // A getter, since the mock factory runs before the class above is initialized
    get WagtailApiResponseError() {
        return MockWagtailApiResponseError;
    },
}));

const submit = async (password: string) => {
    render(<PasswordProtectedPage restrictionId={1} pageId={2} />);
    await userEvent.type(screen.getByPlaceholderText('Password'), password);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
};

describe('<PasswordProtectedPage />', () => {
    afterEach(() => jest.resetAllMocks());

    it('Refreshes the route once the password is accepted', async () => {
        jest.mocked(getPasswordProtectedPage).mockResolvedValue({
            headers: new Headers(),
            json: null,
        });

        await submit('hello');

        expect(getPasswordProtectedPage).toHaveBeenCalledWith(1, 2, {
            password: 'hello',
        });
        expect(mockRefresh).toHaveBeenCalled();
    });

    it('Shows an error on a wrong password', async () => {
        jest.mocked(getPasswordProtectedPage).mockRejectedValue(
            new MockWagtailApiResponseError(401)
        );

        await submit('wrong');

        expect(screen.getByText('Invalid password')).toBeInTheDocument();
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it('Shows an error when csrf is rejected', async () => {
        jest.mocked(getPasswordProtectedPage).mockRejectedValue(
            new MockWagtailApiResponseError(403)
        );

        await submit('hello');

        expect(screen.getByText('Forbidden')).toBeInTheDocument();
    });
});
