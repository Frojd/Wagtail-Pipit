#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import inspect
import dotenv

from django.core.management import execute_from_command_line
from django.conf import settings


try:
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))
    env_file = "{}/.env".format(env_path)

    if os.path.exists(env_file):
        dotenv.load_dotenv(env_file)
except Exception as e:  # NOQA
    pass

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")

    # enable vs code remote debugging
    # https://github.com/Microsoft/PTVS/issues/1057
    if settings.DEBUG and settings.VS_CODE_REMOTE_DEBUG and os.environ.get("RUN_MAIN"):
        import ptvsd

        ptvsd.enable_attach(address=("0.0.0.0", 5678), redirect_output=True)

    execute_from_command_line(sys.argv)
