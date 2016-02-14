# -*- coding: utf-8 -*-

from django.conf.urls import include, url
from django.contrib import admin


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # Prefered way of including an apps urls
    # url(r'', include('pages.urls'))  # Uncomment this to use the example app
]
