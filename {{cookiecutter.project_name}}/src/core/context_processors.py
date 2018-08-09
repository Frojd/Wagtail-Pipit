#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf import settings


def settings_context_processor(request):
    """
    Expose django settings to template engine
    """
    parsed_settings = {"DEBUG": settings.DEBUG, "APP_VERSION": settings.APP_VERSION}

    if hasattr(settings, "SENTRY_PUBLIC_DSN"):
        parsed_settings["SENTRY_PUBLIC_DSN"] = settings.SENTRY_PUBLIC_DSN

    return {"SETTINGS": parsed_settings}
