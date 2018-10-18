from rest_framework import serializers
from wagtail.core.rich_text import expand_db_html

from .base_serializer import BasePageSerializer
from . import ArticlePage


class ArticlePageSerializer(BasePageSerializer):
    wysiwyg = serializers.SerializerMethodField()

    class Meta:
        model = ArticlePage
        fields = BasePageSerializer.Meta.fields + [
            "author",
            "wysiwyg",
        ]

    def get_wysiwyg(self, page):
        return expand_db_html(page.wysiwyg)
