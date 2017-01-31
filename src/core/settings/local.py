#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Write local settings here, or override base settings
"""

from base import *  # NOQA


DEBUG = True
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG

DEBUG_TOOLBAR_PATCH_SETTINGS = False

# Add django debug toolbar when using local version
INSTALLED_APPS += [
    'debug_toolbar',
]

MIDDLEWARE_CLASSES += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# Allow weak local passwords
AUTH_PASSWORD_VALIDATORS = []

INTERNAL_IPS = get_env_variable('INTERNAL_IPS', default="").split(',')


# Allow django-debug-bar under docker
def show_toolbar(request):
    # https://gist.github.com/douglasmiranda/9de51aaba14543851ca3
    return not request.is_ajax()

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': 'core.settings.local.show_toolbar',
}
