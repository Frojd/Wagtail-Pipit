#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write test settings here (for ci environment), or override base settings
"""
from __future__ import absolute_import, unicode_literals

import logging

from core.settings.base import *  # NOQA


DEBUG = False
TEMPLATES[0]['OPTIONS']['debug'] = False

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
