# -*- coding: utf-8 -*-

from django.conf.urls import url

from views import PageListView


urlpatterns = [
    url(r'^pages/$', PageListView.as_view(),
        name='page_list'),  # NOQA
]
