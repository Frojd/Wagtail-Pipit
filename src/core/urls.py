from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    # Prefered way of including an apps urls
    # url(r'', include('pages.urls')) # Uncomment this to use the example app
)
