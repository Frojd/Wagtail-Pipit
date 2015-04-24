#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf import settings


# Adds all settings to context, SETTINGS.SETTING_VALUE
def settings_context_processor(request):
    """ Expose django settings to template engine """
    parsed_settings = settings
    parsed_settings.SECRET_KEY = None
    parsed_settings.DATABASES = None
    full_settings = {
        'SETTINGS': parsed_settings,
    }

    return full_settings