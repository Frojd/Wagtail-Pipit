# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Fixed
### Removed

## [8.10.0] - 2023-03-11

### Added
- Add Wagtail 4.2 support (@marteinn)

### Changed
- Upgrade next to 13.2.4 (@marteinn)

### Fixed
- Make sure .env.local are not used in docker (@rinti)
- Upgrade python-dotenv to 1.0.0
- Upgrade sentry_sdk to 1.16.0
- Upgrade django to 4.1.7
- Upgrade djangorestframework-stubs to 1.9.0
- Upgrade djangp-stubs to 1.15.0
- Upgrade djangorestframework-stubs to 1.9.1
- Upgrade @swc/core to 1.3.39
- Upgrade @sentry/nextjs to 7.42.0
- Upgrade eslint to 8.36.0
- Upgrade prettier to 2.8.4
- Upgrade @types/react to 18.0.28
- Upgrade storybook to 6.5.16
- Upgrade storybook-addon-next to 1.7.3
- Upgrade eslint-config-prettier to 8.7.0
- Upgrade i18next
- Upgrade eslint-config-next to 13.2.4
- Upgrade frontend testing libraries

### Removed
- Drop AWS S3 storage (@marteinn)

## [8.9.2] - 2023-02-16

### Fixed
- Fix issue with cluster mode and memory in pm2 (@mikaelengstrom)
- Upgrade circleci slack orb

## [8.9.1] - 2023-01-31

### Added
- Add playbook for generating deploy keys for environments (@marteinn)
- Add docker-entrypoint command for running coverage (@marteinn)
- Add pyproject.toml config (@marteinn)
- Add ruff linter (@marteinn)

### Changed
- Upgrade Next.js to 13.1 (@marteinn)
- Move env var retrival to pipit.env_utils (@marteinn)
- Make get_env default str type (@marteinn)

### Fixed
- Fix issue with missing ignores in prettier template conf
- Run ruff linting in project CI
- Reset and rebuild migrations for customdocument, customimage and main (@marteinn)
- Upgrade next-i18next to 13.0.1
- Upgrade prettier to 2.8.2
- Upgrade django-stubs to 1.14.0
- Upgrade djangorestframework-stubs to 1.8.0
- Upgrade python-dotenv to 0.21.1

### Removed

## [8.9.0] - 2023-01-06

### Added
- Add troubleshooting section to provisioning docs (@marteinn)
- Add next-i18next for translations (@rinti)

### Changed
- Upgrade Django to 4.1 (@rinti)
- Upgrade Wagtail to 4.1 (@rinti)
- Upgrade Next.js to 13 (@rinti)
- Remove enzyme in favour of testing-library (@rinti)
- Add missing wagtail.search app (@itekhi)
- Assume systemd calls in deploy requires root user (@marteinn)
- Upgrade storybook to 6.5 (@rinti)
- Change css class naming convention from style to s (@rinti)
- Use .Root as base name for component styling (@rinti)
- Upgrade Python to 3.10 (@marteinn)
- Replace BaseSetting with BaseSiteSetting for SiteSetting (@marteinn)

### Fixed
- Drop unused REACT_HOST env var from provisioning django .env (@marteinn)
- Fix issue with provisioned nginx beeing copied instead of generated (@marteinn)
- Add missing semicolon to nginx provision conf (@marteinn)
- Fix invalid output in pm2_application_count for nginx in provision (@marteinn)
- Fix typo in cms path ignore in robots.txt (@marteinn)
- Exclude django media dir from being synced in deployment
- Pin meta preview (@rinti)
- Upgrade wagtail_headless_preview to 0.4.0 (@rinti)
- Fix linting errors in cli (@rinti)
- Generate WAGTAILADMIN_BASE_URL variable (@marteinn)
- Fix wrong port for https in project readme (@marteinn)
- Ignore storybook static and public dir for prettier (@marteinn)
- Upgrade @types/react, css-loader, eslint, husky and prettier
- Upgrade swc to 1.3.25
- Upgrade sentry/nextjs to 7.29.0
- Upgrade jest-junit to 15.0.0
- Upgrade psycopg2 to 2.9.5
- Upgrade python-dotenv to 0.21.0
- Upgrade wagtail_headless_preview to 0.5.0
- Upgrade wagtail-factories to 4.0.0
- Upgrade sentry-sdk to 1.12.1
- Replace deprecated jsxBracketSameLine with bracketSameLine in prettier (@marteinn)

### Removed
- Remove deprecated fontawesome (@rinti)
- Remove storybook next-preset (@rinti)
- Drop support for class based components in frontend cli (@rinti)

## [8.8.0] - 2022-06-01

### Changed
- Upgrade to Wagtail 3 (@marteinn)
- Clarify SLACK_DEFAULT_CHANNEL value when setting up circle ci integration with slack (@marteinn)
- Add mypy linting for django-rest-framework parts (@marteinn)

## Fixed
- Improve page not found test by using proper json to detect component name (@marteinn)
- Cleanup unused imports and variable declarations (@marteinn)
- Run `manage.py new_page` on CI (@marteinn)
- Update django-stubs to 1.11.0
- Update sentry_sdk to 1.5.12
- Update @babel/core to 7.17.10
- Update @swc/core to 1.2.196
- Update @swc/jest to 0.2.21
- Update i18next to 21.8.5
- Update @sentry/nextjs to 7.0.0
- Update @testing-library/user-event to 14.2.0
- Update husky to 8.0.1

## [8.7.0] - 2022-05-07
### Added
- Add custom 502 page to Nginx (Andreas Bernacca)

### Changed
- Default to always creating function components (Andreas Bernacca)
- Change from links to depends_on to fix error with missing python host in web (Martin Sandström)
- Update WagtailUserbar implementation according to latest Wagtail version (Martin Sandström)
- Ignore any mypy error from migrations (Martin Sandström)
- Require Node 16 when running Next.js (Martin Sandström)
- Upgrade to python 3.8.13 in .python-version (Martin Sandström)
- Drop deprecated USE_L10N=True setting as it is default True in Django 4+ (Martin Sandström)

### Fixed
- Make Next.js hmr work again, it broke in Next 12 (Andreas Bernacca)
- Move boilerplate testing to Github Actions (Martin Sandström)
- Fix broken getting started link (@joshuadavidthomas)
- Fix incorrect sync data between environment docs (Martin Sandström)
- Add missing scaffolding documentation link (Martin Sandström)
- Update Next.js to 12.1.6
- Update Wagtail to 2.16.2
- Update Django to 4.0.4
- Update sentry_sdk to 1.5.11
- Update python-dotenv to 0.20.0
- Update django-stubs to 1.10.1
- Update wagtail_headless_preview to 0.2.1
- Update @svgr/webpack to 6.2.1
- Update prettier to to 2.6.2
- Update @sentry/nextjs to to 6.19.7
- Update storybook to 6.4.22
- Update i18next to 21.7.1
- Update swc/core to 1.2.177
- Update swc/jest to 0.2.20
- Update babel/core to 7.17.10
- Update babel-loader to 8.2.5
- Update css-loader to 6.7.1
- Update jest to 28.1.0
- Update jest-junit to 13.2.0
- Update testing-library/jest-dom to 5.16.4
- Update testing-library/react to 12.1.5
- Update testing-library/user-event to 14.1.1
- Ignore Next.js SSG output from version control

-

## 8.6.0 (2022.01.01)

- New: Add guide for publishing storybook (Martin Sandström)
- New: Make it possible to configure Next.js and Storybook ports (Martin Sandström)
- New: Add SVG to example Hero component, to make sure the SVG importing works (Andreas Bernacca)
- Fix: Switch from alpine to slim for the Dockerfile, for easier maintenance (Andreas Bernacca)
- Fix: Remove .babelrc so Next.js uses SWC as compiler (Andreas Bernacca)
- Fix: Make jest use SWC (Andreas Bernacca)
- Fix: Rename master branch to main
- Fix: Changed SVGR-handling to be more inline with their current documentation
- Fix: Upgrade Sentry integration (Martin Sandström)
- Fix: Drop postgresql from Dockerfile
- Fix: Update Wagtail to 2.15.1
- Fix: Update Django to 3.2.10
- Fix: Update frontend dependencies
- Fix: Update python dependencies
- Fix: Update Next.js to 12.0.7
- Fix: Add missing trailing slash to getViewData


## 8.5.0 (2021.05.16)

- Fix: Forward cookies from api to Next.js (Martin Lindvall, Martin Sandström)
- Fix: Add headers in js api response (Martin Lindvall, Martin Sandström)
- Fix: Include custom docker-compose to simplify running local python (Andreas Bernacca, Martin Sandström)
- Fix: Use CSF format when defining Storybook stories (Martin Sandström)
- Fix: Solve issue with muted errors in api calls (Martin Sandström, Martin Lindvall)
- Fix: Enforce CSRF protection on password protected page (Martin Sandström)
- Fix: Fix models.W042 warning by adding default auto field (Martin Sandström)
- Fix: Downgrade to Next.js 10.1 to dynamic import issue in Storybook (Martin Sandström)
- Fix: Activate webpack 5 in Storybook (Martin Sandström)
- Fix: Fix issue serving svg in Storybook (Martin Sandström)
- Fix: Fix bug in scaffolder when generating stories for function component (Martin Sandström)
- Fix: Run Storybook build in CI
- Fix: Update Wagtail to 2.13
- Fix: Update Django to 3.2
- Fix: Update python Sentry
- Fix: Update frontend packages


## 8.4.0 (2021.05.01)

- Fix: Update Wagtail to 2.13 (Martin Sandström)
- Fix: Update Django to 3.2 (Martin Sandström)
- Fix: Update Nextjs to 10.2 (Martin Sandström)
- Fix: Use webpack 5 (Martin Sandström)
- Fix: Add support for Circle CI test insights (Martin Sandström)
- Fix: Drop type ignores in urls by adding custom urlpattern type alias (Martin Sandström)
- Fix: Make sure Next.js uses trailing slash (Martin Sandström)
- Fix: Drop js from wagtail userbar to make it cross platform. Fixes #457 (Andreas Bernacca)
- Fix: Serve Next.js static files from Nginx in production (Martin Sandström)
- Fix: Make sure restricted page access is persisted. Fixes #426 (Martin Sandström)
- Fix: Update all frontend packages
- Fix: Update python-dotenv
- Fix: Update pytest-django
- Fix: Update django-stubs


## 8.3.0 (2021.04.06)

- New: Add guide for handling CSRF Tokens (Martin Sandström)
- Fix: Update Next.js to 10.1.3 (Martin Sandström)
- Fix: Replace withSourceMaps with productionBrowserSourceMaps (Martin Sandström)
- Fix: Add collectstatic instruction to local python setup (Martin Sandström)
- Fix: Move node ignores to frontend gitignore (Martin Sandström)
- Fix: Fix issue with inconsitent indentation in nginx template (Martin Sandström)
- Fix: Fix wrong nginx conf path in `enable_ssl.sh` script (Martin Sandström)
- Fix: Run npm run build in project ci
- Fix: Update testing-library
- Fix: Update babel core
- Fix: Update sentry
- Fix: Update jest-dom
- Fix: Update classnames
- Fix: Update i18next
- Fix: Update Storybook
- Fix: Update css-loader
- Fix: Update react+react-dom
- Fix: Update react-test-renderer
- Fix: Update python-dotenv
- Fix: Update husky to 6.0
- Fix: Update @testing-library/user-event
- Fix: Include all guides in the generated project readme
- Fix: Fix broken link to django styleguide


## 8.2.0 (2021.03.22)

- New: Add guide for adding slack notifications to circleci (Martin Sandström)
- New: Add guide for adding Sentry (Martin Sandström)
- Fix: Solve issue with Sentry not activated in Next.js (Martin Sandström, Martin Lindvall)
- Fix: Improve flexibility by moving headless mixin from base page to each page model (Martin Sandström)
- Fix: Rename fields in timestamp mixin to indicate date (Andreas Bernacca)
- Fix: Fix typo in test method name (Martin Lindvall)
- Fix: Pin boto3 more loosely since the minor is auto updated very frequently (Andreas Bernacca)
- Fix: Implement circleci slack orb 4+ (Martin Sandström)
- Fix: Ignore virtualenv dir when generating translations (Martin Sandström)
- Fix: Add quick info in readme on running Next.js (Martin Sandström)
- Fix: Raise proxy timeout to avoid next.js first load beeing timed out (Martin Sandström)
- Fix: Drop unused redirect middleware (Martin Lindvall)
- Fix: Add automatic transform of redirect in nextjs api external view (Martin Sandström)
- Fix: Cleanup unused env vars from frontend .env (Martin Sandström)
- Fix: Add note on getting reverse proxy working in Linux (@remiBoudreau)
- Fix: Upgrade Next.js to 10.0.9
- Fix: Upgrade Wagtail to 2.13.3
- Fix: Upgrade Djangp to 3.1.7
- Fix: Storybook, Husky, i18next and sentry to latest version


## 8.1.0 (2021.02.13)

- New: Make it possible to serve remote media locally (Martin Sandström)
- New: Rewrite guide for syncing data (Martin Sandström)
- New: Rewrite scaffolding documentation (Martin Sandström)
- New: Add documentation for server provision (Martin Sandström)
- New: Add guide for implementing wagtail-2fa (Martin Lindvall, Martin Sandström)
- New: Rewrite CI deployment guide (Martin Sandström)
- Fix: Clean up outdated documentation (Martin Sandström)
- Fix: Fix issue with dynamic imports not recogized in jest (Martin Sandström)
- Fix: Ignore main branch as well as master in ci (Martin Sandström)
- Fix: Fix mypy typecheck issues (Martin Sandström)
- Fix: Lazy load WagtailUserbar component (Martin Sandström)
- Fix: Fix issue with missing WagtailUserbar component import (Martin Sandström)
- Fix: Use root user when running provison playbook (Martin Sandström)
- Fix: Make sure deploy does not run after provision (Martin Sandström)
- Fix: Upgrade Wagtail to 2.12
- Fix: Upgrade Django to 3.1.6
- Fix: Upgrade Next.js to 10.0.6


## 8.0.6 (2021.02.03)

- Fix: Improve Storbybook 6 support (Andreas Bernacca)
- Fix: Solve issue with wrong path in `example_prod_to_stage.sh` (Martin Sandström)
- Fix: Improve `example_prod_to_stage` documentation (Martin Sandström)
- Fix: Add support for multiple pm2 applications in provisioning (Martin Sandström)
- Fix: Add new cookiecutter variables to separate application domain and ssh host (Martin Sandström)
- Fix: Drop username from ssh host and hard code it to ssh user `deploy` (Martin Sandström)
- Fix: Make SVG handling a bit more robust (Andreas Bernacca)
- Fix: Minimize circleci changes by adding conditions to sentry sourcemap upload (Martin Sandström)
- Fix: Make slack orb conditional in circleci (Martin Sandström)
- Fix: Solve issue with missing WagtailUserbar component import (Martin Sandström)
- Fix: Use root user when running provison playbook (Martin Sandström)
- Fix: Lazy load WagtailUserbar (Martin Sandström)
- Fix: Upgrade Wagtail to 2.12
- Fix: Upgrade Django to 3.1.6


## 8.0.5 (2021.01.17)

- Fix: Solve issue with broken tests (Martin Sandström)
- Fix: Fix issue with missing `wagtail_userbar` field (Martin Sandström)


## 8.0.4 (2021.01.17)

- Fix: Replace ssr pm2 config in provision with next.js pm2 config (Martin Sandström)
- Fix: Include `site.site_name` in `seo_html_title` (Martin Sandström)
- Fix: Add missing `wagtail_userbar` data from backend api (Martin Sandström)
- Fix: Drop redundant assert in email.py (Martin Sandström)
- Fix: Include Next.js process in provision nginx configuration (Martin Sandström)
- Fix: Correct invalid paths in next.js provision env template (Martin Sandström)
- Fix: Include pm2 in server requirements (Martin Sandström)
- Fix: Upgrade django to 3.1.3
- Fix: Upgrade django-storages to 1.11.1
- Fix: Upgrade boto3 to 1.16.56


## 8.0.3 (2021.01.04)

- Fix: Update Next.js to 10.0.4
- Fix: Update Storybook to v6
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
