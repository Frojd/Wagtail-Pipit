# Changelog

## 7.0. (XXX.XX.XX) - IN DEVELOPMENT

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
