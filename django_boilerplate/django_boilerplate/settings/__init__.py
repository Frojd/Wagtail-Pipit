import os
from django.core.exceptions import ImproperlyConfigured


def get_env_variable(var_name, is_bool=False, default=None):
    """ Get the environment variable or return exception """
    try:
        if is_bool:
            return os.environ[var_name] == 'True'

        return os.environ[var_name]
    except KeyError:
        if default is not None:
            return default

        error_msg = "Set the %s env variable" % var_name
        raise ImproperlyConfigured(error_msg)

PROJECT_NAME = get_env_variable('PROJECT_NAME')
