#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write prod settings here, or override base settings
"""

from base import *  # NOQA


# Enable caching of templates in production environment
TEMPLATE_LOADERS = (
    ('django.template.loaders.cached.Loader', (
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    )),
)
