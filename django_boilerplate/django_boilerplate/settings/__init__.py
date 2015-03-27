import os
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


def get_env_variable(var_name):
    """ Get the environment variable or return exception """
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = "Set the %s env variable" % var_name
        raise ImproperlyConfigured(error_msg)


def settings_context_processor(request):
    full_settings = {
        'SETTINGS': settings,
    }

    return full_settings


PROJECT_NAME = get_env_variable('PROJECT_NAME')
