#!/usr/bin/env python

import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line

from utils.env import if_exists_load_env


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pipit.settings.prod")

    if_exists_load_env(".env")
    if not os.environ.get("IN_DOCKER", False):
        if_exists_load_env(".env.local")

    # enable vs code remote debugging
    # https://github.com/Microsoft/PTVS/issues/1057
    if settings.DEBUG and settings.VS_CODE_REMOTE_DEBUG and os.environ.get("RUN_MAIN"):
        import ptvsd

        ptvsd.enable_attach(address=("0.0.0.0", 5678))

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
