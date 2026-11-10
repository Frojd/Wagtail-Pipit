# Handling CSRF Tokens in Pipit

Django protects all unsafe requests (POST, PUT, PATCH, DELETE) with a CSRF token. In Pipit the browser talks to Django directly through `/wt`, which is the same origin as the frontend, so Django can set and read its own `csrftoken` cookie without Next.js being involved.

## Requirements

- An understanding of [CSRF (Cross-Site Request Forgery)](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## How it works

- The backend exposes `csrf_token/` on the Next.js API router (`src/nextjs/api.py`). It sets the `csrftoken` cookie and returns the token as JSON.
- `getCsrfToken()` in `frontend/api/wagtail.ts` fetches that token.
- `postRequest()` in the same file calls `getCsrfToken()` and adds the `X-CSRFToken` header automatically, unless you pass one yourself.

This means a client component can post to Django without handling the token at all. `PasswordProtectedPage` is the reference implementation.

## Posting from a client component

Add an api function that uses `postRequest` and the browser relative `NEXT_PUBLIC_WAGTAIL_API_URL`:

```ts
// frontend/api/wagtail.ts
export async function postContactForm(params: { message: string }) {
    return await postRequest<null>(`${NEXT_PUBLIC_API_URL}/v1/contact/`, params);
}
```

Call it from a client component:

```tsx
'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { postContactForm, WagtailApiResponseError } from '../../api/wagtail';

const ContactForm = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await postContactForm({ message });
        } catch (err) {
            if (!(err instanceof WagtailApiResponseError)) {
                throw err;
            }
            setError(err.response.status === 403 ? 'Forbidden' : 'Technical issues');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {!!error && <p>{error}</p>}
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="submit">Send</button>
        </form>
    );
};

export default ContactForm;
```

On the backend, protect the endpoint with `csrf_protect` (the password protected page endpoint in `src/nextjs/api.py` is an example). If the request changes what the server renders, for example a session cookie that unlocks content, call `router.refresh()` from `next/navigation` after the request succeeds.

## Alternative: Server Actions

If you would rather keep the request on the server, use a [Server Action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations). The action runs in Next.js, so it must fetch a token from `csrf_token/` and send both the `X-CSRFToken` header and the `csrftoken` cookie to Django itself. Any cookie Django returns stays on the server unless you set it with `cookies()` from `next/headers`.

## Running behind HTTPS

Django checks the `Origin` header on secure requests. Make sure nginx forwards the original `Host` and `X-Forwarded-Proto` headers, which `SECURE_PROXY_SSL_HEADER` in the stage and prod settings relies on. If the frontend is served from another domain than Django, add it to `CSRF_TRUSTED_ORIGINS`.
