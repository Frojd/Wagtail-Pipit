from rest_framework import serializers
from wagtail.core import fields
from wagtail.api.v2 import serializers as wagtail_serializers

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer
from . import BasePage


class BasePageSerializer(serializers.ModelSerializer):
    serializer_field_mapping = (
        serializers.ModelSerializer.serializer_field_mapping.copy()
    )
    serializer_field_mapping.update(
        {fields.StreamField: wagtail_serializers.StreamField}
    )

    site_setting = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields = [
            # from page
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            # from seo mixin
            "og_title",
            "og_description",
            "og_image",
            "twitter_title",
            "twitter_description",
            "twitter_image",
            "robot_noindex",
            "robot_nofollow",
            # from external relation
            "site_setting",
        ]

    def get_site_setting(self, page):
        request = self.context.get("request", None)

        if not request:
            return None

        site_setting = SiteSetting.for_site(request.site)
        return SiteSettingSerializer(site_setting).data
