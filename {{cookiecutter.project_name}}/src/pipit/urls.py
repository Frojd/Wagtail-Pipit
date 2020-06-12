from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls import url
from django.conf.urls.static import static
from django.views import defaults as default_views
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.core import urls as wagtail_urls
from wagtail.contrib.sitemaps.views import sitemap

from main.views.page_not_found import PageNotFoundView
from main.views.error_500 import error_500_view


handler404 = PageNotFoundView.as_view()
handler500 = error_500_view

urlpatterns = []

if settings.DEBUG:
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),  # NOQA
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),  # NOQA
        path(
            "404/", handler404, kwargs={"exception": Exception("Page not Found")}
        ),  # NOQA
        path(
            "500/", handler500, kwargs={"exception": Exception("Internal error")}
        ),  # NOQA
    ]

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]

    if "revproxy" in settings.INSTALLED_APPS:
        from revproxy.views import ProxyView
        from urllib3 import PoolManager

        CustomProxyView = ProxyView

        if settings.REACT_DEVSERVER_HTTPS:
            class NoSSLVerifyProxyView(ProxyView):
                def __init__(self, *args, **kwargs):
                    super().__init__(*args, **kwargs)
                    self.http = PoolManager(
                        cert_reqs='CERT_NONE', assert_hostname=False
                    )

            CustomProxyView = NoSSLVerifyProxyView

        proxy_upstream_url = "{}://{}:{}/proxy".format(
            "https" if settings.REACT_DEVSERVER_HTTPS else "http",
            settings.REACT_DEVSERVER_REVPROXY_DOMAIN,
            settings.REACT_DEVSERVER_PORT,
        )
        urlpatterns += [
            url(r'^proxy/(?P<path>.*)$',
                CustomProxyView.as_view(upstream=proxy_upstream_url)
            ),
        ]

urlpatterns += [
    url(settings.ADMIN_URL, admin.site.urls),
    path("cms/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("sitemap.xml", sitemap, name="sitemap"),
]

urlpatterns += [url(r"", include(wagtail_urls))]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
