# -*- coding: utf-8 -*-

from django.contrib import admin
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.views import defaults as default_views

from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtailsearch import urls as wagtailsearch_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailcore import urls as wagtail_urls
from wagtail.contrib.wagtailsitemaps.views import sitemap



urlpatterns = []

if settings.DEBUG:
    urlpatterns += [
        url(r'^400/$', default_views.bad_request, kwargs={'exception': Exception('Bad Request!')}),  # NOQA
        url(r'^403/$', default_views.permission_denied, kwargs={'exception': Exception('Permission Denied')}),  # NOQA
        url(r'^404/$', default_views.page_not_found, kwargs={'exception': Exception('Page not Found')}),  # NOQA
        url(r'^500/$', default_views.server_error),
    ]

    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ]

urlpatterns += [
    url(settings.ADMIN_URL, admin.site.urls),

    url(r'^cms/', include(wagtailadmin_urls)),
    url(r'^documents/', include(wagtaildocs_urls)),
    url(r'^search/', include(wagtailsearch_urls)),
    url('^sitemap\.xml$', sitemap, name='sitemap'),
]

urlpatterns += [
    # Prefered way of including an apps urls
    url(r'', include('pages.urls')),  # TODO: Example app, remove this

    url(r'', include(wagtail_urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
