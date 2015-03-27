#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Django settings for Fröjd Django projects.

"""

import os
from . import get_env_variable, PROJECT_NAME
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Version, be sure to bump this with each release
APP_VERSION = '0.0.1'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_env_variable('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if get_env_variable('DEBUG') == 'True' else False

# Minified, by default it is set to the same as Debug
MINIFIED = DEBUG

# This is when debug is off, else django wont allow you to visit the site
ALLOWED_HOSTS = get_env_variable('ALLOWED_HOSTS').split(',')

INTERNAL_IPS = (
    '127.0.0.1',
)

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

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
    )

# Project name is set in .env
ROOT_URLCONF = '%s.urls' % PROJECT_NAME

WSGI_APPLICATION = '%s.wsgi.application' % PROJECT_NAME


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
# Using PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': get_env_variable('DB_NAME'),
        'USER': get_env_variable('DB_USERNAME'),
        'PASSWORD': get_env_variable('DB_PASSWORD'),
        'HOST': get_env_variable('DB_HOST'),
        'PORT': get_env_variable('DB_PORT'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/
LANGUAGE_CODE = 'sv-SE'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Uploaded media
MEDIA_URL = '/media/'
MEDIA_ROOT = get_env_variable('MEDIA_PATH')

# Templates
TEMPLATE_DEBUG = True
TEMPLATE_DIRS = (
    'templates',
)

# Static files, if in production use static root, else use static dirs
STATIC_URL = '/static/'

if not DEBUG:
    STATIC_ROOT = get_env_variable('STATIC_PATH')
else:
    STATICFILES_DIRS = (
        get_env_variable('STATIC_PATH'),
    )

# Static folder for gulp/grunt generated files
STATIC_FOLDER = 'builds'
GA_ACCOUNT = 'UA-xxxxxxx'
