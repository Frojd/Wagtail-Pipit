import os
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


def get_env_variable(var_name, is_bool=False, no_throw=False):
    """ Get the environment variable or return exception """
    try:
        if is_bool:
            return os.environ[var_name] == 'True'

        return os.environ[var_name]
    except KeyError:
        if no_throw:
            return None

        error_msg = "Set the %s env variable" % var_name
        raise ImproperlyConfigured(error_msg)


def settings_context_processor(request):
    parsed_settings = settings
    parsed_settings.SECRET_KEY = None
    parsed_settings.DATABASES = None
    full_settings = {
        'SETTINGS': parsed_settings,
    }


    return full_settings


PROJECT_NAME = get_env_variable('PROJECT_NAME')
