from typing import List

from rest_framework import serializers
from wagtail.core import fields
from wagtail.core.models import Locale
from wagtail.api.v2 import serializers as wagtail_serializers

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer
from ..serializers import SeoSerializer
from . import BasePage


class LocaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locale
        fields = ["language_code"]


class BasePageSerializer(serializers.ModelSerializer):
    serializer_field_mapping = (
        serializers.ModelSerializer.serializer_field_mapping.copy()
    )
    serializer_field_mapping.update(
        {fields.StreamField: wagtail_serializers.StreamField}
    )

    seo = serializers.SerializerMethodField()
    site_setting = serializers.SerializerMethodField()
    locale = LocaleSerializer("locale")
    translations = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields: List[str] = [
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            "seo",
            "site_setting",
            "locale",
            "translations",
        ]

    def get_seo(self, page):
        return SeoSerializer(page).data

    def get_site_setting(self, page):
        site_setting = SiteSetting.for_site(page.get_site())
        return SiteSettingSerializer(site_setting).data

    def get_translations(self, page):
        translations = page.get_translations(inclusive=False)
        return [{
            "title": x.title,
            "url": x.full_url,
            "language_code": x.locale.language_code,
        } for x in translations]
