from rest_framework import serializers
from wagtail.core.rich_text import expand_db_html

from .base_serializer import BasePageSerializer
from . import ExamplePage


class ExamplePageSerializer(BasePageSerializer):
    wysiwyg = serializers.SerializerMethodField()

    class Meta:
        model = ExamplePage
        fields = BasePageSerializer.Meta.fields + [
            "authpr",
            "wysiwyg",
        ]

    def get_wysiwyg(self, page):
        return expand_db_html(page.wysiwyg)
