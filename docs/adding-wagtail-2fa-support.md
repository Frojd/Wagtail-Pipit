# Adding wagtail-2fa support

[wagtail-2fa](https://github.com/labd/wagtail-2fa) is a great library that works almost out of the box in Pipit, one thing though is that, since we replace the entire frontend, we need to modify the middleware to properly redirect the user for verification.

## Guide

- Create a new file at `src/nextjs/middleware.py`
- Add a extended version of the VerifyUserPermissionsMiddleware that comes with `wagtail-2fa`, it should look as follows:

```python
import json

from django.http.response import HttpResponseRedirect, JsonResponse
from wagtail_2fa.middleware import VerifyUserPermissionsMiddleware


class NextVerifyUserPermissionsMiddleware(VerifyUserPermissionsMiddleware):
    def process_request(self, request):
        result = super().process_request(request)

        if (
            result
            and isinstance(result, HttpResponseRedirect)
            and "/api/nextjs" in request.path
        ):
            destination = result.url
            html_path = request.GET.get("html_path", None)
            if html_path is not None:
                first_url = destination.split("?next=")[0]
                destination = f"{first_url}?next=/{html_path}"
            data = {
                "redirect": {
                    "destination": destination,
                    "is_permanent": False,
                }
            }
            return JsonResponse(data)

        return result
```

- Update `src/pipt/setting/basepy` and update `MIDDLEWARE` list our new middleware (it replaces the regular `VerifyUserPermissionsMiddleware` middleware)

```
MIDDLEWARE = [
    ...
    "nextjs.middleware.NextVerifyUserPermissionsMiddleware",
]
```
- Done!
