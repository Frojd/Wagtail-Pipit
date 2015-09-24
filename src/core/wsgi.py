#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import inspect
import dotenv


# Load settings from possible .env file
try:
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))

    dotenv.load_dotenv("%s/../.env" % (env_path,))
except Exception, e:
    pass

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
