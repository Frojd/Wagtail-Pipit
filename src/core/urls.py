# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls import url
from django.contrib import admin
from django.conf.urls.static import static


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # Prefered way of including an apps urls
    # url(r'', include('pages.urls'))  # Uncomment this to use the example app
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
