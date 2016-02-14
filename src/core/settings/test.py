#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write test settings here (for ci environment), or override base settings
"""

from base import *  # NOQA


# Add django debug toolbar when using local version
INSTALLED_APPS += (
    'debug_toolbar',
)
