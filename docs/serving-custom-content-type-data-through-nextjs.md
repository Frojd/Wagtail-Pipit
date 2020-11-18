# Serving custom content type data through Next.js

A common scenario is that you want to serve something that is not html through Next.js, this is how you do it.

What you do is that you return a object called `customResponse` with the keys `contentType` and `body`.
Next.js will unpack the data and build a response based on it.

```python
def serve(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
    response_cls = JsonResponse if isinstance(request, Request) else Response

    return response_cls({
        "customResponse": {
            "contentType": "application/xml",
            "body": '<?xml version="1.0" encoding="UTF-8"?><root>1</root>',
        }
    })
```

If you want to return binary data you can use the `body64` key, in this example we will return a gif.

```python
def serve(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
    response_cls = JsonResponse if isinstance(request, Request) else Response

    return response_cls({
        "customResponse": {
            "contentType": "image/gif",
            "body64": "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs=",
        }
    })
```
