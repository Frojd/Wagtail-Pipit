# -*- coding: utf-8 -*-

from rest_framework import serializers

from pages.models import Page


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('title', 'content')
