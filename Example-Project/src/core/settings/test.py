#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write test settings here (for ci environment), or override base settings
"""

from base import *  # NOQA


logging.disable(logging.CRITICAL)

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)

INSTALLED_APPS += (
    'debug_toolbar',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}
