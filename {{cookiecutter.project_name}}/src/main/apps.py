from django.apps import AppConfig


class MainConfig(AppConfig):
    name = "main"

    def ready(self) -> None:
        from wagtail import fields
        from wagtail.api.v2 import serializers as wagtail_serializers

        from .pages.base_serializer import BasePageSerializer

        BasePageSerializer.serializer_field_mapping[fields.StreamField] = (
            wagtail_serializers.StreamField
        )
