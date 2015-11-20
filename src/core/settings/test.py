#!/usr/bin/env python
# -*- coding: utf-8 -*-

from base import *  # NOQA

"""
Write test settings here (for ci environment), or override base settings
"""

# Add django debug toolbar when using local version
INSTALLED_APPS += (
    'debug_toolbar',
)
