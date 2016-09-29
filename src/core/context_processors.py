#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf import settings


def settings_context_processor(request):
    """
    Expose django settings to template engine
    """
    parsed_settings = {
        'DEBUG': settings.DEBUG,
        'MINIFIED': settings.MINIFIED,
        'APP_VERSION': settings.APP_VERSION,
    }

    return {
        'SETTINGS': parsed_settings,
    }
