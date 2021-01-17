# Changelog

## 8.0.5 (2020.01.17)

- Fix: Solve issue with broken tests
- Fix: Fix issue with missing `wagtail_userbar` field


## 8.0.4 (2020.01.17)

- Fix: Replace ssr pm2 config in provision with next.js pm2 config
- Fix: Include `site.site_name` in `seo_html_title`
- Fix: Add missing `wagtail_userbar` data from backend api
- Fix: Drop redundant assert in email.py
- Fix: Include Next.js process in provision nginx configuration
- Fix: Correct invalid paths in next.js provision env template
- Fix: Include pm2 in server requirements
- Fix: Upgrade django to 1.3.5
- Fix: Upgrade django-storages to 1.11.1
- Fix: Upgrade boto3 to 1.16.56


## 8.0.3 (2020.01.04)

- Fix: Update Next.js to 10.0.4
- Fix: Update storybook to v6
- Fix: Upgrade frontend test packages and prettier


## 8.0.2 (2020.12.14)

- Add guide on how to build routable pages (Martin Sandström)
- Make it possible to serve custom content types through Next.js (Martin Lindvall, Martin Sandström)
- Convert png to jpg and add support for webp (Martin Lindvall)
- Add multi language support (Martin Sandström)
- Fix: Simplify redirects using new Next.js 10 redirect (Martin Sandström)
- Fix: Move django setting env to config root (Martin Sandström)
- Fix: Use pinned wagtail-factories version (Martin Sandström)
- Fix: Solve issue where DDT where not detected on api (Martin Lindvall, Martin Sandström)
- Fix: Pass host in request to api to make it site aware (Martin Sandström)
- Fix: Enable javascript to access csrf token  (Martin Lindvall)


## 8.0.1 (2020.11.11)

- Fix issue where syncscripts where nog working in docker mode (Martin Sandström)
- Add guide on how to use static site generation (Martin Sandström)
- Fix issue where `api/wagtail.js` `getAllPages` did not work (Martin Sandström)


## 8.0.0 (2020.11.08)

- Replace Create React App with Next.js (Martin Sandström, Mikael Engström)
- Replace Hypernova with Next.js (Martin Sandström, Mikael Engström)
- Update deploy scripts to support Next.js (Mikael Engström)
- Add new "backend-developer-guide" (Martin Sandström)
- Improve docker performance and refactor docker-compose structure (Mikael Engström)
- Add npm shortcut for creating new containers (Martin Lindvall)
- Drop external file logging (Martin Sandström)
- Replace class components with functional components (morrme)
- Add doumentation for running python locally (Martin Sandström)
- Add support for locally running python in syncscripts (Martin Sandström)
- Fix: Improve mypy coverage (Andreas Bernacca, Martin Sandström)
- Fix: Rebuild customuser migrations (Martin Sandström)
- Fix: Change so `serve()` always return json data
- Fix: Drop `django-sslserver` in favor of Nginx ssl handling
- Fix: Use /wt/ namespace for wagtail app
- Fix: Add wagtail background job to provisioning (Martin Lindvall)
- Fix: Update deployment docs (Martin Lindvall)
- Fix: Change default deploy user to "deploy" (Mikael Engström)
- Fix: Override environment variables if they exist (Martin Lindvall)
- Fix: Update Wagtail to 2.11.1
- Fix: Update Django to 3.1.2
- Fix: Update DRF
- Fix: Replace Boto with Boto3 (Martin Lindvall)
- Fix: Add optional slack notification on release (Martin Sandström)
- Fix: Add default cache for renditions (Martin Sandström)
- Fix: Rename web.env to python.env


## 7.0.0 (XXXX.XX.XX) - SKIPPED

- Replace React-Sass-Starterkit with Create React App (Martin Sandström)
- Replace Hastur SSR service with Hypernova (Martin Sandström)
- Add Storybook for component preview (Martin Sandström)
- Add meta preview with wagtail-meta-preview (Andreas Bernacca, Martin Sandström)
- Add provisioning for SSR service (Andreas Bernacca)
- Remove class containers in favor of function components in scaffold CLI (Andreas Bernacca)
- Change postgres to new image (mdillon is deprecated), and use postgres 12 with postgis 2.5 (Andreas Bernacca)
- Fix: Add ability to send slack notifications from CircleCI (Andreas Bernacca)
- Fix: Adopt pattern where --reuse-db is default and --create-db overrides behaviour (Martin Sandström)
- Fix: Retain pip cache in requirements cache on CI (Martin Sandström)
- Fix: Add missing field to image serializer (Andreas Bernacca)
- Fix: Adopt policy for limiting test collection (Martin Sandström)
- Fix: Always show the 10 slowest tests in CI (Martin Sandström)
- Fix: Fix broken canonical value in template (Martin Sandström)
- Fix: Drop deprecated SiteMiddleware. Fixes #189 (Martin Sandström)
- Fix: Use the new pip resolver when installing packages (Martin Sandström)
- Fix: Ignore tests marked as slow in dev (Martin Sandström)
- Fix: Upgrade Wagtail to 2.10
- Fix: Upgrade Python to 3.8
- Fix: Upgrade Sentry SDK
