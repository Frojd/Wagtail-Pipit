#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write test settings here (for ci environment), or override base settings
"""
from __future__ import absolute_import, unicode_literals

import logging

from core.settings.base import *  # NOQA


DEBUG = False
TEMPLATE_DEBUG = DEBUG

logging.disable(logging.CRITICAL)

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"
