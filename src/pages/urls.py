# -*- coding: utf-8 -*-

from django.conf.urls import include, url

from pages.views import PageListView, PageDetailView


urlpatterns = [
    # Some basic examples
    # Root startpage eg. http://site.com
    url(r'^$', PageListView.as_view(), name='startpage'),

    # Slugged page eg. http://site.com/subpage/
    url(r'^(?P<slug>[-\w]+)/$', PageDetailView.as_view(), name='page-detail'),

    # Api
    url(r'^api/v1/', include('pages.api.urls', namespace='api',
                             app_name='pages'))
]
