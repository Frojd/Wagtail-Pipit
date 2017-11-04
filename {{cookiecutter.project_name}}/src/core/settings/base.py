#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Django settings for Fröjd Django projects.
"""
from __future__ import absolute_import, unicode_literals

import os

from boto.s3.connection import OrdinaryCallingFormat, S3Connection

from core.settings import get_env, get_env_bool


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Version, be sure to bump this with each release (please follow semver.org)
APP_VERSION = '{{cookiecutter.version}}'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = get_env_bool('DEBUG')

# This is when debug is off, else django wont allow you to visit the site
ALLOWED_HOSTS = get_env('ALLOWED_HOSTS').split(',')

INTERNAL_IPS = (
    '127.0.0.1',
)


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'storages',

    {% if cookiecutter.use_wagtail == 'y' -%}
    'wagtail.wagtailforms',
    'wagtail.wagtailredirects',
    'wagtail.wagtailembeds',
    'wagtail.wagtailsites',
    'wagtail.wagtailusers',
    'wagtail.wagtailsnippets',
    'wagtail.wagtaildocs',
    'wagtail.wagtailimages',
    'wagtail.wagtailsearch',
    'wagtail.wagtailadmin',
    'wagtail.wagtailcore',
    'wagtail.contrib.modeladmin',
    'wagtail.contrib.wagtailroutablepage',
    'wagtail.contrib.settings',
    'modelcluster',
    'taggit',
    {% endif %}

    # Project specific apps
    'core',
    'pages',  # TODO: Example app, remove this

    {% if cookiecutter.use_wagtail == 'y' -%}
    'sitesettings',
    {% endif %}
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    {% if cookiecutter.use_wagtail == 'y' -%}
    'wagtail.wagtailcore.middleware.SiteMiddleware',
    'wagtail.wagtailredirects.middleware.RedirectMiddleware',
    {% endif %}
]

ROOT_URLCONF = 'core.urls'
APPEND_SLASH = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            'templates',
        ],
        'OPTIONS': {
            'debug': DEBUG,
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                # Project specific
                'core.context_processors.settings_context_processor',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
# Using PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': get_env('DATABASE_NAME'),
        'USER': get_env('DATABASE_USER'),
        'PASSWORD': get_env('DATABASE_PASSWORD'),
        'HOST': get_env('DATABASE_HOST'),
        'PORT': get_env('DATABASE_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',  # NOQA
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',  # NOQA
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',  # NOQA
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',  # NOQA
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/
TIME_ZONE = 'UTC'
LANGUAGE_CODE = 'sv-SE'
SITE_ID = 1
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*10,  # 10 MB
            'backupCount': 7,
            'formatter': 'standard',
            'filename': os.path.join(get_env('APP_LOG_DIR'),
                                     'django-debug.log')
        },
    },
    'loggers': {
        '': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}


{% if cookiecutter.use_wagtail == 'y' -%}
# Wagtail
WAGTAIL_SITE_NAME = '{{ cookiecutter.project_name }}'
WAGTAILIMAGES_IMAGE_MODEL = 'customimage.CustomImage'
{% endif %}

# File storage
AWS_ACCESS_KEY_ID = get_env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = get_env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = get_env('AWS_BUCKET_NAME')

AWS_AUTO_CREATE_BUCKET = True
AWS_QUERYSTRING_AUTH = False
AWS_EXPIRY = 60 * 60 * 24 * 7

AWS_HEADERS = {
    'Cache-Control': 'max-age={}'.format(AWS_EXPIRY),
}
AWS_S3_CALLING_FORMAT = OrdinaryCallingFormat()

# Retrieve S3 files using https, with a bucket that contains a dot.
S3Connection.DefaultHost = 's3-eu-west-1.amazonaws.com'

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
THUMBNAIL_DEFAULT_STORAGE = 'storages.backends.s3boto.S3BotoStorage'


# Uploaded media
MEDIA_URL = '/media/'
MEDIA_ROOT = get_env('MEDIA_PATH')


# Static files, if in production use static root, else use static dirs

# Static URL to use when referring to static files located in STATIC_ROOT.
STATIC_URL = '/static/'

# The absolute path to the directory where collectstatic will collect static
# files for deployment. Example: "/var/www/example.com/static/"I
STATIC_ROOT = get_env('STATIC_PATH')

# This setting defines the additional locations the staticfiles will traverse
STATICFILES_DIRS = (
    # "/home/special.polls.com/polls/static",
    # "/home/polls.com/polls/static",
)

# Admin

ADMIN_URL = r'^admin/'


# Example metadata
GA_ACCOUNT = get_env('GA_ACCOUNT', default="GA-XXXX")
