#!/usr/bin/env python

import os
import sys
import inspect
import dotenv

from django.core.management import execute_from_command_line
from django.conf import settings


def if_exists_load_env():
    inspect_file = inspect.getfile(inspect.currentframe())
    env_path = os.path.dirname(os.path.abspath(inspect_file))
    env_file = "{}/.env".format(env_path)

    if os.path.exists(env_file):
        dotenv.load_dotenv(env_file)


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")

    if_exists_load_env()

    # enable vs code remote debugging
    # https://github.com/Microsoft/PTVS/issues/1057
    if settings.DEBUG and settings.VS_CODE_REMOTE_DEBUG and os.environ.get("RUN_MAIN"):
        import ptvsd

        ptvsd.enable_attach(address=("0.0.0.0", 5678), redirect_output=True)

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
