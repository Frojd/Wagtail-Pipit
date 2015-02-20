"""
Django settings for django_boilerplate project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from . import get_env_variable, PROJECT_NAME
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_env_variable("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if get_env_variable("DEBUG") == "True" else False

# This is when debug is off, else django wont allow you to visit the site
ALLOWED_HOSTS = [
    "127.0.0.1",
]

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

# Project name is set in .env
ROOT_URLCONF = '%s.urls' % PROJECT_NAME

WSGI_APPLICATION = '%s.wsgi.application' % PROJECT_NAME


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
# Using PostgreSQL
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": get_env_variable("DB_NAME"),
        "USER": get_env_variable("DB_USERNAME"),
        "PASSWORD": get_env_variable("DB_PASSWORD"),
        "HOST": get_env_variable("DB_HOST"),
        "PORT": get_env_variable("DB_PORT"),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'sv-SE'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'

# Uploaded media
MEDIA_URL = '/media/'
MEDIA_ROOT = get_env_variable("MEDIA_PATH")

# Templates
TEMPLATE_DEBUG = True
TEMPLATE_DIRS = (
    'templates',
)

# Static files
if not DEBUG:
    STATIC_ROOT = get_env_variable("STATIC_PATH")
else:
    STATICFILES_DIRS = (
        get_env_variable("STATIC_PATH"),
    )
