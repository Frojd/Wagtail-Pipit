#!/usr/bin/env python
# -*- coding: utf-8 -*-

from base import *


"""
Write local settings here, or override base settings
"""

# Add django debug toolbar when using local version
INSTALLED_APPS += (
    'debug_toolbar',
)
