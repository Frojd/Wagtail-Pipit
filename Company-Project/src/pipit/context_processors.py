#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf import settings


def settings_context_processor(request):
    """
    Expose django settings to template engine
    """
    parsed_settings = {"DEBUG": settings.DEBUG, "APP_VERSION": settings.APP_VERSION}

    if hasattr(settings, "SENTRY_DSN"):
        parsed_settings["SENTRY_DSN"] = settings.SENTRY_DSN

    if hasattr(settings, "REACT_DEVSERVER"):
        parsed_settings["REACT_DEVSERVER"] = settings.REACT_DEVSERVER

    if hasattr(settings, "REACT_DEVSERVER_PUBLIC_URL"):
        parsed_settings["REACT_DEVSERVER_PUBLIC_URL"] = settings.REACT_DEVSERVER_PUBLIC_URL


    return {"SETTINGS": parsed_settings}


def request_meta_context_processor(request):
    domain = request.get_host().split(":")[0]

    return {
        "REQUEST_DOMAIN": domain,
    }

