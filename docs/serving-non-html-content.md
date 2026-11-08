# Serving non-HTML content

Next.js renders all HTML pages in Pipit. Some paths should return something else, such as an RSS feed, an XML file or a file download. App Router pages cannot return a raw response body, so these paths are served by Django directly and routed to it by nginx.

## 1. Add a Django view

Add a view and route it in `src/pipit/urls.py`, above the line that includes `wagtail_urls`:

```python
from django.http import HttpRequest, HttpResponse
from django.urls import path


def feed(request: HttpRequest) -> HttpResponse:
    return HttpResponse(
        '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>',
        content_type="application/rss+xml",
    )


urlpatterns += [path("feeds/news/", feed)]
```

A Wagtail page can do the same by overriding `serve` or by using a [routable page](/docs/working-with-wagtails-routable-pages.md) route.

## 2. Route the path to Django in nginx

Both nginx configs contain a commented `/feeds/` example. Uncomment it and change the path:

- `docker/files/config/nginx.conf.template` for local development
- `deploy/files/nginx.conf.j2` for servers

```nginx
location ^~ /feeds/ {
    proxy_set_header Host $host:8081;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass ${PYTHON_HOST}:8000/feeds/;
}
```

## Without nginx in front

If Next.js is served without nginx, rewrite the path to Django in `frontend/proxy.js` instead, replacing the host with the address of your Django server:

```js
if (pathname.startsWith('/feeds/')) {
    return NextResponse.rewrite(new URL(pathname, 'http://python:8000'));
}
```
