#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write local settings here, or override base settings
"""

from base import *  # NOQA


# Add django debug toolbar when using local version
INSTALLED_APPS += (
    'debug_toolbar',
)

# Allow weak local passwords
AUTH_PASSWORD_VALIDATORS = []
