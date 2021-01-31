from urllib.parse import unquote
import json


def cookie_notice_middleware(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        approvals = request.COOKIES.get("cookieNoticeApprovals", "")

        if approvals:
            approvals = unquote(approvals)
            approvals = json.loads(approvals)
        else:
            approvals = {
                "categories": [],
                "cookies": [],
            }

        request.cookie_notice_approvals = approvals

        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    return middleware
