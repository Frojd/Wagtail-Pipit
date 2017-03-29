#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write prod settings here, or override base settings
"""

from base import *  # NOQA


DEBUG = False

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'cache_table',
    }
}

INSTALLED_APPS += [
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

# This ensures that Django will be able to detect a secure connection
# properly on Heroku.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

RAVEN_CONFIG = {
    'dsn': get_env_variable('SENTRY_DSN'),
    'release': APP_VERSION,
}
