#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import inspect
import dotenv

# Fetches all environment variables from your .env file
try:
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))
    dotenv.load_dotenv("%s/.env" % (env_path,))
except Exception, e:
    pass

if __name__ == "__main__":
    # os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_boilerplate.settings.local")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
