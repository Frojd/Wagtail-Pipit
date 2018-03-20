#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write test settings here (for ci environment), or override base settings
"""
from __future__ import absolute_import, unicode_literals

import logging

from core.settings.base import *  # NOQA


DEBUG = False

logging.disable(logging.CRITICAL)

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"

TEMPLATES[0]['OPTIONS']['loaders'] = [
    ('django.template.loaders.cached.Loader', [
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    ]),
]

LOGGING = {}

TEST_RUNNER = 'core.test_runner.PytestTestRunner'
