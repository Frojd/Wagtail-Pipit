#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write local settings here, or override base settings
"""
from __future__ import absolute_import, unicode_literals

from core.settings.base import *  # NOQA


DEBUG = True
TEMPLATES[0]["OPTIONS"]["debug"] = DEBUG

DEBUG_TOOLBAR_PATCH_SETTINGS = False

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Add django debug toolbar when using local version
INSTALLED_APPS += ["debug_toolbar"]

MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]

# Allow weak local passwords
AUTH_PASSWORD_VALIDATORS = []

INTERNAL_IPS = get_env("INTERNAL_IPS", default="").split(",")


# Allow django-debug-bar under docker
def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": "core.settings.local.show_toolbar"}
