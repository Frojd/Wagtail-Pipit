'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getPasswordProtectedPage,
    WagtailApiResponseError,
} from '../../api/wagtail';

const PasswordProtectedPage = ({ restrictionId, pageId }) => {
    const router = useRouter();
    const [values, setValues] = useState({ password: '' });
    const [error, setError] = useState(null);

    const handleFormChange = async (e) => {
        e.preventDefault();

        try {
            await getPasswordProtectedPage(restrictionId, pageId, {
                ...values,
            });

            // Django has set the session cookie, render the unlocked page on the server
            router.refresh();
        } catch (e) {
            if (!(e instanceof WagtailApiResponseError)) {
                throw e;
            }

            switch (e.response.status) {
                case 403:
                    setError('Forbidden');
                    break;
                case 401:
                    setError('Invalid password');
                    break;
                default:
                    setError('Technical issues');
                    break;
            }
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <div>
            <h1>Password is required</h1>
            <p>You need a password to access this website</p>

            {!!error && <p>{error}</p>}
            <p>
                <input
                    type="password"
                    name="password"
                    onChange={handlePasswordChange}
                    placeholder="Password"
                />
            </p>
            <button onClick={handleFormChange}>Continue</button>
        </div>
    );
};

export default PasswordProtectedPage;
