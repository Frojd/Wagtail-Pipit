# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.views.generic import ListView
from django.views.generic.detail import DetailView
from django.utils import timezone

from exampleapp.models import Page


class PageListView(ListView):
    model = Page
    template_name = 'pages/startpage.html'


class PageDetailView(DetailView):
    model = Page
    template_name = 'pages/subpage.html'

    def get_context_data(self, **kwargs):
        context = super(PageDetailView, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context
