#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import inspect

from django.core.management import execute_from_command_line


if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")
    execute_from_command_line(sys.argv)
