#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import inspect

import dotenv
from django.core.management import execute_from_command_line


try:
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))
    dotenv.load_dotenv("%s/.env" % (env_path,))
except Exception as e:
    pass

if __name__ == "__main__":
    # os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.local")
    execute_from_command_line(sys.argv)
