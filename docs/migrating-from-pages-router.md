# Migrating from the Pages Router

Pipit generates projects that use the Next.js App Router. Earlier versions used the Pages Router by default, with the App Router behind the `experimental_use_app_router` option. This guide lists what changed so you can move an existing project over.

The simplest way is to generate a new project with the same name and copy the files below into your project, then move over your own containers and components.

## Files

| Pages Router | App Router |
|---|---|
| `pages/_app.js` | `app/layout.js`, which also imports `index.css` |
| `pages/_document.js` | `app/layout.js` renders `<html lang>`, GTM moved to `containers/BasePage` |
| `pages/index.js`, `pages/[...path].js` | `app/page.js` and `app/[...path]/page.js`, both re-export `routing/catchAll.js` |
| `getServerSideProps` in `pages/[...path].js` | `loadPageData` and `generateMetadata` in `routing/catchAll.js` |
| `pages/_preview.js` | `app/%5Fdraft/page.js`, gated by `draftMode()` |
| `pages/api/preview.js` | `app/api/draft/route.js` |
| `pages/404.js` | `app/not-found.js` |
| `pages/_error.js` | `app/global-error.js` for render errors, `onRequestError` in `instrumentation.js` for server errors |
| `next-i18next.config.js` | `i18n/config.js` |

Delete the `pages` directory when the App Router files are in place, Next.js does not allow the same route in both.

## Backend

- Change the preview client url in `src/pipit/settings/base.py`:
    ```python
    WAGTAIL_HEADLESS_PREVIEW = {
        "CLIENT_URLS": {
            "default": "/api/draft/",
        }
    }
    ```
- Copy the `csrf_token/` endpoint from `src/nextjs/api.py`, and remove `csrf_token` from the password protected page response in `page_by_path`.

## SEO

`BasePage` no longer renders `<title>` and meta tags with `next/head`. Metadata is built by `generateMetadata` in `routing/catchAll.js` from the same `seo` fields. Remove `next/head` from your own containers.

## Google Tag Manager

The GTM snippet moved from `_document.js` to `containers/BasePage`, where it is rendered with `next/script`. It still reads `siteSetting.gtmId`.

## Routing hooks

Replace `useRouter` from `next/router` with `useRouter` from `next/navigation` in client components, and add `'use client'` at the top of any component that uses state, effects or event handlers. To render a page again on the server after a request, for example after unlocking a password protected page, call `router.refresh()`.

## CSRF and cookies

Next.js no longer forwards `Set-Cookie` headers from Django. Client components post straight to Django through `/wt`, and `postRequest` in `api/wagtail.js` adds the CSRF token automatically. See [Handling CSRF Tokens](/docs/handling-csrf-tokens.md).

## Locales

Next.js no longer handles locale routing, the `i18n` key in `next.config.js` is removed. Wagtail resolves the locale from the path and `app/layout.js` sets `<html lang>` from the first path segment. See [Adding multi language support](/docs/adding-multi-language-support.md).

## Non-HTML responses

The `customResponse` object is no longer supported, App Router pages cannot return a raw body. Serve those paths from Django and route them through nginx, see [Serving non-HTML content](/docs/serving-non-html-content.md).

## Static site generation

The commented `getStaticProps` and `getStaticPaths` blocks and their guide are removed. Pages are rendered on demand.
