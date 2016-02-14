# -*- coding: utf-8 -*-

from django.utils.translation import ugettext_lazy as _
from django import forms

from pages.models import Page


class PageForm(forms.ModelForm):
    class Meta:
        model = Page
        fields = ['title', 'content', 'slug']

    def clean_title(self):
        title = self.cleaned_data.get('title')
        if len(title) < 5:
            raise forms.ValidationError(_('Title must be more than 5 characters long.'))  # NOQA

        return title
