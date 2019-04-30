from __future__ import absolute_import, unicode_literals

import os

from django.core.exceptions import ImproperlyConfigured


def get_env(name, default=None):
    """Get the environment variable or return exception"""
    if name in os.environ:
        return os.environ[name]

    if default is not None:
        return default

    error_msg = "Set the {} env variable".format(name)
    raise ImproperlyConfigured(error_msg)


def get_env_bool(name, default=None):
    return get_env(name, default=default) == "True"
