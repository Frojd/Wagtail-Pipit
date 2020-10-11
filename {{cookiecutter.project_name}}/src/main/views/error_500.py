from sentry_sdk import last_event_id
from django.shortcuts import render


def error_500_view(request, *args, **argv):
    return render(
        request,
        "500.html",
        {
            "sentry_event_id": last_event_id(),
        },
        status=500,
    )
