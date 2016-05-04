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

from django.core.wsgi import get_wsgi_application
import dotenv


# Load settings from possible .env file
try:
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))

    dotenv.load_dotenv("%s/../.env" % (env_path,))
except Exception, e:
    pass

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")
application = get_wsgi_application()
