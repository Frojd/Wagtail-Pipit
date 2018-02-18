#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write stage settings here, or override base settings
"""
from __future__ import absolute_import, unicode_literals

from core.settings.base import *  # NOQA


DEBUG = False

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'cache_table',
    }
}

INSTALLED_APPS = INSTALLED_APPS + [
    'raven.contrib.django.raven_compat',
]

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'  # NOQA

# Enable caching of templates in production environment
TEMPLATES[0]['OPTIONS']['loaders'] = [
    ('django.template.loaders.cached.Loader', [
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    ]),
]

# Add sentry to logging
LOGGING['handlers']['sentry'] = {
    'level': 'ERROR',
    'class': 'raven.handlers.logging.SentryHandler',
    'dsn': get_env('SENTRY_DSN'),
}
LOGGING['loggers']['']['handlers'].append('sentry')

# This ensures that Django will be able to detect a secure connection
# properly on Heroku.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SENTRY_DSN = get_env('SENTRY_DSN')
SENTRY_PUBLIC_DSN = get_env('SENTRY_PUBLIC_DSN')

RAVEN_CONFIG = {
    'dsn': SENTRY_DSN,
    'release': APP_VERSION,
}
