#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
WSGI config for mysite project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/
"""

import os
import inspect

import dotenv
from django.core.wsgi import get_wsgi_application


# Load settings from possible .env file
try:
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))
    env_file = "%s/../.env" % (env_path,)

    if os.path.exists(env_file):
        dotenv.load_dotenv(env_file)
except Exception as e:  # NOQA
    pass

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")
application = get_wsgi_application()
