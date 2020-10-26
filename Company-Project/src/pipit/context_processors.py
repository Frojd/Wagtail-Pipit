from django.conf import settings


def settings_context_processor(request):
    """
    Expose django settings to template engine
    """
    parsed_settings = {"DEBUG": settings.DEBUG, "APP_VERSION": settings.APP_VERSION}

    if settings.SENTRY_DSN:
        parsed_settings["SENTRY_DSN"] = settings.SENTRY_DSN

    if settings.SENTRY_ENVIRONMENT:
        parsed_settings["SENTRY_ENVIRONMENT"] = settings.SENTRY_ENVIRONMENT

    return {"SETTINGS": parsed_settings}


def request_meta_context_processor(request):
    domain = request.get_host().split(":")[0]

    return {
        "REQUEST_DOMAIN": domain,
    }
