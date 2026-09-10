from typing import List

from rest_framework import serializers
from wagtail.admin.templatetags.wagtailuserbar import wagtailuserbar

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer

from ..serializers import SeoSerializer
from . import BasePage


class BasePageSerializer(serializers.ModelSerializer):
    serializer_field_mapping = (
        serializers.ModelSerializer.serializer_field_mapping.copy()
    )

    seo = serializers.SerializerMethodField()
    site_setting = serializers.SerializerMethodField()
    wagtail_userbar = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields: List[str] = [
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            "seo",
            "site_setting",
            "wagtail_userbar",
        ]

    def get_seo(self, page):
        return SeoSerializer(page).data

    def get_site_setting(self, page):
        site_setting = SiteSetting.for_site(page.get_site())
        return SiteSettingSerializer(site_setting).data

    def get_wagtail_userbar(self, page):
        request = self.context.get("request", None)
        if not request:
            return None

        in_preview_panel = getattr(request, "in_preview_panel", False)
        if in_preview_panel:
            return None

        if not hasattr(request, "user"):
            return None

        html = wagtailuserbar({"request": request, "self": page})

        if not html:
            return None

        return {
            "html": html,
        }
